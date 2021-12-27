import {FlameModel} from "./FlameModel";
import {FlameParticleInstancesElement} from "./FlameParticleInstancesElement";
import {FlameParticle} from "./FlameParticle";
import {ASceneNodeController} from "../../../amvc/node/base/ASceneNodeController";
import {APolygonElement, ARenderGroup, NewObject3D} from "../../../arender";
import {ASerializable} from "../../../aserial";
import {Color, Mat4} from "../../../amath";
import {AParticlesView} from "../AParticlesView";

@ASerializable("FlameView")
export class FlameView extends AParticlesView<FlameModel>{
    element!:APolygonElement;
    public controller!:ASceneNodeController<FlameModel>;
    protected _particlesElement!:FlameParticleInstancesElement;

    public particleGroup!:ARenderGroup;
    public particles:FlameParticle[]=[];




    //##################//--polygon--\\##################
    //<editor-fold desc="polygon">

    constructor() {
        super();
        this.threejs = NewObject3D();
    }

    init(){
        super.init();
    }

    onGeometryUpdate(){
        super.onGeometryUpdate();
        this.element.setVerts(this.model.verts);
    }

    initGraphics() {
        super.initGraphics();
        const self = this;
        const model = self.model;
        this.particleGroup = new ARenderGroup();
        this.element = new APolygonElement(this.model.verts, this.model.color);
        this.addElement(this.element);
        // this.element.visible = false;
        this._particlesElement = new FlameParticleInstancesElement();
        this._particlesElement.setMatrixAt(0,new Mat4());
        this._particlesElement.setColorAt(0,Color.Random());
        this.particleGroup.add(this._particlesElement);
        this.addElement(this.particleGroup);

        this.addMaterialChangeCallback(()=>{
            self.element.setColor(self.model.color);
        },
            'model.color'
        );
        // this.controller.subscribe(
        //     self.model.addStateKeyListener('geometry', ()=>{
        //         self.onGeometryUpdate();
        //     }),
        //     'model.verts'
        // );

        this.initParticleGraphics();

        this.subscribe(
            this.model.addStateKeyListener('transform',()=>{
                self.particleGroup.setTransform(self.model.transform.getMatrix().getInverse());
            }),
            'particlesToWorld'
        )
    }



    //</editor-fold>
    //##################\\--polygon--//##################


    // updateParticleElements(){
    //     for(let p=0; p<this.model.nParticles;p++){
    //         this.particlesElement.setMatrixAt(p, Mat4.Translation2D(V2(p*this.model.spread, p*this.model.spread)).times(Mat4.Scale2D(this.model.radius)));
    //         this.particlesElement.setColorAt(p, this.model.color);
    //     }
    //     this.particlesElement.mesh.instanceMatrix.needsUpdate = true;
    // }



}
