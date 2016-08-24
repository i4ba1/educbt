package id.co.knt.cbt.service;

import id.co.knt.cbt.model.EventResult;

import java.util.List;

public interface EventResultService {
	EventResult addNew(EventResult er);
	
	EventResult updateER(EventResult er);
	
	List<EventResult> detailER(EventResult er);
	
	EventResult findERByEventStudent(Long id, String nis);
	
	List<EventResult> findAll();
	
	List<EventResult> findERByClass(Long eventId, Integer classId);
}
