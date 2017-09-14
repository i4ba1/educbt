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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

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

	@Scheduled(fixedRate=3000)
	public void checkActivationKey() {
		RestTemplateUtility restTemplateUtility = new RestTemplateUtility();
		List<License> list = licenseRepo.findAll();
		LOG.info("license size==========> ",list.size());

		if (list.size() > 0) {
			for (License license : list) {
				Map<String, Object> objLicense = restTemplateUtility.serializeLicenseObject(license);
				int response = restTemplateUtility.helpDeskAPI()
						.postForObject(baseUrl + Constant.HELPDESK_API_VALIDATE_ACTIVATION_KEY, objLicense, Integer.class);


				LOG.info("response==========> ",response);
				/**
				 * If the response is -1, it mean the activationKey is not same on the helpdesk
				 * cloud, so we delete the activation key, then user must be reactivate
				 */
				if (response < 0) {
					license.setActivationKey(null);
					licenseRepo.saveAndFlush(license);
				}
			}
		}
		
	}
}
