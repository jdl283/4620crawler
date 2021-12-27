import * as THREE from "three";
import {
    ALoadedModel,
    AMaterialManager,
    AObjectState,
    ASceneNodeModel,
    ASerializable,
    BezierTween,
    Color,
    GetAppState, Quaternion,
    Vec3,
    VertexArray3D
} from "../../../anigraph";
import {bezier} from "@leva-ui/plugin-bezier";
import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {button} from "leva";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";

const DEFAULT_DURATION = 1.5;

const loader = new PLYLoader();
const DragonGeometry:THREE.BufferGeometry|Promise<THREE.BufferGeometry> = loader.loadAsync('./models/ply/dragon_color_onground.ply');

@ASerializable("DragonModel")
export class DragonNodeModel extends ALoadedModel{
    //Our vertices
    static DragonObject3D:THREE.Object3D;

    @AObjectState tween:BezierTween;
    @AObjectState spinDuration:number;
    @AObjectState nSpins:number;
    @AObjectState isSpinning:boolean;

    constructor() {
        super(DragonNodeModel.DragonObject3D);
        this.tween= new BezierTween(0.33, -0.6, 0.66, 1.6);
        this.spinDuration = DEFAULT_DURATION;
        this.nSpins = 3;
        this.isSpinning=false;
    }

    /**
     * Define this to customize what gets created when you click the create default button in the GUI
     * @constructor
     */
    static async CreateDefaultNode(radius:number=50, widthSegments:number=50, heightSegments:number=50, ...args:any[]){
        if(!DragonNodeModel.DragonObject3D){
            const geometry = await DragonGeometry;
            DragonNodeModel.DragonObject3D = new THREE.Mesh(geometry);
        }
        let newNode = new DragonNodeModel();
        return newNode;
    }

    getModelGUIControlSpec(): { [p: string]: any } {
        const self = this;
        const specs = {
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
