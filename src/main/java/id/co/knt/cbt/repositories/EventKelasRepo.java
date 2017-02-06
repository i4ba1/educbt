package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Event.EventType;
import id.co.knt.cbt.model.EventKelas;

@Repository
public interface EventKelasRepo extends JpaRepository<EventKelas, Long> {

	@Query("select distinct ek from EventKelas ek where ek.event.id = :eventId")
	List<EventKelas> findByEventId(@Param("eventId") Long eventId);

	//@Query("select distinct ek from EventKelas ek where ek.kelas.id = :classId and ek.event.eventType= :eventType and ek.event.status > 0")
	@Query("select distinct ek from EventKelas as ek right join ek.event where ek.kelas.id = :classId and ek.event.eventType= :eventType and ek.event.status > 0")
	List<EventKelas> findEventByClass(@Param("classId") Integer classId, @Param("eventType") EventType eventType);

	@Query("select ek from EventKelas as ek right join ek.event where (ek.kelas.id = :classId and ek.event.eventType= :eventTypeUTS) or (ek.kelas.id = :classId and ek.event.eventType= :eventTypeUAS) and ek.event.status > 0  ORDER BY ek.event.status  >  1")
	List<EventKelas> findEvenUtsUas(@Param("eventTypeUTS") EventType eventTypeUTS,
			@Param("eventTypeUAS") EventType eventTypeUAS, @Param("classId") Integer classId);

	@Query("select ek from EventKelas as ek where ek.kelas.id = :classId and ek.event.status = 1")
	List<EventKelas> findEventByClassId(@Param("classId") Integer classId);
}
