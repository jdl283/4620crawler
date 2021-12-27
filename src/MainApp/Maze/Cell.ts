export class Cell{
    public isWall:number;

    constructor() {
        this.isWall = 1;
    }

    public setType(type:number){
        this.isWall = type;
    }
}

export{}