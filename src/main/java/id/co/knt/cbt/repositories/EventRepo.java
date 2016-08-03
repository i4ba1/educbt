package id.co.knt.cbt.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventType;

@Repository
public interface EventRepo extends JpaRepository<Event, Long> {

	@Query("select e from Event e where e.eventName= :eventName")
	Event findEventByEventName(@Param("eventName") String eventName);

	@Query("select e from Event e where e.eventName like '%'")
	List<Event> searchEventByName(@Param("eventName") String eventName);

	@Query("select e from Event e join e.classes c where e.eventType= :eventType and e.status != 0 order by e.createdDate desc")
	List<Event> findEventByEventType(@Param("eventType") EventType eventType);

	@Query("select e from Event e where e.eventType= :eventTypeUTS or e.eventType= :eventTypeUAS and e.status != 0 order by e.createdDate desc")
	List<Event> findEvenUtsUas(@Param("eventTypeUTS") EventType eventTypeUTS,
			@Param("eventTypeUAS") EventType eventTypeUAS);

	@Query("select e from Event e where e.eventType= :eventType and e.status = 2 order by e.createdDate asc")
	List<Event> fetchNewEvent(@Param("eventType") EventType eventType);

	@Query("select e from Event e where e.eventType= :eventType and e.status = 3 order by e.createdDate asc")
	List<Event> fetchRecentEvent(@Param("eventType") EventType eventType);

	@Query("select e from Event e JOIN FETCH e.classes where e.id= :eventId")
	Event findEventKelas(@Param("eventId") Long id);
	
	@Query("select e from Event as e where e.emp.nip= :nip and e.deleted=false")
	List<Event> findEventByTeacher(@Param("nip") String nip);

	@Query("select e from Event as e where e.emp.nip= :nip and e.deleted=false")
	List<Event> findByDeleted();
}
