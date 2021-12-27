import Chance from 'chance';

export class SeededRandom{
    public chance:any;
    constructor(seed:number=0) {
        this.chance = new Chance(seed);
    }
    rand(){
        return this.chance.floating({ min: 0, max: 1 });
    }
    floatArray(n:number){
        const randomArray = []
        for(let i = 0; i<n; i++) {randomArray.push(this.rand())}
        return randomArray;
    }
}

const Random = new SeededRandom();
export {Random};
