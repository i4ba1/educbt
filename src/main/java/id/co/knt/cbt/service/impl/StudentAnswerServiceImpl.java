package id.co.knt.cbt.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.StudentAnswer;
import id.co.knt.cbt.repositories.StudentAnswerRepo;
import id.co.knt.cbt.service.StudentAnswerService;

@Transactional
@Service("studentAnswerService")
public class StudentAnswerServiceImpl implements StudentAnswerService{

	@Autowired
	private StudentAnswerRepo studentAnswerRepo;
	
	public StudentAnswerServiceImpl() {
		
	}
	
	public StudentAnswerServiceImpl(StudentAnswerRepo studentAnswerRepo) {
		super();
		this.studentAnswerRepo = studentAnswerRepo;
	}

	@Async
	@Override
	public StudentAnswer addNew(StudentAnswer sa) {
		StudentAnswer studentAnswer = studentAnswerRepo.save(sa); 
		return studentAnswer;
	}

	@Override
	public StudentAnswer updateSA(StudentAnswer sa) {
		StudentAnswer studentAnswer = studentAnswerRepo.saveAndFlush(sa);
		return studentAnswer;
	}

	@Override
	public List<Object> calculateResult(StudentAnswer sa) {
		return null;
	}

	@Override
	public StudentAnswer findOneSA(Long id) {
		return studentAnswerRepo.findOne(id);
	}

	@Override
	public StudentAnswer findSAByQuestion(Long qId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Integer checkStudentIsWorkingOn(Long eventId, String nis) {
		Integer count = studentAnswerRepo.checkStudentIsWorkingOn(eventId, nis);
		
		return count;
	}

	@Override
	public List<StudentAnswer> findSAByEvent(Long eventId, String nis) {
		List<StudentAnswer> list = studentAnswerRepo.findSAByEvent(eventId, nis);
		
		return list;
	}

	@Override
	public List<Map<String, Object>> resultEvent(Long eventId, String nis) {
		List<StudentAnswer> list = studentAnswerRepo.findSAByEvent(eventId, nis);
		List<Map<String, Object>> listData = new ArrayList<>();
		
		Map<String, Object> mapSA = new HashMap<>();
		Map<String, Object> mapQuestion = new HashMap<>();
		//List<Map<String, Object>> questions = new ArrayList<>();
		
		for (StudentAnswer sa : list) {
			mapSA = new HashMap<>();
			mapSA.put("answered", sa.getAnswered());
			mapSA.put("correct", sa.getCorrect());
			mapSA.put("event", sa.getEvent());
			mapSA.put("id", sa.getId());
			
			Question q = sa.getQuestion();
			mapQuestion = new HashMap<>();
			mapQuestion.put("id", q.getId());
			mapQuestion.put("question", q.getQuestion());
			mapQuestion.put("optionA", q.getOptionA());
			mapQuestion.put("optionB", q.getOptionB());
			mapQuestion.put("optionC", q.getOptionC());
			mapQuestion.put("optionD", q.getOptionD());
			mapQuestion.put("optionE", q.getOptionE());
			mapQuestion.put("key", System.currentTimeMillis()+"#"+q.getKey()+"#"+System.nanoTime());
			mapQuestion.put("explanation", q.getExplanation());
			mapQuestion.put("typeQuestion", q.getTypeQuestion());
			mapQuestion.put("questioGroup", q.getQuestionGroup());
			
			mapSA.put("question", mapQuestion);
			mapSA.put("student", sa.getStudent());
			listData.add(mapSA);
		}
		
		return listData;
	}
}
