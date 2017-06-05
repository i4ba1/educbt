package id.co.knt.cbt.service.impl;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.QuestionPool;
import id.co.knt.cbt.repositories.QuestionPoolRepo;
import id.co.knt.cbt.service.QuestionPoolService;

/**
 * 
 * @author MNI
 *
 */
@Transactional
@Service("questionPoolService")
public class QuestionPoolServiceImpl implements QuestionPoolService{

	@Autowired
	private QuestionPoolRepo questionPoolRepo;
	
	public QuestionPoolServiceImpl() {
		
	}
	
	public QuestionPoolServiceImpl(QuestionPoolRepo poolRepository) {
		questionPoolRepo = poolRepository;
	}
	
	@Override
	public QuestionPool addNewBankQuestion(QuestionPool questionPool) {
		QuestionPool newBankQuestion = questionPoolRepo.save(questionPool);
		return newBankQuestion;
	}

	@Override
	public QuestionPool updateNewBankQuestion(QuestionPool questionPool) {
		QuestionPool newBankQuestion = questionPoolRepo.saveAndFlush(questionPool);
		return newBankQuestion;
	}

	@Override
	public void deletePoolQuestion(QuestionPool questionPool) {
		questionPoolRepo.saveAndFlush(questionPool);
	}

	@Override
	public List<QuestionPool> bankQuestions() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<QuestionPool> findBankQuestion(String name) {
		List<QuestionPool> pools = new ArrayList<QuestionPool>();
		
		return pools;
	}

	@Override
	public QuestionPool viewDetailBankQuestion(Long id) {
		QuestionPool pool = questionPoolRepo.findOne(id);
		return pool;
	}

	@Override
	public QuestionPool findQuestionBankById(Long id) {
		QuestionPool pool = questionPoolRepo.findOne(id);
		return pool;
	}

	@Override
	public Iterable<QuestionPool> findAllQuestionPool() {
		return questionPoolRepo.findAll();
	}

	@Override
	public List<QuestionPool> findAllQuestionByTeacher(String nip) {
		List<QuestionPool> pools = questionPoolRepo.findQpByTeacher(nip);
		return pools;
	}

}
