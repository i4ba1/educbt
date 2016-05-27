package com.cbt.backend.test.unit.student.mgmt;

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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import id.co.knt.cbt.config.PersistenceConfig;
import id.co.knt.cbt.config.WebMvcConfig;
import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventType;
import id.co.knt.cbt.model.Event.QuestionTypeStructure;
import id.co.knt.cbt.model.EventResult;
import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.Question.Difficulty;
import id.co.knt.cbt.model.QuestionPool;
import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.model.StudentAnswer;
import id.co.knt.cbt.model.User.Religion;
import id.co.knt.cbt.model.User.Sex;
import id.co.knt.cbt.repositories.EventRepo;
import id.co.knt.cbt.repositories.EventResultRepo;
import id.co.knt.cbt.repositories.KelasRepo;
import id.co.knt.cbt.repositories.QuestionPoolRepository;
import id.co.knt.cbt.repositories.QuestionRepo;
import id.co.knt.cbt.repositories.StudentAnswerRepo;
import id.co.knt.cbt.repositories.StudentRepo;
import id.co.knt.cbt.service.EventService;
import id.co.knt.cbt.service.KelasService;
import id.co.knt.cbt.service.QuestionPoolService;
import id.co.knt.cbt.service.QuestionService;
import id.co.knt.cbt.service.StudentAnswerService;
import id.co.knt.cbt.service.StudentService;
import id.co.knt.cbt.service.impl.EventResultServiceImpl;
import id.co.knt.cbt.service.impl.EventServiceImpl;
import id.co.knt.cbt.service.impl.KelasServiceImpl;
import id.co.knt.cbt.service.impl.QuestionPoolServiceImpl;
import id.co.knt.cbt.service.impl.QuestionServiceImpl;
import id.co.knt.cbt.service.impl.StudentAnswerServiceImpl;
import id.co.knt.cbt.service.impl.StudentServiceImpl;
import id.co.knt.cbt.util.PasswordUtility;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { PersistenceConfig.class, WebMvcConfig.class })
@WebAppConfiguration
public class MockStudentServiceRepo {

	@Autowired
	private StudentRepo studentRepo;
	
	@Autowired
	private StudentAnswerRepo studentAnswerRepo;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@Autowired
	private KelasRepo kelasRepo;
	
	@Autowired
	private QuestionPoolRepository poolRepository;

	@Autowired
	private QuestionRepo questionRepo;
	
	@Autowired
	private EventResultRepo eventResultRepo;
	
	@Autowired
	private EventRepo eventRepo;

	@InjectMocks
	private StudentService serviceImpl;
	
	@InjectMocks
	private StudentAnswerService sasImpl;
	
	@InjectMocks
	private KelasService kelasServiceImpl;
	
	@InjectMocks
	private QuestionPoolService qPoolServiceImpl;

	@InjectMocks
	private QuestionService questionServiceImpl;
	
	@InjectMocks
	private EventResultServiceImpl eventResultService;
	
	@InjectMocks
	private EventService eventService;
	
	private QuestionPool poolA;

	private Question qA;
	private Question qB;
	private Question qC;
	private Question qD;
	private Question qE;
	
	private List<Question> lst;

