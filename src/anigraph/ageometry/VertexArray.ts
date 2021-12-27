import {
    VertexAttributeArray,
    VertexAttributeArray2D,
    VertexAttributeArray3D,
    VertexAttributeArray4D,
    VertexPositionArray2DH
} from "./VertexAttributeArray";
import {Vector} from "../amath/Vector";
import {HasBounds} from "./ModelGeometry";
import {BoundingBox3D} from "../amath/BoundingBox3D";
import {VertexIndexArray} from "./VertexIndexArray";
import {Mat3} from "../amath/Mat3";
import {Mat4} from "../amath/Mat4";


export abstract class VertexArray<VType extends Vector> implements HasBounds{
    public attributes:{[name:string]:VertexAttributeArray<any>}={};
    public indices!:VertexIndexArray;

    /** Get set position */
    set position(value:VertexPositionArray2DH|VertexAttributeArray3D|VertexAttributeArray4D){this.attributes['position'] = value;}
    get position(){return this.attributes['position'] as VertexPositionArray2DH|VertexAttributeArray3D|VertexAttributeArray4D;}

    /** Get set normal */
    set normal(value:VertexAttributeArray3D){this.attributes['normal'] = value;}
    get normal(){return this.attributes['normal'] as VertexAttributeArray3D;}

    // /** Get set color */
    set color(value:VertexAttributeArray<any>){this.attributes['color'] = value;}
    get color(){return this.attributes['color'];}

    /** Get set uv */
    set uv(value:VertexAttributeArray2D){this.attributes['uv'] = value;}
    get uv(){return this.attributes['uv'];}

    abstract addVertex(v:VType|any):void;
    abstract getBounds():BoundingBox3D;
    protected _uid:string='';


    getAttributeArray(name:string){
        return this.attributes[name];
    }

    ApplyMatrix(m:Mat3|Mat4){
        this.position.ApplyMatrix(m);
        if(this.normal){
            let m4 = (m instanceof Mat4)?m:Mat4.From2DMat3(m);
            let mnorm = m4.getInverse()?.getTranspose();
            if(!mnorm){
                throw new Error(`tried to apply singular matrix to normals...`);
            }
            this.normal.ApplyMatrix(mnorm);
        }
    }

    get uid(){
        return this._uid;
    }

    get nVerts(){
        return this.position.nVerts;
    }

    clone():this{
        let cfunc:any=(this.constructor as any);
        let clone = new cfunc();
        for(let atr in this.attributes){
            clone.attributes[atr] = this.attributes[atr].clone();
        }
        clone.indices = this.indices.clone();
        return clone;
    }

    toJSON(){
        var rval:{[name:string]:any} = {};
        for (let k in this){
            // @ts-ignore
            rval[k]=this[k];
        }
        return rval;
    }
}
