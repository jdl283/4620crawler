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
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";

const loader = new PLYLoader();
const CubeGeometry:THREE.BufferGeometry|Promise<THREE.BufferGeometry> = loader.loadAsync('./models/cube.ply');

@ASerializable("CubeModel")
export class CubeNodeModel extends ALoadedModel{
    //Our vertices
    static CubeObject3D:THREE.Object3D;

    constructor() {
        super(CubeNodeModel.CubeObject3D);
    }

    /**
     * Define this to customize what gets created when you click the create default button in the GUI
     * @constructor
     */
    static async CreateDefaultNode(sideLength:number=50, ...args:any[]){
        if(!CubeNodeModel.CubeObject3D){
            const geometry = await CubeGeometry;
            CubeNodeModel.CubeObject3D = new THREE.Mesh(geometry);
        }
        let newNode = new CubeNodeModel();
        return newNode;
    }

    getModelGUIControlSpec(): { [p: string]: any } {
        const self = this;
        return {...super.getModelGUIControlSpec()};
    }

}
