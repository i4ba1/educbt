package id.co.knt.cbt.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@DiscriminatorValue("E")
public class Employee extends User {

	/**
	 *
	 */
	private static final long serialVersionUID = -249687614267757333L;

	public enum Marital {
		SINGLE, MARRIED, WIDOW;
	}

	@Column(name = "employee_nip", unique = true)
	private String nip;

	@Basic
	@Temporal(TemporalType.DATE)
	@Column(name = "joining_date")
	private Date joiningDate = new Date();

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

	public Date getJoiningDate() {
		return joiningDate;
	}

	public void setJoiningDate(Date joiningDate) {
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
