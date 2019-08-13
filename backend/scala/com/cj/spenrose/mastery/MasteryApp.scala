package com.cj.spenrose.mastery

import org.httpobjects.jetty.HttpObjectsJettyHandler
import org.httpobjects._
import org.httpobjects.DSL._
import org.httpobjects.util.ClasspathResourceObject
import org.apache.commons.io.IOUtils
import org.httpobjects.util.HttpObjectUtil
import java.io.File
import org.apache.commons.io.FileUtils
import java.util.UUID
import java.net.URLEncoder
import org.httpobjects.header.response.SetCookieField
import java.net.URLDecoder
import java.nio.file.Paths
import java.nio.file.Files
import com.cj.spenrose.squads.Data
import scala.util.Properties

object MasteryApp extends App {

  val port = 9193
  val dataDir = new File("mastery-data")
  val emailDomain = args(0)

  trait KeyValueStore {
    def get(key:String):Option[Array[Byte]]
    def put(key:String, value:Array[Byte])
    def delete(key:String)
    def keys():Iterator[String]
    def scan[T](fn:(String, Array[Byte]) => T):Iterator[T]
  }

  class SimpleKeyValueStore(dir:File) extends KeyValueStore{
    private val encoding = "UTF8"
    private def pathFor(key:String):File = {
      new File(dir, URLEncoder.encode(key, encoding))
    }
    def get(key:String):Option[Array[Byte]] = this.synchronized{
      val path = pathFor(key)
      if(path.exists){
        Some(FileUtils.readFileToByteArray(path))
      }else{
        None
      }
    }
    def put(key:String, value:Array[Byte]) = this.synchronized{
      val path = pathFor(key)
      FileUtils.writeByteArrayToFile(path, value)
      import java.nio.file.attribute.PosixFilePermission._
      import scala.collection.JavaConversions._

      Files.setPosixFilePermissions(path.toPath(), Set(OWNER_WRITE, OWNER_READ))
    }
    def delete(key:String) = this.synchronized {
      val path = pathFor(key)
      if(path.exists){
        path.delete()
      }
    }
    def keys():Iterator[String] = this.synchronized{dir.list().toIterator.map(URLDecoder.decode(_, encoding))}

    def scan[T](fn:(String, Array[Byte]) => T):Iterator[T] =  {
      keys.map {key => fn(key, get(key).get) }
    }

  }


  val envURL = Properties.envOrNone("MASTERY_LDAPURL")
  val envUser = Properties.envOrNone("MASTERY_LDAPUSER")
  val envPwd = Properties.envOrNone("MASTERY_LDAPPASSWORD")

  val (ldapURL, ldapUser, ldapPassword) = (envURL, envUser, envPwd) match {
    case (None, None, None) =>
      args match {
        case Array(a, b, c) => (a, b, c)
        case _ => (
                    Console.readLine("""LDAP URL: """),
                    Console.readLine("""LDAP Username (e.g. 'CORP\larry' ): """),
                    System.console().readPassword("LDAP Password: ").mkString(""))
      }
    case (Some(url), Some(lu), Some(lp)) => (url, lu, lp)
  }
  val ldap = new LdapTool(
           url = ldapURL,
           ldapUser = ldapUser,
           ldapPassword = ldapPassword)
  val assignments = new SimpleKeyValueStore(new File(dataDir, "assignments"))
  val feedbackSubmissions = new SimpleKeyValueStore(new File(dataDir, "feedback"))
  val tokens = new SimpleKeyValueStore(new File(dataDir, "tokens"))

  object Org {
    private val squadsData = Jackson.mapper.readValue(getClass().getResourceAsStream("/data.js"), classOf[Data])
    private def emailToName(email:String) = {
      val EmailPattern = ("([A-Za-z0-9].*)@" + emailDomain).r
      email match {
        case EmailPattern(name) => name
        case other => println("OTHER: " + other); other
      }
    }
    def isAbove(manager:String, person:String) = {
      squadsData.everyoneWhoReportsTo(emailToName(manager)).map(_.name).toSet.contains(emailToName(person))
    }
    def everyoneWhoReportsTo(manager:String) = squadsData.everyoneWhoReportsTo(emailToName(manager)).map(_.name + "@" + emailDomain)
  }

