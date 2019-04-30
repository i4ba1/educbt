package id.co.knt.cbt.model.dto;

public class EventStudent{
	private String studentNis;
    private String studentName;
    private String kelasName;
    private Boolean correctionStatus;
    
    
    /**
	 * @param studentNis
	 * @param studentName
	 * @param kelasName
	 * @param correctionStatus
	 */
	public EventStudent(String studentNis, String studentName, String kelasName, Boolean correctionStatus) {
		super();
		this.studentNis = studentNis;
		this.studentName = studentName;
		this.kelasName = kelasName;
		this.correctionStatus = correctionStatus;
	}


	/**
	 * @return the studentNis
	 */
	public String getStudentNis() {
		return studentNis;
	}


	/**
	 * @return the studentName
	 */
	public String getStudentName() {
		return studentName;
	}


	/**
	 * @return the kelasName
	 */
	public String getKelasName() {
		return kelasName;
	}


	/**
	 * @return the correctionStatus
	 */
	public Boolean getCorrectionStatus() {
		return correctionStatus;
	}
}