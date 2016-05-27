package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventType;

/**
 * 
 * @author MNI
 *
 */
public interface EventService {
	Event addNewEvent(Event event);

	Event updateEvent(Event event);

	void deleteEvent(Event event);

	List<Event> searchEvent(String name);

	Event findEventById(Long id);

	Event findEventByName(String name);

	List<Event> findEventByEventType(EventType et);
	
	List<Event> findEventUtsUas(EventType et1, EventType et2);

	Iterable<Event> findAllEvent();
	
	Iterable<Event> findEventKelas();
	
	Event detailEvent(Long id);
	
	List<Event> listRecentEvent(EventType eventType);
	
	List<Event> listNewEvent(EventType eventType);
	
	List<Event> findAllByTeacher(String nip);
} 