  def authOrLogin(r:Request, fn:(Request)=>Response):Response = {
    import scala.collection.JavaConversions._
    val maybeValidUser = r.header().cookiesNamed("token").headOption.map(_.value).flatMap(tokens.get(_)).map(new String(_))

    maybeValidUser match {
      case Some(user) => fn(r)
      case None => SEE_OTHER(Location("/login"))
    }
  }

  def authenticated(o:HttpObject):HttpObject = new HttpObject(o.pattern()){
    override def get(r:Request) = authOrLogin(r, o.get)
    override def post(r:Request) = authOrLogin(r, o.post)
    override def put(r:Request) = authOrLogin(r, o.put)
    override def delete(r:Request) = authOrLogin(r, o.delete)
  }

  def authenticated(r:Request)(fn:(String)=>Response):Response = {
    import scala.collection.JavaConversions._
    val maybeValidUser = r.header().cookiesNamed("token").headOption.map(_.value).flatMap(tokens.get(_)).map(new String(_).trim)

    maybeValidUser match {
      case Some(user) => fn(user)
      case None => UNAUTHORIZED
    }
  }

  def relativeToAbsolute(relativeLevel:String, spectrum:Seq[String]) = {
    val ValuePattern = """([a-zA-Z]*)-([0-9]*)""".r
    relativeLevel match {case ValuePattern(level, value) =>
      val labelIdx = spectrum.indexOf(level)
      if(labelIdx == -1) throw new Exception(s"""Unkown level "$level".  Levels I know about are ${spectrum.mkString(",")}""")
      (labelIdx * 100) + value.toInt
    }
  }

  def absoluteToRelative( absoluteValue:Int, spectrum:Seq[String]) = {
    val avg = absoluteValue
    val labelIndex = (avg/100)

    val progress = (avg % 100)

    val (label, x) = if(progress == 0){
      if(labelIndex == 0){
        spectrum.head -> 0
      }else{
        spectrum(labelIndex -1) -> 100
      }
    }else if(labelIndex >= spectrum.length){
      spectrum.last -> 100

      }else{
      spectrum(labelIndex) -> progress
    }

    label + "-" + x.toString()
  }

  def consolidate(items:Seq[Feedback], spectrum:Seq[String]):Feedback = {
    val subjects = items.map(_.subject).toSet
    if(subjects.size != 1) throw new Exception(s"Expected 1 subject but there were ${subjects.size}")

    val aspects = items.flatMap(_.items.map(_._1)).distinct

    val consolidatedItems = aspects.map{a=>
      val strings = items.flatMap(_.items).filter(_._1 == a).map(_._2)

      val values = strings.filterNot(_=="unknown").map(relativeToAbsolute(_, spectrum))

//      println(s"Values for $a : " + strings.mkString(",\n    "))

      val total = values.foldLeft(0)(_+_)
      val avg = if(values.length == 0) 0 else total/values.length
//      println("average value: " + avg)

      val n = absoluteToRelative(avg, spectrum)
      a->n
    }

    val commentSections = items.flatMap(_.comments.map(_._1)).distinct
    val allComments = items.flatMap(_.comments)

//    println("Comment areas:" + commentSections.mkString(","))

    val comments = commentSections.map{section=>
      val allCommentsForSection = items.flatMap{f=> f.comments.get(section)}.map(_.trim).filterNot(_.isEmpty()).distinct
      section -> allCommentsForSection.mkString("==========\n", "\n==========\n", "")
    }.toMap

    Feedback(
        when = -1L, from = "aggregate", subject = subjects.head,
        comments = comments,
        items = consolidatedItems.toMap)
  }

  def latestFeedback(from:String, to:String) = {
          val allSubmissions = feedbackSubmissions.scan{case (key, value)=> Jackson.mapper.readValue(value, classOf[Feedback])}.toSeq.distinct

          allSubmissions
                  .sortBy(_.when)
                  .filter{s=> s.from == from && s.subject == to}
                  .lastOption
  }

