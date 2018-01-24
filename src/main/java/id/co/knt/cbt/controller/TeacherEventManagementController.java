package id.co.knt.cbt.controller;

import java.util.Date;
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

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventStatusType;
import id.co.knt.cbt.model.Event.EventType;
import id.co.knt.cbt.model.Event.QuestionTypeStructure;
import id.co.knt.cbt.model.EventKelas;
import id.co.knt.cbt.model.EventQuestion;
import id.co.knt.cbt.model.EventResult;
import id.co.knt.cbt.model.Kelas;
import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.model.StudentAnswer;
import id.co.knt.cbt.model.dto.DetailStudentExamine;
import id.co.knt.cbt.model.dto.EventStudent;
import id.co.knt.cbt.repositories.KelasRepo;
import id.co.knt.cbt.service.EmployeeService;
import id.co.knt.cbt.service.EventKelasService;
import id.co.knt.cbt.service.EventQuestionService;
import id.co.knt.cbt.service.EventResultService;
import id.co.knt.cbt.service.EventService;
import id.co.knt.cbt.service.QuestionService;
import id.co.knt.cbt.service.StudentAnswerService;
import id.co.knt.cbt.service.StudentService;

/**
 * 
 * @author MNI
 *
 */
@CrossOrigin(origins="http://localhost:8787")
@RestController
@RequestMapping(value = "/teacher/teacher_event_mgmt")
public class TeacherEventManagementController {
	private static final Logger LOG = LoggerFactory.getLogger(TeacherEventManagementController.class);

	@Autowired
	private EventService eventService;

	@Autowired
	private KelasRepo kelasRepo;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private EmployeeService empService;

	@Autowired
	private EventKelasService eventKelasService;

	@Autowired
	private EventQuestionService eventQuestionService;

	@Autowired
	private EventResultService eventResultService;

	@Autowired
	private StudentAnswerService studentAnswerService;
	
	@Autowired
	private StudentService studentService;

	/**
	 * Get list all event
	 * 
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}/{nip}" }, method = RequestMethod.GET)
	public ResponseEntity<Iterable<Event>> getAllEvent(@PathVariable String token, @PathVariable String nip) {
		Iterable<Event> list = eventService.findAllByTeacher(nip);

		if (list == null) {
			// You many decide to return HttpStatus.NOT_FOUND
			return new ResponseEntity<Iterable<Event>>(HttpStatus.NOT_FOUND);
		}

		LOG.info("Successfully get all kelas " + "/list/");
		return new ResponseEntity<Iterable<Event>>(list, HttpStatus.OK);
	}

	/**
	 * Create new event
	 * 
	 * @param events
	 * @return
	 */
	@RequestMapping(value = { "/create/" }, method = RequestMethod.POST)
	public ResponseEntity<Event> createEvent(@RequestBody List<Object> events) {
		LOG.info("createEvent================> ");

		Event e = new Event();
		JSONArray array = new JSONArray(events);
		JSONObject obj = array.getJSONObject(0).getJSONObject("event");
		Event newEvent = null;

		if (events.size() > 0) {
			LOG.info("Event================> " + obj.getString("eventName"));

			Employee emp = empService.findById(obj.getLong("empId"));
			e.setEventName(obj.getString("eventName"));
			e.setEventType(EventType.valueOf(obj.getString("eventType")));
			e.setCreatedDate(new Date());

			Long longSD = obj.getLong("startDate");
			Long longED = obj.getLong("endDate");
			
			e.setStartDate(longSD);
			e.setEndDate(longED);

			e.setWorkingTime(obj.getInt("workingTime"));
			e.setDeleted(false);
			e.setStatus(EventStatusType.valueOf(obj.getString("status")));
			e.setQuestionStructure(QuestionTypeStructure.valueOf(obj.getString("questionStructure")));
			e.setEventImgName(obj.getString("eventImgName"));
			e.setEmp(emp);
			newEvent = eventService.addNewEvent(e);

			/**
			 * In this loop I add weight of question
			 */
			JSONArray arrayQuestion = obj.getJSONArray("questions");
			for (int i = 0; i < arrayQuestion.length(); i++) {
				JSONObject objEQ = arrayQuestion.getJSONObject(i);
				Question q = questionService.findQuestionById(objEQ.getLong("id"));
				EventQuestion eq = new EventQuestion(e, q, objEQ.getInt("weight"));
				eventQuestionService.addNew(eq);
			}
			// e.setEventQuestions(listEQ);

			JSONArray arrayKelas = obj.getJSONArray("classes");
			for (int i = 0; i < arrayKelas.length(); i++) {
				Kelas k = kelasRepo.findOne(arrayKelas.getInt(i));
				EventKelas ek = new EventKelas(e, k);
				eventKelasService.addNew(ek);
			}
			// e.setEventKelas(listEK);
		}

		return newEvent == null ? new ResponseEntity<Event>(e, HttpStatus.EXPECTATION_FAILED)
				: new ResponseEntity<Event>(e, HttpStatus.CREATED);
	}

