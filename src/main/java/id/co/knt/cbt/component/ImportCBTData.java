package id.co.knt.cbt.component;

import javax.annotation.PostConstruct;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import id.co.knt.cbt.repositories.UserRepo;

@Component
public class ImportCBTData {

	private static final Logger LOG = Logger.getLogger(ImportCBTData.class);
	
	@Autowired
	private UserRepo userRepo;
	
	@PostConstruct
	public void init(){
		LOG.info("================INIT AFTER APPLICATION CONTEXT STARTED===================");
	}
	
}
