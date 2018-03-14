package id.co.knt.cbt.component;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import id.co.knt.cbt.repositories.UserRepo;

/*@Component*/
public class ImportCBTData {

	private static final Logger LOG = LoggerFactory.getLogger(ImportCBTData.class);
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private DataSource dataSource;
	
	/*@PostConstruct*/
	public void init(){
		
		/**
		 * If the user data is null then import data
		 */
		if(userRepo.findUserByUserName("teacher_SD") == null){
			try {
				ScriptUtils.executeSqlScript(dataSource.getConnection(), new ClassPathResource("final_sql_data_only.sql"));
			} catch (Exception e) {
				// TODO: handle exception
				e.printStackTrace();
			}
		}
		LOG.info("================INIT AFTER APPLICATION CONTEXT STARTED===================");
	}
	
}
