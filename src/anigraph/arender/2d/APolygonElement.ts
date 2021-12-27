import * as THREE from "three";
import {Color} from "../../amath";
import {VertexArray, VertexArray2D} from "../../ageometry";
import {ARenderElement} from "../ARenderElement";
import {AMaterial} from "../../amvc/material/AMaterial";


export class APolygonElement extends ARenderElement{
    constructor(verts?:VertexArray<any>|number[], color?:Color|THREE.Color){
        super();
        if(verts){
            this.init((verts instanceof VertexArray)?verts:new VertexArray2D(verts), color?color:Color.RandomRGBA());
        }
    }

    onMaterialUpdate(newMaterial: AMaterial, ...args:any[]) {
        // @ts-ignore
        // this.material.color = newMaterial.getColor().asThreeJS();
    }
    onMaterialChange(newMaterial: AMaterial, ...args:any[]) {
        // @ts-ignore
        // this.material.color = newMaterial.getColor().asThreeJS();
    }

    init(geometry?:THREE.BufferGeometry|VertexArray<any>, material?:Color|THREE.Color|THREE.Material|THREE.Material[]) {
        super._initIfNotAlready(geometry, material);
    }


    // init(verts:VertexArray<any>|number[], color:Color|THREE.Color){
    //     if(verts){
    //         this.setVerts(verts);
    //     }
    //     this.setMaterial(
    //         // new THREE.MeshBasicMaterial({
    //         //     color: Color.RandomRGBA().asThreeJS(),
    //         //     side: THREE.DoubleSide,
    //         //     depthWrite: false
    //         // })
    //         new THREE.MeshBasicMaterial({
    //             color: Color.RandomRGBA().asThreeJS(),
    //             transparent:true,
    //             opacity:1,
    //             side: THREE.DoubleSide,
    //             depthWrite: true
    //         })
    //     );
    //     if(color){
    //         this.setColor(color);
    //     };
    //     if(this._geometry && this._material){
    //         this._element = new THREE.Mesh(this._geometry, this._material);
    //         this.threejs.matrixAutoUpdate=false;
    //     }
    // }



    // setMaterial(material:THREE.MeshBasicMaterial){
    //     if(this._material !== undefined){
    //         this._material.dispose();
    //     }
    //     this._material = material;
    // }

    // setColor(color:Color|THREE.Color){
    //     if(color instanceof Color){
    //         this._material.color.set(color.asThreeJS());
    //     }else if(color instanceof THREE.Color){
    //         this._material.color.set(color);
    //     }else{
    //         throw new Error(`invalid color ${color}`);
    //     }
    // }
    //
    // setOpacity(alpha:number) {
    //     this._material.opacity=alpha;
    // }
    //
    // getColor(){
    //     return Color.FromThreeJS(this.material.color);
    // }

    setVerts2D(verts:VertexArray2D|number[]){
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
        this._geometry = new THREE.ShapeGeometry(shape);
        if(this._element){
            this._element.geometry = this._geometry;
        }
    }

    // setGeometry(geometry:THREE.ShapeGeometry|VertexArray<any>){
    //     if(geometry instanceof VertexArray){
    //         this.setVerts(geometry);
    //     }else{
    //         this._geometry=geometry;
    //         if(this._element){
    //             this._element.geometry = this._geometry;
    //         }
    //     }
    //
    // }
}
