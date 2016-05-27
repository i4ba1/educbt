package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.QuestionGroup;

public interface QuestionGroupService {
	QuestionGroup addNew(QuestionGroup qg);
	
	QuestionGroup updatedQP(QuestionGroup qg);
	
	void deleteQP(QuestionGroup qg);
	
	List<QuestionGroup> findAll(QuestionGroup qg);
	
	QuestionGroup findQuestionGroupById(Long id);
}
