/**
 * 
 */
package id.co.knt.cbt.scheduler;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;

import id.co.knt.cbt.controller.AdminLicenseController;
import id.co.knt.cbt.model.License;
import id.co.knt.cbt.repositories.LicenseRepo;
import id.co.knt.cbt.util.Constant;
import id.co.knt.cbt.util.RestTemplateUtility;

/**
 * @author muhamad
 *
 */
@Component
public class CheckActivationKeyScheduler {

	@Autowired
	private LicenseRepo licenseRepo;
	
	@Value("${helpdesk.url}")
	String baseUrl;
	
	private static final Logger LOG = LoggerFactory.getLogger(AdminLicenseController.class);

	/*
	 * second, minute, hour, day, month, weekday
	 */
	@Scheduled(fixedDelay=5000000)
	public void checkActivationKey() {
		RestTemplateUtility restTemplateUtility = new RestTemplateUtility();
		List<License> list = licenseRepo.findAll();
		LOG.info("license size==========> "+list.size());

		if (list.size() > 0) {
			for (License license : list) {
				Map<String, Object> objLicense = restTemplateUtility.serializeLicenseObject(license);
				
				LOG.info("objLicense=====> "+objLicense);
				LOG.info("url validateActivationKey=====> "+(baseUrl + Constant.HELPDESK_API_VALIDATE_ACTIVATION_KEY));
				
				try {
					if (restTemplateUtility.isInternet()) {
						restTemplateUtility.helpDeskAPI()
                        	.postForObject(baseUrl + Constant.HELPDESK_API_VALIDATE_ACTIVATION_KEY, objLicense, Integer.class);
					}
	                
	            } catch (HttpClientErrorException e) {
	                int statusCode = e.getStatusCode().value();
	                if (statusCode == HttpStatus.NOT_ACCEPTABLE.value()) {
	                	license.setLicenseStatus(false);
						license.setActivationKey(null);
						licenseRepo.saveAndFlush(license);
	                }else {
	                	LOG.info("another error=====> "+ statusCode);
	                }
	            }
			}
		}
		
	}
}
