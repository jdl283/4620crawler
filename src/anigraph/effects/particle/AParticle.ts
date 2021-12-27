export enum AParticleEnums{
    DEFAULT_MAX_N_PARTICLES=1200
}

export abstract class AParticle {
    public t0:number=0;
    public lifespan:number=0;
    public lastUpdate:number;
    public hidden:boolean=false;
    constructor(t0:number=0, lifespan?:number, ...args:any[]) {
        this.t0=t0;
        this.lifespan = lifespan!==undefined?lifespan:0;
        this.lastUpdate=t0;
    }
    get age(){
        return this.lastUpdate-this.t0;
    }
}
