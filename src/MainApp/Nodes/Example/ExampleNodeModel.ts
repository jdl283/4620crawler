import * as THREE from "three";
import {
    AMaterialManager,
    AObjectState,
    ASceneNodeModel,
    ASerializable,
    BezierTween,
    Color,
    GetAppState,
    Vec3,
    VertexArray3D
} from "../../../anigraph";
import {bezier} from "@leva-ui/plugin-bezier";
import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {button} from "leva";
export enum ExampleEnums{
    maxElements=3000
}

const DEFAULT_DURATION = 1.5;

@ASerializable("ExampleNodeModel")
export class ExampleNodeModel extends AMeshModel{
    static SpinEventHandle:string = "MODEL_SPIN_EVENT";
    @AObjectState tween:BezierTween;
    @AObjectState spinDuration:number;
    @AObjectState nSpins:number;

    constructor() {
        super();
        this.tween= new BezierTween(0.33, -0.6, 0.66, 1.6);
        this.spinDuration = DEFAULT_DURATION;
        this.nSpins = 3;
    }

    /**
     * Define this to customize what gets created when you click the create default button in the GUI
     * @constructor
     */
    static async CreateDefaultNode(radius:number=50, widthSegments:number=50, heightSegments:number=50, ...args:any[]){
        let newNode = new ExampleNodeModel();
        newNode.verts = VertexArray3D.FromThreeJS(new THREE.SphereBufferGeometry(radius, 50,50, ...args));
        // newNode.setMaterial(AMaterialManager.DefaultMaterials.Standard);
        // newNode.setMaterial('trippy');
        newNode.color = Color.Random();
        newNode.color.a = 0.5;
        return newNode;
    }

    static async CreateCubeNode(w:number=50, h:number=50, d:number=50, ...args:any[]){
        let newNode = new ExampleNodeModel();
        newNode.verts = VertexArray3D.FromThreeJS(new THREE.BoxBufferGeometry(w,h,d));
        // newNode.setMaterial(AMaterialManager.DefaultMaterials.Standard);
        newNode.setMaterial('trippy');
        newNode.color = Color.FromString('#ffffff');
        newNode.color.a = 0.0;
        return newNode;
    }

    onSpacebar(){
        this.signalEvent(ExampleNodeModel.SpinEventHandle);
    }

    getModelGUIControlSpec(): { [p: string]: any } {
        const self = this;
        const specs = {
            SPIN: button(() => {
                // @ts-ignore
                self.onSpacebar();
            }),
            spinDuration: {
                value: self.spinDuration,
                min: 0.5,
                max: 10,
                step: 0.1,
                onChange(v:any){
                    self.spinDuration=v;
                }
            },
            nSpins: {
                value: self.nSpins,
                min: 1,
                max: 10,
                step:1,
                onChange(v:any){
                    self.nSpins=v;
                }
            },
            curve: bezier({
                handles: self.tween.x1y1x2y2,
                graph: true,
                onChange:(v:any)=>{
                    self.tween.x1y1x2y2=[v[0],v[1],v[2],v[3]];
                }
            }),
            looking: {
                value: {x: self.transform.anchor.x, y:self.transform.anchor.y},
                joystick: "invertY",
                step: 5,
                onChange:(v: any)=>{
                    self.transform.anchor = new Vec3(v.x, v.y, 0);
                }
            }
        }
        return {...super.getModelGUIControlSpec(),...specs};
    }

}
