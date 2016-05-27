package id.co.knt.cbt.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.knt.cbt.model.QuestionTag;
import id.co.knt.cbt.repositories.QuestionTagRepo;
import id.co.knt.cbt.service.QuestionTagService;

@Service("questionTagService")
public class QuestionTagServiceImpl implements QuestionTagService {

	@Autowired
	private QuestionTagRepo questionTagRepo;

	@Override
	public QuestionTag addNew(QuestionTag qt) {
		QuestionTag newQT = questionTagRepo.save(qt);
		return newQT;
	}

	@Override
	public QuestionTag updateQuestion(QuestionTag qt) {
		QuestionTag updatedQT = questionTagRepo.saveAndFlush(qt);
		return updatedQT;
	}

	@Override
	public void deleteQuestion(QuestionTag qt) {
		questionTagRepo.delete(qt);
	}

	@Override
	public List<QuestionTag> findAllQuestionTag() {
		List<QuestionTag> questionTags = questionTagRepo.findAll();
		return questionTags;
	}

	@Override
	public QuestionTag findQuestionTagById(Long id) {
		QuestionTag qt = questionTagRepo.findOne(id);
		return qt;
	}

}
