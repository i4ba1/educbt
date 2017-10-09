/**
 * 
 */
package id.co.knt.cbt.util;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import id.co.knt.cbt.model.License;

/**
 * @author muhamad
 *
 */
public class RestTemplateUtility {
private RestTemplate helpDeskApi;
	
	public RestTemplateUtility() {
		helpDeskApi = new RestTemplate(getClientHttpRequestFactory());
	}
	
	public Map<String, Object> serializeLicenseObject(License license) {
		Map<String, Object> nodeProduct = new HashMap<>();
		nodeProduct.put("id", null);
		nodeProduct.put("productName", null);
		nodeProduct.put("productCode", 3);
		nodeProduct.put("createdDate", null);
		nodeProduct.put("description", null);
		nodeProduct.put("subModuleType", null);
		nodeProduct.put("subModuleLable", null);
		nodeProduct.put("deleted", false);

		Map<String, Object> nodeLicense = new HashMap<>();
		nodeLicense.put("id", null);
		nodeLicense.put("license", license.getLicense());
		nodeLicense.put("passKey", license.getPassKey());
		nodeLicense.put("activationKey", license.getActivationKey());
		nodeLicense.put("activationLimit", 3);
		nodeLicense.put("numberOfActivation", 0);
		nodeLicense.put("createdDate", license.getCreatedDate());
		nodeLicense.put("xlock", license.getXLock());
		nodeLicense.put("numberOfClient", license.getNumberOfClient());
		nodeLicense.put("schoolName", null);
		nodeLicense.put("product", nodeProduct);
		
		return nodeLicense;
    }
	
	private ClientHttpRequestFactory getClientHttpRequestFactory() {
        int timeout = 15000;
        HttpComponentsClientHttpRequestFactory clientHttpRequestFactory = new HttpComponentsClientHttpRequestFactory();
        clientHttpRequestFactory.setConnectTimeout(timeout);
        clientHttpRequestFactory.setReadTimeout(timeout);

        return clientHttpRequestFactory;
    }
	
	public RestTemplate helpDeskAPI() {
		return helpDeskApi;
	}
}
