package com.cj.spenrose.mastery

case class Feedback(when:Long, subject:String, from:String, items:Map[String, String], comments:Map[String, String])