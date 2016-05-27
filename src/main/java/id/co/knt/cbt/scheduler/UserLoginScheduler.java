package id.co.knt.cbt.scheduler;

import java.util.concurrent.BlockingQueue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import id.co.knt.cbt.model.Login;
import id.co.knt.cbt.service.LoginService;
import id.co.knt.cbt.util.UserLoginQueue;

@Component
public class UserLoginScheduler {
	
	@Autowired
	LoginService loginService;
	
	@Scheduled(fixedRate=600000)
	public void removeWhenIdle(){
		UserLoginQueue loginQueue = UserLoginQueue.getInstance();
		
		if (loginQueue.getQueue() != null && loginQueue.getQueue().size() > 0) {
			BlockingQueue<Login> blockingQueue = loginQueue.getQueue();
			while (blockingQueue.peek() != null) {
				loginService.deleteToken(blockingQueue.peek());
				blockingQueue.poll();
			}
		}
	}
}
