package id.co.knt.cbt.service;

import java.util.List;
import java.util.Map;

import id.co.knt.cbt.model.StudentAnswer;

public interface StudentAnswerService {
	StudentAnswer addNew(StudentAnswer sa);
	
	StudentAnswer updateSA(StudentAnswer sa);
	
	StudentAnswer findOneSA(Long id);
	
	StudentAnswer findSAByQuestion(Long qId);
	
	List<Object> calculateResult(StudentAnswer sa);
	
	List<StudentAnswer> findSAByEvent(Long eventId, String nis);
	
	List<Map<String, Object>> resultEvent(Long eventId, String nis);
	
	Integer checkStudentIsWorkingOn(Long eventId, String nis);
}
