package id.co.knt.cbt.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.Question.Difficulty;
import id.co.knt.cbt.model.QuestionGroup;
import id.co.knt.cbt.model.QuestionGroup.QG_TYPE;
import id.co.knt.cbt.model.QuestionPool;
import id.co.knt.cbt.model.Subject;
import id.co.knt.cbt.repositories.QuestionGroupRepo;
import id.co.knt.cbt.repositories.QuestionPoolRepository;
import id.co.knt.cbt.service.EmployeeService;
import id.co.knt.cbt.service.QuestionPoolService;
import id.co.knt.cbt.service.QuestionService;
import id.co.knt.cbt.service.SubjectService;

/**
 * 
 * @author MNI
 *
 */
@CrossOrigin(origins = "http://localhost:8787")
@RestController
@RequestMapping(value = "/teacher/questionMgmt")
public class TeacherQuestionMgmtCtrl {

	private static final Logger LOG = LoggerFactory.getLogger(TeacherQuestionMgmtCtrl.class);

	@Autowired
	private QuestionPoolService poolService;

	@Autowired
	private QuestionService questionService;

	@Autowired
	private SubjectService subjectService;

	@Autowired
	private EmployeeService employeeService;

	@Autowired
	private QuestionGroupRepo questionGroupRepo;

	@Autowired
	private QuestionPoolRepository poolRepo;

	/**
	 * Create new QuestionPool
	 * 
	 * @param questionPool
	 * @return
	 */
	@RequestMapping(value = "/createQuestionPool/", method = RequestMethod.POST)
	public ResponseEntity<QuestionPool> createPoolQuestion(@RequestBody List<Object> questionPool) {
		LOG.info("Question Pool===========> " + questionPool.toString());
		JSONArray array = new JSONArray(questionPool);
		String strQuestionPool = array.getJSONObject(0).getString("questionBank");
		Subject currentSbj = subjectService.findSubjectById(array.getJSONObject(0).getInt("subjectId"));
		Employee currentEmp = employeeService.findById(array.getJSONObject(0).getLong("teacherId"));

		QuestionPool qp = new QuestionPool();
		qp.setCreatedDate(new Date());
		qp.setQuestionPoolName(strQuestionPool);
		qp.setActivated(true);
		qp.setSubject(currentSbj);
		qp.setEmployee(currentEmp);
		QuestionPool newQP = poolService.addNewBankQuestion(qp);

		return newQP == null ? new ResponseEntity<>(newQP, HttpStatus.EXPECTATION_FAILED)
				: new ResponseEntity<>(newQP, HttpStatus.CREATED);
	}

