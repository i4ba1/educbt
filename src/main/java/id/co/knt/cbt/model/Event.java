package id.co.knt.cbt.model;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * @author MNI
 */
@Entity
@Table(name = "cbt_event")
public class Event implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8884780526121545229L;

	public enum EventType {
		TUGAS, KUIS, TRYOUT_UAS, TRYOUT_UTS, TRYOUT_UAN;
	}

	public enum QuestionTypeStructure {
		FIXED, RANDOM
	}
	
	public enum EventStatusType {
		PREPARED, PUBLISHED, RELEASED, COMPLETED
	}

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "id")
	private Long id;

	@Column(name = "event_name")
	private String eventName;

	@Column(name = "event_type")
	@Enumerated(EnumType.STRING)
	private EventType eventType;

	@Column(name = "start_date")
	private Long startDate;

	@Column(name = "end_date")
	private Long endDate;

	@Column(name = "working_time", columnDefinition="smallint")
	private Integer workingTime;

	@Column(name = "is_deleted")
	private Boolean deleted = false;
	
	@Column(name="created_date")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createdDate;
	
	@Column(name="event_status")
	private EventStatusType status = EventStatusType.PREPARED;

	@Column(name = "question_structure")
	@Enumerated(EnumType.STRING)
	private QuestionTypeStructure questionStructure;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="emp_id", referencedColumnName="id")
	private Employee emp;
	
	@Column(name="image_name")
	private String eventImgName;
	
	@JsonIgnore
	@OneToMany(mappedBy="event", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.LAZY)
	private List<EventResult> eventResults;
	
	@JsonIgnore
	@OneToMany(mappedBy="event", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.LAZY)
	private List<EventQuestion> eventQuestions;
	
	@JsonIgnore
	@OneToMany(mappedBy="event", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.LAZY)
	private List<EventKelas> classes;

	public String getEventName() {
		return eventName;
	}

	public void setEventName(String eventName) {
		this.eventName = eventName;
	}

	public EventType getEventType() {
		return eventType;
	}

	public void setEventType(EventType eventType) {
		this.eventType = eventType;
	}

	public Long getStartDate() {
		return startDate;
	}

	public void setStartDate(Long startDate) {
		this.startDate = startDate;
	}

	public Long getEndDate() {
		return endDate;
	}

	public void setEndDate(Long endDate) {
		this.endDate = endDate;
	}

	public Integer getWorkingTime() {
		return workingTime;
	}

	public void setWorkingTime(Integer workingTime) {
		this.workingTime = workingTime;
	}

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
	}
	
	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public EventStatusType getStatus() {
		return status;
	}

	public void setStatus(EventStatusType status) {
		this.status = status;
	}

	public QuestionTypeStructure getQuestionStructure() {
		return questionStructure;
	}

	public void setQuestionStructure(QuestionTypeStructure typeStructure) {
		this.questionStructure = typeStructure;
	}

	public Long getId() {
		return id;
	}

	public List<EventResult> getEventResults() {
		return eventResults;
	}
	
	public List<EventQuestion> getEventQuestions() {
		return eventQuestions;
	}

	public List<EventKelas> getClasses() {
		return classes;
	}

	public String getEventImgName() {
		return eventImgName;
	}

	public void setEventImgName(String eventImgName) {
		this.eventImgName = eventImgName;
	}

	public Employee getEmp() {
		return emp;
	}

	public void setEmp(Employee emp) {
		this.emp = emp;
	}
}