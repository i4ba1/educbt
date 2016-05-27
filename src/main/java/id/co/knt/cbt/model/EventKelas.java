package id.co.knt.cbt.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="cbt_event_kelas")
public class EventKelas implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2514918595662026615L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	private Long id;

	@ManyToOne
	@JoinColumn(name="event_id", referencedColumnName="id")
	private Event event;
	
	@ManyToOne
	@JoinColumn(name="kelas_id", referencedColumnName="id")
	private Kelas kelas;
	
	public EventKelas() {
		// TODO Auto-generated constructor stub
	}
	
	public EventKelas(Event event, Kelas kelas) {
		super();
		this.event = event;
		this.kelas = kelas;
	}
	
	public Long getId() {
		return id;
	}

	public Event getEvent() {
		return event;
	}

	public void setEvent(Event event) {
		this.event = event;
	}

	public Kelas getKelas() {
		return kelas;
	}

	public void setKelas(Kelas kelas) {
		this.kelas = kelas;
	}
}
