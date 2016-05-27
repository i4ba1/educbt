package id.co.knt.cbt.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Question;
import id.co.knt.cbt.model.Question.Difficulty;
import id.co.knt.cbt.model.QuestionGroup;
import id.co.knt.cbt.model.QuestionGroup.QG_TYPE;
import id.co.knt.cbt.model.QuestionPool;
import id.co.knt.cbt.model.QuestionTag;
import id.co.knt.cbt.model.Tag;
import id.co.knt.cbt.repositories.QuestionGroupRepo;
import id.co.knt.cbt.repositories.QuestionPoolRepository;
import id.co.knt.cbt.repositories.QuestionRepo;
import id.co.knt.cbt.repositories.QuestionTagRepo;
import id.co.knt.cbt.repositories.TagRepo;
import id.co.knt.cbt.service.QuestionService;

@Transactional
@Service("questionService")
public class QuestionServiceImpl implements QuestionService {

	@Autowired
	private QuestionRepo questionRepo;

	@Autowired
	private QuestionPoolRepository poolRepo;

	@Autowired
	private QuestionGroupRepo groupRepo;

	@Autowired
	private TagRepo tagRepo;

	@Autowired
	private QuestionTagRepo questionTagRepo;

	public QuestionServiceImpl() {
		super();
	}

	public QuestionServiceImpl(QuestionRepo questionRepo) {
		super();
		this.questionRepo = questionRepo;
	}

	@Override
	public int addNewQuestion(List<Object> questions) {
		int success = 0;
		JSONArray array = new JSONArray(questions);
		JSONObject objQG = array.getJSONObject(0).getJSONObject("questionGroup");
		JSONArray arrQuestions = objQG.getJSONArray("questions") == null ? null : objQG.getJSONArray("questions");
		String qgType = objQG.getString("qgType");
		Long qPoolId = objQG.getLong("questionPoolId");

		QuestionPool qp = poolRepo.findOne(qPoolId);
		QuestionGroup group = new QuestionGroup();
		group.setCreatedDate(new Date().getTime());
		group.setQgType(QG_TYPE.valueOf(qgType));
		group.setQuestionPool(qp);
		groupRepo.save(group);

		Question newQuestion = null;
		JSONObject objQuestion = null;
		List<Question> listNewQ = new ArrayList<>();

		if (QG_TYPE.MC.name().equals(qgType)) {
			objQuestion = arrQuestions.getJSONObject(0);
			newQuestion = new Question();
			newQuestion.setQuestionGroup(group);
			newQuestion.setQuestion(objQuestion.getString("question"));
			newQuestion.setOptionA(objQuestion.has("optionA") ? objQuestion.getString("optionA") : null);
			newQuestion.setOptionB(objQuestion.has("optionB") ? objQuestion.getString("optionB") : null);
			newQuestion.setOptionC(objQuestion.has("optionC") ? objQuestion.getString("optionC") : null);
			newQuestion.setOptionD(objQuestion.has("optionD") ? objQuestion.getString("optionD") : null);
			newQuestion.setOptionE(objQuestion.has("optionE") ? objQuestion.getString("optionE") : null);
			newQuestion.setDisabled(false);
			newQuestion.setDifficulty(Difficulty.valueOf(objQuestion.getString("difficulty")));
			newQuestion.setExplanation(objQuestion.getString("explanation"));
			newQuestion.setKey(objQuestion.getString("key"));
			newQuestion.setTypeQuestion(QG_TYPE.MC.name());
			questionRepo.save(newQuestion);
			success++;
		} else if (QG_TYPE.TF.name().equals(qgType)) {
			objQuestion = arrQuestions.getJSONObject(0);
			newQuestion = new Question();
			newQuestion.setQuestionGroup(group);
			newQuestion.setQuestion(objQuestion.getString("question"));
			newQuestion.setDifficulty(Difficulty.valueOf(objQuestion.getString("difficulty")));
			newQuestion.setDisabled(false);
			newQuestion.setExplanation(objQuestion.getString("explanation"));
			newQuestion.setKey(objQuestion.getString("key"));
			newQuestion.setTypeQuestion(QG_TYPE.TF.name());
			questionRepo.save(newQuestion);
			success++;
		} else if (QG_TYPE.PASSAGE.name().equals(qgType)) {
			String strPassage = objQG.getString("globalValue");
			group.setGlobalValue(strPassage);

			for (int i = 0; i < arrQuestions.length(); i++) {
				objQuestion = arrQuestions.getJSONObject(i);

				newQuestion = new Question();
				newQuestion.setQuestionGroup(group);
				newQuestion.setQuestion(objQuestion.getString("question"));
				newQuestion.setOptionA(objQuestion.has("optionA") ? objQuestion.getString("optionA") : null);
				newQuestion.setOptionB(objQuestion.has("optionB") ? objQuestion.getString("optionB") : null);
				newQuestion.setOptionC(objQuestion.has("optionC") ? objQuestion.getString("optionC") : null);
				newQuestion.setOptionD(objQuestion.has("optionD") ? objQuestion.getString("optionD") : null);
				newQuestion.setOptionE(objQuestion.has("optionE") ? objQuestion.getString("optionE") : null);
				newQuestion.setDisabled(false);
				newQuestion.setDifficulty(Difficulty.valueOf(objQuestion.getString("difficulty")));
				newQuestion.setExplanation(objQuestion.getString("explanation"));
				newQuestion.setKey(objQuestion.getString("key"));

				if (newQuestion.getOptionA() == null && newQuestion.getOptionB() == null
						&& newQuestion.getOptionC() == null && newQuestion.getOptionD() == null
						&& newQuestion.getOptionE() == null) {
					newQuestion.setTypeQuestion(QG_TYPE.TF.name());
				} else {
					newQuestion.setTypeQuestion(QG_TYPE.MC.name());
				}

				questionRepo.save(newQuestion);
				listNewQ.add(newQuestion);
			}

			success++;
		}

		if (arrQuestions.length() > 1) {

			for (int i = 0; i < arrQuestions.length(); i++) {
				objQuestion = arrQuestions.getJSONObject(i);
				Question currentQ = listNewQ.get(i);
				JSONArray arrTag = objQuestion.getJSONArray("tagNames");

				for (int j = 0; j < arrTag.length(); j++) {
					Long id = arrTag.getJSONObject(j).getLong("id");
					Tag tag = tagRepo.findOne(id);
					if (tag != null) {
						QuestionTag qt = new QuestionTag();
						qt.setQuestion(currentQ);
						qt.setTag(tag);
						questionTagRepo.save(qt);
					}
				}
			}
		} else {
			objQuestion = arrQuestions.getJSONObject(0);
			JSONArray arrTag = objQuestion.getJSONArray("tagNames");

			Long id = arrTag.getJSONObject(0).getLong("id");
			Tag tag = tagRepo.findOne(id);
			if (tag != null) {
				QuestionTag qt = new QuestionTag();
				qt.setQuestion(newQuestion);
				qt.setTag(tag);
				questionTagRepo.save(qt);
			}
		}

		return success;

	}

