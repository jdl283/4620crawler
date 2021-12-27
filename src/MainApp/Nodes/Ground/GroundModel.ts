import {AMeshModel} from "../../../anigraph/amvc/node/mesh/AMeshModel";
import {
    AMaterialManager,
    AObjectState,
    ASerializable,
    BezierTween,
    Color,
    Vec3,
    VertexArray3D
} from "../../../anigraph";
import * as THREE from "three";
import {button} from "leva";
import {ATexture} from "../../../anigraph/arender/ATexture";
import {GroundMaterialModel} from "../../Materials/GroundMaterialModel";

@ASerializable("GroundModel")
export class GroundModel extends AMeshModel{
    @AObjectState noiseAmplitude:number;
    @AObjectState textureWraps:number;

    constructor(size:number=1000) {
        super();
        this.selectable = false; // Don't want clicking on the ground to select it
        this.noiseAmplitude=10;
        this.textureWraps=10;
        this.reRoll(size);
    }

    /**
     * Define this to customize what gets created when you click the create default button in the GUI
     * @constructor
     */
    static async CreateDefaultNode(texture?:string|ATexture, ...args:any[]){
        await GroundMaterialModel.ShaderPromise;
        let groundNode = new GroundModel();
        groundNode.name = 'GroundPlane';
        groundNode.transform.position.z = -0.5;
        groundNode.setMaterial('ground');
        // groundNode.material.setTexture('marble');
        return groundNode;
    }

    reRoll(size:number=1000, textureWraps?:number, nSamplesPerSide?:number){
        // doesn't use nSamplesPerSide yet...
        if(textureWraps !== undefined){this.textureWraps=textureWraps;}
        this.verts = VertexArray3D.SquareXYUV(1000, this.textureWraps);
    }

    getModelGUIControlSpec(): { [p: string]: any } {
        const self = this;
        const specs = {
            Reroll: button(() => {
                self.reRoll();
            }),
            Noise: {
                value: self.noiseAmplitude,
                min: 0,
                max: 100,
                step: 0.2,
                onChange(v:any){
                    self.noiseAmplitude=v;
                }
            }
        }
        return {...super.getModelGUIControlSpec(),...specs};
    }

}
