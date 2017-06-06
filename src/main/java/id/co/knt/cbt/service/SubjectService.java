package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.Subject;

public interface SubjectService {
	Iterable<Subject> getAllSubject();

	int save(List<Object> objects);

	String getSubjectById(Integer id);

	Subject findSubjectById(Integer id);

	String updateSubject(Subject subject);

	void delete(Subject subject);

	Boolean isSubjectExist(Subject subject);

	int importSubject(List<Object> list);
	
	Subject findSubjectName(String subjectName);
	
	Subject turnOnDeleted(Subject subject);
}
