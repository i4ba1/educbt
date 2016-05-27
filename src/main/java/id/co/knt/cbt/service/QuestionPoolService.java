package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.QuestionPool;

public interface QuestionPoolService {
	QuestionPool addNewBankQuestion(QuestionPool bankQuestion);

	QuestionPool updateNewBankQuestion(QuestionPool questionPool);

	void deletePoolQuestion(QuestionPool questionPool);

	List<QuestionPool> bankQuestions();

	List<QuestionPool> findBankQuestion(String name);

	QuestionPool viewDetailBankQuestion(Long id);
	
	QuestionPool findQuestionBankById(Long id);
	
	Iterable<QuestionPool> findAllQuestionPool();
	
	List<QuestionPool> findAllQuestionByTeacher(String nip);
}
