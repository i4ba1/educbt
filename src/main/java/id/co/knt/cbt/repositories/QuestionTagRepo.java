package id.co.knt.cbt.repositories;

import java.util.List;
import java.util.ArrayList;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.QuestionTag;

@Repository
public interface QuestionTagRepo extends JpaRepository<QuestionTag, Long> {

		@Query("select qT from QuestionTag qT where qT.question.id= :id")
		List<QuestionTag> findQT(@Param("id") Long id);

		@Query("select qT.question from QuestionTag qT where qT.tag.id in :tagIds")
		List<QuestionTag> findQuestionByTag(@Param("tagIds")  ArrayList<Integer>  tagIds);
}
