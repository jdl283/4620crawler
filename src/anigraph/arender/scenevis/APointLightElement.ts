import * as THREE from "three";
import {Color, Mat4} from "../../amath";
import {ASerializable} from "../../aserial";
import {ASceneVisElement} from "./ASceneVisElement";
import {AniGraphEnums} from "../../basictypes";

@ASerializable("APointLightElement")
export class APointLightElement extends ASceneVisElement{
    static CreateGeometry():THREE.BufferGeometry{
        return new THREE.SphereGeometry( AniGraphEnums.LightBoxSize*0.5, 10, 10 );

    };
    static CreateMaterial(color?:Color):THREE.Material{
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
}
