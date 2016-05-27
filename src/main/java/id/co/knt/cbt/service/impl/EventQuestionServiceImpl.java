package id.co.knt.cbt.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.knt.cbt.model.EventQuestion;
import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.QuestionPool;
import id.co.knt.cbt.model.QuestionTag;
import id.co.knt.cbt.repositories.EventQuestionRepo;
import id.co.knt.cbt.repositories.QuestionTagRepo;
import id.co.knt.cbt.service.EventQuestionService;

@Service("eventQuestionService")
public class EventQuestionServiceImpl implements EventQuestionService{
	
	@Autowired
	private EventQuestionRepo eventQuestionRepo;
	
	@Autowired
	private QuestionTagRepo questionTagRepo;

	@Override
	public Map<String, List<Map<String, Object>>> findEventQuestionByEventId(Long eventId) {
		List<EventQuestion> list = eventQuestionRepo.findByEventId(eventId);
		Map<String, Object> mapQ = null;
		Map<String, Object> mapQP = new HashMap<>();
		
		Map<String, List<Map<String, Object>>> values = new HashMap<>();
		List<Map<String, Object>> objTag = new ArrayList<>();
		List<Map<String, Object>> objQuestion = new ArrayList<>();
		List<Map<String, Object>> objQP = new ArrayList<>();
		QuestionPool qp = null;
		
		for (EventQuestion eventQuestion : list) {
			mapQ = new HashMap<>();
			Question question = eventQuestion.getQuestion();
			mapQ = new HashMap<>();
			objTag = new ArrayList<>();
			
			mapQ.put("id", question.getId());
			mapQ.put("question", question.getQuestion());
			mapQ.put("optionA", question.getOptionA());
			mapQ.put("optionB", question.getOptionB());
			mapQ.put("optionC", question.getOptionC());
			mapQ.put("optionD", question.getOptionD());
			mapQ.put("optionE", question.getOptionE());
			mapQ.put("difficulty", question.getDifficulty());
			mapQ.put("disabled", question.getDisabled());
			mapQ.put("explanation", question.getExplanation());
			mapQ.put("key", question.getKey());
			mapQ.put("typeQuestion", question.getTypeQuestion());

			List<QuestionTag> qt = questionTagRepo.findQT(question.getId());
			if (qt != null && !qt.isEmpty()) {
				if (qt.size() > 0) {
					for (QuestionTag questionTag : qt) {
						Map<String, Object> mapQT = new HashMap<>();
						mapQT.put("id", questionTag.getId());
						mapQT.put("tagName", questionTag.getTag().getTagName());
						objTag.add(mapQT);
					}
				} else {
					Map<String, Object> mapQT = new HashMap<>();
					mapQT.put("id", qt.get(0).getId());
					mapQT.put("tagName", qt.get(0).getTag().getTagName());
					objTag.add(mapQT);
				}
			}

			qp = eventQuestion.getQuestion().getQuestionGroup().getQuestionPool();
			mapQ.put("tagNames", objTag);
			objQuestion.add(mapQ);
		}
		
		mapQP.put("questionPool", qp);
		objQP.add(mapQP);
		values.put("questions", objQuestion);
		values.put("QP", objQP);
		
		return values;
	}

	@Override
	public void deleteEQByEventId(EventQuestion eq) {
		eventQuestionRepo.delete(eq);
	}

	@Override
	public List<EventQuestion> findEQByEventId(Long eventId) {
		return eventQuestionRepo.findByEventId(eventId);
	}

	@Override
	public EventQuestion addNew(EventQuestion eq) {
		return eventQuestionRepo.save(eq);
	}

	@Override
	public EventQuestion findOneByEventId(Long eventId) {
		return eventQuestionRepo.findOne(eventId);
	}
}
