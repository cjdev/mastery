
import org.junit.Test
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import com.cj.spenrose.mastery._
import scala.util.Try
import org.scalatest.Failed
import scala.util.{Failure, Success}

@RunWith(classOf[JUnitRunner])
class FeedbackTest extends FunSuite {
  val consolidate = MasteryApp.consolidate _ 
  
  test("consolidates names"){
    // given
    val a = feedback.copy(
        from = "larry", 
        subject = "ralph")
    val b= feedback.copy(
        from = "bobby", 
        subject = "ralph")
    val spectrum = Seq("beginner", "master")
    // when
    val z = consolidate(Seq(a, b), spectrum)
    
    // then
    
    assert(z.from === "aggregate")
    assert(z.subject === "ralph")
        
  }
  
  test("consolidates comments"){
    // given
    val a = feedback.copy(
        from = "larry",  subject = "ralph",
        comments = Map("Eating" -> "You ate all the food!"))
    val b= feedback.copy(
        from = "bobby",  subject = "ralph",
        comments = Map("Eating" -> "You didn't eat anything."))
        
    val spectrum = Seq("beginner", "master")
    // when
    val z = consolidate(Seq(a, b), spectrum)
    
    // then
    
    assert(z.comments === Map("Eating" -> """|==========
                                             |You ate all the food!
                                             |==========
                                             |You didn't eat anything.""".stripMargin))
        
  }
  
  val testCases = Seq(
      ("Nothin in, nothing out",
       Seq("beginner", "master"), 
       Seq(Map[String,String]()), Map[String, String]()),
      
      ("consolidates 2 middle values in different levels",
       Seq("beginner", "master"), 
       Seq(Map("a" -> "master-20"), 
           Map("a" -> "beginner-20")),
           
           Map("a" -> "beginner-70")),
           
           
      ("consolidates 2 values in same level",
       Seq("beginner", "master"), 
       Seq(Map("a" -> "master-20"), 
           Map("a" -> "master-40")),
           
           Map("a" -> "master-30")),
           
      ("max ratings become a max rating",
       Seq("beginner", "master"), 
       Seq(Map("a" -> "master-100"), 
           Map("a" -> "master-100")),
           
           Map("a" -> "master-100")),
           
      ("non-overlapping rating sets don't collide",
       Seq("beginner", "master"), 
       Seq(Map("a" -> "beginner-100"), 
           Map("b" -> "master-100")),
           
           Map("a" -> "beginner-100",
               "b" -> "master-100")),
           
      ("handles top values at multiple levels, even with >2 levels",
       Seq("starter", "middler", "super"), 
       Seq(Map("a" -> "starter-100"), 
           Map("b" -> "middler-100"),
           Map("c" -> "super-100")),
           
           Map("a" -> "starter-100",
               "b" -> "middler-100",
               "c" -> "super-100")),
           
      ("handles mid values at multiple levels, even with >2 levels",
       Seq("starter", "middler", "super"), 
       Seq(Map("a" -> "starter-50"), 
           Map("b" -> "middler-50"),
           Map("c" -> "super-50")),
           
           Map("a" -> "starter-50",
               "b" -> "middler-50",
               "c" -> "super-50")),
           
      ("handles low values at multiple levels, even with >2 levels",
       Seq("starter", "middler", "super"), 
       Seq(Map("a" -> "starter-0"), 
           Map("b" -> "starter-100"),
           Map("c" -> "middler-100")),
           
           Map("a" -> "starter-0",
               "b" -> "starter-100",
               "c" -> "middler-100")),
               
      ("ignores 'unknown' values (a.k.a 'I don't know')",
       Seq("beginner", "master"), 
       Seq(Map("a" -> "master-20"), 
           Map("a" -> "unknown")),
           
           Map("a" -> "master-20"))
      )
    
  testCases.zipWithIndex.foreach{ case ((description, spectrum, inputs, expectation), idx)=>
      
    test(s"item consolidation: $description (case $idx)"){
      // given
      val input = inputs.map{i=> feedback.copy(items =i)}
    
      // when
      val actual = consolidate(input, spectrum)
      
      // then
      assert(actual.items === expectation)
    }
        
  }
  
  test("doesn't consolidate feedback about different people"){
    // given
    val a = Feedback(
        when = 300L, from = "larry", subject = "ralph", comments = Map(), items = Map())
    val b= Feedback(
        when = 500L, from = "bobby", subject = "sam", comments = Map(), items = Map())
        
    // when
    val outcome = Try(consolidate(Seq(a, b), Seq()))
    
    // then
    assert("Expected 1 subject but there were 2" === (outcome match{
      case Failure(err) => err.getMessage
      case Success(_) => ""
    }))
  }
  
  private def feedback = Feedback(when = 0L, from = "", subject = "", comments = Map(), items = Map())
  
}