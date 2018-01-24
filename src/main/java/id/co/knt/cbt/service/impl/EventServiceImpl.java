package id.co.knt.cbt.service.impl;

import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventType;
import id.co.knt.cbt.repositories.EventRepo;
import id.co.knt.cbt.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service("eventService")
@Transactional
public class EventServiceImpl implements EventService {

	@Autowired
	private EventRepo eventRepo;

	public EventServiceImpl() {

	}

	public EventServiceImpl(EventRepo eventRepo) {
		super();
		this.eventRepo = eventRepo;
	}

	@Override
	public Event addNewEvent(Event event) {
		Event newEvent = eventRepo.save(event);
		return newEvent;
	}

	@Override
	public Event updateEvent(Event event) {
		return eventRepo.saveAndFlush(event);
	}

	@Override
	public void deleteEvent(Event event) {
		eventRepo.saveAndFlush(event);
	}

	@Override
	public List<Event> searchEvent(String name) {
		List<Event> events = eventRepo.searchEventByName(name);
		return events;
	}

	@Override
	public Event findEventById(Long id) {
		Event e = eventRepo.findOne(id);
		return e;
	}

	@Override
	public Event findEventByName(String name) {
		Event e = eventRepo.findEventByEventName(name);
		return e;
	}

	@Override
	public List<Event> findEventByEventType(EventType et) {
		List<Event> listTugas = eventRepo.findEventByEventType(et);
		
		return listTugas;
	}

	@Override
	public Iterable<Event> findAllEvent() {
		Iterable<Event> events = eventRepo.findAll();
		return events;
	}

	@Override
	public Iterable<Event> findEventKelas() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Event detailEvent(Long id) {
		return eventRepo.fetchEventWithEventQuestion(id);
	}

	@Override
	public List<Event> listRecentEvent(EventType eventType) {
		return eventRepo.fetchRecentEvent(eventType);
	}

	@Override
	public List<Event> listNewEvent(EventType eventType) {
		return eventRepo.fetchNewEvent(eventType);
	}

	public List<Event> findEventUtsUas(EventType et1, EventType et2) {
		List<Event> listTugas = eventRepo.findEvenUtsUas(et1, et2);
		
		return listTugas;
	}

	@Override
	public List<Event> findAllByTeacher(String nip) {
		List<Event> events = eventRepo.findEventByTeacher(nip);
		return events;
	}

	@Override
	public List<Event> fetchPublishedEvent() {
		List<Event> publishedEvents = eventRepo.findPublishedEvent();
		
		return publishedEvents;
	}
}