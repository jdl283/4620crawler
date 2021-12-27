import {Vector} from "../amath/Vector";
import {Vec2} from "../amath/Vec2";
import {Vec3} from "../amath/Vec3";
import * as THREE from "three";
import {Mat3} from "../amath/Mat3";
import {Vec4} from "../amath/Vec4";
import {Mat4} from "../amath/Mat4";
import {BufferAttribute} from "three/src/core/BufferAttribute";
import {InterleavedBufferAttribute} from "three/src/core/InterleavedBufferAttribute";


export abstract class VertexAttributeArray<V extends Vector> extends Vector{
    static ElementsPerVertex:number=-1;
    abstract getAt(i:number):V;
    abstract setAt(i:number, vertex:V):void;

    abstract get nVerts():number;



    push(vertex:V){
        for(let i=0;i<vertex.elements.length;i++){
            this.elements.push(vertex.elements[i]);
        }
    }

    Float32Array(){
        return new Float32Array(this.elements);
    }

    BufferAttribute(itemSize?:number){
        itemSize = (itemSize!==undefined)?itemSize:-1;
        return new THREE.Float32BufferAttribute(new Float32Array(this.elements), itemSize);
    };
    InstancedBufferAttribute(itemSize?:number){
        itemSize = (itemSize!==undefined)?itemSize:-1;
        return new THREE.InstancedBufferAttribute( new Float32Array(this.elements), itemSize);
    }
}

export class VertexAttributeArray2D extends VertexAttributeArray<Vec2>{
    static ElementsPerVertex:number=2;
    constructor(elements?:number[])
    constructor(...args:any[]) {
        super(...args);
    }

    static FromThreeJS(attr:THREE.BufferAttribute | THREE.InterleavedBufferAttribute){
        return new this(Array.from(attr.array));
    }

    push(vertex:Vec2){
        this.elements.push(vertex.elements[0]);
        this.elements.push(vertex.elements[1]);
    }

    getAt(i:number){
        return new Vec2(this.elements[i*2], this.elements[(i*2)+1]);
    }

    setAt(i:number, vertex:Vec2|number[]){
        let elements = (vertex instanceof Vec2)?vertex.elements:vertex;
        this.elements[i*2]=elements[0];
        this.elements[(i*2)+1]=elements[1];
    }


    BufferAttribute(itemSize:number=2){
        return new THREE.BufferAttribute( new Float32Array(this.elements), itemSize);
    };
    InstancedBufferAttribute(itemSize:number=2){
        return new THREE.InstancedBufferAttribute( new Float32Array(this.elements), itemSize);
    }

    get nVerts(){
        return this.elements.length/2;
    }
}

export class VertexAttributeArray3D extends VertexAttributeArray<Vec3>{
    static ElementsPerVertex:number=3;
    getAt(i:number){
        return new Vec3(this.elements[i*3], this.elements[(i*3)+1], this.elements[(i*3)+2]);
    }

    static FromThreeJS(attr:THREE.BufferAttribute | THREE.InterleavedBufferAttribute){
        return new this(Array.from(attr.array));
    }

    setAt(i:number, vertex:Vec3|number[]){
        let elements = (vertex instanceof Vec3)?vertex.elements:vertex;
        this.elements[i*3]=elements[0];
        this.elements[(i*3)+1]=elements[1];
        this.elements[(i*3)+2]=elements[2];
    }

    BufferAttribute(itemSize:number=3){
        return new THREE.BufferAttribute( new Float32Array(this.elements), itemSize);
    };

    InstancedBufferAttribute(itemSize:number=3){
        return new THREE.InstancedBufferAttribute( new Float32Array(this.elements), itemSize);
    }

    get nVerts(){
        return this.elements.length/3;
    }

    ApplyMatrix(m:Mat4|Mat3){
        m = (m instanceof Mat4)?m:Mat4.From2DMat3(m);
        let rval = this.clone();
        for(let v=0;v<this.nVerts;v++){
            rval.setAt(v, m.times(this.getAt(v).Point3DH).Point3D);
        }
        return rval;
    }

}

export class VertexAttributeArray4D extends VertexAttributeArray<Vec4>{
    static ElementsPerVertex:number=4;
    _defaultH = 0;

    static FromThreeJS(attr:THREE.BufferAttribute | THREE.InterleavedBufferAttribute){
        return new this(Array.from(attr.array));
    }

    getAt(i:number){
        return new Vec4(this.elements[i*4], this.elements[(i*4)+1], this.elements[(i*4)+2], this.elements[(i*4)+3]);
    }
    setAt(i:number, vertex:Vec4|Vec3|number[]){
        if(vertex instanceof Vec3){
            vertex = vertex.Point3DH;
        }
        let elements = (vertex instanceof Vec4)?vertex.elements:vertex;
        this.elements[i*4]=elements[0];
        this.elements[(i*4)+1]=elements[1];
        this.elements[(i*4)+2]=elements[2];
        this.elements[(i*4)+3]=elements[3];
    }

