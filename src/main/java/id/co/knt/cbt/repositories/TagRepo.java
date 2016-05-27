package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Tag;

@Repository
public interface TagRepo extends JpaRepository<Tag, Long> {

	@Query("select th from Tag th where th.subject.id= :id")
	List<Tag> findThemeBySubject(@Param("id") Integer id);
	
	@Query("select th from Tag th where th.tagName= :tagName")
	Tag findTagByName(@Param("tagName") String tagName);
	
	@Query("select th from Tag th where th.teacher.id= :id and deleted=false")
	List<Tag> findTeacherTag(@Param("id") Long id);
}
