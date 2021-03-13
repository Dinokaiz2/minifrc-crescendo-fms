class Team {
    static PointType = {
        INITIATION_LINE: "INITIATION_LINE",
        HIGH_GOAL: "HIGH_GOAL",
        LOW_GOAL: "LOW_GOAL",
        ROTATION_CONTROL: "ROTATION_CONTROL",
        POSITION_CONTROL: "POSITION_CONTROL",
        CLIMB: "CLIMB",
        PARK: "PARK",
        BALANCE: "BALANCE"
    }

    static PointValues = {
        "INITIATION_LINE": 5,
        "HIGH_GOAL": 2,
        "LOW_GOAL": 1,
        "ROTATION_CONTROL": 10,
        "POSITION_CONTROL": 20,
        "CLIMB": 15,
        "PARK": 5,
        "BALANCE": 15
    }

    constructor(color) {
        this.color = color;
        this.totalScore = 0;
        this.highGoalScore = 0;
        this.lowGoalScore = 0;
        this.ballNum = 0;
        this.climb = 0;
        this.endgame = 0;
        this.rankingPoint = 0;
    }

    updateScore(pointType, isAuto, del) {
        var num = (del) ? -1 : 1;
        var auto = (isAuto) ? 2 : 1;

        switch (pointType) {
            case PointType.HIGH_GOAL:
                this.highGoalScore += (PointValues[pointType] * num * auto);
                this.totalScore += (PointValues[pointType] * num * auto);
                this.ballNum += num;
                break;
            case PointType.LOW_GOAL: 
                this.lowGoalScore += (PointValues[pointType] * num * auto);
                this.totalScore += (PointValues[pointType] * num * auto);
                this.ballNum += num;
                break;
            case PointType.ROTATION_CONTROL:
                this.totalScore += (PointValues[pointType] * num);
                break;
            case PointType.POSITION_CONTROL:
                this.totalScore += (PointValues[pointType] * num);
                this.rankingPoint += num;
                break;
            case PointType.PARK:
                this.totalScore += (PointValues[pointType] * num);
                this.endgame += (PointValues[pointType] * num);
                break;
            case PointType.CLIMB:
                this.totalScore += (PointValues[pointType] * num);
                this.endgame += (PointValues[pointType] * num);
                break;
            case PointType.BALANCE:
                this.totalScore += (PointValues[pointType] * num);
                this.endgame += (PointValues[pointType] * num);
                break;
            case PointType.INITIATION_LINE:
                if (isAuto) this.totalScore += (PointValues[pointType] * num);
                break;
        }
    }

    getScore() {
        return this.totalScore;
    }
}

export { Team }