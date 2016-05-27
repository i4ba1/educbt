package com.cbt.backend.test.unit.teacher.mgmt;

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
import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.repositories.EmployeeRepo;
import id.co.knt.cbt.service.EmployeeService;
import id.co.knt.cbt.service.impl.EmployeeServiceImpl;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes={PersistenceConfig.class,WebMvcConfig.class})
@WebAppConfiguration
public class MockEmployeeServiceRepo {
	@Autowired
	private EmployeeRepo teacherRepo;
	
	@InjectMocks
	private EmployeeService serviceImpl;
	
	@Before
	public void setup(){
		serviceImpl = new EmployeeServiceImpl(teacherRepo);
	}
	
	private Employee teacherA;
	private Employee teacherB;
	private Employee teacherC;
	private Employee teacherD;
	private Employee teacherE;
	private Employee teacherF;
	
	@Test
	public void testAdd(){
		teacherA = new Employee();
		teacherA.setNip("1246598606");
		teacherA.setFirstName("Ali");
		teacherA.setLastName("Uraidi");
		teacherA.setAddress("Jatinegara Kaum");
		teacherA.setBirthDate(new Date());
		teacherA.setBirthPlace("Jakarta");
		teacherA.setMobilePhone("085675968769");
		teacherA.setPhone("021-5765868");
		
		teacherB = new Employee();
		teacherB.setNip("1246598777");
		teacherB.setFirstName("Abdulloh");
		teacherB.setLastName("Alwi");
		teacherB.setAddress("Jatinegara Kaum");
		teacherB.setBirthDate(new Date());
		teacherB.setBirthPlace("Jakarta");
		teacherB.setMobilePhone("085675968769");
		teacherB.setPhone("021-5765868");
		
		teacherC = new Employee();
		teacherC.setNip("124659888");
		teacherC.setFirstName("Abdul");
		teacherC.setLastName("Qodir");
		teacherC.setAddress("Jatinegara Kaum");
		teacherC.setBirthDate(new Date());
		teacherC.setBirthPlace("Jakarta");
		teacherC.setMobilePhone("085675968769");
		teacherC.setPhone("021-5765868");
		
		teacherD = new Employee();
		teacherD.setNip("1246598999");
		teacherD.setFirstName("Abu");
		teacherD.setLastName("Yazid");
		teacherD.setAddress("Jatinegara Kaum");
		teacherD.setBirthDate(new Date());
		teacherD.setBirthPlace("Jakarta");
		teacherD.setMobilePhone("085675968769");
		teacherD.setPhone("021-5765868");
		
		teacherE = new Employee();
		teacherE.setNip("1246598111");
		teacherE.setFirstName("Harits");
		teacherE.setLastName("Nu'man");
		teacherE.setAddress("Jatinegara Kaum");
		teacherE.setBirthDate(new Date());
		teacherE.setBirthPlace("Jakarta");
		teacherE.setMobilePhone("085675968769");
		teacherE.setPhone("021-5765868");
		
		EmployeeServiceImpl mock = Mockito.mock(EmployeeServiceImpl.class);
		Mockito.when(mock.save(teacherA)).thenReturn(new Employee());
		Mockito.when(mock.save(teacherB)).thenReturn(new Employee());
		Mockito.when(mock.save(teacherC)).thenReturn(new Employee());
		Mockito.when(mock.save(teacherD)).thenReturn(new Employee());
		Mockito.when(mock.save(teacherE)).thenReturn(new Employee());
		
		Assert.assertEquals(teacherA, serviceImpl.save(teacherA));
		Assert.assertEquals(teacherB, serviceImpl.save(teacherB));
		Assert.assertEquals(teacherC, serviceImpl.save(teacherC));
		Assert.assertEquals(teacherD, serviceImpl.save(teacherD));
		Assert.assertEquals(teacherE, serviceImpl.save(teacherE));	
	}
	
	@Test
	public void testUpdate(){
		EmployeeServiceImpl mock = Mockito.mock(EmployeeServiceImpl.class);
		Mockito.when(mock.getByNip("1246598606")).thenReturn("Ali Uraidi");
		Assert.assertEquals("Ali Uraidi", serviceImpl.getByNip("1246598606"));
		
		Employee tmp = serviceImpl.getTeacherByNip("1246598606");
		tmp.setFirstName("Umar");
		tmp.setLastName("Faruq");
		Mockito.when(mock.updateTeacher(tmp)).thenReturn("Umar Faruq");
		Assert.assertEquals("Umar Faruq", serviceImpl.updateTeacher(tmp));
	}
	
	@Test
	public void testDelete(){
		EmployeeServiceImpl mock = Mockito.mock(EmployeeServiceImpl.class);
		Mockito.when(mock.getByNip("1246598777")).thenReturn("Abdulloh Alwi");
		Assert.assertEquals("Abdulloh Alwi", serviceImpl.getByNip("1246598777"));
		
		Employee tmp = serviceImpl.getTeacherByNip("1246598777");
		serviceImpl.delete(tmp);
		System.out.println("Teacher Name===============> "+tmp.getFirstName());
	}
	
	@Test
	public void testFindByNip(){
		EmployeeServiceImpl mock = Mockito.mock(EmployeeServiceImpl.class);
		Mockito.when(mock.getByNip("1246598777")).thenReturn("Abdulloh Alwi");
		Assert.assertEquals("Abdulloh Alwi", serviceImpl.getByNip("1246598777"));
		
		Employee tmp = serviceImpl.getTeacherByNip("1246598777");
		System.out.println("Teacher Name===============> "+tmp.getFirstName());
	}
	
	@Test
	public void testImport(){
		teacherF = new Employee();
		teacherF.setNip("1246598444");
		teacherF.setFirstName("Abdulloh");
		teacherF.setLastName("Salam");
		teacherF.setAddress("Jatinegara Kaum");
		teacherF.setBirthDate(new Date());
		teacherF.setBirthPlace("Jakarta");
		teacherF.setMobilePhone("085675968769");
		teacherF.setPhone("021-5765868");
		
		EmployeeServiceImpl mock = Mockito.mock(EmployeeServiceImpl.class);
		Mockito.when(mock.importTeacher(teacherF)).thenReturn(new Employee());
		
		Assert.assertEquals(teacherF, serviceImpl.importTeacher(teacherF));
	}
}
