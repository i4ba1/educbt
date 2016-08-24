package id.co.knt.cbt.service.impl;

import id.co.knt.cbt.model.EventResult;
import id.co.knt.cbt.repositories.EventResultRepo;
import id.co.knt.cbt.service.EventResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Transactional
@Service("eventResultService")
public class EventResultServiceImpl implements EventResultService {

	@Autowired
	private EventResultRepo eventResultRepo;

	public EventResultServiceImpl() {

	}

	public EventResultServiceImpl(EventResultRepo erp) {
		this.eventResultRepo = erp;
	}

	@Override
	public EventResult addNew(EventResult er) {
		EventResult newER = eventResultRepo.save(er);
		return newER;
	}

	@Override
	public EventResult updateER(EventResult er) {
		EventResult updatedER = eventResultRepo.saveAndFlush(er);
		return updatedER;
	}

	@Override
	public List<EventResult> detailER(EventResult er) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public EventResult findERByEventStudent(Long id, String nis) {
		EventResult er = eventResultRepo.findERByEventStudent(id, nis);

		return er;
	}

	@Override
	public List<EventResult> findAll() {
		return eventResultRepo.findAll();
	}

	@Override
	public List<EventResult> findERByClass(Long eventId, Integer classId) {
		List<EventResult> list = eventResultRepo.findEventResultByClass(eventId, classId);

		return list;
	}
}
