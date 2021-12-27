import {AObjectState} from "../../aobject";
import {ASceneNodeModel, AClock} from "../../amvc";
import {AParticle, AParticleEnums} from "./AParticle";


export enum AParticlesModelEnums{
    CLOCK_SUBSCRIPTION_HANDLE = 'CLOCK_SUBSCRIPTION_HANDLE'
}

export abstract class AParticlesModel extends ASceneNodeModel{
    @AObjectState nParticles:number;
    @AObjectState time:number;
    @AObjectState playing!:boolean;
    public clock:AClock;
    protected _maxNumParticles:number;
    abstract particles:AParticle[];

    abstract update(t:number, ...args:any[]):void;
    // abstract transform:NodeTransform<any, any>;


    get maxNumParticles(){
        return this._maxNumParticles;
    }

    constructor(max_num_particles?:number) {
        super();
        // this.transform = new NodeTransform2D();
        this.clock = new AClock();
        this._maxNumParticles = max_num_particles!==undefined?max_num_particles:AParticleEnums.DEFAULT_MAX_N_PARTICLES;
        this.nParticles = this.maxNumParticles;
        this.time = 0;
        this._maxNumParticles = max_num_particles!==undefined?max_num_particles:AParticleEnums.DEFAULT_MAX_N_PARTICLES;
        this.nParticles = this.maxNumParticles;
        this.rate = 1;
        this.paused = false;
        this.playing = true;
        this.play();

        const self=this;
        // update when the clock does
        this.subscribe(this.clock.addTimeListener((t:number)=>{
                self.time = t;
                self.update(t);
            }),
            AParticlesModelEnums.CLOCK_SUBSCRIPTION_HANDLE);
    }


    /** Get set rate */
    set rate(value:number){this.clock.rate = value;}
    get rate(){return this.clock.rate;}
    get paused(){
        return this.clock.paused;
    }
    set paused(v:boolean){
        this.clock.paused = v;
    }

    pause(){
        this.clock.pause();
        this.playing=false;
    }
    play(){
        this.clock.play();
        this.playing=true;
    }

    getModelGUIControlSpec(){
        const self = this;
        const customSpec = {
            nParticles: {
                value: self.nParticles,
                min:0,
                max:self.maxNumParticles,
                step:1,
                onChange:(v:number)=>{
                    self.nParticles=v;
                }
            }
        }
        return {...super.getModelGUIControlSpec(),...customSpec}
    }
}


