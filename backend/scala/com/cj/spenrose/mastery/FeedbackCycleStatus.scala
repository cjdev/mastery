package com.cj.spenrose.mastery

case class FeedbackCycleUserAssignmentStatus(subjectName:String, percentComplete:Int)
case class FeedbackCycleUserStatus(name:String, percentCompleteOverall:Int, assignments:Seq[FeedbackCycleUserAssignmentStatus])
case class FeedbackCycleStatus(users:Seq[FeedbackCycleUserStatus], cyclePercentComplete:Int)
