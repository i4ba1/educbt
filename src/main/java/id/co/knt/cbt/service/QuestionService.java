package id.co.knt.cbt.service;

import java.util.List;
import java.util.Map;

import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.QuestionGroup;

public interface QuestionService {
	int addNewQuestion(List<Object> questions);

	Question updateCurrentQuestion(List<Object> objects);

	void deleteCurrentQuestion(Question question);

	Question findQuestionById(Long id);
	
	Question detailQuestion(Long id);
	
	List<Question> findQuestionByQP(Long questionPoolId);
	
	List<Question> findQuestionBySubject(Integer subjectId, String nip);
	
	List<Question> findQuestionByQG(Long qgId);
	
	List<QuestionGroup> findQuestionGroupByQP(Long qpId, String nip);
	
	Map<String, List<Map<String, Object>>> findQuestionGroupById(Long id);
	
	void disabledQG(Long groupId);
}
