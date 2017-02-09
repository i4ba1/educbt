package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.QuestionGroup;

@Repository
public interface QuestionGroupRepo extends JpaRepository<QuestionGroup, Long> {

	@Query("select qG from QuestionGroup qG inner join fetch qG.questionPool qP where qP.id= :id and qP.employee.nip= :nip and qG.deleted=false")
	List<QuestionGroup> findQuestionGroupByQP(@Param("id") Long id, @Param("nip") String nip);

	@Query("select qG from QuestionGroup qG inner join fetch qG.questionPool qP inner join qG.questions where qG.id= :id and qG.deleted=false")
	QuestionGroup findQuestionGroupById(@Param("id") Long id);

	@Query("select qG from QuestionGroup qG inner join fetch qG.questionPool qP where qP.employee.nip= :nip and qG.deleted=false")
	List<QuestionGroup> findQuestionGroupByNIP(@Param("nip") String nip);
}
