package id.co.knt.cbt.model.dto;

public class EventStudent{
    private String studentName;
    private String studentNis;
    private Boolean correctionStatus;

    public EventStudent(String studentName, String studentNis, Boolean correctionStatus){
        this.studentName = studentName;
        this.studentNis = studentNis;
        this.correctionStatus = correctionStatus;
    }

    public String getStudentName(){
        return this.studentName;
    }

    public String getStudentNis(){
        return this.studentNis;
    }

    public Boolean getCorrectionStatus(){
        return this.correctionStatus;
    }
}