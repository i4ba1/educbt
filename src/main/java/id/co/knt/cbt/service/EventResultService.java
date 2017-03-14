package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.EventResult;

public interface EventResultService {
	EventResult addNew(EventResult er);
	
	EventResult updateER(EventResult er);
	
	List<EventResult> detailER(EventResult er);
	
	EventResult findERByEventStudent(Long id, String nis);
	
	List<EventResult> findAll();
	
	List<EventResult> findERByClass(Long eventId, Integer classId);
}
