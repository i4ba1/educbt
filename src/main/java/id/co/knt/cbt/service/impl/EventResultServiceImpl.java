package id.co.knt.cbt.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventStatusType;
import id.co.knt.cbt.model.EventKelas;
import id.co.knt.cbt.model.EventResult;
import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.model.dto.CompletedEvent;
import id.co.knt.cbt.model.dto.EventStudent;
import id.co.knt.cbt.repositories.EventResultRepo;
import id.co.knt.cbt.service.EventResultService;

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
	public List<CompletedEvent> fetchStudentOnCompletedEvent(Long eventId) {
		List<EventResult> list = eventResultRepo.fetchStudentByEventId(eventId);
		ArrayList<CompletedEvent> completedEvents = new ArrayList<>();
		
		for (EventResult er : list) {
			Student s = er.getStudent();
			CompletedEvent ce = new CompletedEvent(s.getFirstName()+" "+s.getLastName(), s.getNis(), er.getTotal(), s.getKelas().getClassName());
			completedEvents.add(ce);
		}

		return completedEvents;
	}

	@Override
	public List<Map<String, Object>> fetchListEvent(List<EventKelas> eventClasses, String nis) {
		Map<String, Object> mapJson = null;
		List<Map<String, Object>> listJsonMap = new ArrayList<Map<String, Object>>();

		for (EventKelas ek : eventClasses) {
			Event e = ek.getEvent();
			mapJson = new HashMap<String, Object>();
			mapJson.put("id", e.getId());
			mapJson.put("eventName", e.getEventName());
			mapJson.put("eventType", e.getEventType());
			mapJson.put("startDate", e.getStartDate());
			mapJson.put("endDate", e.getEndDate());
			mapJson.put("workingTime", e.getWorkingTime());
			mapJson.put("deleted", e.getDeleted());
			mapJson.put("createdDate", e.getCreatedDate());
			mapJson.put("status", e.getStatus());
			mapJson.put("questionStructure", e.getQuestionStructure());
			mapJson.put("eventImgName", e.getEventImgName());
			boolean isFinish = eventResultRepo.findERByEventStudent(e.getId(), nis) != null ? true : false;
			mapJson.put("finish", isFinish);
			listJsonMap.add(mapJson);
		}
		
		return listJsonMap;
	}
	
	@Override
	public List<EventStudent> getListAttendStudent(Long eventId){
		List<Object[]> objects = eventResultRepo.findStudentAttendToEvent(eventId, EventStatusType.COMPLETED);
		List<EventStudent> eStudents = new ArrayList<>();
		EventStudent eventStudent = null;
		boolean isCorrected = true;

		for (Object[] obj : objects) {
			String studentName = (String)obj[0]+" "+(String)obj[1];
			String studentNis = (String)obj[2];

			EventResult eventResult = eventResultRepo.findERByEventStudent(eventId, studentNis);
			if(eventResult.getTotal() == null){
				isCorrected = false;
			}

			eventStudent = new EventStudent(studentName, studentNis, isCorrected);
			eStudents.add(eventStudent);
		}

		return eStudents;
	}

}