	@Before
	public void setup() {
		//serviceImpl = new StudentServiceImpl(studentRepo);
		kelasServiceImpl= new KelasServiceImpl(kelasRepo);
		sasImpl = new StudentAnswerServiceImpl(studentAnswerRepo);
		qPoolServiceImpl = new QuestionPoolServiceImpl(poolRepository);
		questionServiceImpl = new QuestionServiceImpl(questionRepo);
		eventResultService = new EventResultServiceImpl(eventResultRepo);
		eventService = new EventServiceImpl(eventRepo);
		
		lst = new ArrayList<Question>();
		
		poolA = new QuestionPool();
		poolA.setCreatedDate(new Date());

		qA = new Question();
		qA.setQuestion("Berapa 5 + 4");
		qA.setOptionA("6");
		qA.setOptionB("7");
		qA.setOptionC("3");
		qA.setOptionD("9");
		qA.setKey("D");
		qA.setExplanation("hasilnya 9");
		qA.setDifficulty(Difficulty.EASY);
		lst.add(qA);
		//poolA.setQuestions(qA);

		qB = new Question();
		qB.setQuestion("Berapa 11 + 4");
		qB.setOptionA("6");
		qB.setOptionB("7");
		qB.setOptionC("25");
		qB.setOptionD("15");
		qB.setKey("D");
		qB.setExplanation("hasilnya 15");
		qB.setDifficulty(Difficulty.MEDIUM);
		lst.add(qB);
		//poolA.setQuestions(qB);

		qC = new Question();
		qC.setQuestion("Berapa 11 * 5");
		qC.setOptionA("6");
		qC.setOptionB("44");
		qC.setOptionC("1");
		qC.setOptionD("55");
		qC.setKey("D");
		qC.setExplanation("hasilnya 55");
		qC.setDifficulty(Difficulty.MEDIUM);
		lst.add(qC);
		//poolA.setQuestions(qC);

		qD = new Question();
		qD.setQuestion("Berapa 120 * 50");
		qD.setOptionA("6000");
		qD.setOptionB("44");
		qD.setOptionC("1");qA = new Question();
		qD.setOptionD("9");
		qD.setKey("A");
		qD.setExplanation("hasilnya 6000");
		qD.setDifficulty(Difficulty.HARD);
		//poolA.setQuestions(qD);

		qE = new Question();
		qE.setQuestion("Berapa 120 * 150");
		qE.setOptionA("6");
		qE.setOptionB("44");
		qE.setOptionC("18000");
		qE.setOptionD("9");
		qE.setKey("C");
		qE.setExplanation("hasilnya 18000");
		qE.setDifficulty(Difficulty.HARD);
		//poolA.setQuestions(qE);

		QuestionPoolServiceImpl mock = Mockito.mock(QuestionPoolServiceImpl.class);
		Mockito.when(mock.addNewBankQuestion(poolA)).thenReturn(new QuestionPool());

		Assert.assertEquals(poolA, qPoolServiceImpl.addNewBankQuestion(poolA));
		
		/*qA.setQuestionPool(poolA);
		qB.setQuestionPool(poolA);
		qC.setQuestionPool(poolA);
		qD.setQuestionPool(poolA);

		Assert.assertEquals(qA, questionServiceImpl.addNewQuestion(qA));
		Assert.assertEquals(qB, questionServiceImpl.addNewQuestion(qB));
		Assert.assertEquals(qC, questionServiceImpl.addNewQuestion(qC));
		Assert.assertEquals(qD, questionServiceImpl.addNewQuestion(qD));
		Assert.assertEquals(qE, questionServiceImpl.addNewQuestion(qE));*/
	}

	private Student studentA;
	private Student studentB;
	private Student studentC;
	private Student studentF;
	
