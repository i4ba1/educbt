package id.co.knt.cbt.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventStatusType;
import id.co.knt.cbt.model.Event.EventType;
import id.co.knt.cbt.model.EventKelas;
import id.co.knt.cbt.model.EventQuestion;
import id.co.knt.cbt.model.EventResult;
import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.School;
import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.model.StudentAnswer;
import id.co.knt.cbt.model.StudentEventTime;
import id.co.knt.cbt.service.EventKelasService;
import id.co.knt.cbt.service.EventQuestionService;
import id.co.knt.cbt.service.EventResultService;
import id.co.knt.cbt.service.EventService;
import id.co.knt.cbt.service.SchoolService;
import id.co.knt.cbt.service.StudentAnswerService;
import id.co.knt.cbt.service.StudentEventTimeService;
import id.co.knt.cbt.service.StudentService;

@CrossOrigin(origins = "http://localhost:8787")
@RestController
@RequestMapping(value = "/student")
public class StudentController {

	private static final Logger LOG = LoggerFactory.getLogger(StudentController.class);

	@Autowired
	private EventService eventService;

	@Autowired
	private EventQuestionService eventQuestionService;

	@Autowired
	private StudentAnswerService studentAnswerService;

	@Autowired
	private StudentService studentService;

	@Autowired
	private EventResultService eventResultService;

	@Autowired
	private EventKelasService eventKelasService;

	@Autowired
	private SchoolService schoolService;

	@Autowired
	private StudentEventTimeService studentEventTimeService;

	/**
	 * Get all event based on event type and class id
	 *
	 * @param evtType
	 * @param classId
	 * @param nis
	 * @return
	 */
	@RequestMapping(value = { "/list_event/{token}/{evtType}/{classId}/{nis}" }, method = RequestMethod.GET)
	public synchronized ResponseEntity<List<Map<String, Object>>> listEvent(@PathVariable("token") String token,
			@PathVariable("evtType") String evtType, @PathVariable("classId") Integer classId,
			@PathVariable("nis") String nis) {

		/**
		 * Check if any event need to be released
		 */
		List<Event> publishedEvent = eventService.fetchPublishedEvent();
		Long currentTime = System.currentTimeMillis();

		if (!publishedEvent.isEmpty() || publishedEvent.size() > 0) {
			for (Event event : publishedEvent) {
				if (currentTime >= event.getStartDate()) {
					event.setStatus(EventStatusType.RELEASED);
				}
				eventService.updateEvent(event);
			}
		}

		Map<String, Object> mapJson = null;
		List<Map<String, Object>> listJsonMap = new ArrayList<Map<String, Object>>();
		List<EventKelas> eventClasses = null;

		if (EventType.TUGAS.toString().equals(evtType)) {
			eventClasses = eventKelasService.findEventByEventType(classId, EventType.TUGAS);
		} else if (EventType.KUIS.toString().equals(evtType)) {
			eventClasses = eventKelasService.findEventByEventType(classId, EventType.KUIS);
		} else if (EventType.TRYOUT_UAN.toString().equals(evtType)) {
			eventClasses = eventKelasService.findEventByEventType(classId, EventType.TRYOUT_UAN);
		} else {
			eventClasses = eventKelasService.findEventUtsUas(EventType.TRYOUT_UTS, EventType.TRYOUT_UAS, classId);
		}

		if (eventClasses != null && eventClasses.size() > 0) {
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
				boolean isFinish = eventResultService.findERByEventStudent(e.getId(), nis) != null ? true : false;
				mapJson.put("finish", isFinish);
				listJsonMap.add(mapJson);
			}

			return new ResponseEntity<List<Map<String, Object>>>(listJsonMap, HttpStatus.OK);
		}

