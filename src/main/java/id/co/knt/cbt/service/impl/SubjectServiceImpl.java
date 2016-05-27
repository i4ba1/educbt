package id.co.knt.cbt.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Subject;
import id.co.knt.cbt.repositories.SubjectRepo;
import id.co.knt.cbt.service.SubjectService;

@Transactional
@Service("subjectService")
public class SubjectServiceImpl implements SubjectService {

	@Autowired
	public SubjectRepo subjectRepo;

	public SubjectServiceImpl() {

	}

	public SubjectServiceImpl(SubjectRepo subjectRepo) {
		this.subjectRepo = subjectRepo;
	}

	@Override
	public Iterable<Subject> getAllSubject() {
		Iterable<Subject> subjects = subjectRepo.fetchSubjectNotDeleted(false);
		return subjects;
	}

	@Override
	public Subject save(Subject subject) {
		Subject sbj = subjectRepo.save(subject);
		return sbj;
	}

	@Override
	public String getSubjectById(Integer id) {
		Subject sbj = subjectRepo.findOne(id);
		return sbj.getSubjectName();
	}

	@Override
	public Subject findSubjectById(Integer id) {
		Subject sbj = subjectRepo.findOne(id);
		return sbj;
	}

	@Override
	public String updateSubject(Subject subject) {
		Subject sbj = subjectRepo.saveAndFlush(subject);
		return sbj.getSubjectName();
	}

	@Override
	public void delete(Subject subject) {
		subjectRepo.saveAndFlush(subject);
	}

	@Override
	public Boolean isSubjectExist(Subject subject) {
		Subject sbj = subjectRepo.findBySubjectName(subject.getSubjectName());
		return sbj != null;
	}

	@Override
	public Subject importSubject(Subject subject) {
		Subject newSubject = subjectRepo.save(subject);
		return newSubject;
	}

	@Override
	public Subject findSubjectName(String sbjName) {
		Subject sbj = subjectRepo.findBySubjectName(sbjName);
		return sbj;
	}

	@Override
	public Subject turnOnDeleted(Subject subject) {
		return subjectRepo.saveAndFlush(subject);
	}

}