	@Test
	public void testAdd() {
		Kelas kelas = new Kelas();
		kelas.setClassName("3A");
		kelas.setCreatedDate(new Date());
		Assert.assertNotNull(kelasServiceImpl.save(kelas));
		
		studentA = new Student();
		studentA.setNis("1246598606");
		studentA.setFirstName("Muhamad");
		studentA.setLastName("Yakub");
		studentA.setGender(Sex.MALE);
		studentA.setBirthDate(new Date());
		studentA.setBirthPlace("Jakarta");
		studentA.setEmail("muhamad.yakub@gmail");
		studentA.setSchool("SMP 7 Jakarta");
		studentA.setMobilePhone("0876484748484");
		studentA.setPhone("021-8595959");
		String pass1 = PasswordUtility.generatePass(studentA.getNis());
		studentA.setPassword(PasswordUtility.generatePass(studentA.getNis()));
		studentA.setHashedPassword(passwordEncoder.encode(pass1));
		studentA.setReligion(Religion.ISLAM);
		studentA.setKelas(kelas);

		studentB = new Student();
		studentB.setNis("1246598777");
		studentB.setFirstName("Muhamad");
		studentB.setLastName("Ali");
		studentB.setGender(Sex.MALE);
		studentB.setBirthDate(new Date());
		studentB.setBirthPlace("Jakarta");
		studentB.setEmail("muhamad.yakub@gmail");
		studentB.setSchool("SMP 7 Jakarta");
		studentB.setMobilePhone("0876484748484");
		studentB.setPhone("021-8595959");
		String pass2 = PasswordUtility.generatePass(studentB.getNis());
		studentB.setPassword(PasswordUtility.generatePass(studentB.getNis()));
		studentB.setHashedPassword(passwordEncoder.encode(pass2));
		studentB.setReligion(Religion.ISLAM);
		studentB.setKelas(kelas);
		
		studentC = new Student();
		studentC.setNis("124659888");
		studentC.setFirstName("Muhammad");
		studentC.setLastName("Thoha");
		studentC.setGender(Sex.MALE);
		studentC.setBirthDate(new Date());
		studentC.setBirthPlace("Jakarta");
		studentC.setEmail("muhamad.yakub@gmail");
		studentC.setSchool("SMP 7 Jakarta");
		studentC.setMobilePhone("0876484748484");
		studentC.setPhone("021-8595959");
		String pass3 = PasswordUtility.generatePass(studentC.getNis());
		studentC.setPassword(PasswordUtility.generatePass(studentC.getNis()));
		studentC.setHashedPassword(passwordEncoder.encode(pass3));
		studentC.setReligion(Religion.ISLAM);
		studentC.setKelas(kelas);

/*		StudentServiceImpl mock = Mockito.mock(StudentServiceImpl.class);
		Mockito.when(mock.save(studentA)).thenReturn(new Student());
		Mockito.when(mock.save(studentB)).thenReturn(new Student());
		Mockito.when(mock.save(studentC)).thenReturn(new Student());*/

		Assert.assertEquals(studentA, serviceImpl.save(studentA));
		Assert.assertEquals(studentB, serviceImpl.save(studentB));
		Assert.assertEquals(studentC, serviceImpl.save(studentC));
	}

	@Test
	public void testUpdate() {
		StudentServiceImpl mock = Mockito.mock(StudentServiceImpl.class);
		Mockito.when(mock.getByNis("124659888")).thenReturn("Muhammad Thoha");
		Assert.assertEquals("Muhammad Thoha", serviceImpl.getByNis("124659888"));

		Student tmp = serviceImpl.getStudentByNis("124659888");
		tmp.setFirstName("Umar Faruq");
		Mockito.when(mock.updateStudent(tmp)).thenReturn("Umar Faruq");
		Assert.assertEquals("Umar Faruq", serviceImpl.updateStudent(tmp));
	}

	@Test
	public void testDelete() {
		StudentServiceImpl mock = Mockito.mock(StudentServiceImpl.class);
		Mockito.when(mock.getByNis("1246598777")).thenReturn("Muhamad Ali");
		Assert.assertEquals("Muhamad Ali", serviceImpl.getByNis("1246598777"));

		Student tmp = serviceImpl.getStudentByNis("1246598777");
		serviceImpl.delete(tmp);
		System.out.println("Student Name===============> " + tmp.getFirstName());
	}

	@Test
	public void testFindByNip() {
		StudentServiceImpl mock = Mockito.mock(StudentServiceImpl.class);
		Mockito.when(mock.getByNis("1246598777")).thenReturn("Muhamad Ali");
		Assert.assertEquals("Muhamad Ali", serviceImpl.getByNis("1246598777"));

		Student tmp = serviceImpl.getStudentByNis("1246598777");
		System.out.println("Student Name===============> " + tmp.getFirstName());
	}
	
