package ch.helpfuleth.instanthelpfinder.domain.enumeration;

public enum ETurningEventStatus {
    PENDING("PENDING"),
    ACCEPTED("ACCEPTED"),
    ALL_ON_BOARD("ALL_ON_BOARD"),
    EXECUTED("EXECUTED");

    private String status;

    ETurningEventStatus(String status){
        this.status = status;
    }

    public String getStatus(){
        return this.status;
    }
}
