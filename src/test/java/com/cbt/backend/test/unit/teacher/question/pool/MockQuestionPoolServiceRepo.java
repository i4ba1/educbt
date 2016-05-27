package com.cbt.backend.test.unit.teacher.question.pool;

import java.util.Date;
import java.util.List;

import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;

import id.co.knt.cbt.config.PersistenceConfig;
import id.co.knt.cbt.config.WebMvcConfig;
import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.Question.Difficulty;
import id.co.knt.cbt.model.QuestionPool;
import id.co.knt.cbt.repositories.QuestionPoolRepository;
import id.co.knt.cbt.repositories.QuestionRepo;
import id.co.knt.cbt.service.QuestionPoolService;
import id.co.knt.cbt.service.QuestionService;
import id.co.knt.cbt.service.impl.QuestionPoolServiceImpl;
import id.co.knt.cbt.service.impl.QuestionServiceImpl;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = { PersistenceConfig.class, WebMvcConfig.class })
@WebAppConfiguration
public class MockQuestionPoolServiceRepo {

	@Autowired
	private QuestionPoolRepository poolRepository;

	@Autowired
	private QuestionRepo questionRepo;

	@InjectMocks
	private QuestionPoolService serviceImpl;

	@InjectMocks
	private QuestionService questionServiceImpl;

	@Before
	public void setup() {
		serviceImpl = new QuestionPoolServiceImpl(poolRepository);
		questionServiceImpl = new QuestionServiceImpl(questionRepo);
	}

	@Mock
	private QuestionPool poolA;

	@Mock
	private QuestionPool poolB;

	private Question qA;
	private Question qB;
	private Question qC;
	private Question qD;
	private Question qE;

	@Test
	public void testAdd() {
		poolA = new QuestionPool();
		poolA.setCreatedDate(new Date());

		poolB = new QuestionPool();
		poolB.setCreatedDate(new Date());

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
		qA.setQuestion("Berapa 5 + 4");
		qD.setKey("6000");
		qD.setExplanation("hasilnya 6000");
		qD.setDifficulty(Difficulty.HARD);

		qE = new Question();
		qE.setQuestion("Berapa 120 * 150");
		qE.setOptionA("6");
		qE.setOptionB("44");
		qE.setOptionC("18000");
		qE.setOptionD("9");
		qE.setKey("18000");
		qE.setExplanation("hasilnya 18000");
		qE.setDifficulty(Difficulty.HARD);

		QuestionPoolServiceImpl mock = Mockito.mock(QuestionPoolServiceImpl.class);
		Mockito.when(mock.addNewBankQuestion(poolA)).thenReturn(new QuestionPool());
		Mockito.when(mock.addNewBankQuestion(poolB)).thenReturn(new QuestionPool());

		Assert.assertEquals(poolA, serviceImpl.addNewBankQuestion(poolA));
		Assert.assertEquals(poolB, serviceImpl.addNewBankQuestion(poolB));
		
		/*qA.setQuestionPool(poolA);
		qB.setQuestionPool(poolA);
		qC.setQuestionPool(poolA);
		qD.setQuestionPool(poolA);
		*/

		/*Assert.assertEquals(qA, questionServiceImpl.addNewQuestion(qA));
		Assert.assertEquals(qB, questionServiceImpl.addNewQuestion(qB));
		Assert.assertEquals(qC, questionServiceImpl.addNewQuestion(qC));
		Assert.assertEquals(qD, questionServiceImpl.addNewQuestion(qD));
		Assert.assertEquals(qE, questionServiceImpl.addNewQuestion(qE));*/
	}

	@Test
	public void testUpdate() {
		QuestionPoolServiceImpl mock = Mockito.mock(QuestionPoolServiceImpl.class);
		Mockito.when(mock.findQuestionBankById(new Long(1))).thenReturn(poolA);
		Assert.assertEquals(poolA, serviceImpl.findQuestionBankById(new Long(1)));

		List<QuestionPool> qPool = serviceImpl.findBankQuestion("Bank Question AlJabar");
		QuestionPool updatedQuestionPool = qPool.get(0);
		Mockito.when(mock.updateNewBankQuestion(updatedQuestionPool));		
		Assert.assertEquals("Bank Question Pythagoras", serviceImpl.updateNewBankQuestion(updatedQuestionPool));
	}

	@Test
	public void testDelete() {
		QuestionPoolServiceImpl mock = Mockito.mock(QuestionPoolServiceImpl.class);
		Mockito.when(mock.findQuestionBankById(new Long(1))).thenReturn(poolA);
		Assert.assertEquals(poolA, serviceImpl.findQuestionBankById(new Long(1)));

		List<QuestionPool> qPool = serviceImpl.findBankQuestion("Bank Question AlJabar");
		QuestionPool deletedQuestionPool = qPool.get(0);

		serviceImpl.deletePoolQuestion(deletedQuestionPool);
	}

	@Test
	public void testViewDetailQuestionPool() {
		QuestionPool qp = serviceImpl.viewDetailBankQuestion(new Long(1));
		Assert.assertNotNull(qp);

		Question questions = questionServiceImpl.findQuestionById(qp.getId());
	}

	//@Test
	public void testImport() {
		QuestionPool qp = serviceImpl.viewDetailBankQuestion(new Long(1));
		Assert.assertNotNull(qp);
		
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
		qA.setQuestion("Berapa 5 + 4");
		qD.setKey("6000");
		qD.setExplanation("hasilnya 6000");
		qD.setDifficulty(Difficulty.HARD);

		qE = new Question();
		qE.setQuestion("Berapa 120 * 150");
		qE.setOptionA("6");
		qE.setOptionB("44");
		qE.setOptionC("18000");
		qE.setOptionD("9");
		qE.setKey("18000");
		qE.setExplanation("hasilnya 18000");
		qE.setDifficulty(Difficulty.HARD);
		
		/*qA.setQuestionPool(qp);
		qB.setQuestionPool(qp);
		qC.setQuestionPool(qp);
		qD.setQuestionPool(qp);
		*/

		/*Assert.assertEquals(qA, questionServiceImpl.addNewQuestion(qA));
		Assert.assertEquals(qB, questionServiceImpl.addNewQuestion(qB));
		Assert.assertEquals(qC, questionServiceImpl.addNewQuestion(qC));
		Assert.assertEquals(qD, questionServiceImpl.addNewQuestion(qD));
		Assert.assertEquals(qE, questionServiceImpl.addNewQuestion(qE));*/
	}
	
	@Test
	public void testCrudQuestion(){
		poolA = new QuestionPool();
		poolA.setCreatedDate(new Date());
		Assert.assertEquals(poolA, serviceImpl.addNewBankQuestion(poolA));
		
		qA = new Question();
		qA.setQuestion("Berapa 5 + 4");
		qA.setOptionA("6");
		qA.setOptionB("7");
		qA.setOptionC("3");
		qA.setOptionD("9");
		qA.setKey("9");
		qA.setExplanation("hasilnya 9");
		qA.setDifficulty(Difficulty.EASY);
		//qA.setQuestionPool(poolA);
		//Assert.assertEquals(qA, questionServiceImpl.addNewQuestion(qA));
		
		Question question = questionServiceImpl.detailQuestion(qA.getId());
		question.setDifficulty(Difficulty.MEDIUM);
		
		questionServiceImpl.deleteCurrentQuestion(question);
		System.out.println("Question Name===============> " + question.getQuestion());
	} 
	
}
