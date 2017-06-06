package id.co.knt.cbt.service.impl;

import java.util.Date;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import id.co.knt.cbt.model.Subject;
import id.co.knt.cbt.repositories.SubjectRepo;
import id.co.knt.cbt.service.SubjectService;

@Transactional
@Service("subjectService")
public class SubjectServiceImpl implements SubjectService {

	@Autowired
	public SubjectRepo subjectRepo;

	public SubjectServiceImpl() {

	}
	
	@Override
	public Iterable<Subject> getAllSubject() {
		Iterable<Subject> subjects = subjectRepo.fetchSubjectNotDeleted(false);
		return subjects;
	}

	@Override
	public int save(List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("subject");
		Subject subject = subjectRepo.findBySubjectName(obj.getString("subjectName"));

		if (subject == null) {
			Subject sbj = new Subject();
			sbj.setSubjectName(obj.getString("subjectName"));
			sbj.setDeleted(false);
			sbj.setCreatedDate(new Date());
			if(subjectRepo.save(sbj) == null){
				return 1;
			}

			return 0;
		}else{
			if (subject.getDeleted()) {
				subject.setDeleted(false);
				subject.setCreatedDate(new Date());
				if(subjectRepo.saveAndFlush(subject) == null){
					return 1;
				}
				
				return 0;
			}else{
				return 2;
			}
		}
	}

	@Override
	public String getSubjectById(Integer id) {
		Subject sbj = subjectRepo.findOne(id);
		return sbj.getSubjectName();
	}

	@Override
	public Subject findSubjectById(Integer id) {
		Subject sbj = subjectRepo.findOne(id);
		return sbj;
	}

	@Override
	public String updateSubject(Subject subject) {
		Subject sbj = subjectRepo.saveAndFlush(subject);
		return sbj.getSubjectName();
	}

	@Override
	public void delete(Subject subject) {
		subjectRepo.saveAndFlush(subject);
	}

	@Override
	public Boolean isSubjectExist(Subject subject) {
		Subject sbj = subjectRepo.findBySubjectName(subject.getSubjectName());
		return sbj != null;
	}

	@Override
	public int importSubject(List<Object> list) {
		JSONArray array = new JSONArray(list);
		JSONArray data = array.getJSONObject(0).getJSONArray("subjects");
		if (list.size() > 0) {

			for (int i = 0; i < data.length(); i++) {
				JSONObject obj = data.getJSONObject(i);
				Subject existingSbj = subjectRepo.findBySubjectName(obj.getString("subjectName"));
				if (!obj.getString("subjectName").equals("") && existingSbj == null) {
					Subject subject = new Subject();
					subject.setSubjectName(obj.getString("subjectName"));
					subject.setCreatedDate(new Date());
					subject.setDeleted(false);
					if(subjectRepo.save(subject) == null){
						return 1;
					}
				}else{
					//If conflict
					return 2;
				}
			}
			
			return 0;
		}
		
		//If the size is 0
		return 1;
	}

	@Override
	public Subject findSubjectName(String sbjName) {
		Subject sbj = subjectRepo.findBySubjectName(sbjName);
		return sbj;
	}

	@Override
	public Subject turnOnDeleted(Subject subject) {
		return subjectRepo.saveAndFlush(subject);
	}

}
