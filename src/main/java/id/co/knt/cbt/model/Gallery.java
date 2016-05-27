package id.co.knt.cbt.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "cbt_gallery")
public class Gallery implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7358715092532048219L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "file_name")
	private String fileName;

	@Column(name = "path_file")
	private String pathFile;

	@Column(name = "content_type")
	private String contentType;

	@Column(name = "created_date")
	private Long createdDate;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="emp_id", referencedColumnName="id")
	private Employee employee;

	public Gallery() {

	}

	public Gallery(String fileName, String pathFile, String contentType, Long createdDate, Employee emp) {
		super();
		this.fileName = fileName;
		this.pathFile = pathFile;
		this.contentType = contentType;
		this.createdDate = createdDate;
		this.employee = emp;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getPathFile() {
		return pathFile;
	}

	public void setPathFile(String pathFile) {
		this.pathFile = pathFile;
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public Long getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Long createdDate) {
		this.createdDate = createdDate;
	}

	public Long getId() {
		return id;
	}

	public Employee getEmp() {
		return employee;
	}

	public void setEmp(Employee emp) {
		this.employee = emp;
	}
}
