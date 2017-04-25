package id.co.knt.cbt.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cbt_license")
public class License implements Serializable {

	/**
	 *
	 */
	private static final long serialVersionUID = -7117977408293795916L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Integer id;

	@Column(name="license_key")
	private String license;

	@Column(name = "passkey")
	private String passKey;

	@Column(name = "activation_key")
	private String activationKey;

	@Column(name="created_date")
	private Long createdDate;

	@Column(name = "xlock")
	private String xlock;

	@Column(name="number_of_license")
	private Integer numberOfClient;

	public License() {
		// TODO Auto-generated constructor stub
	}

	public License(String license, String passKey, String activationKey, Long createdDate, String xlock, Integer numberOfLicense) {
		super();
		this.license = license;
		this.createdDate = createdDate;
		this.passKey = passKey;
		this.activationKey = activationKey;
		this.xlock = xlock;
		this.numberOfClient = numberOfLicense;
	}

	public String getLicense() {
		return license;
	}

	public void setLicense(String license) {
		this.license = license;
	}

	public String getPassKey() {
		return passKey;
	}

	public void setPassKey(String passKey) {
		this.passKey = passKey;
	}

	public String getActivationKey() {
		return activationKey;
	}

	public void setActivationKey(String activationKey) {
		this.activationKey = activationKey;
	}

	public void setXLock(String xlock) {
		this.xlock = xlock;
	}

	public String getXLock() {
		return xlock;
	}

	public Long getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Long createdDate) {
		this.createdDate = createdDate;
	}

	public Integer getId() {
		return id;
	}

	public Integer getNumberOfClient() {
		return numberOfClient;
	}

	public void setNumberOfClient(Integer numberOfClient) {
		this.numberOfClient = numberOfClient;
	}
}