	@RequestMapping(value = { "/update/" }, method = RequestMethod.PUT)
	public ResponseEntity<Event> updateEvent(@RequestBody List<Object> events) {
		LOG.info("createEvent================> ");

		Event e = null;
		JSONArray array = null;
		JSONObject obj = null;

		if (events.size() > 0) {
			array = new JSONArray(events);
			obj = array.getJSONObject(0).getJSONObject("event");
			e = eventService.findEventById(obj.getLong("id"));
			LOG.info("Event================> " + obj.getString("eventName"));
			e.setEventName(obj.getString("eventName"));
			e.setEventType(EventType.valueOf(obj.getString("eventType")));

			Long longSD = obj.getLong("startDate");
			Long longED = obj.getLong("endDate");
			
			e.setStartDate(longSD);
			e.setEndDate(longED);

			if (EventStatusType.valueOf(obj.getString("status")).equals(EventStatusType.PREPARED) ||
				EventStatusType.valueOf(obj.getString("status")).equals(EventStatusType.PUBLISHED)) {

				e.setWorkingTime(obj.getInt("workingTime"));
				e.setDeleted(false);
				e.setStatus(EventStatusType.valueOf(obj.getString("status")));
				e.setQuestionStructure(QuestionTypeStructure.valueOf(obj.getString("questionStructure")));
				e.setEventImgName(obj.getString("eventImgName"));

				JSONArray arrayQuestion = obj.getJSONArray("questions");
				// Delete the all event question mapping table
				List<EventQuestion> eventQuestions = eventQuestionService.findEQByEventId(e.getId());
				if (eventQuestions != null && eventQuestions.size() > 0) {
					for (EventQuestion eq : eventQuestions) {
						eventQuestionService.deleteEQByEventId(eq);
					}
				}

				for (int i = 0; i < arrayQuestion.length(); i++) {
					JSONObject objEQ = arrayQuestion.getJSONObject(i);
					Question q = questionService.findQuestionById(objEQ.getLong("id"));
					EventQuestion eq = new EventQuestion(e, q, objEQ.getInt("weight"));
					eventQuestionService.addNew(eq);
				}

				JSONArray arrayKelas = obj.getJSONArray("classes");
				// Delete the all event kelas mapping table
				List<EventKelas> eventClassess = eventKelasService.findEKByEventId(e.getId());
				if (eventClassess != null && eventClassess.size() > 0) {
					for (EventKelas ek : eventClassess) {
						eventKelasService.deleteEventKelas(ek);
					}
				}

				for (int i = 0; i < arrayKelas.length(); i++) {
					Kelas k = kelasRepo.findOne(arrayKelas.getInt(i));
					EventKelas ek = new EventKelas(e, k);
					eventKelasService.addNew(ek);
				}

				return eventService.updateEvent(e) == null ? new ResponseEntity<Event>(e, HttpStatus.EXPECTATION_FAILED)
						: new ResponseEntity<Event>(e, HttpStatus.OK);

			} else if(EventStatusType.valueOf(obj.getString("status")).equals(EventStatusType.UNPUBLISHED)){
				e.setStatus(EventStatusType.PREPARED);
				return eventService.updateEvent(e) == null ? new ResponseEntity<Event>(e, HttpStatus.EXPECTATION_FAILED)
						: new ResponseEntity<Event>(e, HttpStatus.OK);
			}
		}

		return null;
	}

