package id.co.knt.cbt.model.dto;

public class Essay{
    private String question;
    private String explanation;
    private String answer;
    private Integer questionWeight;

    public Essay(String question,String explanation,String answer,Integer questionWeight){
        this.question = question;
        this.explanation = explanation;
        this.answer = answer;
        this.questionWeight = questionWeight;
    }

	public String getQuestion() {
		return question;
	}

	public String getExplanation() {
		return explanation;
	}

	public String getAnswer() {
		return answer;
	}

	public Integer getQuestionWeight() {
		return questionWeight;
	}
    
}