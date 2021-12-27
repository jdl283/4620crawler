import * as THREE from "three";
import {ARenderElement} from "../ARenderElement";
import {Color, Mat4} from "../../amath";
import {AMaterial} from "../../amvc";
import {MeshBasicMaterial} from "three";
import {ASerializable} from "../../aserial";
import {VertexArray3D} from "../../ageometry";


@ASerializable("ASceneVisElement")
export abstract class ASceneVisElement extends ARenderElement{
    static CreateGeometry(...args:any[]):THREE.BufferGeometry|VertexArray3D{
        return new THREE.SphereGeometry( 100, 10, 10 );

    };
    static CreateMaterial(color?:Color, ...args:any[]):THREE.Material{
        color = color?color:Color.FromString("#dddddd");
        return new THREE.MeshBasicMaterial({
            color: color.asThreeJS(),
            side: THREE.DoubleSide,
            transparent:true,
            opacity: 0.75,
            depthWrite: true,
            wireframe: false,
        });
    }
    constructor(color?:Color, ...args:any[]) {
        super();
        let elementClass = (this.constructor as (typeof ASceneVisElement));
        this.init(elementClass.CreateGeometry(), elementClass.CreateMaterial(color));
    }

    /**
     * Do nothing because we don't want to change the material properties here...
     * @param newMaterial
     * @param args
     */
    onMaterialUpdate(newMaterial:AMaterial, ...args:any[]){
        // console.warn(`Cannot change material properties of ${this.serializationLabel}`)
    }

    /**
     * Do nothing because we don't want to change the material properties here...
     * @param newMaterial
     * @param args
     */
    onMaterialChange(newMaterial:AMaterial, ...args:any[]){
        // console.warn(`Cannot change material properties of ${this.serializationLabel}`)
    }

    setVisScale(scale:number){
        Mat4.Scale3D(scale).assignTo(this.threejs.matrix);
    }

    setColor(color:Color){
        // this.light.color = color.asThreeJS();
        ((this.threejs as THREE.Mesh).material as MeshBasicMaterial).color = color.asThreeJS();
        ((this.threejs as THREE.Mesh).material as MeshBasicMaterial).opacity = color.a;
    }
}
