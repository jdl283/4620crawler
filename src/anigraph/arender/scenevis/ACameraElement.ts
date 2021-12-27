import {ARenderElement} from "../ARenderElement";
import {ASerializable} from "../../aserial";
import {ARenderObject} from "../ARenderObject";
import * as THREE from "three";
import {ACamera, ALightModel, AMaterial} from "../../amvc";
import {Color, Mat4} from "../../amath";
import {MeshBasicMaterial} from "three";
import {ASceneVisElement} from "./ASceneVisElement";
import {VertexArray3D} from "../../ageometry";


@ASerializable("ACameraElement")
export abstract class ACameraElement extends ASceneVisElement{
    static CreateGeometry(camera:ACamera, ...args:any[]):THREE.BufferGeometry|VertexArray3D{
        return VertexArray3D.FrustumFromProjectionMatrix(camera.getProjection());
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
}
