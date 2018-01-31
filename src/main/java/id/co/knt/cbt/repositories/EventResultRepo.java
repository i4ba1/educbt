package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.EventResult;

@Repository
public interface EventResultRepo extends JpaRepository<EventResult, Long> {

	@Query("select er from EventResult er where er.event.id= :eventId and er.student.nis= :nis")
	EventResult findERByEventStudent(@Param("eventId") Long eventId, @Param("nis") String nis);
	
	@Query("select er from EventResult er inner join fetch er.student s where er.event.id= :eventId and er.event.status=3 order by s.kelas asc")
	List<EventResult> fetchStudentByEventId(@Param("eventId") Long eventId);

	@Query("select er from EventResult er where er.event.id= :eventId and er.student.kelas.id= :classId order by er.total desc")
	List<EventResult> findEventResultByClass(@Param("eventId") Long eventId, @Param("classId") Integer classId);
}
