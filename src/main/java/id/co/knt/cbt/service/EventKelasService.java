package id.co.knt.cbt.service;

import java.util.List;
import java.util.Map;

import id.co.knt.cbt.model.Event.EventType;
import id.co.knt.cbt.model.EventKelas;
import id.co.knt.cbt.model.Kelas;

public interface EventKelasService {
	List<Map<String, Object>> findEventKelasByEventId(Long eventId);

	List<Kelas> findKelasByEventId(Long eventId);

	void deleteEventKelas(EventKelas ek);

	List<EventKelas> findEKByEventId(Long eventId);

	EventKelas addNew(EventKelas ek);

	List<EventKelas> findEventByClassId(Integer id);

	List<EventKelas> findEventByEventType(Integer classId, EventType eventType);

	List<EventKelas> findEventUtsUas(EventType eventTypeUTS, EventType eventTypeUAS, Integer classId);
}