	@Test
	public void testImport(){
		studentF = new Student();
		studentF.setNis("1246598725");
		studentF.setFirstName("Harits");
		studentF.setLastName("Nu'man");
		studentF.setAddress("Jatinegara Kaum");
		studentF.setBirthDate(new Date());
		studentF.setBirthPlace("Jakarta");
		studentF.setMobilePhone("085675968769");
		studentF.setPhone("021-5765868");

		StudentServiceImpl mock = Mockito.mock(StudentServiceImpl.class);
		Mockito.when(mock.importStudent(studentF)).thenReturn(new Student());

		Assert.assertEquals(studentA, serviceImpl.importStudent(studentF));
	}
	
	@Test
	public void crudStudentAnswer(){
		studentA = serviceImpl.getStudentByNis("1246598606");
		
		StudentAnswerRepo mockSAR = Mockito.mock(StudentAnswerRepo.class);
		
		List<StudentAnswer> list = new ArrayList<StudentAnswer>();
		StudentAnswer sa = new StudentAnswer();
		//sa.setQuestion(poolA.getQuestions().get(0));
		sa.setStudent(studentA);
		sa.setAnswered("D");
		Mockito.when(mockSAR.save(sa)).thenReturn(new StudentAnswer());
		Assert.assertEquals(sa, sasImpl.addNew(sa));
		list.add(sa);
		
		sa = new StudentAnswer();
		//sa.setQuestion(poolA.getQuestions().get(1));
		sa.setStudent(studentA);
		sa.setAnswered("D");
		Mockito.when(mockSAR.save(sa)).thenReturn(new StudentAnswer());
		Assert.assertEquals(sa, sasImpl.addNew(sa));
		list.add(sa);
		
		sa = new StudentAnswer();
		//sa.setQuestion(poolA.getQuestions().get(2));
		sa.setStudent(studentA);
		sa.setAnswered("B");
		Mockito.when(mockSAR.save(sa)).thenReturn(new StudentAnswer());
		Assert.assertEquals(sa, sasImpl.addNew(sa));
		list.add(sa);
		
		sa = new StudentAnswer();
		//sa.setQuestion(poolA.getQuestions().get(3));
		sa.setStudent(studentA);
		sa.setAnswered("A");
		Mockito.when(mockSAR.save(sa)).thenReturn(new StudentAnswer());
		Assert.assertEquals(sa, sasImpl.addNew(sa));
		list.add(sa);
		
		sa = new StudentAnswer();
		//sa.setQuestion(poolA.getQuestions().get(4));
		sa.setStudent(studentA);
		sa.setAnswered("C");
		Mockito.when(mockSAR.save(sa)).thenReturn(new StudentAnswer());
		Assert.assertEquals(sa, sasImpl.addNew(sa));
		list.add(sa);
		
		sa.setAnswered("D");
		Mockito.when(mockSAR.saveAndFlush(sa)).thenReturn(new StudentAnswer());
		Assert.assertNotNull(sasImpl.updateSA(sa));
		
//		List<Question> questions = poolA.getQuestions();
//		double correct = 0;
//		double incorrect = 0;
//		
//		for (int j = 0; j < questions.size(); j++) {
//			if (questions.get(j).getKey().equals(list.get(j).getAnswered())) {
//				list.get(j).setCorrect(true);
//				correct++;
//			}else{
//				list.get(j).setCorrect(false);
//				incorrect++;
//			}
//		}
		
		for (StudentAnswer data : list) {
			Assert.assertNotNull(sasImpl.updateSA(data));
		}
		
		Event e = constrcutEvent();
		Assert.assertNotNull(eventService.addNewEvent(e));
		
		EventResult er = new EventResult();
		er.setEvent(e);
		er.setStudent(studentA);
		//er.setTotal((correct/5)*100);
		Assert.assertNotNull(eventResultService.addNew(er));
	}
	
	private Event constrcutEvent(){
		
		String datePattern = "dd/MM/yyyy";
		String timePattern = "HH:mm:ss";
	    SimpleDateFormat formatter = new SimpleDateFormat(datePattern);
	    SimpleDateFormat formatterTime = new SimpleDateFormat(timePattern);
	    
		Event event1 = new Event();
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
		
		event1.setQuestionStructure(QuestionTypeStructure.RANDOM);
		
		return event1;
	}
}
