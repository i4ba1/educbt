package id.co.knt.cbt.model.dto;

public class MultipleChoice{
    private String answer;
    private String questionType;
    private Boolean isCorrect;
    private String key;
    private Integer questionWeight;

    public MultipleChoice(String answer,String questionType,Boolean isCorrect,String key,Integer questionWeight){
        this.answer = answer;
        this.questionType = questionType;
        this.isCorrect = isCorrect;
        this.key = key;
        this.questionWeight = questionWeight;
    }

	public String getAnswer() {
		return answer;
	}

	public String getQuestionType() {
		return questionType;
	}

	public Boolean getIsCorrect() {
		return isCorrect;
	}

	public String getKey() {
		return key;
	}

	public Integer getQuestionWeight() {
		return questionWeight;
	}
    
}