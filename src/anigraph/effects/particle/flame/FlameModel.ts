import {AObjectState} from "../../../aobject";
import {FlameParticle} from "./FlameParticle";
import {ASerializable} from "../../../aserial";
import {Color, Vec2} from "../../../amath";
import {A2DParticlesModel} from "../A2DParticlesModel";

export enum FlameParticleEnums {
    MAX_HEIGHT_FACTOR=5,
    MAX_SPEED=5,
    MAX_AMP=1,
    MAX_FREQ=2,
    MAX_SIZE=1,
    DESATURATE=30,
    DARKEN=30,
    LIFESPAN_VARIATION=0.2,
    SIZE_DECAY=0.1,
    COLOR_SHIFT=0.5,
    COLOR_RANDOM_SHIFT = 0.2
}

@ASerializable("FlameModel")
export class FlameModel extends A2DParticlesModel{
    particles:FlameParticle[]=[];

    // @AObjectState verts:VertexArray2D;
    // @AObjectState color:Color;
    // @AObjectState nParticles:number;
    // @AObjectState time:number;
    @AObjectState particleSize:number;
    @AObjectState height:number;
    @AObjectState amplitude:number;
    @AObjectState frequency:number;
    @AObjectState randomness:number;
    @AObjectState lifespan:number;
    @AObjectState gamma:number;
    @AObjectState playing:boolean;
    @AObjectState colorShift:number;
    @AObjectState integrateForce:boolean;
    @AObjectState forceStrength:number;







    static ForceTarget:Vec2;
    getTarget(){return FlameModel.ForceTarget;}



    // public clock:AClock;
    // protected _maxNumParticles:number;
    // public particles:FlameParticle[]=[];
    // get maxNumParticles(){
    //     return this._maxNumParticles;
    // }
    //
    // /** Get set rate */
    // set rate(value:number){this.clock.rate = value;}
    // get rate(){return this.clock.rate;}
    //
    // get paused(){
    //     return this.clock.paused;
    // }
    // set paused(v:boolean){
    //     this.clock.paused = v;
    // }


    constructor(max_num_particles?:number) {
        super();
        // this.verts = new VertexArray2D();
        // this._maxNumParticles = max_num_particles!==undefined?max_num_particles:AParticleEnums.DEFAULT_MAX_N_PARTICLES;
        // this.nParticles = this.maxNumParticles;
        // this.clock = new AClock();
        // this.time = 0;
        const self = this;
        this.rate = 1;
        this.paused = false;
        this.particleSize=0.7;
        this.height = 1.5;
        this.amplitude=0.5;
        this.frequency=0.5;
        this.randomness = 1.2;
        this.lifespan=1.0;
        this.gamma=2.0;
        this.playing = true;
        this.colorShift = 0.75;
        this.integrateForce=false;
        this.forceStrength = 3;
        this.play();



        this.color = Color.FromString("#ffaa00");

        this.subscribe(this.clock.addTimeListener((t:number)=>{
            self.time = t;
            self.update(t);
        }));

        this.subscribe(this.addTransformListener( ()=>{
            FlameModel.ForceTarget = self.transform.position;
        }))
    }

    update(t:number){
        if(this.nParticles>this.particles.length){
            for(let p=0;p<this.nParticles;p++){
                if(p>(this.particles.length-1)){
                    let newParticle = new FlameParticle(p, this);
                    newParticle.t0=t;
                    newParticle.lifespan=Math.random()*this.lifespan;
                    this.particles.push(newParticle);
                }
            }
        }
        for(let p=0;p<this.particles.length;p++){
            if(p<this.nParticles) {
                if (this.particles[p].age > this.particles[p].lifespan) {
                    this.emit(this.particles[p], t);
                } else {
                    this.particles[p].update(t, this);
                }
            }else{
                this.particles[p].hidden=true;
            }
        }
    }

    getEmissionLine(){
        let corners = this.getBounds().corners;
        return [corners[0], corners[1]];
    }

