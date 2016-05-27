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
	
	@Column(name="created_date")
	private Long createdDate;
	
	public License() {
		// TODO Auto-generated constructor stub
	}

	public License(String license, Long createdDate) {
		super();
		this.license = license;
		this.createdDate = createdDate;
	}

	public String getLicense() {
		return license;
	}

	public void setLicense(String license) {
		this.license = license;
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
}
