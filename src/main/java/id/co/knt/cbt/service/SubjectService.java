package id.co.knt.cbt.service;

import id.co.knt.cbt.model.Subject;

public interface SubjectService {
	Iterable<Subject> getAllSubject();

	Subject save(Subject subject);

	String getSubjectById(Integer id);

	Subject findSubjectById(Integer id);

	String updateSubject(Subject subject);

	void delete(Subject subject);

	Boolean isSubjectExist(Subject subject);

	Subject importSubject(Subject subject);
	
	Subject findSubjectName(String subjectName);
	
	Subject turnOnDeleted(Subject subject);
}