	@Override
	public Question updateCurrentQuestion(List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject objQG = array.getJSONObject(0).getJSONObject("questionGroup");
		JSONArray arrayQ = objQG.getJSONArray("questions");
		JSONObject objQ = null;
		Question updatedQuestion = null;

		if (objQG.getString("qgType").compareTo(QG_TYPE.PASSAGE.name()) == 0) {

			QuestionGroup qg = groupRepo.findOne(objQG.getLong("id"));
			qg.setGlobalValue(objQG.getString("globalValue"));
			groupRepo.saveAndFlush(qg);

			for (int i = 0; i < arrayQ.length(); i++) {
				objQ = arrayQ.getJSONObject(i);
				Question question = questionRepo.findOne(objQ.getLong("id"));
				List<QuestionTag> questionTags = questionTagRepo.findQT(question.getId());

				question.setQuestion(objQ.getString("question"));
				question.setOptionA(objQ.has("optionA") ? objQ.getString("optionA") : null);
				question.setOptionB(objQ.has("optionB") ? objQ.getString("optionB") : null);
				question.setOptionC(objQ.has("optionC") ? objQ.getString("optionC") : null);
				question.setOptionD(objQ.has("optionD") ? objQ.getString("optionD") : null);
				question.setOptionE(objQ.has("optionE") ? objQ.getString("optionE") : null);
				question.setKey(objQ.getString("key"));
				question.setDifficulty(Difficulty.valueOf(objQ.getString("difficulty")));
				question.setExplanation(objQ.getString("explanation"));

				JSONArray arrQT = objQ.getJSONArray("tagNames");
				if (arrQT.length() > 0) {
					if (arrQT.length() < questionTags.size()) {
						List<QuestionTag> removeQT = new ArrayList<>();
						for (int j = 0; j < arrQT.length(); j++) {
							removeQT.add(questionTagRepo.findOne(arrQT.getJSONObject(j).getLong("id")));
						}

						questionTags.removeAll(removeQT);
						for (int k = 0; k < questionTags.size(); k++) {
							questionTagRepo.delete(questionTags.get(k));
						}
					} else if (arrQT.length() > questionTags.size()) {
						Tag tag = null;
						for (int j = 0; j < arrQT.length(); j++) {
							QuestionTag tmpQT = questionTagRepo.findOne(arrQT.getJSONObject(j).getLong("id"));
							if (tmpQT == null) {
								tag = tagRepo.findOne(arrQT.getJSONObject(j).getLong("id"));
								QuestionTag newQT = new QuestionTag();
								newQT.setQuestion(question);
								newQT.setTag(tag);
								questionTagRepo.save(newQT);
							}
						}

					} else if (arrQT.length() == questionTags.size()) {
						for (int j = 0; j < questionTags.size(); j++) {
							String tagName = arrQT.getJSONObject(j).getString("tagName");
							if (tagName.compareTo(questionTags.get(j).getTag().getTagName()) != 0) {
								QuestionTag currentQT = questionTags.get(j);
								Tag newTag = tagRepo.findOne(arrQT.getJSONObject(j).getLong("id"));
								currentQT.setTag(newTag);
								questionTagRepo.saveAndFlush(currentQT);
							}
						}
					}
				} else {
					for (QuestionTag qt : questionTags) {
						questionTagRepo.delete(qt);
					}
				}

				updatedQuestion = questionRepo.saveAndFlush(question);
			}
		} else if (objQG.getString("qgType").compareTo(QG_TYPE.MC.name()) == 0
				|| objQG.getString("qgType").compareTo(QG_TYPE.TF.name()) == 0) {
			objQ = arrayQ.getJSONObject(0);
			Question question = questionRepo.findOne(objQ.getLong("id"));
			List<QuestionTag> questionTags = questionTagRepo.findQT(question.getId());

			question.setQuestion(objQ.getString("question"));
			question.setOptionA(objQ.has("optionA") ? objQ.getString("optionA") : null);
			question.setOptionB(objQ.has("optionB") ? objQ.getString("optionB") : null);
			question.setOptionC(objQ.has("optionC") ? objQ.getString("optionC") : null);
			question.setOptionD(objQ.has("optionD") ? objQ.getString("optionD") : null);
			question.setOptionE(objQ.has("optionE") ? objQ.getString("optionE") : null);
			question.setKey(objQ.getString("key"));
			question.setDifficulty(Difficulty.valueOf(objQ.getString("difficulty")));
			question.setExplanation(objQ.getString("explanation"));

			JSONArray arrQT = objQ.getJSONArray("tagNames");
			if (arrQT.length() > 0) {
				if (arrQT.length() < questionTags.size()) {
					List<QuestionTag> removeQT = new ArrayList<>();
					for (int i = 0; i < arrQT.length(); i++) {
						removeQT.add(questionTagRepo.findOne(arrQT.getJSONObject(i).getLong("id")));
					}

					questionTags.removeAll(removeQT);
					for (int i = 0; i < questionTags.size(); i++) {
						questionTagRepo.delete(questionTags.get(i));
					}
				} else if (arrQT.length() > questionTags.size()) {
					Tag tag = null;
					for (int j = 0; j < arrQT.length(); j++) {
						QuestionTag tmpQT = questionTagRepo.findOne(arrQT.getJSONObject(j).getLong("id"));
						if (tmpQT == null) {
							tag = tagRepo.findOne(arrQT.getJSONObject(j).getLong("id"));
							QuestionTag newQT = new QuestionTag();
							newQT.setQuestion(question);
							newQT.setTag(tag);
							questionTagRepo.save(newQT);
						}
					}

				} else if (arrQT.length() == questionTags.size()) {
					for (int i = 0; i < questionTags.size(); i++) {
						String tagName = arrQT.getJSONObject(i).getString("tagName");
						if (tagName.compareTo(questionTags.get(i).getTag().getTagName()) != 0) {
							QuestionTag currentQT = questionTags.get(i);
							Tag newTag = tagRepo.findOne(arrQT.getJSONObject(i).getLong("id"));
							currentQT.setTag(newTag);
							questionTagRepo.saveAndFlush(currentQT);
						}
					}
				}
			} else {
				for (QuestionTag qt : questionTags) {
					questionTagRepo.delete(qt);
				}
			}

			updatedQuestion = questionRepo.saveAndFlush(question);
		}

		return updatedQuestion;
	}

