package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.EventQuestion;

@Repository
public interface EventQuestionRepo extends JpaRepository<EventQuestion, Long> {
	@Query("select distinct eq from EventQuestion eq join fetch eq.question q join fetch q.questionGroup qG join fetch qG.questionPool qP where eq.event.id = :eventId")
	List<EventQuestion> findByEventId(@Param("eventId") Long eventId);

	@Query("select eq from EventQuestion eq where eq.id = :eventId")
	EventQuestion findOneEQ(@Param("eventId") Long eventId);

	@Query("from EventQuestion eq inner join fetch eq.question q inner join fetch q.questionGroup qg where eq.question.id =:questionId and eq.event.id =:eventId")
	EventQuestion findQuestion(@Param("questionId") Long questionId, @Param("eventId") Long eventId);
}
