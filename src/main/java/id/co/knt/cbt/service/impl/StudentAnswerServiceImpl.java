package id.co.knt.cbt.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.EventQuestion;
import id.co.knt.cbt.model.EventResult;
import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.StudentAnswer;
import id.co.knt.cbt.model.QuestionGroup.QG_TYPE;
import id.co.knt.cbt.model.dto.DetailStudentExamine;
import id.co.knt.cbt.model.dto.Essay;
import id.co.knt.cbt.model.dto.EventStudent;
import id.co.knt.cbt.model.dto.MultipleChoice;
import id.co.knt.cbt.repositories.EventQuestionRepo;
import id.co.knt.cbt.repositories.EventResultRepo;
import id.co.knt.cbt.repositories.StudentAnswerRepo;
import id.co.knt.cbt.service.StudentAnswerService;

@Transactional
@Service("studentAnswerService")
public class StudentAnswerServiceImpl implements StudentAnswerService{

	@Autowired
	private StudentAnswerRepo studentAnswerRepo;

	@Autowired
	private EventResultRepo eventResultRepo;

	@Autowired
	private EventQuestionRepo eventQuestionRepo;
	
	public StudentAnswerServiceImpl() {
		
	}
	
	public StudentAnswerServiceImpl(StudentAnswerRepo studentAnswerRepo) {
		super();
		this.studentAnswerRepo = studentAnswerRepo;
	}

	@Async
	@Override
	public StudentAnswer addNew(StudentAnswer sa) {
		StudentAnswer studentAnswer = studentAnswerRepo.save(sa); 
		return studentAnswer;
	}

	@Override
	public StudentAnswer updateSA(StudentAnswer sa) {
		StudentAnswer studentAnswer = studentAnswerRepo.saveAndFlush(sa);
		return studentAnswer;
	}

	@Override
	public List<Object> calculateResult(StudentAnswer sa) {
		return null;
	}

	@Override
	public StudentAnswer findOneSA(Long id) {
		return studentAnswerRepo.findOne(id);
	}

	@Override
	public StudentAnswer findSAByQuestion(Long qId) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Integer checkStudentIsWorkingOn(Long eventId, String nis) {
		Integer count = studentAnswerRepo.checkStudentIsWorkingOn(eventId, nis);
		
		return count;
	}

	@Override
	public List<StudentAnswer> findSAByEvent(Long eventId, String nis) {
		List<StudentAnswer> list = studentAnswerRepo.findSAByEvent(eventId, nis);
		
		return list;
	}

	@Override
	public List<Map<String, Object>> resultEvent(Long eventId, String nis) {
		List<StudentAnswer> list = studentAnswerRepo.findSAByEvent(eventId, nis);
		List<Map<String, Object>> listData = new ArrayList<>();
		
		Map<String, Object> mapSA = new HashMap<>();
		Map<String, Object> mapQuestion = new HashMap<>();
		//List<Map<String, Object>> questions = new ArrayList<>();
		
		for (StudentAnswer sa : list) {
			mapSA = new HashMap<>();
			mapSA.put("answered", sa.getAnswered());
			mapSA.put("correct", sa.getCorrect());
			mapSA.put("eventId", sa.getEvent().getId());
			mapSA.put("id",sa.getId());
			
			Question q = sa.getQuestion();
			mapQuestion = new HashMap<>();
			mapQuestion.put("id", q.getId());
			mapQuestion.put("question", q.getQuestion());
			mapQuestion.put("optionA", q.getOptionA());
			mapQuestion.put("optionB", q.getOptionB());
			mapQuestion.put("optionC", q.getOptionC());
			mapQuestion.put("optionD", q.getOptionD());
			mapQuestion.put("optionE", q.getOptionE());
			mapQuestion.put("key", System.currentTimeMillis()+"#"+q.getKey()+"#"+System.nanoTime());
			mapQuestion.put("explanation", q.getExplanation());
			mapQuestion.put("typeQuestion", q.getTypeQuestion());
			mapQuestion.put("questioGroup", q.getQuestionGroup());
			
			mapSA.put("question", mapQuestion);
			mapSA.put("studentId", sa.getStudent().getId());
			listData.add(mapSA);
		}
		
		return listData;
	}

	@Override
	public List<EventStudent> eventStudents(Long eventId){
		List<Object[]> objects = studentAnswerRepo.findStudentAttendToEvent(eventId);
		List<EventStudent> eStudents = new ArrayList<>();
		EventStudent eventStudent = null;
		boolean isCorrected = true;

		for (Object[] obj : objects) {
			String studentName = (String)obj[0]+" "+(String)obj[1];
			String studentNis = (String)obj[2];

			EventResult eventResult = eventResultRepo.findERByEventStudent(eventId, studentNis);
			if(eventResult == null){
				isCorrected = false;
			}

			eventStudent = new EventStudent(studentName, studentNis, isCorrected);
			eStudents.add(eventStudent);
		}

		return eStudents;
	}

	@Override
	public DetailStudentExamine getDetailStudentExamines(Long eventId, String nis){
		List<StudentAnswer> studentAnswers = studentAnswerRepo.fetchDetailStudentAnswer(eventId, nis);
		ArrayList<MultipleChoice> listMC = new ArrayList<>();
		ArrayList<Essay> listEssay = new ArrayList<>();

		int i = 0;
		for (StudentAnswer sa:studentAnswers) {
			EventQuestion eq = eventQuestionRepo.findQuestion(sa.getQuestion().getId(), eventId);
			if (eq.getQuestion().getQuestionGroup().getQgType() == QG_TYPE.ESSAY) {
				Essay essay = new Essay(eq.getQuestion().getQuestion(), eq.getQuestion().getExplanation(), sa.getAnswered(), eq.getQuestionWeight());
				listEssay.add(essay);
			}else{
				MultipleChoice mc = new MultipleChoice(sa.getAnswered(), eq.getQuestion().getTypeQuestion(), sa.getCorrect(), eq.getQuestion().getKey(), eq.getQuestionWeight());
				listMC.add(mc);
			}
		}

		String dateString = null;
		StudentAnswer studentAnswer = studentAnswers.get(i);
		SimpleDateFormat sdfr = new SimpleDateFormat("dd-MM-yyyy");
		Date eventDate = new Date(studentAnswer.getEvent().getStartDate());
		dateString = sdfr.format(eventDate);
		String studentName = studentAnswer.getStudent().getFirstName()+" "+studentAnswer.getStudent().getLastName();
		String studentNis = studentAnswer.getStudent().getNis();
		String eventName = studentAnswer.getEvent().getEventName();

		DetailStudentExamine detailStudentExamine = new DetailStudentExamine(studentName, studentNis, eventName, dateString, listMC, listEssay);

		return detailStudentExamine;
	}
}
