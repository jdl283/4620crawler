import {AMaterial, BoundingBox3D, NodeTransform3D, V3, VertexArray3D} from "../../../anigraph";
import {ATriangleMeshElement} from "../../../anigraph/arender/basic/ATriangleMeshElement";
import * as THREE from "three";


export class Sphere {
    radius:number;
    transform:NodeTransform3D;
    constructor(radius:number=10, transform?:NodeTransform3D) {
        this.radius = radius;
        this.transform = transform??new NodeTransform3D();
    }

    getBounds(){
        let b = new BoundingBox3D();
        b.boundPoint(V3(this.radius, this.radius, this.radius));
        b.boundPoint(V3(-this.radius, -this.radius, -this.radius));
        b.transform = this.transform;
        return b;
    }
}

export class SphereElement extends ATriangleMeshElement{
    sphere!:Sphere;
    static CreateSphere(sphere:Sphere,
                        material:AMaterial,
                        widthSegments?: number,
                        heightSegments?: number,
                        phiStart?: number,
                        phiLength?: number,
                        thetaStart?: number,
                        thetaLength?: number,
    ){
        let element = new SphereElement();
        element.sphere = sphere;
        let geometry = VertexArray3D.FromThreeJS(
            new THREE.SphereBufferGeometry(element.sphere.radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength
        ));
        element.init(geometry, material.threejs);
        element.setTransform(element.sphere.transform);
        return element;
    }
}
