package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.EventResult;
import id.co.knt.cbt.model.Student;
import id.co.knt.cbt.model.Event.EventStatusType;

@Repository
public interface EventResultRepo extends JpaRepository<EventResult, Long> {

	@Query("select er from EventResult er where er.event.id= :eventId and er.student.id= :studentId")
	EventResult findERByEventStudent(@Param("eventId") Long eventId, @Param("studentId") Long studentId);
	
	@Query("select er from EventResult er where er.event.id= :eventId and er.student.nis= :nis")
	EventResult findERByEventStudentNis(@Param("eventId") Long eventId, @Param("nis") String nis);
	
	@Query("select er from EventResult er inner join fetch er.student s where er.event.id= :eventId and er.event.status=3 order by s.kelas asc")
	List<EventResult> fetchStudentByEventId(@Param("eventId") Long eventId);

	@Query("select er from EventResult er where er.event.id= :eventId and er.student.kelas.id= :classId order by er.total desc")
	List<EventResult> findEventResultByClass(@Param("eventId") Long eventId, @Param("classId") Integer classId);
	
	@Query("select er.student from EventResult er where er.event.id= :eventId and er.event.status= :eventStatus")
	List<Student> findStudentAttendToEvent(@Param("eventId") Long eventId, @Param("eventStatus") EventStatusType eventStatusType);
}
