package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.QuestionGroupImages;

@Repository
public interface QuestionGroupImagesRepo extends JpaRepository<QuestionGroupImages, Long> {
	
	@Query("select groupImages from QuestionGroupImages groupImages where groupImages.questionGroup.id= :id")
	List<QuestionGroupImages> findByQuestionGroupId(@Param("id") Long id);
}