	/**
	 * Create new question
	 * 
	 * @param questions
	 * @return
	 */
	@RequestMapping(value = "/createQuestion/", method = RequestMethod.POST)
	public ResponseEntity<Void> createQuestion(@RequestBody List<Object> questions) {
		LOG.info("Create Question===========> " + questions.size());
		HttpHeaders headers = new HttpHeaders();

		int success = questionService.addNewQuestion(questions);
		if (success <= 0) {
			return new ResponseEntity<Void>(headers, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}

	/**
	 * 
	 * @param questionFile
	 * @return
	 */
	@RequestMapping(value = "/importQuestion/", method = RequestMethod.POST)
	public ResponseEntity<List<Question>> importQuestion(@RequestParam("token") String token,
			@RequestParam("questionFile") MultipartFile questionFile,
			@RequestParam("questionPoolId") Long questionPoolId,
			@RequestParam("questionGroupType") String questionGroupType, @RequestParam("passage") String passage) {
		LOG.info("Import Questionn===========> " + questionFile.getOriginalFilename() + "."
				+ questionFile.getContentType());
		try {
			// Creates a workbook object from the uploaded questionFile
			HSSFWorkbook workBook = new HSSFWorkbook(questionFile.getInputStream());

			// Creates a worksheet object representing the first sheet
			Sheet workSheet = workBook.getSheetAt(0);
			Iterator<Row> iterator = workSheet.iterator();

			QuestionPool qp = poolRepo.findOne(questionPoolId);
			QuestionGroup group = null;
			List<Question> questions = new ArrayList<>();
			int i = 0;

			if (questionGroupType.equals("PASSAGE")) {
				group = new QuestionGroup();
				group.setCreatedDate(new Date().getTime());
				group.setQgType(QG_TYPE.valueOf(questionGroupType));
				group.setQuestionPool(qp);
				// set the passage
				group.setGlobalValue(passage);

				questionGroupRepo.save(group);
				while (iterator.hasNext()) {
					Row nextRow = iterator.next();
					Iterator<Cell> cellIterator = nextRow.cellIterator();
					Question question = new Question();

					if (i > 0) {
						while (cellIterator.hasNext()) {
							Cell nextCell = cellIterator.next();
							int columnIndex = nextCell.getColumnIndex();
							LOG.info(getCellValue(nextCell).toString());

							switch (columnIndex) {
							case 0:
								question.setQuestion(getCellValue(nextCell).toString());
								break;
							case 1:
								question.setOptionA(getCellValue(nextCell).toString());
								break;
							case 2:
								question.setOptionB(getCellValue(nextCell).toString());
								break;
							case 3:
								question.setOptionC(getCellValue(nextCell).toString());
								break;
							case 4:
								question.setOptionD(getCellValue(nextCell).toString());
								break;
							case 5:
								question.setOptionE(getCellValue(nextCell).toString());
								break;
							case 6:
								question.setKey(getCellValue(nextCell).toString());
								break;
							case 7:
								question.setDifficulty(Difficulty.valueOf(getCellValue(nextCell).toString()));
								break;
							case 8:
								question.setExplanation(getCellValue(nextCell).toString());
								break;
							case 9:
								question.setTypeQuestion(getCellValue(nextCell).toString());
								break;
							default:
								break;
							}

							question.setDisabled(false);
						}
						
						question.setQuestionGroup(group);
						questions.add(question);
					}

					i++;
				}
			} else {
				while (iterator.hasNext()) {
					Row nextRow = iterator.next();
					Iterator<Cell> cellIterator = nextRow.cellIterator();
					Question question = new Question();

					if (i > 0) {
						while (cellIterator.hasNext()) {
							Cell nextCell = cellIterator.next();
							int columnIndex = nextCell.getColumnIndex();
							LOG.info(getCellValue(nextCell).toString());

							switch (columnIndex) {
							case 0:
								question.setQuestion(getCellValue(nextCell).toString());
								break;
							case 1:
								question.setOptionA(getCellValue(nextCell).toString());
								break;
							case 2:
								question.setOptionB(getCellValue(nextCell).toString());
								break;
							case 3:
								question.setOptionC(getCellValue(nextCell).toString());
								break;
							case 4:
								question.setOptionD(getCellValue(nextCell).toString());
								break;
							case 5:
								question.setOptionE(getCellValue(nextCell).toString());
								break;
							case 6:
								question.setKey(getCellValue(nextCell).toString());
								break;
							case 7:
								question.setDifficulty(Difficulty.valueOf(getCellValue(nextCell).toString()));
								break;
							case 8:
								question.setExplanation(getCellValue(nextCell).toString());
								break;
							case 9:
								question.setTypeQuestion(getCellValue(nextCell).toString());
								break;
							default:
								break;
							}

							question.setDisabled(false);
						}

						group = new QuestionGroup();
						group.setCreatedDate(new Date().getTime());
						group.setQgType(QG_TYPE.valueOf(question.getTypeQuestion()));
						group.setQuestionPool(qp);
						questionGroupRepo.save(group);
						question.setQuestionGroup(group);
						questions.add(question);
					}

					i++;
				}
			}

			workBook.close();
			int success = questionService.importQuestion(questions);
			if (success > 0) {
				return new ResponseEntity<List<Question>>(questions, HttpStatus.OK);
			} else {
				return new ResponseEntity<List<Question>>(new ArrayList<>(), HttpStatus.FORBIDDEN);
			}

		} catch (Exception e) {
			e.printStackTrace();
			return new ResponseEntity<List<Question>>(new ArrayList<>(), HttpStatus.FORBIDDEN);
		}
	}

	@SuppressWarnings("deprecation")
	private Object getCellValue(Cell cell) {
		switch (cell.getCellType()) {
		case Cell.CELL_TYPE_STRING:
			return cell.getStringCellValue();

		case Cell.CELL_TYPE_BOOLEAN:
			return cell.getBooleanCellValue();

		case Cell.CELL_TYPE_NUMERIC:
			return cell.getNumericCellValue();
		}

		return null;
	}

	/**
	 * Find all question pool
	 * 
	 * @return
	 */
	@RequestMapping(value = { "", "/{token}/{nip}" }, method = RequestMethod.GET)
	public ResponseEntity<Iterable<QuestionPool>> findAllQP(@PathVariable("token") String token,
			@PathVariable("nip") String nip) {
		LOG.info("Method findAllQP to fetch all question pool");

		Iterable<QuestionPool> list = poolService.findAllQuestionByTeacher(nip);

		if (list == null) {
			// You many decide to return HttpStatus.NOT_FOUND
			return new ResponseEntity<Iterable<QuestionPool>>(HttpStatus.NOT_FOUND);
		}

		LOG.info("Successfully get all kelas " + "/list/");
		return new ResponseEntity<Iterable<QuestionPool>>(list, HttpStatus.OK);
	}

	/**
	 * Delete the question pool, mean we just set the is_activated=false
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/delete/{token}/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteQuestionPool(@PathVariable("token") String token, @PathVariable("id") Long id) {
		LOG.info("Deleting question bank" + id);

		QuestionPool questionPool = poolService.findQuestionBankById(id);
		if (questionPool == null) {
			LOG.info("Unable to delete. QuestionPool with id " + id + " not found");
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}

		questionPool.setActivated(false);
		poolService.deletePoolQuestion(questionPool);

		HttpHeaders headers = new HttpHeaders();
		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}

	@RequestMapping(value = "/deleteQG/{token}/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteQuestionGroup(@PathVariable("token") String token, @PathVariable("id") Long id) {
		LOG.info("Deleting question group" + id);

		questionService.disabledQG(id);

		HttpHeaders headers = new HttpHeaders();
		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}

	/**
	 * Update selected question pool Only question pool name and subject can be
	 * edit
	 * 
	 * @param questionPool
	 * @return ResponseEntity<QuestionPool>
	 */
	@RequestMapping(value = "/update/", method = RequestMethod.PUT)
	public ResponseEntity<QuestionPool> updateQuestionPool(@RequestBody List<Object> questionPool) {
		LOG.info("updateQuestionPool Method=============> ");

		JSONArray array = new JSONArray(questionPool);
		JSONObject objQP = array.getJSONObject(0).getJSONObject("questionBank");
		String qpName = objQP.getString("questionPoolName");

		QuestionPool qp = poolService.findQuestionBankById(objQP.getLong("id"));
		qp.setQuestionPoolName(qpName);
		QuestionPool updatedQP = poolService.updateNewBankQuestion(qp);

		return updatedQP == null ? new ResponseEntity<QuestionPool>(updatedQP, HttpStatus.EXPECTATION_FAILED)
				: new ResponseEntity<QuestionPool>(updatedQP, HttpStatus.CREATED);
	}

	/**
	 * Find selected question pool by id
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/findQP/{token}/{id}", method = RequestMethod.GET)
	public ResponseEntity<QuestionPool> findSelectedQuestionPool(@PathVariable("token") String token,
			@PathVariable("id") Long id) {
		LOG.info("updfindSelectedQuestionPool Method=============> ");
		QuestionPool questionPool = poolService.findQuestionBankById(id);

		return questionPool == null ? new ResponseEntity<QuestionPool>(questionPool, HttpStatus.NOT_FOUND)
				: new ResponseEntity<QuestionPool>(questionPool, HttpStatus.OK);
	}

	/**
	 * 
	 * @param token
	 * @param id
	 * @param nip
	 * @return
	 */
	@RequestMapping(value = "/detailQuestionPool/{token}/{id}/{nip}", method = RequestMethod.GET)
	public ResponseEntity<List<QuestionGroup>> detailQuestionPool(@PathVariable("token") String token,
			@PathVariable("id") Long id, @PathVariable("nip") String nip) {
		LOG.info("View all question related to question pool ");
		LOG.info("=========> /detailQuestionPool/{token}/{id}/{nip}");
		List<QuestionGroup> questionGroups = questionService.findQuestionGroupByQP(id, nip);

		if (questionGroups == null || questionGroups.size() == 0) {
			return new ResponseEntity<List<QuestionGroup>>(questionGroups, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<QuestionGroup>>(questionGroups, HttpStatus.OK);
	}

	/**
	 * 
	 * @param token
	 * @param qgId
	 * @return
	 */
	@RequestMapping(value = "/detailQuestionGroup/{token}/{id}", method = RequestMethod.GET)
	public ResponseEntity<Map<String, List<Map<String, Object>>>> detailQuestionGroup(
			@PathVariable("token") String token, @PathVariable("id") Long qgId) {
		LOG.info("View all question related to question pool ");
		LOG.info("=========> /detailQuestionPool/{token}/{id}");
		Map<String, List<Map<String, Object>>> questionGroups = questionService.findQuestionGroupById(qgId);

		if (questionGroups == null || questionGroups.size() == 0) {
			return new ResponseEntity<Map<String, List<Map<String, Object>>>>(questionGroups, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<Map<String, List<Map<String, Object>>>>(questionGroups, HttpStatus.OK);
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/listQuestionInQP/{token}/{id}", method = RequestMethod.GET)
	public ResponseEntity<List<Question>> findQuestionByQuestionPool(@PathVariable("token") String token,
			@PathVariable("id") Long id) {
		LOG.info("findQuestionByQuestionPool Method=============> ");
		List<Question> list = questionService.findQuestionByQP(id);

		return list == null ? new ResponseEntity<List<Question>>(list, HttpStatus.NOT_FOUND)
				: new ResponseEntity<List<Question>>(list, HttpStatus.OK);
	}

	/**
	 * Find list all question in selected question pool
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/findQ/{token}/{id}", method = RequestMethod.GET)
	public ResponseEntity<Question> findSelectedQuestion(@PathVariable("token") String token,
			@PathVariable("id") Long id) {
		LOG.info("findSelectedQuestion Method=============> ");

		Question question = questionService.findQuestionById(id);

		return question == null ? new ResponseEntity<Question>(question, HttpStatus.NOT_FOUND)
				: new ResponseEntity<Question>(question, HttpStatus.OK);
	}

	/**
	 * Update current question
	 * 
	 * @param objects
	 * @return
	 */
	@RequestMapping(value = "/updateQ/", method = RequestMethod.PUT)
	public ResponseEntity<Question> updateQuestion(@RequestBody List<Object> objects) {

		Question q = questionService.updateCurrentQuestion(objects);

		return q == null ? new ResponseEntity<Question>(q, HttpStatus.EXPECTATION_FAILED)
				: new ResponseEntity<Question>(q, HttpStatus.OK);
	}

	/**
	 * Delete selected question
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/deleteQ/{token}/{id}", method = RequestMethod.DELETE)
	public ResponseEntity<Void> deleteQuestion(@PathVariable("token") String token, @PathVariable("id") Long id) {
		LOG.info("Deleting question bank" + id);

		Question question = questionService.findQuestionById(id);
		if (question == null) {
			LOG.info("Unable to delete. QuestionPool with id " + id + " not found");
			return new ResponseEntity<Void>(HttpStatus.NOT_FOUND);
		}

		question.setDisabled(true);
		questionService.deleteCurrentQuestion(question);

		HttpHeaders headers = new HttpHeaders();
		return new ResponseEntity<Void>(headers, HttpStatus.OK);
	}

	/**
	 * Find question by subject id
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/findQBySubject/{token}/{id}/{nip}", method = RequestMethod.GET)
	public ResponseEntity<List<Question>> findQuestionsBySbj(@PathVariable("token") String token,
			@PathVariable("id") Integer id, @PathVariable("nip") String nip) {
		LOG.info("findQuestionsBySbj" + id);

		List<Question> list = questionService.findQuestionBySubject(id, nip);

		if (list.size() <= 0 || list == null) {
			return new ResponseEntity<List<Question>>(list, HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<List<Question>>(list, HttpStatus.OK);
	}
}
