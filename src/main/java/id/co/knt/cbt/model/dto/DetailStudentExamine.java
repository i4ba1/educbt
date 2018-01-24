
package id.co.knt.cbt.model.dto;

import java.util.ArrayList;
import id.co.knt.cbt.model.dto.MultipleChoice;
import id.co.knt.cbt.model.dto.Essay;

public class DetailStudentExamine{
    private String studentName;
    private String studentNis;
    private String eventName;
    private String eventDate;
    private ArrayList<MultipleChoice> listMC;
    private ArrayList<Essay> listEssay;

    public DetailStudentExamine(String studentName, String studentNis, String eventName, String eventDate, ArrayList<MultipleChoice> listMC, ArrayList<Essay> listEssay){
        this.studentName = studentName;
        this.studentNis = studentNis;
        this.eventName = eventName;
        this.eventDate = eventDate;
        this.listMC = listMC;
        this.listEssay = listEssay;
    }
}