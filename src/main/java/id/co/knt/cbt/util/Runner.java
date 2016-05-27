package id.co.knt.cbt.util;

public class Runner implements Runnable {
	private boolean bExit = false;
	private static final Runner instance = new Runner();
	
	public Runner() {
		
	}
	
	public static Runner getInstance(){
		return instance;
	}
	
	public void exit(boolean bExit){
        this.bExit = bExit;
        System.out.println("BExit======> "+bExit);
    }
  
    @Override
    public synchronized void run(){
        while(bExit == false){
            System.out.println("Thread is running "+bExit);
                try {
                    Thread.sleep(15000);
                } catch (InterruptedException ex) {
                    System.out.println(ex);
                }
        }
        
        System.out.println("Thread is running TRUE=====> "+bExit);
    }

}
