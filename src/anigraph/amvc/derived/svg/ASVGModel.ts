import {AObjectState} from "../../../aobject";
import {ASerializable} from "../../../aserial";
import {ASceneNodeModel} from "../../node";
import {SVGLoader, SVGParsedData} from "../../../acomponents/fileloading/svg/SVGLoader";
import {ThreeJSObjectFromParsedSVG} from "../../../acomponents/fileloading/svg/SvgToThreeJsObject";
import * as THREE from "three";
import {Object3D} from "three";
import {BoundingBox3D, Mat3, V3} from "../../../amath";

export enum SVGModelEnums{
    SelfSVGScaleListener = 'SelfSVGScaleListener'
}

@ASerializable("ASVGModel")
export class ASVGModel extends ASceneNodeModel {
    @AObjectState public svgText: string;
    @AObjectState public svgScale:number;
    @AObjectState refObject3D:Object3D;
    protected _parsedSVG:SVGParsedData;



    constructor(svgText: string) {
        super();
        this.svgText = svgText;
        this._parsedSVG = ASVGModel.ParseSVGText(this.svgText);
        this.refObject3D = ThreeJSObjectFromParsedSVG(this._parsedSVG);
        this.svgScale=1;
        const self = this;
        this.subscribe(this.addEventListener('svgScale', ()=>{
            Mat3.Scale2D(self.svgScale).Mat4From2DH().assignTo(self.refObject3D.matrix);
        }), SVGModelEnums.SelfSVGScaleListener);
    }

    get parsedSVG(){
        return this._parsedSVG;
    }

    static ParseSVGText(svgText: string) {
        const loader = new SVGLoader();
        const svgParsedData: SVGParsedData = loader.parse(svgText);
        return svgParsedData;
    }

    getBounds():BoundingBox3D{
        // let b = this._svgBounds.clone();
        let threebox = new THREE.Box3().setFromObject(this.refObject3D);
        let bounds = new BoundingBox3D()
        bounds.minPoint=V3(threebox.min.x, threebox.min.y, threebox.min.z);
        bounds.maxPoint=V3(threebox.max.x, threebox.max.y, threebox.max.z);
        bounds.transform = this.getWorldTransform();
        return bounds;
    }


    getModelGUIControlSpec(){
        let self = this;
        let svgspec = {
            svgScale: {
                min: 0.01,
                max: 2.0,
                value:self.svgScale,
                onChange:(v:number)=>{
                    self.svgScale = v;
                }
            }
        }
        return {...super.getModelGUIControlSpec(), ...svgspec}
    }


}
