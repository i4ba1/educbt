package id.co.knt.cbt.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cbt_school")
public class School implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6549146806900802231L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Long id;
	
	@Column(name="school_name")
	private String schoolName;
	
	@Column(name="school_description")
	private String schoolDescription;
	
    @Column(name="file_data")
    private byte[] fileData;
	
	/*@Column(name="file_data")
    private String fileData;*/
    
    @Column(name="content_type")
    private String contentType;
    
    @Column(name="file_name")
    private String fileName;
    
	public String getSchoolName() {
		return schoolName;
	}

	public void setSchoolName(String schoolName) {
		this.schoolName = schoolName;
	}

	public String getSchoolDescription() {
		return schoolDescription;
	}

	public void setSchoolDescription(String schoolDescription) {
		this.schoolDescription = schoolDescription;
	}
	
	/*public String getFileData() {
		return fileData;
	}

	public void setFileData(String fileData) {
		this.fileData = fileData;
	}*/

	public String getContentType() {
		return contentType;
	}

	public byte[] getFileData() {
		return fileData;
	}

	public void setFileData(byte[] fileData) {
		this.fileData = fileData;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public Long getId() {
		return id;
	}
}
