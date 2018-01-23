package id.co.knt.cbt.model.dto;

public class MultipleChoice{
    private String answer;
    private String kindaQuestion;
    private Boolean isCorrect;
    private String key;
    private Integer questionWeight;

    public MultipleChoice(String answer,String kindaQuestion,Boolean isCorrect,String key,Integer questionWeight){
        this.answer = answer;
        this.kindaQuestion = kindaQuestion;
        this.isCorrect = isCorrect;
        this.key = key;
        this.questionWeight = questionWeight;
    }
}