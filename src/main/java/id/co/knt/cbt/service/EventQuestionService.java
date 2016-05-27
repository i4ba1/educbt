package id.co.knt.cbt.service;

import java.util.List;
import java.util.Map;

import id.co.knt.cbt.model.EventQuestion;

public interface EventQuestionService {
	Map<String, List<Map<String, Object>>> findEventQuestionByEventId(Long eventId);

	void deleteEQByEventId(EventQuestion eq);
	
	List<EventQuestion> findEQByEventId(Long eventId);
	
	EventQuestion addNew(EventQuestion eq);
	
	EventQuestion findOneByEventId(Long eventId);
}
