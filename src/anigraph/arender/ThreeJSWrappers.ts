import * as THREE from "three";


export function NewObject3D(){
    let rnode = new THREE.Object3D();
    rnode.matrixAutoUpdate=false;
    return rnode;
}
