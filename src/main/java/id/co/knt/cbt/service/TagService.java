package id.co.knt.cbt.service;

import java.util.List;

import id.co.knt.cbt.model.Tag;

public interface TagService {
	Tag addNewTag(List<Object> objects);

	Tag updateTag(List<Object> objects);

	void deleteTag(Long id);

	List<Tag> findThemeBySubject(Integer id);
	
	List<Tag> findTagBySubject(Long teacherId, Integer subjectId);

	Tag findTagById(Long id);
	
	Tag findTagByName(String name);
	
	List<Tag> findAll(Long id);
}