	@Override
	public void deleteCurrentQuestion(Question question) {
		questionRepo.saveAndFlush(question);
	}

	@Override
	public Question findQuestionById(Long id) {
		Question questions = questionRepo.findOne(id);
		return questions;
	}

	@Override
	public Question detailQuestion(Long id) {
		Question question = questionRepo.findOne(id);
		return question;
	}

	@Override
	public List<Question> findQuestionByQP(Long questionPoolId) {
		List<Question> questions = questionRepo.findQuestionByQPoolId(questionPoolId);

		return questions;
	}

	@Override
	public List<Question> findQuestionBySubject(Integer subjectId, String nip) {
		List<Question> questions = questionRepo.findQuestionBySubject(subjectId, nip);

		return questions;
	}

	@Override
	public List<Question> findQuestionByQG(Long qgId) {
		List<Question> questions = questionRepo.findQuestionByQG(qgId);

		return questions;
	}

	@Override
	public List<QuestionGroup> findQuestionGroupByQP(Long qpId, String nip) {
		List<QuestionGroup> questionGroups = groupRepo.findQuestionGroupByQP(qpId, nip);

		return questionGroups;
	}

	@Override
	public Map<String, List<Map<String, Object>>> findQuestionGroupById(Long id) {
		QuestionGroup questionGroup = groupRepo.findQuestionGroupById(id);
		Map<String, List<Map<String, Object>>> mapQG = new HashMap<>();
		Map<String, Object> mapQGV = new HashMap<>();

		List<Map<String, Object>> objQG = new ArrayList<>();
		mapQGV.put("id", questionGroup.getId());
		mapQGV.put("createdDate", questionGroup.getCreatedDate());
		mapQGV.put("qgType", questionGroup.getQgType());
		mapQGV.put("globalValue", questionGroup.getGlobalValue());

		List<Map<String, Object>> objQuestion = new ArrayList<>();
		List<Map<String, Object>> objTag = new ArrayList<>();
		List<Question> questions = questionGroup.getQuestions();

		for (Question question : questions) {
			Map<String, Object> mapQ = new HashMap<>();
			objTag = new ArrayList<>();
			
			mapQ.put("id", question.getId());
			mapQ.put("question", question.getQuestion());
			mapQ.put("optionA", question.getOptionA());
			mapQ.put("optionB", question.getOptionB());
			mapQ.put("optionC", question.getOptionC());
			mapQ.put("optionD", question.getOptionD());
			mapQ.put("optionE", question.getOptionE());
			mapQ.put("difficulty", question.getDifficulty());
			mapQ.put("disabled", question.getDisabled());
			mapQ.put("explanation", question.getExplanation());
			mapQ.put("key", question.getKey());
			mapQ.put("typeQuestion", question.getTypeQuestion());

			List<QuestionTag> qt = questionTagRepo.findQT(question.getId());
			if (qt != null && !qt.isEmpty()) {
				if (qt.size() > 0) {
					for (QuestionTag questionTag : qt) {
						Map<String, Object> mapQT = new HashMap<>();
						mapQT.put("id", questionTag.getId());
						mapQT.put("tagName", questionTag.getTag().getTagName());
						objTag.add(mapQT);
					}
				} else {
					Map<String, Object> mapQT = new HashMap<>();
					mapQT.put("id", qt.get(0).getId());
					mapQT.put("tagName", qt.get(0).getTag().getTagName());
					objTag.add(mapQT);
				}
			}

			mapQ.put("tagNames", objTag);
			objQuestion.add(mapQ);
		}

		mapQGV.put("questions", objQuestion);
		objQG.add(mapQGV);
		mapQG.put("questionGroup", objQG);

		return mapQG;
	}

	@Override
	public void disabledQG(Long groupId) {
		QuestionGroup qg = groupRepo.findOne(groupId);
		qg.setDeleted(true);
		groupRepo.saveAndFlush(qg);
	}

}
