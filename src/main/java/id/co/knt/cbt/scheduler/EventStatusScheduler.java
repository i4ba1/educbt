package id.co.knt.cbt.scheduler;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import id.co.knt.cbt.model.Event;
import id.co.knt.cbt.model.Event.EventStatusType;
import id.co.knt.cbt.service.EventService;

@Component
public class EventStatusScheduler {

	@Autowired
	private EventService eventService;

	@Scheduled(cron = "* 15 * * * *")
	public void updateEvent() {
		List<Event> publishedEvent = eventService.fetchPublishedEvent();

		Long currentTime = System.currentTimeMillis();

		if (!publishedEvent.isEmpty() || publishedEvent.size() > 0) {
			for (Event event : publishedEvent) {
				if (currentTime >= event.getEndDate()) {
					event.setStatus(EventStatusType.CORRECTED);
				}

				eventService.updateEvent(event);
			}
		}
	}
}
