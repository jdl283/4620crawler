import * as THREE from "three";
import {Color} from "../../amath";
import {VertexArray, VertexArray2D, VertexArray3D} from "../../ageometry";
import {ARenderElement} from "../ARenderElement";
import {ASerializable} from "../../aserial";


@ASerializable("AExtrudedShapeElement")
export class AExtrudedShapeElement extends ARenderElement{
    protected extrudeSettings:{[name:string]:any}={};
    get geometry(){return this._geometry;}

    setExtrudeSettingsDict(settings:{[name:string]:any}){
        this.extrudeSettings = settings;
    }

    setExtrudeSetting(name:string, value:any){
        this.extrudeSettings[name]=value;
    };
    getExtrudeSetting(name:string){
        return this.extrudeSettings[name];
    }

    get extrudeDepth(){
        return this.getExtrudeSetting('depth');
    }
    set extrudeDepth(v:number){
        this.setExtrudeSetting('depth', v);
    }

    constructor(verts?:VertexArray<any>|number[], material?:Color|THREE.Color|THREE.Material){
        super();
        this.extrudeDepth=10;
        this.setExtrudeSetting('steps', 2);
        this.setExtrudeSetting('bevelEnabled', true);
        this.setExtrudeSetting('bevelThickness', 1);
        this.setExtrudeSetting('bevelSize', 1);
        this.setExtrudeSetting('bevelOffset', 0);
        this.setExtrudeSetting('bevelSegments', 1);
        if(verts){
            this.init((verts instanceof VertexArray)?verts:new VertexArray2D(verts), material);
        }
    }

    init(verts?:VertexArray<any>, material?:Color|THREE.Color|THREE.Material|THREE.Material[]) {
        if(verts){
            this.setVerts(verts);
        }
        super.init(undefined, material);
    }


    // init(verts:VertexArray<any>|number[], material?:Color|THREE.Color|THREE.Material){
    //     if(verts){
    //         this.setVerts(verts);
    //     }
    //     this.setMaterial(
    //         new THREE.MeshBasicMaterial({
    //             color: Color.RandomRGBA().asThreeJS(),
    //             side: THREE.DoubleSide,
    //             depthWrite: true
    //         })
    //     );
    //     if(color){
    //         this.setColor(color);
    //     };
    //     if(this._geometry && this._material){
    //         this._mesh = new THREE.Mesh(this._geometry, this._material);
    //         this.threejs.matrixAutoUpdate=false;
    //     }
    // }


    // setMaterial(material:THREE.Material){
    //     // if(this.material !== undefined){
    //     //     this._material.dispose();
    //     // }
    //     this._material = material;
    // }

    setGeometry(geometry :VertexArray3D) {
        super.setGeometry(geometry);
    }

    setVerts2D(verts: VertexArray2D | number[]) {
        this.setVerts(verts);
    }

    setVerts(verts:VertexArray<any>|number[]){
        let geometry:VertexArray2D;
        if(Array.isArray(verts)){
            geometry = new VertexArray2D(verts);
        }else if (verts instanceof VertexArray2D){
            geometry = verts;
        }else{
            throw new Error(`cannot set verts to unsupported type: ${verts}`);
        }
        if(this._geometry){
            this._geometry.dispose();
        }
        let shape = new THREE.Shape();
        if(geometry.length){
            shape.moveTo(geometry.position.elements[0], geometry.position.elements[1]);
            for (let v=1;v<geometry.length;v++){
                let vert =geometry.position.getAt(v);
                shape.lineTo(vert.x, vert.y);
            }
        }

        this._geometry = new THREE.ExtrudeGeometry(shape, this.extrudeSettings);
        if(this._element){
            this._element.geometry = this._geometry;
        }
    }
}
