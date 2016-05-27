package com.cbt.backend.test.unit.subject.mgmt;


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
import id.co.knt.cbt.model.Subject;
import id.co.knt.cbt.repositories.SubjectRepo;
import id.co.knt.cbt.service.SubjectService;
import id.co.knt.cbt.service.impl.SubjectServiceImpl;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes={PersistenceConfig.class, WebMvcConfig.class})
@WebAppConfiguration
public class MockSubjectServiceRepo {
	
	@Autowired
	private SubjectRepo subjectRepo;
	
	@InjectMocks
	private SubjectService serviceImpl;
	
	@Before
	public void setup(){
		serviceImpl = new SubjectServiceImpl(subjectRepo);
	}
	
	private Subject subjectA;
	private Subject subjectB;
	private Subject subjectC;
	private Subject subjectD;
	
	@Test
	public void testAdd(){
		subjectA = new Subject();
		subjectA.setSubjectName("Matematika");
		subjectA.setCreatedDate(new Date());
		
		subjectB = new Subject();
		subjectB.setSubjectName("Fisika");
		subjectB.setCreatedDate(new Date());
		
		subjectC = new Subject();
		subjectC.setSubjectName("Biologi");
		subjectC.setCreatedDate(new Date());
		
		SubjectServiceImpl mock = Mockito.mock(SubjectServiceImpl.class);
		Mockito.when(mock.save(subjectA)).thenReturn(new Subject());
		Mockito.when(mock.save(subjectB)).thenReturn(new Subject());
		Mockito.when(mock.save(subjectC)).thenReturn(new Subject());
		
		Assert.assertEquals(subjectA, serviceImpl.save(subjectA));
		Assert.assertEquals(subjectB, serviceImpl.save(subjectB));
		Assert.assertEquals(subjectC, serviceImpl.save(subjectC));
	}
	
	@Test
	public void testUpdate(){
		SubjectServiceImpl mock = Mockito.mock(SubjectServiceImpl.class);
		Mockito.when(mock.getSubjectById(2)).thenReturn("Fisika");
		Assert.assertEquals("Fisika", serviceImpl.getSubjectById(2));
		
		Subject tmp = serviceImpl.findSubjectById(2);
		tmp.setSubjectName("Bahasa Indonesia");
		Mockito.when(mock.updateSubject(tmp)).thenReturn("Bahasa Indonesia");
		Assert.assertEquals("Bahasa Indonesia", serviceImpl.updateSubject(tmp));
	}
	
	@Test
	public void testDelete(){
		SubjectServiceImpl mock = Mockito.mock(SubjectServiceImpl.class);
		Mockito.when(mock.findSubjectById(1)).thenReturn(new Subject());
		
		Subject tmp = serviceImpl.findSubjectById(1);
		serviceImpl.delete(tmp);
		System.out.println("Teacher Name===============> "+tmp.getSubjectName());
	}
	
	@Test
	public void testFindById(){
		SubjectServiceImpl mock = Mockito.mock(SubjectServiceImpl.class);
		Mockito.when(mock.getSubjectById(1)).thenReturn("Matematika");
		Assert.assertEquals("Matematika", serviceImpl.getSubjectById(1));
		
		Subject tmp = serviceImpl.findSubjectById(1);
		System.out.println("Teacher Name===============> "+tmp.getSubjectName());
	}
	
	@Test
	public void testImport(){
		subjectD = new Subject();
		subjectD.setSubjectName("Biologi");
		subjectD.setCreatedDate(new Date());
		
		SubjectServiceImpl mock = Mockito.mock(SubjectServiceImpl.class);
		Mockito.when(mock.importSubject(subjectA)).thenReturn(new Subject());
		
		Assert.assertEquals(subjectD, serviceImpl.importSubject(subjectA));
	}
}