		return new ResponseEntity<List<Map<String, Object>>>(HttpStatus.NOT_FOUND);
	}

	/**
	 * @param eventId
	 * @return
	 */
	@RequestMapping(value = { "/working_on_question/{token}/{id}" }, method = RequestMethod.GET)
	public ResponseEntity<Map<String, List<Map<String, Object>>>> workingOnQuestion(@PathVariable("token") String token,
			@PathVariable("id") Long eventId) {
		Map<String, List<Map<String, Object>>> values = eventQuestionService.findEventQuestionByEventId(eventId);

		return values != null ? new ResponseEntity<Map<String, List<Map<String, Object>>>>(values, HttpStatus.FOUND)
				: new ResponseEntity<Map<String, List<Map<String, Object>>>>(values, HttpStatus.NOT_FOUND);
	}

	/**
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = { "/student_answer/create/" }, method = RequestMethod.POST)
	public ResponseEntity<Void> saveStudentAnswer(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("studentAnswer");

		List<EventQuestion> list = eventQuestionService.findEQByEventId(obj.getLong("eventId"));
		Student user = studentService.getStudentByNis(obj.getString("nis"));
		HttpStatus status = HttpStatus.OK;
		HttpHeaders header = new HttpHeaders();

		if (studentAnswerService.checkStudentIsWorkingOn(obj.getLong("eventId"), obj.getString("nis")) <= 0) {
			try {

				for (EventQuestion eventQuestion : list) {
					studentAnswerService.addNew(new StudentAnswer(user, eventQuestion.getQuestion(),
							"", eventQuestion.getQuestionWeight(), false, eventQuestion.getEvent()));
				}

				try {
					Thread.sleep(100);
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				status = HttpStatus.CREATED;
			} catch (Exception e) {
				status = HttpStatus.EXPECTATION_FAILED;
			}
		}

		return new ResponseEntity<Void>(header, status);
	}

	/**
	 * Save the result when finish
	 *
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = { "/finish/" }, method = RequestMethod.POST)
	public ResponseEntity<EventResult> saveResult(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("studentResult");

		Event e = eventService.findEventById(obj.getLong("eventId"));
		Student user = studentService.getStudentByNis(obj.getString("nis"));
		/*List<StudentAnswer> list = studentAnswerService.findSAByEvent(e.getId(), user.getNis());

		for (StudentAnswer sa : list) {
			if (sa.getAnswered() != null) {
				if (sa.getQuestion().getQuestionGroup().getQgType() != QG_TYPE.ESSAY) {
					if (sa.getAnswered().compareTo(sa.getQuestion().getKey()) == 0) {
						sa.setCorrect(true);
						studentAnswerService.updateSA(sa);
					}	
				}
			}
		}*/
		
		EventResult er = null;
		if(eventResultService.findERByEventStudent(e.getId(), user.getNis()) == null) {
			er = new EventResult();
			er.setEvent(e);
			er.setStudent(user);
			er.setCreatedDate(new Date());
			er.setCorrect(0.0);
			er.setIncorrect(0.0);
			er.setTotal(0.0);
			er = eventResultService.addNew(er);
		}
		
		return new ResponseEntity<EventResult>(er, HttpStatus.OK);
	}

	/**
	 * @param eventType
	 * @return
	 */
	@RequestMapping(value = { "/list_new_event/{token}/{eventType}" }, method = RequestMethod.GET)
	public ResponseEntity<List<Event>> listNewEvent(@PathVariable("token") String token,
			@PathVariable("eventType") String eventType) {
		if (EventType.TUGAS.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listNewEvent(EventType.TUGAS), HttpStatus.FOUND);
		} else if (EventType.KUIS.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listNewEvent(EventType.KUIS), HttpStatus.FOUND);
		} else if (EventType.TRYOUT_UTS.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listNewEvent(EventType.TRYOUT_UTS), HttpStatus.FOUND);
		} else if (EventType.TRYOUT_UAS.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listNewEvent(EventType.TRYOUT_UAS), HttpStatus.FOUND);
		} else if (EventType.TRYOUT_UAN.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listNewEvent(EventType.TRYOUT_UAN), HttpStatus.FOUND);
		}

		return new ResponseEntity<List<Event>>(new ArrayList<Event>(), HttpStatus.NOT_FOUND);
	}

	/**
	 * @param eventId
	 * @return
	 */
	@RequestMapping(value = { "/list_event_question/{token}/{id}" }, method = RequestMethod.GET)
	public ResponseEntity<List<Question>> listEventQuestion(@PathVariable("token") String token,
			@PathVariable("id") Long eventId) {
		List<EventQuestion> eventQuestions = eventQuestionService.findEQByEventId(eventId);
		List<Question> questions = new ArrayList<Question>();

		for (EventQuestion eq : eventQuestions) {
			questions.add(eq.getQuestion());
		}

		return questions.size() > 0 ? new ResponseEntity<List<Question>>(questions, HttpStatus.FOUND)
				: new ResponseEntity<List<Question>>(questions, HttpStatus.NOT_FOUND);
	}

	/**
	 * Get all save student answer list based on event
	 *
	 * @param eventId
	 * @return
	 */
	@RequestMapping(value = { "/list_student_answer/{token}/{eventId}/{nis}" }, method = RequestMethod.GET)
	public ResponseEntity<List<Map<String, Object>>> listStudentAnswer(@PathVariable("token") String token,
			@PathVariable("eventId") Long eventId, @PathVariable("nis") String nis) {
		List<Map<String, Object>> list = studentAnswerService.resultEvent(eventId, nis);

		Collections.shuffle(list);

		return list.size() > 0 ? new ResponseEntity<List<Map<String, Object>>>(list, HttpStatus.OK)
				: new ResponseEntity<List<Map<String, Object>>>(list, HttpStatus.NOT_FOUND);
	}

	/**
	 * Get explanation for every completed event
	 *
	 * @param eventId
	 * @return
	 */
	@RequestMapping(value = { "/event_explanation/{token}/{eventId}/{nis}" }, method = RequestMethod.GET)
	public ResponseEntity<Map<String, Object>> eventExplanation(@PathVariable("token") String token,
			@PathVariable("eventId") Long eventId, @PathVariable("nis") String nis) {

		List<StudentAnswer> list = studentAnswerService.findSAByEvent(eventId, nis);
		EventResult eventResult = eventResultService.findERByEventStudent(eventId, nis);
		Map<String, Object> data = new HashMap<>();
		data.put("listStudentAnswer", list);
		data.put("eventResult", eventResult);

		return data.size() > 0 ? new ResponseEntity<List<StudentAnswer>>(data, HttpStatus.OK)
				: new ResponseEntity<List<StudentAnswer>>(data, HttpStatus.NOT_FOUND);
	}

	/**
	 * Find event by classId this service is used on CBT dashboard
	 *
	 * @param classId
	 * @return
	 */
	@RequestMapping(value = { "/findEventByClassId/{token}/{classId}" }, method = RequestMethod.GET)
	public ResponseEntity<List<Event>> findEventByClassId(@PathVariable("token") String token,
			@PathVariable("classId") Integer classId) {
		List<EventKelas> eventClasses = eventKelasService.findEventByClassId(classId);
		List<Event> events = new ArrayList<Event>();

		for (EventKelas ec : eventClasses) {
			events.add(ec.getEvent());
		}
		return events.size() > 0 ? new ResponseEntity<List<Event>>(events, HttpStatus.OK)
				: new ResponseEntity<List<Event>>(events, HttpStatus.NOT_FOUND);
	}

	/**
	 * Find school profile
	 *
	 * @return
	 */
	@RequestMapping(value = "/findSchoolProfile/{token}", method = RequestMethod.GET)
	public ResponseEntity<School> findSchool(@PathVariable("token") String token) {
		LOG.info("Find school profile /findSchool/");
		School school = schoolService.findSchool();

		return school != null ? new ResponseEntity<School>(school, HttpStatus.OK)
				: new ResponseEntity<School>(school, HttpStatus.NOT_FOUND);
	}

	/**
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = { "/saveOrUpdateTime/" }, method = RequestMethod.POST)
	public ResponseEntity<Void> saveTime(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		boolean hasId = array.getJSONObject(0).has("id");

		// Update time
		if (hasId) {
			StudentEventTime currentData = studentEventTimeService.findOne(array.getJSONObject(0).getLong("id"));
			currentData.setLastUpdatedTime(array.getJSONObject(0).getLong("lastUpdatedTime"));

			return studentEventTimeService.updateTime(currentData) != null ? new ResponseEntity<Void>(HttpStatus.OK)
					: new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
		} else {
			// insert new time
			long lastUpdateTime = array.getJSONObject(0).getLong("lastUpdatedTime");
			Long eventId = array.getJSONObject(0).getLong("eventId");
			String studentId = array.getJSONObject(0).getString("studentId");

			Event e = eventService.findEventById(eventId);
			Student s = studentService.findPassByNis(studentId);

			StudentEventTime studentEventTime = new StudentEventTime();
			studentEventTime.setLastUpdatedTime(lastUpdateTime);
			studentEventTime.setEvent(e);
			studentEventTime.setStudent(s);

			return studentEventTimeService.saveTime(studentEventTime) != null ? new ResponseEntity<Void>(HttpStatus.OK)
					: new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = { "/updateTime/" }, method = RequestMethod.POST)
	public ResponseEntity<Void> updateTime(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		long lastUpdateTime = array.getJSONObject(0).getLong("last_updated_time");
		Long eventId = array.getJSONObject(0).getLong("eventId");
		String studentId = array.getJSONObject(0).getString("studentId");

		Event e = eventService.findEventById(eventId);
		Student s = studentService.findPassByNis(studentId);

		StudentEventTime studentEventTime = new StudentEventTime();
		studentEventTime.setLastUpdatedTime(lastUpdateTime);
		studentEventTime.setEvent(e);
		studentEventTime.setStudent(s);

		return studentEventTimeService.updateTime(studentEventTime) != null ? new ResponseEntity<Void>(HttpStatus.OK)
				: new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
	}

	/**
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = { "/student_answer/update/" }, method = RequestMethod.PUT)
	public ResponseEntity<Void> updateStudentAnswer(@RequestBody List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("studentAnswer");

		StudentAnswer sa = studentAnswerService.findOneSA(obj.getLong("id"));
		HttpStatus status;
		HttpHeaders header = new HttpHeaders();

		try {
			sa.setAnswered(obj.getString("ans"));
			studentAnswerService.updateSA(sa);
			status = HttpStatus.CREATED;
		} catch (Exception e) {
			status = HttpStatus.EXPECTATION_FAILED;
		}

		return new ResponseEntity<Void>(header, status);
	}

	/**
	 * Fetch all new event that has been COMPLETED
	 *
	 * @param eventType
	 * @return
	 */
	@RequestMapping(value = { "/list_recent_event/{token}/{eventType}" }, method = RequestMethod.GET)
	public ResponseEntity<List<Event>> listRecentEvent(@PathVariable("token") String token,
			@PathVariable("eventType") String eventType) {
		if (EventType.TUGAS.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listRecentEvent(EventType.TUGAS), HttpStatus.FOUND);
		} else if (EventType.KUIS.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listRecentEvent(EventType.KUIS), HttpStatus.FOUND);
		} else if (EventType.TRYOUT_UTS.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listRecentEvent(EventType.TRYOUT_UTS),
					HttpStatus.FOUND);
		} else if (EventType.TRYOUT_UAS.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listRecentEvent(EventType.TRYOUT_UAS),
					HttpStatus.FOUND);
		} else if (EventType.TRYOUT_UAN.equals(eventType)) {
			return new ResponseEntity<List<Event>>(eventService.listRecentEvent(EventType.TRYOUT_UAN),
					HttpStatus.FOUND);
		}

		return new ResponseEntity<List<Event>>(new ArrayList<Event>(), HttpStatus.NOT_FOUND);
	}

	/**
	 * Find the last time working time when student did examination
	 *
	 * @return
	 */
	@RequestMapping(value = { "/findLastWorkingTime/{token}/{eventId}/{studentId}" }, method = RequestMethod.GET)
	public ResponseEntity<StudentEventTime> findLastWorkingTime(@PathVariable("token") String token,
			@PathVariable("eventId") Long eventId, @PathVariable("studentId") String studentId) {
		StudentEventTime data = studentEventTimeService.findStudentEventTime(eventId, studentId);

		return data == null ? new ResponseEntity<StudentEventTime>(data, HttpStatus.NOT_FOUND)
				: new ResponseEntity<StudentEventTime>(data, HttpStatus.OK);
	}

}