  def parseAssignments(data:Array[Byte]):Seq[String] = new String(data).lines.toSeq.map(_.trim).filterNot(_.isEmpty)

  def peopleWithAssignments = assignments
            .scan{(k, assignments)=> k->parseAssignments(assignments)}
            .filter{case (who, assignments) => !assignments.isEmpty}
            .map{case (who, _) => who}
            .toList
            .distinct

  import scala.collection.JavaConversions._
  val requiredItems = IOUtils
                             .readLines(this.getClass.getResourceAsStream("/template.txt"))
                             .map(_.trim)
                             .filter(_.startsWith("-"))
                             .map(_.replaceFirst("-", ""))
                             .toSeq

  def percentComplete(feedback:Feedback):Int = {

    val completed = requiredItems.filter(feedback.items.keys.toSet.contains(_))
    val todo = requiredItems.filterNot(feedback.items.keys.toSet.contains(_))

    //                     println("ALL:" + requiredItems.mkString("\n"))
    //                     println("DONE:" + completed.mkString("\n"))
    //                     println("TODO:" + todo.mkString("\n"))

    if(todo.isEmpty){
      100
    }else{
      ((completed.length.toDouble / requiredItems.length.toDouble) * 100.0).toInt
    }
  }

  def getAssignmentsFor(user:String) = assignments.get(user).toSeq.flatMap(parseAssignments)



