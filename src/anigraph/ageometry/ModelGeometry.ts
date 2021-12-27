import {BoundingBox2D} from "../amath/BoundingBox2D";
import {VertexArray} from "./VertexArray";
import {BoundingBox3D} from "../amath/BoundingBox3D";
import {v4 as uuidv4} from "uuid";
import {Object3DModelWrapper} from "./Object3DModelWrapper";
import * as THREE from "three";
import {Color} from "../amath/Color";
import {NodeTransform3D} from "../amath/NodeTransform3D";

export interface HasBounds{
    // getBounds2D(cameraMatrix?:Mat4):BoundingBox2D;
    // getBounds3D():BoundingBox3D;
    uid:string;
    getBounds():BoundingBox3D;
}

enum GeometrySetEnum{
    VertsElementName = 'verts'
}

export class GeometrySet implements HasBounds {
    _sourceTransform:NodeTransform3D;
    public members: { [name: string]: HasBounds} = {};
    protected _uid:string;
    get uid(){return this._uid};

    private _updateKey!:string;

    touch(){
        this._updateKey=uuidv4();
    }

    get sourceTransform(){return this._sourceTransform;}
    get sourceScale(){
        // this assumes we don't use non-uniform scales...
        return this._sourceTransform.scale.x;
    }
    set sourceScale(s:number){
        this.sourceTransform.scale=s;
        for(let m in this.members){
            let mo = this.members[m];
            if(mo instanceof Object3DModelWrapper){
                mo.setSourceScale(this.sourceScale);
            }
        }
    }

    setSourceTransform(v:NodeTransform3D){
        this.sourceTransform = v;
    }

    updateTransform(){
        for(let m in this.members){
            let mo = this.members[m];
            if(mo instanceof Object3DModelWrapper){
                mo.sourceTransform= this.sourceTransform;
            }
        }
    }

    set sourceTransform(v:NodeTransform3D){
        this._sourceTransform=v;
        this.updateTransform();
    }

    getMemberList(){
        return Object.values(this.members);
    }

    constructor() {
        this._uid=uuidv4();
        this._sourceTransform = new NodeTransform3D();
    }

    setMember(name:string, element:HasBounds){
        this.members[name]=element;
    }

    addMember(member:HasBounds|THREE.Object3D){
        let element:HasBounds;

        //the member might be geometry only
        if(member instanceof THREE.BufferGeometry) {
            let threemesh = new THREE.Mesh(
                member,
                new THREE.MeshBasicMaterial(
                    {
                        color: Color.RandomRGBA().asThreeJS(),
                        transparent:true,
                        opacity:1,
                        side: THREE.DoubleSide,
                        depthWrite: true
                    }
                )
            );
            element = new Object3DModelWrapper(threemesh);
        }else if(member instanceof THREE.Object3D){
            element = new Object3DModelWrapper(member);
        }else{
            element = member;
        }
        if(this.members[element.uid]!==undefined){
            console.error(`Geometry member with uid ${element.uid} already added!`)
        }
        this.members[element.uid]=element;
    }

    // getBounds2D(cameraMatrix?:Mat4){
    //     let b = new BoundingBox2D();
    //     for (let e in this.members){
    //         b.boundBounds(this.members[e].getBounds2D(cameraMatrix));
    //     }
    //     return b;
    // }

    getBounds(){
        let b = new BoundingBox3D();
        for (let e in this.members){
            let nb = this.members[e].getBounds();
            if(nb instanceof BoundingBox2D){
                nb = BoundingBox3D.FromBoundingBox2D(nb);
            }
            b.boundBounds(nb);
        }
        return b;
    }

    get verts(){
        return this.members[GeometrySetEnum.VertsElementName] as unknown as VertexArray<any>;
    }
    set verts(v:VertexArray<any>){
        // @ts-ignore
        this.members[GeometrySetEnum.VertsElementName]=v;
    }

}