    emit(particle:FlameParticle, t:number){
        let leftover = (particle.age%particle.lifespan);

        let corners = this.getBounds().corners;

        let emissionScale = corners[0].minus(corners[1]).L2();
        let heightScale =corners[2].minus(corners[0]).L2();
        let palpha = Math.random();
        let startPosition =this.getBounds().randomTransformedPoint();
            // corners[0]
            // .times(palpha)
            // .plus(
            //     corners[1].times(1-palpha)
            // );
        let startColor = this.color.Spun(this.randomness*FlameParticleEnums.COLOR_RANDOM_SHIFT);
        let particleSize = this.particleSize*emissionScale;
        let height = heightScale*this.height*(1+this.randomness*Math.random());
        let amplitude = emissionScale*this.amplitude;
        let frequency = this.frequency;
        let randomness = this.randomness;
        let lifespan = this.lifespan*(1+(Math.random())*FlameParticleEnums.LIFESPAN_VARIATION*randomness);
        let phase = this.randomness*this.nParticles?(particle.id/this.nParticles):0;
        particle.reset(this, t,
            lifespan,
            particleSize,
            startPosition,
            startColor,
            height,
            frequency,
            amplitude,
            phase,
            FlameParticleEnums.SIZE_DECAY*(1+Math.random()*randomness),
            this.colorShift*(1+Math.random()*randomness),
            this.gamma
            )
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
            integrateForce:{
                value:self.integrateForce,
                onChange:(v:boolean)=>{
                    self.integrateForce = v;
                }
            },

            forceStrength: {
                value:self.forceStrength,
                min:-50,
                max:50,
                step:0.01,
                onChange:(v:number)=>{
                    self.forceStrength = v;
                }
            },


            randomness: {
                value:self.randomness,
                min:0,
                max:2,
                step:0.01,
                onChange:(v:number)=>{
                    self.randomness = v;
                }
            },

            nParticles: {
                value: self.nParticles,
                min: 0,
                max: self.maxNumParticles,
                step: 1,
                onChange: (v: number) => {
                    self.nParticles = v;
                }
            },

            height: {
                value: self.height,
                min: 0,
                max: FlameParticleEnums.MAX_HEIGHT_FACTOR,
                step: FlameParticleEnums.MAX_HEIGHT_FACTOR / 200,
                onChange: (v: number) => {
                    self.height = v;
                }
            },
            amplitude: {
                value: self.amplitude,
                min: 0,
                max: FlameParticleEnums.MAX_AMP,
                step: FlameParticleEnums.MAX_AMP / 200,
                onChange: (v: number) => {
                    self.amplitude = v;
                }
            },
            frequency: {
                value: self.frequency,
                min: 0,
                max: FlameParticleEnums.MAX_FREQ,
                step: 0.01,
                onChange: (v: number) => {
                    self.frequency = v;
                }
            },
            particleSize: {
                value: self.particleSize,
                min: 0,
                max: FlameParticleEnums.MAX_SIZE,
                step: FlameParticleEnums.MAX_SIZE / 200,
                onChange: (v: number) => {
                    self.particleSize = v;
                }
            },
            lifespan: {
                value: self.lifespan,
                min: 0,
                max: 10,
                step: 0.01,
                onChange: (v: number) => {
                    self.lifespan = v;
                }
            },
            gamma:{
                value: self.gamma,
                min: 0,
                max: 3,
                step: 0.01,
                onChange: (v: number) => {
                    self.gamma = v;
                }
            },
            colorShift:{
                value: self.colorShift,
                min: 0,
                max: 2*Math.PI,
                step: 0.01,
                onChange: (v: number) => {
                    self.colorShift = v;
                }
            },
            playing:{
                value:self.playing,
                onChange:(v:boolean)=>{
                    if(v){
                        this.play();
                    }else{
                        this.pause();
                    }
                }
            }
        }
        return {...super.getModelGUIControlSpec(),...customSpec}
    }

}
