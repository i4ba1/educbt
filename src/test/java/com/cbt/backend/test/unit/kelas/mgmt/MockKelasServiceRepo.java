package com.cbt.backend.test.unit.kelas.mgmt;


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
import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.repositories.KelasRepo;
import id.co.knt.cbt.service.KelasService;
import id.co.knt.cbt.service.impl.KelasServiceImpl;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes={PersistenceConfig.class, WebMvcConfig.class})
@WebAppConfiguration
public class MockKelasServiceRepo {
	
	@Autowired
	private KelasRepo kelasRepo;
	
	@InjectMocks
	private KelasService serviceImpl;
	
	@Before
	public void setup(){
		serviceImpl = new KelasServiceImpl(kelasRepo);
	}
	
	private Kelas kelasA;
	private Kelas kelasB;
	private Kelas kelasC;
	private Kelas kelasD;
	
	@Test
	public void testAdd(){
		kelasA = new Kelas();
		kelasA.setClassName("1A");
		kelasA.setCreatedDate(new Date());
		
		kelasB = new Kelas();
		kelasB.setClassName("1B");
		kelasB.setCreatedDate(new Date());
		
		kelasC = new Kelas();
		kelasC.setClassName("1C");
		kelasC.setCreatedDate(new Date());
		
		KelasServiceImpl mock = Mockito.mock(KelasServiceImpl.class);
		Mockito.when(mock.save(kelasA)).thenReturn(new Kelas());
		Mockito.when(mock.save(kelasB)).thenReturn(new Kelas());
		Mockito.when(mock.save(kelasC)).thenReturn(new Kelas());
		
		Assert.assertEquals(kelasA, serviceImpl.save(kelasA));
		Assert.assertEquals(kelasB, serviceImpl.save(kelasB));
		Assert.assertEquals(kelasC, serviceImpl.save(kelasC));
	}
	
	@Test
	public void testUpdate(){
		KelasServiceImpl mock = Mockito.mock(KelasServiceImpl.class);
		Mockito.when(mock.getKelasById(1)).thenReturn("1A");
		Assert.assertEquals("1A", serviceImpl.getKelasById(1));
		
		Kelas tmp = serviceImpl.findKelasById(1);
		tmp.setClassName("1AA");
		Mockito.when(mock.updateKelas(tmp)).thenReturn("1AA");
		Assert.assertEquals("1AA", serviceImpl.updateKelas(tmp));
	}
	
	@Test
	public void testDelete(){
		KelasServiceImpl mock = Mockito.mock(KelasServiceImpl.class);
		Mockito.when(mock.findKelasById(1)).thenReturn(new Kelas());
		
		Kelas tmp = serviceImpl.findKelasById(1);
		serviceImpl.updateKelas(tmp);
		System.out.println("Teacher Name===============> "+tmp.getClassName());
	}
	
	@Test
	public void testFindById(){
		KelasServiceImpl mock = Mockito.mock(KelasServiceImpl.class);
		Mockito.when(mock.getKelasById(1)).thenReturn("1A");
		Assert.assertEquals("1A", serviceImpl.getKelasById(1));
		
		Kelas tmp = serviceImpl.findKelasById(1);
		System.out.println("Teacher Name===============> "+tmp.getClassName());
	}
	
	@Test
	public void testImport(){
		kelasD = new Kelas();
		kelasD.setClassName("1D");
		kelasD.setCreatedDate(new Date());
		
		KelasServiceImpl mock = Mockito.mock(KelasServiceImpl.class);
		Mockito.when(mock.importKelas(kelasD)).thenReturn(new Kelas());
		
		Assert.assertEquals(kelasD, serviceImpl.importKelas(kelasD));
	}
}
