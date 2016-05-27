package com.cbt.backend.test.unit.course.mgmt;


import java.util.Date;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import id.co.knt.cbt.config.PersistenceConfig;
import id.co.knt.cbt.config.WebMvcConfig;
import id.co.knt.cbt.model.Course;
import id.co.knt.cbt.model.Subject;
import id.co.knt.cbt.repositories.CourseRepo;
import id.co.knt.cbt.repositories.SubjectRepo;
import id.co.knt.cbt.service.CourseService;
import id.co.knt.cbt.service.SubjectService;
import id.co.knt.cbt.service.impl.CourseServiceImpl;
import id.co.knt.cbt.service.impl.SubjectServiceImpl;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes={PersistenceConfig.class, WebMvcConfig.class})
@WebAppConfiguration
public class MockCourseServiceRepo {
	
	@Autowired
	private SubjectRepo kelasRepo;
	
	@Autowired
	private CourseRepo courseRepo;
	
	@InjectMocks
	private SubjectService subjectServiceImpl;
	
	@InjectMocks
	private CourseService courseServiceImpl;
	
	@Before
	public void setup(){
		subjectServiceImpl = new SubjectServiceImpl(kelasRepo);
		courseServiceImpl = new CourseServiceImpl(courseRepo);
	}
	
	private Course courseA;
	private Course courseB;
	private Course courseC;
	private Course courseD;
	
	@Test
	public void testAdd(){
		Subject sbj = new Subject();
		sbj.setSubjectName("Matematika 1");
		sbj.setCreatedDate(new Date());
		
		courseA = new Course();
		courseA.setCourseName("Aljabar");
		courseA.setCreatedDate(new Date());
		
		courseB = new Course();
		courseB.setCourseName("Persamaan Kuadrat");
		courseB.setCreatedDate(new Date());
		
		courseC = new Course();
		courseC.setCourseName("Trigonometri");;
		courseC.setCreatedDate(new Date());
		
		SubjectServiceImpl mockSbj = Mockito.mock(SubjectServiceImpl.class);
		Mockito.when(mockSbj.save(sbj)).thenReturn(new Subject());
		
		CourseServiceImpl mock = Mockito.mock(CourseServiceImpl.class);
		Mockito.when(mock.save(courseA)).thenReturn(new Course());
		Mockito.when(mock.save(courseB)).thenReturn(new Course());
		Mockito.when(mock.save(courseC)).thenReturn(new Course());
		
		Assert.assertEquals(sbj, subjectServiceImpl.save(sbj));
		Assert.assertEquals(courseA, courseServiceImpl.save(courseA));
		Assert.assertEquals(courseB, courseServiceImpl.save(courseB));
		Assert.assertEquals(courseC, courseServiceImpl.save(courseC));
	}
	
	@Test
	public void testUpdate(){
		CourseServiceImpl mock = Mockito.mock(CourseServiceImpl.class);
		Mockito.when(mock.getCourseById(1)).thenReturn("Aljabar");
		Assert.assertEquals("Aljabar", courseServiceImpl.getCourseById(1));
		
		Course tmp = courseServiceImpl.findCourseById(1);
		tmp.setCourseName("Pythagoras");
		Mockito.when(mock.updateCourse(tmp)).thenReturn("Pythagoras");
		Assert.assertEquals("Pythagoras", courseServiceImpl.updateCourse(tmp));
	}
	
	@Test
	public void testDelete(){
		CourseServiceImpl mock = Mockito.mock(CourseServiceImpl.class);
		Mockito.when(mock.findCourseById(1)).thenReturn(new Course());
		
		Course tmp = courseServiceImpl.findCourseById(1);
		courseServiceImpl.delete(tmp);
		System.out.println("Course Name===============> "+tmp.getCourseName());
	}
	
	@Test
	public void testFindById(){
		CourseServiceImpl mock = Mockito.mock(CourseServiceImpl.class);
		Mockito.when(mock.getCourseById(1)).thenReturn("Aljabar");
		Assert.assertEquals("Aljabar", courseServiceImpl.getCourseById(1));
		
		Course tmp = courseServiceImpl.findCourseById(1);
		System.out.println("Course Name===============> "+tmp.getCourseName());
	}
	
	@Test
	public void testImport(){
		courseD = new Course();
		courseD.setCourseName("Statistik");
		courseD.setCreatedDate(new Date());
		
		CourseServiceImpl mock = Mockito.mock(CourseServiceImpl.class);
		Mockito.when(mock.importCourse(courseD)).thenReturn(new Course());
		
		Assert.assertEquals(courseD, courseServiceImpl.importCourse(courseD));
	}
}
