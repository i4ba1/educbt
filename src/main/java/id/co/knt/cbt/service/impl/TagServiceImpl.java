package id.co.knt.cbt.service.impl;

import java.util.List;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import id.co.knt.cbt.model.Employee;
import id.co.knt.cbt.model.Subject;
import id.co.knt.cbt.model.Tag;
import id.co.knt.cbt.repositories.EmployeeRepo;
import id.co.knt.cbt.repositories.SubjectRepo;
import id.co.knt.cbt.repositories.TagRepo;
import id.co.knt.cbt.service.TagService;

@Service("themeService")
public class TagServiceImpl implements TagService {
	
	@Autowired
	private TagRepo tagRepo;
	
	@Autowired
	private SubjectRepo subjectRepo;
	
	@Autowired
	private EmployeeRepo empRepo;

	@Override
	public Tag addNewTag(List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("tag");
		Subject sbj = subjectRepo.findOne(obj.getInt("subjectId"));
		Employee teacher = empRepo.findOne(obj.getLong("teacherId"));

		String themeName = obj.getString("tagName");
		Tag th = new Tag();
		th.setSubject(sbj);
		th.setTagName(themeName);
		th.setTeacher(teacher);
		Tag newTheme = tagRepo.save(th);
		
		return newTheme;
	}

	@Override
	public Tag updateTag(List<Object> objects) {
		JSONArray array = new JSONArray(objects);
		JSONObject obj = array.getJSONObject(0).getJSONObject("tag");

		String themeName = obj.getString("tagName");
		Tag th = tagRepo.findOne(obj.getLong("tagId"));
		th.setTagName(themeName);
		Tag updatedTheme = tagRepo.saveAndFlush(th);
		
		return updatedTheme;
	}

	@Override
	public void deleteTag(Long id) {
		Tag th = tagRepo.findOne(id);
		th.setDeleted(true);
		
		tagRepo.saveAndFlush(th);
	}

	@Override
	public List<Tag> findThemeBySubject(Integer id) {
		List<Tag> tags = tagRepo.findThemesBySubject(id);
		return tags;
	}

	@Override
	public Tag findTagById(Long id) {
		Tag th = tagRepo.findOne(id);
		return th;
	}

	@Override
	public Tag findTagByName(String name) {
		Tag tag = tagRepo.findTagByName(name);
		
		return tag;
	}

	@Override
	public List<Tag> findAll(Long id) {
		List<Tag> tags = tagRepo.findTeacherTag(id);
		
		return tags;
	}

	@Override
	public List<Tag> findTagBySubject(Long teacherId, Integer subjectId) {
		List<Tag> tags = tagRepo.findTagBySubject(teacherId, subjectId);
		
		return tags;
	}

}
