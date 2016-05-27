package id.co.knt.cbt.model;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@DiscriminatorValue("S")
public class Student extends User {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -5490864642567918382L;
	
	@Column(name="student_nis", unique=true)
	private String nis;

	@Column(name = "admission_date")
	@Temporal(TemporalType.DATE)
	private Date admissionDate = new Date();
	
	@ManyToOne
	@JoinColumn(name="kelas_id", referencedColumnName="id")
	private Kelas kelas;
	
	@JsonIgnore
	@OneToMany(mappedBy="student", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.LAZY)
	private List<EventResult> eventResults;
	
	@JsonIgnore
	@OneToMany(mappedBy="student", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.LAZY)
	private List<StudentAnswer> studentAnswers;

	public String getNis() {
		return nis;
	}

	public void setNis(String nis) {
		this.nis = nis;
	}
	
	public Kelas getKelas(){
		return kelas;
	}
	
	public void setKelas(Kelas kelas){
		this.kelas = kelas;
	}

	public Date getAdmissionDate() {
		return admissionDate;
	}

	public void setAdmissionDate(Date admissionDate) {
		this.admissionDate = admissionDate;
	}

	public List<EventResult> getEventResults() {
		return eventResults;
	}

	public void setEventResults(List<EventResult> eventResults) {
		this.eventResults = eventResults;
	}

	public List<StudentAnswer> getStudentAnswers() {
		return studentAnswers;
	}

	public void setStudentAnswers(List<StudentAnswer> studentAnswers) {
		this.studentAnswers = studentAnswers;
	}
}