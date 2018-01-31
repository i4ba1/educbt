/**
 * 
 */
package id.co.knt.cbt.model.dto;

/**
 * @author MNI
 *
 */
public class CompletedEvent {
	private String studentName;
    private String nis;
    private Double score;
    private String className;
    
    
	public CompletedEvent(String studentName, String nis, Double score, String className) {
		super();
		this.studentName = studentName;
		this.nis = nis;
		this.score = score;
		this.className = className;
	}
	
	public String getStudentName() {
		return studentName;
	}
	public String getNis() {
		return nis;
	}
	public Double getScore() {
		return score;
	}
	public String getClassName() {
		return className;
	}
    
    
}
