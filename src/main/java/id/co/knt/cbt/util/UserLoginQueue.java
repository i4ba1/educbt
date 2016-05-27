package id.co.knt.cbt.util;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

import id.co.knt.cbt.model.Login;

public class UserLoginQueue {
	private static final UserLoginQueue instance = new UserLoginQueue();
	private BlockingQueue<Login> queue;
	
	protected UserLoginQueue() {
		
	}
	
	public static UserLoginQueue getInstance(){
		return instance;
	}
	
	public void setQueue(Login login){
		if (queue == null) {
			queue = new LinkedBlockingQueue<>();
		}
		
		queue.add(login);
	}
	
	public BlockingQueue<Login> getQueue(){
		return this.queue;
	}
}
