package id.co.knt.cbt.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	public List<StudentAnswer> findSAByEvent(Long eventId, String nis) {
		List<StudentAnswer> list = studentAnswerRepo.findSAByEvent(eventId, nis);
		
		return list;
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

}