  HttpObjectsJettyHandler.launchServer(port,
      new HttpObject("/api/tokens"){
         override def post(r:Request) = {
          val data = HttpObjectUtil.toAscii(r.representation())
          val Array(user, password) = data.split(":")
          if(ldap.authenticateEmail(user, password)){
            val token = UUID.randomUUID().toString()
            tokens.put(token, user.getBytes)
            OK(Text(token), new SetCookieField("token", token,
                            null, "/", null, false))
          }else{
            UNAUTHORIZED()
          }
        }
      },
      new HttpObject("/api/me"){
         override def get(r:Request) = authenticated(r){user=>
           OK(Text(user))
         }
      },
      new HttpObject("/logout"){
         override def get(r:Request) = {
          val maybeToken = r.header().cookiesNamed("token").headOption.map(_.value)

          maybeToken match {
            case Some(token) => tokens.delete(token)
            case None =>
          }
          SEE_OTHER(Location("/"))
         }
      },
      new HttpObject("/api/assignments/{user}"){
         override def get(r:Request) = authenticated(r){user=>
           val userId = r.path().valueFor("user")
           assignments.get(userId) match {
             case Some(assignmentsBytes) => {

               val people = parseAssignments(assignmentsBytes)

               val assignments = people.map{who=>
                 val status = latestFeedback(from=user, to=who) match {
                   case Some(feedback) => {
                    val percentage = percentComplete(feedback)
                        if(percentage == 100){
                          "complete"
                        }else{
                          percentage.toString() + "%"
                        }
                   }
                   case None => ""
                 }
                 Assignment(name=who, status = status)
               }
               OK(Json(Jackson.mapper.writer.withDefaultPrettyPrinter().writeValueAsString(Assignments(assignments))))
             }
             case None => NOT_FOUND()
           }
         }
      },
      new HttpObject("/api/feedback"){
        override def post(r:Request) = authenticated(r){user=>
          val data = HttpObjectUtil.toByteArray(r.representation())

          val parsed = Jackson.mapper.readValue(data, classOf[Feedback])

          // make sure this is someone we're assigned

          val subjects = getAssignmentsFor(user)


//          println(s"Subject assigned to $user: " + subjects.mkString(","))

          if(subjects.find(_ == parsed.subject).isDefined){
            val id = UUID.randomUUID().toString()

            val validated = parsed.copy(from = user, when = System.currentTimeMillis())

            feedbackSubmissions.put(
                key = id,
                value = Jackson.mapper.writer.withDefaultPrettyPrinter().writeValueAsBytes(validated))
            CREATED(Location("/api/feedback/" + id))
          }else{
            BAD_REQUEST(Text(s"$user is not assigned to give feedback for ${parsed.subject}"))
          }

        }
      },
      new HttpObject("/api/consolidated-feedback/{to}"){
        override def get(r:Request) = authenticated(r){user=>
          val to = r.path().valueFor("to")
          val isManagerRequest = Org.isAbove(user, to)
          if(to==user || isManagerRequest){
            val submitters = feedbackSubmissions.scan{case (key, value)=>
                val feedback = Jackson.mapper.readValue(value, classOf[Feedback])
                feedback.from
              }
              .toSeq
              .filterNot(_ == to) // not self reviews
              .filterNot{name=> Org.isAbove(manager = name, person = to)} // filter-out managers
              .distinct

            val allFeedback = submitters.flatMap{from =>
              val feedback = latestFeedback(from=from, to=to)
              feedback
            }

            if(isManagerRequest || allFeedback.size > 2){
//              println(s"Found ${allFeedback.length} inputs for $to")
              val consolidated = MasteryApp.consolidate(allFeedback, Seq("Exposed", "Apprentice", "Practitioner", "Master"));

              OK(Json(Jackson.mapper.writer.withDefaultPrettyPrinter().writeValueAsString(consolidated)))
            }else{
              DSL.CONFLICT(Text(s"There is not enough feedback for $to to craft a consolidated response"))
            }

          }else{
            UNAUTHORIZED(Text(s"$user is not authorized to see feedback for $to"))
          }

        }
      },
      new HttpObject("/api/feedback/{from}/{to}"){
        override def get(r:Request) = authenticated(r){user=>
          val from = r.path().valueFor("from")
          val to = r.path().valueFor("to")

          if(from!=user) throw new Exception("Security error!")  //hacky, but effective for now

          val matchingSubmission = latestFeedback(from=from, to=to);

          matchingSubmission match {
            case Some(submission) => OK(Json(Jackson.mapper.writer.withDefaultPrettyPrinter().writeValueAsString(submission)))
            case None => NOT_FOUND()
          }
        }
      },
      new HttpObject("/api/status"){
        override def get(r:Request) = authenticated(r){user=>
          val state = peopleWithAssignments.filter{name=> name == user || Org.isAbove(user, name)}.map{name=>

            val assignments = getAssignmentsFor(name).map{subject=>
              val status = latestFeedback(from=name, to=subject).map(percentComplete(_)).getOrElse(0)

              FeedbackCycleUserAssignmentStatus(subjectName = subject, percentComplete = status)
            }
            val totalPercentComplete = assignments.foldLeft(0){(accum, next)=> next.percentComplete + accum} / assignments.length
            FeedbackCycleUserStatus(name = name,
                percentCompleteOverall = totalPercentComplete,
                assignments = assignments)
          }
          val cyclePercentComplete = state.foldLeft(0){(accum, next)=> next.percentCompleteOverall + accum} / state.length
          OK(Json(Jackson.mapper.writer.withDefaultPrettyPrinter().writeValueAsString(FeedbackCycleStatus(state, cyclePercentComplete))))
        }

      },
      new HttpObject("/api/reports"){
        override def get(r:Request) = authenticated(r){user=>
          val reports = Org.everyoneWhoReportsTo(user)
          OK(Json(Jackson.mapper.writer.withDefaultPrettyPrinter().writeValueAsString(reports)))
        }
      },
      new HttpObject("/api/people-with-assignments"){
        override def get(r:Request) = {
          OK(Text(peopleWithAssignments.mkString("; ")))
        }
      }
      ,authenticated(new ClasspathResourceObject("/api/template", "/template.txt", getClass))
      ,authenticated(new ClasspathResourceObject("/", "/assignments.html", getClass))
      ,new ClasspathResourceObject("/login", "/login.html", getClass)

      ,authenticated(new ClasspathResourceObject("/feedback-from-your-peers", "/mastery.html", getClass))
      ,authenticated(new ClasspathResourceObject("/feedback-for-report", "/mastery.html", getClass))
      ,authenticated(new ClasspathResourceObject("/feedback", "/mastery.html", getClass))

      ,classpathResourcesAt("/").loadedVia(getClass).servedAt("/")
      )
}