    BufferAttribute(itemSize:number=4){
        return new THREE.BufferAttribute( new Float32Array(this.elements), itemSize);
    };

    InstancedBufferAttribute(itemSize:number=4){
        return new THREE.InstancedBufferAttribute( new Float32Array(this.elements), itemSize);
    }

    get nVerts(){
        return this.elements.length/4;
    }

    ApplyMatrix(m:Mat4|Mat3){
        m = (m instanceof Mat4)?m:Mat4.From2DMat3(m);
        let rval = this.clone();
        for(let v=0;v<this.nVerts;v++){
            rval.setAt(v, m.times(this.getAt(v)));
        }
        return rval;
    }

    push(vertex:Vec4|Vec3){
        this.elements.push(vertex.elements[0]);
        this.elements.push(vertex.elements[1]);
        this.elements.push(vertex.elements[2]);
        if(vertex.elements.length===3){
            this.elements.push(this._defaultH);
        }else if(vertex.elements.length===4){
            this.elements.push(vertex.elements[3]);
        }else{
            throw new Error(`Can't push ${vertex} onto ${this}`);
        }
    }

}

export class VertexPositionArray2DH extends VertexAttributeArray3D{
    public _defaultZ:number=0;
    constructor(elements?:number[])
    constructor(...args:any[]) {
        super(...args);
    }

    static FromThreeJS(attr:THREE.BufferAttribute | THREE.InterleavedBufferAttribute){
        return new this(Array.from(attr.array));
    }

    push(vertex:Vec3|Vec2){
        let newcoords = vertex.elements.slice();
        // this.elements.push(vertex.elements[0]);
        // this.elements.push(vertex.elements[1]);
        if(vertex.elements.length===2){
            // this.elements.push(this._defaultZ);
            newcoords.push(this._defaultZ);
        }
        this.elements = this.elements.concat(newcoords);
        // else if(vertex.elements.length===3){
        //     this.elements.push(vertex.elements[2]);
        // }else{
        //     throw new Error(`Can't push ${vertex} onto ${this}`);
        // }
    }

    get nVerts(){
        return this.elements.length/3;
    }

    getAt(i:number){
        return new Vec3(this.elements[i*3], this.elements[(i*3)+1], this.elements[(i*3)+2]);
    }

    getPoint2DAt(i:number){
        return this.getAt(i).Point2D;
    }

    setAt(i:number, vertex:Vec2|Vec3|number[]){
        let elements = Array.isArray(vertex)?vertex:vertex.elements;
        this.elements[i*3]=elements[0];
        this.elements[(i*3)+1]=elements[1];
        if(elements.length===2){
            this.elements[(i*3)+2]=this._defaultZ;
        }else{
            this.elements[(i*3)+2]=elements[2];
        }
    }


    ApplyMatrix(m:Mat3|Mat4){
        let rval = this.clone();
        if(m instanceof Mat3){
            for(let v=0;v<this.nVerts;v++){
                rval.setAt(v, m.times(this.getAt(v)).Point2D);
            }
        }else{
            for(let v=0;v<this.nVerts;v++){
                rval.setAt(v, m.times(this.getAt(v).Point3DH).Point3D);
            }
        }
        return rval;
    }
}

export class VertexPositionArray3DH extends VertexAttributeArray4D{
    public _defaultH:number=1;
    constructor(elements?:number[])
    constructor(...args:any[]) {
        super(...args);
    }

    static FromThreeJS(attr:THREE.BufferAttribute | THREE.InterleavedBufferAttribute){
        return new this(Array.from(attr.array));
    }

    getAt(i:number){
        return new Vec4(this.elements[i*4], this.elements[(i*4)+1], this.elements[(i*4)+2], this.elements[(i*4)+3]);
    }
    setAt(i:number, vertex:Vec4|Vec3|number[]) {
        let elements = Array.isArray(vertex)?vertex:vertex.elements;
        this.elements[i * 4] = elements[0];
        this.elements[(i * 4) + 1] = elements[1];
        this.elements[(i * 4) + 2] = elements[2];
        if (elements.length === 3) {
            this.elements[(i * 4) + 3] = this._defaultH;
        } else {
            this.elements[(i * 4) + 3] = elements[3];
        }
    }
}


export function VertexAttributeArrayFromThreeJS(threeattribute:THREE.BufferAttribute | THREE.InterleavedBufferAttribute){
    switch (threeattribute.itemSize) {
        case 2:
            return VertexAttributeArray2D.FromThreeJS(threeattribute);
            break;
        case 3:
            return VertexAttributeArray3D.FromThreeJS(threeattribute);
            break;
        case 4:
            return VertexAttributeArray4D.FromThreeJS(threeattribute);
            break;
        default:
            throw new Error("What kind of attribute dis?");
            break;
    }
}
