import * as THREE from "three";
import {ASceneNodeController, ASceneNodeView} from "../../node";
import {ASVGModel} from "./ASVGModel";
import {ThreeJSObjectFromParsedSVG} from "../../../acomponents/fileloading/svg/SvgToThreeJsObject";
import {Vec3} from "../../../amath";
import {ARenderGroup} from "../../../arender";


export class ASVGView extends ASceneNodeView<ASVGModel>{
    public controller!:ASceneNodeController<ASVGModel>;
    protected _shape!:THREE.Shape;
    protected _shape_geometry!:THREE.ShapeGeometry;
    protected _mesh!:THREE.Mesh;
    protected _material!:THREE.MeshBasicMaterial;
    public color!:Vec3;
    public svg!: ARenderGroup;

    get model():ASVGModel{
        return (this.controller.model as ASVGModel);
    }

    constructor() {
        super();
        // this.svg = new ARenderGroup();
    }

    // get bounds(){
    //     let threebox = new THREE.Box3().setFromObject(this.threejs);
    //     let bounds = new BoundingBox2D()
    //     bounds.minPoint=V2(threebox.min.x, threebox.min.y);
    //     bounds.maxPoint=V2(threebox.max.x, threebox.max.y);
    //     return bounds;
    // }

    initGraphics() {
        super.initGraphics();
        this.svg = new ARenderGroup(ThreeJSObjectFromParsedSVG(this.model.parsedSVG));
        this.addElement(this.svg);
    }

    _initTransformListener(){
        const model = this.model;
        this.controller.subscribe(
            this.model.addTransformListener( ()=>{
                // this.threejs.position.set(model.transform.position.x, model.transform.position.y, 0);
                model.transform.getMatrix().assignTo(this.threejs.matrix);
            }),
            'model.transform'
        );
    }


}
