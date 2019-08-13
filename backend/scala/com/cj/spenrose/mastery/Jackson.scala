package com.cj.spenrose.mastery

import com.fasterxml.jackson.module.scala.experimental.ScalaObjectMapper
import com.fasterxml.jackson.module.scala.DefaultScalaModule
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.DeserializationFeature
import java.io.InputStream

object Jackson {
    val mapper = new ObjectMapper() with ScalaObjectMapper
    mapper.registerModule(DefaultScalaModule)
    mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
  
    
    
    def readSeq[T](data:InputStream, clazz:Class[Array[T]]):Seq[T] = {
      import scala.collection.JavaConversions._
      
      val results = Jackson.mapper.readValue(data, clazz).asInstanceOf[Array[T]]
    	
      results.toSeq
    }
}