package id.co.knt.cbt.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.util.List;

@Entity
@DiscriminatorValue("E")
public class Employee extends User {

	/**
	 *
	 */
	private static final long serialVersionUID = -249687614267757333L;

	public enum Marital {
		SINGLE, MARRIED, DIVORCE;
	}

	@Column(name = "employee_nip", unique = true)
	private String nip;

	@Column(name = "joining_date")
	private Long joiningDate;

	@Column(name = "job_title")
	private String jobTitle;

	@Column(name = "is_status")
	private boolean active = true;

	@Column(name = "marital_status")
	@Enumerated(EnumType.STRING)
	private Marital maritalStatus = Marital.SINGLE;

	@JsonIgnore
	@OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<QuestionPool> questionPools;

	@JsonIgnore
	@OneToMany(mappedBy = "emp", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	private List<Event> events;

	public String getNip() {
		return nip;
	}

	public void setNip(String nip) {
		this.nip = nip;
	}

	public Long getJoiningDate() {
		return joiningDate;
	}

	public void setJoiningDate(Long joiningDate) {
		this.joiningDate = joiningDate;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public Marital getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(Marital maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public List<QuestionPool> getQuestionPools() {
		return questionPools;
	}

	public void setQuestionPools(List<QuestionPool> questionPools) {
		this.questionPools = questionPools;
	}

	public List<Event> getEvents() {
		return events;
	}

	public void setEvents(List<Event> events) {
		this.events = events;
	}
}