    /**
     *
     * @param token
     * @param id
     * @return
     */
	@RequestMapping(value = { "/delete/{token}/{id}" }, method = RequestMethod.PUT)
	public ResponseEntity<Event> deleteEvent(@PathVariable("token") String token, @PathVariable("id") Long id) {
		LOG.info("createEvent================> ");

		Event currentEvent = eventService.findEventById(id);
		currentEvent.setDeleted(true);

		return eventService.updateEvent(currentEvent) == null
				? new ResponseEntity<Event>(currentEvent, HttpStatus.EXPECTATION_FAILED)
				: new ResponseEntity<Event>(currentEvent, HttpStatus.CREATED);
	}

	/**
	 * View detail completed event
	 * @param id is equal event id
	 * @return
	 */
	@RequestMapping(value = { "/detail/{token}/{id}" }, method = RequestMethod.GET)
	public ResponseEntity<Event> detailEvent(@PathVariable("token") String token, @PathVariable("id") Long id) {
		Event currentEvent = eventService.detailEvent(id);

		if (currentEvent == null) {
			// You many decide to return HttpStatus.NOT_FOUND
			return new ResponseEntity<Event>(HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Event>(currentEvent, HttpStatus.OK);
	}

	/**
	 * @param id is the event id
	 * @return ResponseEntity<List<EventStudent>>
	 */
	@RequestMapping(value = { "/getStudentEvent/{token}/{id}" }, method = RequestMethod.GET)
	public ResponseEntity<List<EventStudent>> getStudentEvent(@PathVariable("token") String token, @PathVariable("id") Long id) {
		List<EventStudent> eStudents = studentAnswerService.eventStudents(id);

		if (eStudents.isEmpty() || eStudents.size() == 0) {
			// You many decide to return HttpStatus.NOT_FOUND
			return new ResponseEntity<List<EventStudent>>(eStudents, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<EventStudent>>(eStudents, HttpStatus.OK);
	}

	/**
	 * 
	 * @param eventId
	 * @param nis
	 * @return
	 */
	@RequestMapping(value = { "/getDetailStudentExamineScore/{token}/{eventId}/{nis}" }, method = RequestMethod.GET)
	public ResponseEntity<DetailStudentExamine> getDetailStudentExamine(@PathVariable("eventId") Long eventId, @PathVariable("nis") String nis){
		DetailStudentExamine detailStudentExamine = studentAnswerService.getDetailStudentExamines(eventId, nis);

		if (detailStudentExamine == null) {
			return new ResponseEntity<DetailStudentExamine>(detailStudentExamine, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<DetailStudentExamine>(detailStudentExamine, HttpStatus.OK);
	}
	
	/**
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = { "/saveEventResult/"}, method=RequestMethod.POST)
	public ResponseEntity<Void> saveEventResult(@RequestBody List<Object> objects){
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("studentResult");
		
		Event e = eventService.findEventById(obj.getLong("eventId"));
		Student user = studentService.getStudentByNis(obj.getString("nis"));
		JSONArray listEssay = obj.getJSONArray(obj.getString("listEssay"));
		List<StudentAnswer> list = studentAnswerService.findSAByEvent(e.getId(), user.getNis());
		
		Double totalScore = 0.0; 
		Double totalWeight = 0.0;
		Double correct = 0.0;
		Double incorrect = 0.0;
		Double weight = 0.0;
		/**
		 * Calculate only MC, TF and WACANA
		 */
		for (StudentAnswer sa : list) {
			if(sa.getCorrect()) {
				weight = (Double)(eventQuestionService.findByEventIdAndQuestionId(obj.getLong("eventId"), sa.getQuestion().getId()).getQuestionWeight()).doubleValue();
				totalWeight += weight;
				correct += weight;
			}else {
				incorrect++;
			}
		}
		
		/**
		 * Calculate essay
		 */
		for (int i = 0; i < listEssay.length(); i++) {
			weight = listEssay.getJSONObject(i).getDouble("questionWeight");
			totalWeight += weight;
			correct += weight;
		}
		
		totalScore = (correct/totalWeight) * 100;
		Date createdDate = new Date();
		EventResult er = null;
		if(eventResultService.findERByEventStudent(e.getId(), user.getNis()) == null) {
			er = new EventResult();
			er.setEvent(e);
			er.setStudent(user);
			er.setCreatedDate(createdDate);
			er.setCorrect(correct);
			er.setIncorrect(incorrect);
			er.setTotal(totalScore);
			er = eventResultService.addNew(er);
		}
		
		if (er.equals(null)) {
			return new ResponseEntity<Void>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		return new ResponseEntity<Void>(HttpStatus.OK);
	}
	
	/**
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = { "/completedEvent/{eventId}"}, method=RequestMethod.PUT)
	public ResponseEntity<Void> completedEvent(@PathVariable Long eventId){
		Event currentEvent = eventService.findEventById(eventId);
		currentEvent.setStatus(EventStatusType.CORRECTED);
		eventService.updateEvent(currentEvent);
		
		
		return new ResponseEntity<Void>(HttpStatus.OK);
	}

	/**
	 * Get kelas when teacher view detail the created event
	 * @param id
	 * @return
	 */
	@RequestMapping(value = { "/findKelasByEventId/{token}/{id}" }, method = RequestMethod.GET)
	public ResponseEntity<List<Map<String, Object>>> findKelasByEventId(@PathVariable("token") String token,
			@PathVariable("id") Long id) {
		List<Map<String, Object>> classes = eventKelasService.findEventKelasByEventId(id);
		HttpHeaders headers = new HttpHeaders();

		if (classes.size() < 0) {
			return new ResponseEntity<List<Map<String, Object>>>(headers, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<Map<String, Object>>>(classes, HttpStatus.OK);
	}

	/**
	 * Get list of question when view detail of selected event
	 * @param id is equal event id
	 * @return
	 */
	@RequestMapping(value = { "/findQuestionByEventId/{token}/{id}" }, method = RequestMethod.GET)
	public ResponseEntity<Map<String, List<Map<String, Object>>>> findQuestionByEventId(@PathVariable("token") String token,
			@PathVariable("id") Long id) {
		Map<String, List<Map<String, Object>>> values = eventQuestionService.findEventQuestionByEventId(id);
		HttpHeaders headers = new HttpHeaders();

		if (values.size() <= 0 || values.isEmpty() || values == null) {
			return new ResponseEntity<Map<String, List<Map<String, Object>>>>(headers, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Map<String, List<Map<String, Object>>>>(values, HttpStatus.OK);
	}

	/**
	 * Get list event result based on event and kelas
	 * 
	 * @param eventId
	 * @param classId
	 * @return
	 */
	@RequestMapping(value = { "/list_event_result/{token}/{eventId}/{classId}" }, method = RequestMethod.GET)
	public ResponseEntity<List<EventResult>> listEventResult(@PathVariable("token") String token,
			@PathVariable("eventId") Long eventId, @PathVariable("classId") Integer classId) {
		List<EventResult> eventResults = eventResultService.findERByClass(eventId, classId);

		return eventResults.size() > 0 ? new ResponseEntity<List<EventResult>>(eventResults, HttpStatus.OK)
				: new ResponseEntity<List<EventResult>>(eventResults, HttpStatus.NOT_FOUND);
	}
}
