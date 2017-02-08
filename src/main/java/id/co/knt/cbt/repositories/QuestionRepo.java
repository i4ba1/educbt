package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Question;

@Repository
public interface QuestionRepo extends JpaRepository<Question, Long> {

	@Query("select q from Question q inner join q.questionGroup qG where qG.questionPool.id = :questionPoolId and qG.questionPool.activated=false")
	List<Question> findQuestionByQPoolId(@Param("questionPoolId") Long questionPoolId);

	@Query("select q from Question q inner join q.questionGroup qG where qG.questionPool.subject.id = :subjectId and qG.questionPool.employee.nip= :nip and qG.questionPool.activated=true and qg.deleted=false")
	List<Question> findQuestionBySubject(@Param("subjectId") Integer subjectId, @Param("nip") String nip);

	@Query("select q from Question q inner join fetch q.questionGroup qG inner join qG.questionPool qP where qG.id= :id")
	List<Question> findQuestionByQG(@Param("id") Long id);
	
	@Query("select q from Question q inner join fetch q.questionGroup qG inner join qG.questionPool qP where qG.questionPool.subject.id = :subjectId and qG.questionPool.employee.nip= :nip and qG.id= :id")
	List<Question> findQuestionByQGSubjectAndNip(@Param("subjectId") Integer subjectId, @Param("nip") String nip, @Param("id") Long id);
}
