package id.co.knt.cbt.model;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 
 * MNI
 *
 */
@Entity
@Table(name="cbt_course")
public class Course implements Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5331691973959461708L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name="id")
	private Integer id;
	
	@Column(name="course_name")
	private String courseName;
	
	@Column(name="created_date")
	private Date createdDate;

	public Integer getId() {
		return id;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
}