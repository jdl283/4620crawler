import {ACamera} from "./ACamera";
import {ASerializable} from "../../aserial";
import {Mat4, NodeTransform3D, V2} from "../../amath";
import {AniGraphEnums} from "../../basictypes";
import {AObjectState} from "../../aobject";

const ZNEAR:number = AniGraphEnums.DefaultZNear;
const ZFAR:number = AniGraphEnums.DefaultZFar;
const LEFT = -100;
const RIGHT = 100;
const TOP=100;
const BOTTOM=-100;

@ASerializable("AOrthoCamera")
export class AOrthoCamera extends ACamera{
    constructor(pose?:NodeTransform3D, projection?:Mat4);
    // constructor(pose?:NodeTransform3D, left?:number, right?:number, bottom?:number, top?:number, near?:number, far?:number);
    constructor(...args:any[]){
        super(...args);
        // this.setProjectionOrtho(left, right, bottom, top, near, far)
    }

    updateProjection(){
        let center = this._nearPlaneCenter;
        let wh = this._nearPlaneWH.times(0.5);
        this._setProjection(Mat4.ProjectionOrtho(center.x-wh.x, center.x+wh.x, center.y-wh.y, center.y+wh.y, this.zNear, this.zFar));
    }
    onZoomUpdate() {
        this.updateProjection();
    }

    setProjectionOrtho(left:number, right:number, bottom:number, top:number, near:number=ZNEAR, far:number=ZFAR){
        this.zNear = near;
        this.zFar = far;
        this.lrbt = [left, right, bottom, top];
        this.updateProjection();
    }

    onCanvasResize(width: number, height: number) {
        this.lrbt = [
            -width /2,
            width/2,
            -height/2,
            height/2
        ];
        this.updateProjection();
    }

    static Create(left: number, right: number, bottom: number, top: number, near: number=ZNEAR, far: number=ZFAR, pose?:NodeTransform3D){
        let camera = new AOrthoCamera(pose);
        camera.setProjectionOrtho(left, right, bottom, top, near, far);
        return camera;
    }
}
