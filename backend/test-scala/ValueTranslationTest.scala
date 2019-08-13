
import org.junit.Test
import org.junit.runner.RunWith
import org.scalatest.junit.JUnitRunner
import org.scalatest.FunSuite
import com.cj.spenrose.mastery._
import scala.util.Try
import org.scalatest.Failed
import scala.util.{Failure, Success}

@RunWith(classOf[JUnitRunner])
class ValueTranslationTest extends FunSuite {
  
  val testCases = Seq(
    ("handles lowest",
       (0, Seq("lowest", "highest")),
       "lowest-0"),
       
    ("handles highest",
       (200, Seq("lowest", "highest")),
       "highest-100"),
     
    ("handles low middle",
       (50, Seq("lowest", "mid", "highest")),
       "lowest-50"),
     
    ("handles high middle",
       (250, Seq("lowest", "mid", "highest")),
       "highest-50"),
     
    ("handles mid middle",
       (150, Seq("lowest", "mid", "highest")),
       "mid-50")
       
  )
  
  testCases.foreach{case (name, input, expectation) => 
    test(name){
      // given
      val (value, spectrum) = input
      
      // when
      val output =  MasteryApp.absoluteToRelative(value, spectrum)
      
      // then
      assert(output === expectation)
          
    }
  }
  
  test("Rejects unknown labels"){
    // given
    val value = "SoAwesome-100"
    val spectrum = Seq("Beginner", "Doer", "Superstar")
    
    // when
    val result = Try(MasteryApp.relativeToAbsolute(value, spectrum))
    
    // then
    assert(toTestString(result) === """Failure | Exception | Unkown level "SoAwesome".  Levels I know about are Beginner,Doer,Superstar""")
          
  }
  
  private def toTestString[T](t:Try[T]) = t match {
      case Success(outcome) => "Success" + outcome
      case Failure(err) => "Failure | " + err.getClass.getSimpleName + " | " + err.getMessage
    }
}