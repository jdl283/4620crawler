import {AParticle} from "../AParticle";
import {Color, V3, Vec3} from "../../../amath";
import {FlameModel, FlameParticleEnums} from "./FlameModel";

export class FlameParticle extends AParticle{
    protected _position!:Vec3;
    protected _color!:Color;
    protected _radius!:number;
    protected _alpha!:number;
    protected _gamma!:number;
    public phase!:number;
    public startPosition!:Vec3;
    public startRadius!:number;
    public startColor!:Color;
    public frequency!:number;
    public amplitude!:number;
    public height!:number;
    public sizeDecay!:number;
    public colorShift!:number;
    public hidden:boolean;
    public id:number;
    public velocity!:Vec3;
    public eulerPosition!:Vec3;

    get position(){
        return this._position;
    }
    get color(){
        return this._color;
    }
    get radius(){
        return this._radius;
    }

    constructor(
        id:number,
        model:FlameModel,
        t0?:number,
        lifespan?:number,
        radius:number=1,
        position?:Vec3,
        color?:Color,
        height:number=100,
        frequency:number=1,
        amplitude:number=1,
        phase:number=0,
        sizeDecay:number=1,
        colorShift:number=0.5,
        gamma:number=2,
        alpha:number=1) {
        super();
        this.id = id;
        this.reset(
            model,
            t0?t0:0,
            lifespan?lifespan:0,
            radius,
            position,
            color,
            height,
            frequency,
            amplitude,
            phase,
            sizeDecay,
            colorShift,
            gamma,
            alpha
        );
        this.hidden=true;
    }

    reset(model:FlameModel, t0:number, lifespan:number, radius:number=1, position?:Vec3, color?:Color, height:number=100, frequency:number=1, amplitude:number=1, phase:number=0, sizeDecay:number=1, colorShift:number=0.5, gamma:number=2, alpha:number=1){
        this.hidden = false;
        this.t0=t0;
        this.lifespan=lifespan;
        this.startRadius = radius;
        this.startPosition = position?position.clone():V3();
        this.startColor = color?color:Color.FromString("#ff0000");
        this.frequency = frequency;
        this.amplitude = amplitude;
        this.phase=phase;
        this._alpha=alpha;
        this._gamma = gamma;
        this.height = height;
        this.sizeDecay = sizeDecay;
        this.colorShift = colorShift;
        this.velocity = V3(0,0,0);
        this.eulerPosition = V3(0,0,0);
        this.update(t0, model);

    }

    update(t:number, model:FlameModel){
        if(model.integrateForce){
            let stepSize = (t-Math.max(this.lastUpdate, this.t0))*100;
            let mass = this.radius;
            let target = model.getTarget();
            let distance = target.minus(this.position.plus(this.eulerPosition));
            let force = distance.getNormalized().times(10/(distance.L2()^2));
            let acceleration = force.times(stepSize*model.forceStrength/mass);
            this.eulerPosition = this.eulerPosition.plus(this.velocity.times(stepSize));
            this.velocity = this.velocity.plus(acceleration);
        }
        this.lastUpdate=t;
        let progress = this.age/this.lifespan;
        let progress_gamma = Math.pow(progress, this._gamma);
        let inv_progress_gamma = 1-Math.pow(1-progress, this._gamma);
        this._position =this.startPosition.plus(
            V3(this.amplitude*
                Math.sin((this.frequency*2*Math.PI*t) +this.phase*2*Math.PI),
                progress_gamma*this.height,
                this.amplitude*Math.cos((this.frequency*2*Math.PI*t) +this.phase*2*Math.PI)
            )
        ).plus(this.eulerPosition);
        this._radius = this.startRadius*(1-progress_gamma)+this.sizeDecay*this.startRadius*progress_gamma;
        this._color = this.startColor
            .Spun(-inv_progress_gamma*this.colorShift)
            .Desaturate(progress_gamma*0.5*FlameParticleEnums.DESATURATE)
            .Darken(progress_gamma*0.5*FlameParticleEnums.DARKEN);
    }
}
