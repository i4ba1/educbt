package id.co.knt.cbt.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.knt.cbt.model.Event.EventType;
import id.co.knt.cbt.model.EventKelas;
import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.repositories.EventKelasRepo;
import id.co.knt.cbt.service.EventKelasService;

@Service("eventKelasService")
public class EventKelasServiceImpl implements EventKelasService {

	@Autowired
	private EventKelasRepo eventKelasRepo;

	@Override
	public List<Map<String, Object>> findEventKelasByEventId(Long eventId) {
		List<EventKelas> list = eventKelasRepo.findByEventId(eventId);
		List<Map<String, Object>> listKelas = new ArrayList<Map<String, Object>>();
		Map<String, Object> mapKelas = null;

		for (EventKelas eventKelas : list) {
			Kelas k = eventKelas.getKelas();
			mapKelas = new HashMap<String, Object>();
			mapKelas.put("id", k.getId());
			mapKelas.put("className", k.getClassName());

			listKelas.add(mapKelas);
		}

		return listKelas;
	}

	@Override
	public void deleteEventKelas(EventKelas ek) {
		eventKelasRepo.delete(ek.getId());
	}

	@Override
	public List<EventKelas> findEKByEventId(Long eventId) {
		return eventKelasRepo.findByEventId(eventId);
	}

	@Override
	public EventKelas addNew(EventKelas ek) {
		return eventKelasRepo.save(ek);
	}

	@Override
	public List<Kelas> findKelasByEventId(Long eventId) {
		List<EventKelas> list = eventKelasRepo.findByEventId(eventId);
		List<Kelas> classes = new ArrayList<Kelas>();

		for (EventKelas eventKelas : list) {
			Kelas k = eventKelas.getKelas();
			classes.add(k);
		}

		return classes;

	}

	@Override
	public List<EventKelas> findEventByClassId(Integer id) {
		List<EventKelas> eventClasses = eventKelasRepo.findEventByClassId(id);

		return eventClasses;
	}

	@Override
	public List<EventKelas> findEventByEventType(Integer classId, EventType eventType) {
		List<EventKelas> eventClasses = eventKelasRepo.findEventByClass(classId, eventType);

		return eventClasses;
	}

	@Override
	public List<EventKelas> findEventUtsUas(EventType eventTypeUTS, EventType eventTypeUAS, Integer classId) {
		List<EventKelas> eventClasses = eventKelasRepo.findEvenUtsUas(eventTypeUTS, eventTypeUAS, classId);

		return eventClasses;
	}

}
