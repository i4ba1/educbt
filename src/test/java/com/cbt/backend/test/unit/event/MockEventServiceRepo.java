package com.cbt.backend.test.unit.event;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import id.co.knt.cbt.config.PersistenceConfig;
import id.co.knt.cbt.config.WebMvcConfig;
import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventType;
import id.co.knt.cbt.model.Event.QuestionTypeStructure;
import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.Question.Difficulty;
import id.co.knt.cbt.model.QuestionPool;
import id.co.knt.cbt.repositories.EventRepo;
import id.co.knt.cbt.repositories.KelasRepo;
import id.co.knt.cbt.repositories.QuestionPoolRepository;
import id.co.knt.cbt.repositories.QuestionRepo;
import id.co.knt.cbt.service.EventService;
import id.co.knt.cbt.service.KelasService;
import id.co.knt.cbt.service.QuestionPoolService;
import id.co.knt.cbt.service.QuestionService;
import id.co.knt.cbt.service.impl.EventServiceImpl;
import id.co.knt.cbt.service.impl.KelasServiceImpl;
import id.co.knt.cbt.service.impl.QuestionPoolServiceImpl;
import id.co.knt.cbt.service.impl.QuestionServiceImpl;


@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes={PersistenceConfig.class, WebMvcConfig.class})
@WebAppConfiguration
public class MockEventServiceRepo{
	
	private static final Logger LOG = LoggerFactory.getLogger(MockEventServiceRepo.class);

	@Autowired
	private QuestionPoolRepository poolRepository;

	@Autowired
	private QuestionRepo questionRepo;
	
	@Autowired
	private EventRepo eventRepo;
	
	@Autowired
	private KelasRepo kelasRepo;

	@InjectMocks
	private QuestionPoolService questionPoolServiceImpl;

	@InjectMocks
	private QuestionService questionServiceImpl;
	
	@InjectMocks
	private EventService eventServiceImpl;
	
	@InjectMocks
	private KelasService kelasServiceImpl;
	
	private QuestionPool poolA;
	private QuestionPool poolB;

	private Question qA;
	private Question qB;
	private Question qC;
	private Question qD;
	private Question qE;
	
	private QuestionPoolRepository mockQuestionRepoPool;
	private QuestionRepo mockQuestionRepo;
	private EventRepo mockEventRepo;
	private KelasRepo mockKelasRepo;
	
	private Event event1;
	
	private Kelas kelas;
	private Kelas kelas2;
	private Kelas kelas3;
	
	@Before
	public void setup() {
		questionPoolServiceImpl = new QuestionPoolServiceImpl(poolRepository);
		questionServiceImpl = new QuestionServiceImpl(questionRepo);
		eventServiceImpl = new EventServiceImpl(eventRepo);
		kelasServiceImpl = new KelasServiceImpl(kelasRepo);
		
		mockQuestionRepoPool = Mockito.mock(QuestionPoolRepository.class);
		mockQuestionRepo = Mockito.mock(QuestionRepo.class);
		mockEventRepo = Mockito.mock(EventRepo.class);
		mockKelasRepo = Mockito.mock(KelasRepo.class);
	}
	
