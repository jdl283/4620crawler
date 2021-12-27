import {ARenderObject} from "../../arender";
import {ASceneNodeView} from "../../amvc/node/base/ASceneNodeView";
// import {
//     ARenderObject, ASceneNodeView,
// } from "../../index";
import {AParticleInstancesElement} from "./AParticleInstancesElement";
import {AParticlesModel} from "./AParticlesModel";

export abstract class AParticlesView<T extends AParticlesModel> extends ASceneNodeView<T>{
    protected abstract _particlesElement:AParticleInstancesElement;
    abstract element:ARenderObject;

    get particlesElement(){
        return this._particlesElement;
    }

    get model():T{
        return (this.controller.model as T);
    }
    updateNumParticles(){

    }
    update(){
        // let nParticles = Math.min(this.model.nParticles, this.model.particles.length);
        // for(let p=0;p<nParticles;p++){
        for(let p=0;p<this.model.particles.length;p++){
            this.particlesElement.setParticle(p, this.model.particles[p]);
        }
        this.particlesElement.setNeedsUpdate();
    }

    initParticleGraphics(){
        this.subscribe(this.model.addStateKeyListener('nParticles', ()=>{
            this.updateNumParticles();
        }))
        this.subscribe(this.model.addStateKeyListener('time', ()=>{
            this.update();
        }))
    }

    _initTransformListener(){
        const self = this;
        const model = this.model;
        this.controller.subscribe(
            this.model.addStateKeyListener('transform', ()=>{
                model.transform.getMatrix().assignTo(self.threejs.matrix);
            }),
            'model.transform'
        );
    }
}
