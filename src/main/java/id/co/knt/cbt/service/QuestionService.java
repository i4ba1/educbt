package id.co.knt.cbt.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.QuestionGroup;
import id.co.knt.cbt.model.QuestionGroupImages;

public interface QuestionService {
	QuestionGroup addNewQuestion(List<Object> questions);
	
	int importQuestion(List<Question> questions);

	Question updateCurrentQuestion(List<Object> objects);

	void deleteCurrentQuestion(Question question);

	Question findQuestionById(Long id);
	
	Question detailQuestion(Long id);
	
	List<Question> findQuestionByQP(Long questionPoolId);
	
	List<Map<String, Object>> findQuestionBySubject(Integer subjectId, String nip);
	
	List<Question> findQuestionByQG(Long qgId);
	
	List<QuestionGroup> findQuestionGroupByQP(Long qpId, String nip);
	
	Map<String, List<Map<String, Object>>> findQuestionGroupById(Long id);
	
	QuestionGroup findQGById(Long id);
	
	void disabledQG(Long groupId);
	
	List<Map<String, Object>> getQuestionByTag(ArrayList<Long> ids);
	
	void addNewQuestionImage(List<Object> objects);
	
	void deleteQuestionImage(QuestionGroupImages questionGroupImages);
	
	QuestionGroupImages findQGImage(Long id);
	
	List<QuestionGroupImages> findQGImages(Long id);

	QuestionGroupImages updateQuestionImage(QuestionGroupImages questionGroupImages);
}
