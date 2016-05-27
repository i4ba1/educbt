package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.QuestionTag;

public interface QuestionTagService {
	QuestionTag addNew(QuestionTag qt);
	
	QuestionTag updateQuestion(QuestionTag qt);
	
	void deleteQuestion(QuestionTag qt);
	
	List<QuestionTag> findAllQuestionTag();
	
	QuestionTag findQuestionTagById(Long id);
}