	@Test
	public void addEvent(){
		poolA = new QuestionPool();
		poolA.setCreatedDate(new Date());

		poolB = new QuestionPool();
		poolB.setCreatedDate(new Date());

		Mockito.when(mockQuestionRepoPool.save(poolA)).thenReturn(poolA);
		Mockito.when(mockQuestionRepoPool.save(poolB)).thenReturn(poolB);
		
		Assert.assertEquals(poolA, questionPoolServiceImpl.addNewBankQuestion(poolA));
		Assert.assertEquals(poolB, questionPoolServiceImpl.addNewBankQuestion(poolB));
		
		qA = new Question();
		qA.setQuestion("Berapa 5 + 4");
		qA.setOptionA("6");
		qA.setOptionB("7");
		qA.setOptionC("3");
		qA.setOptionD("9");
		qA.setKey("9");
		qA.setExplanation("hasilnya 9");
		qA.setDifficulty(Difficulty.EASY);

		qB = new Question();
		qB.setQuestion("Berapa 11 + 4");
		qB.setOptionA("6");
		qB.setOptionB("7");
		qB.setOptionC("25");
		qB.setOptionD("9");
		qB.setKey("25");
		qB.setExplanation("hasilnya 25");
		qB.setDifficulty(Difficulty.MEDIUM);

		qC = new Question();
		qC.setQuestion("Berapa 11 * 4");
		qC.setOptionA("6");
		qC.setOptionB("44");
		qC.setOptionC("1");
		qC.setOptionD("9");
		qC.setKey("44");
		qC.setExplanation("hasilnya 44");
		qC.setDifficulty(Difficulty.MEDIUM);
		
		qC = new Question();
		qC.setQuestion("Berapa 11 * 4");
		qC.setOptionA("6");
		qC.setOptionB("44");
		qC.setOptionC("1");
		qC.setOptionD("9");
		qC.setKey("44");
		qC.setExplanation("hasilnya 44");
		qC.setDifficulty(Difficulty.MEDIUM);

		qD = new Question();
		qD.setQuestion("Berapa 120 * 50");
		qD.setOptionA("6000");
		qD.setOptionB("44");
		qD.setOptionC("1");qA = new Question();
		qA.setKey("9");
		qA.setExplanation("hasilnya 9");
		qA.setDifficulty(Difficulty.EASY);

		qE = new Question();
		qE.setQuestion("Berapa 120 * 150");
		qE.setOptionA("6");
		qE.setOptionB("44");
		qE.setOptionC("18000");
		qE.setOptionD("9");
		qE.setKey("18000");
		qE.setExplanation("hasilnya 18000");
		qE.setDifficulty(Difficulty.HARD);
		
		/*qA.setQuestionPool(poolA);
		qB.setQuestionPool(poolA);
		qC.setQuestionPool(poolA);
		qD.setQuestionPool(poolA);
		qE.setQuestionPool(poolA);
		*/
		
		Mockito.when(mockQuestionRepo.save(qA)).thenReturn(qA);
		Mockito.when(mockQuestionRepo.save(qB)).thenReturn(qB);
		Mockito.when(mockQuestionRepo.save(qC)).thenReturn(qC);
		Mockito.when(mockQuestionRepo.save(qD)).thenReturn(qD);
		Mockito.when(mockQuestionRepo.save(qE)).thenReturn(qE);

/*		Assert.assertEquals(qA, questionServiceImpl.addNewQuestion(qA));
		Assert.assertEquals(qB, questionServiceImpl.addNewQuestion(qB));
		Assert.assertEquals(qC, questionServiceImpl.addNewQuestion(qC));
		Assert.assertEquals(qD, questionServiceImpl.addNewQuestion(qD));
		Assert.assertEquals(qE, questionServiceImpl.addNewQuestion(qE));*/
		
		kelas = new Kelas();
		kelas.setClassName("2A");
		kelas.setActivated(true);
		kelas.setCreatedDate(new Date());
		
		kelas2 = new Kelas();
		kelas2.setClassName("2B");
		kelas2.setActivated(true);
		kelas2.setCreatedDate(new Date());
		
		kelas3 = new Kelas();
		kelas3.setClassName("2C");
		kelas3.setActivated(true);
		kelas3.setCreatedDate(new Date());
		
		Mockito.when(mockKelasRepo.save(kelas)).thenReturn(kelas);
		Mockito.when(mockKelasRepo.save(kelas2)).thenReturn(kelas2);
		Mockito.when(mockKelasRepo.save(kelas3)).thenReturn(kelas3);
		
		Assert.assertEquals(kelas, kelasServiceImpl.save(kelas));
		Assert.assertEquals(kelas2, kelasServiceImpl.save(kelas2));
		Assert.assertEquals(kelas3, kelasServiceImpl.save(kelas3));
		
		String datePattern = "dd/MM/yyyy";
		String timePattern = "HH:mm:ss";
	    SimpleDateFormat formatter = new SimpleDateFormat(datePattern);
	    SimpleDateFormat formatterTime = new SimpleDateFormat(timePattern);
		
	    List<Kelas> classes = new ArrayList<Kelas>();
	    classes.add(kelas);
	    classes.add(kelas2);
	    classes.add(kelas3);
	    
		event1 = new Event();
		event1.setEventName("Tugas matematika kelas 2A");
		event1.setEventType(EventType.TUGAS);
		event1.setDeleted(false);
		
		String start = "19/02/2016";
		String end = "19/02/2016";
		String startTime = "08:00:00";
		String endTime = "10:00:00";
		Date startDate;
		Date endDate;
		Date startTimeDate;
		Date endTimeDate;
		long workingTime = 0;
		
		try {
			startDate = formatter.parse(start);
			endDate = formatter.parse(end);
			startTimeDate = formatterTime.parse(startTime);
			endTimeDate = formatterTime.parse(endTime);
			
			long diff = endTimeDate.getTime() - startTimeDate.getTime();
			workingTime = diff / (60 * 60 * 1000) % 24;
			
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		
		Mockito.when(mockEventRepo.save(event1)).thenReturn(event1);
		Assert.assertEquals(event1, eventServiceImpl.addNewEvent(event1));
		
	}
	
	@Test
	public void testUpdate(){
		kelas  = kelasServiceImpl.findKelasById(1);
		kelas2 = kelasServiceImpl.findKelasById(2);
		
		List<Kelas> classes = new ArrayList<Kelas>();
		classes.add(kelas);
		classes.add(kelas2);
		
		event1 = eventServiceImpl.findEventByName("Tugas matematika kelas 2A");
		event1.setEventName("Tugas matematika kelas 2A dan 2B");
		event1.setEventType(EventType.TUGAS);
		event1.setDeleted(false);
		
		String datePattern = "dd/MM/yyyy";
		String timePattern = "HH:mm:ss";
		
	    SimpleDateFormat formatter = new SimpleDateFormat(datePattern);
	    SimpleDateFormat formatterTime = new SimpleDateFormat(timePattern);
	    
	    String start = "19/02/2016";
		String end = "19/02/2016";
		String startTime = "08:00:00";
		String endTime = "11:00:00";
		Date startDate;
		Date endDate;
		Date startTimeDate;
		Date endTimeDate;
		long workingTime = 0;
		
		try {
			startDate = formatter.parse(start);
			endDate = formatter.parse(end);
			startTimeDate = formatterTime.parse(startTime);
			endTimeDate = formatterTime.parse(endTime);
			
			long diff = endTimeDate.getTime() - startTimeDate.getTime();
			workingTime = diff / (60 * 60 * 1000) % 24;

		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		List<QuestionPool> list = questionPoolServiceImpl.findBankQuestion("Bank Question berhitung");
		poolA = list.get(0);
		
		event1.setQuestionStructure(QuestionTypeStructure.FIXED);
		
		Mockito.when(mockEventRepo.save(event1)).thenReturn(event1);
		Assert.assertNotNull(eventServiceImpl.updateEvent(event1));;
	}
	
	@Test
	public void testDelete(){
		event1 = eventServiceImpl.findEventByName("Tugas matematika kelas 2A");
		event1.setDeleted(true);
		eventServiceImpl.deleteEvent(event1);
	}

}
