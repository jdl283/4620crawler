import {AMaterial, ASerializable, BoundingBox3D, Color, NodeTransform3D, V3, VertexArray3D} from "../../../anigraph";
import {ATriangleMeshElement} from "../../../anigraph/arender/basic/ATriangleMeshElement";
import * as THREE from "three";


@ASerializable("Rectangle")
export class Rectangle{
    width:number;
    height:number;
    widthSegments:number;
    heightSegments:number;
    transform:NodeTransform3D;
    constructor(width:number=1, height:number=1, widthSegments:number=5,heightSegments:number=5){
        this.width=width;
        this.height=height;
        this.widthSegments=widthSegments;
        this.heightSegments=heightSegments;
        this.transform = new NodeTransform3D();
    }
    GetGeometry(){
        return VertexArray3D.IndexedGrid(
            this.width,
            this.height,
            this.widthSegments,
            this.heightSegments
        );
    }

    getBounds(){
        let b = new BoundingBox3D();
        b.boundPoint(V3(-this.width*0.5, -this.height*0.5,0))
        b.boundPoint(V3(this.width*0.5, this.height*0.5,0));
        b.transform = this.transform;
        return b;
    }
}

@ASerializable("RectangleElement")
export class RectangleElement extends ATriangleMeshElement{
    rectangle!:Rectangle;
    static CreateRectangle(rectangle:Rectangle,
                        material?: AMaterial
    ){
        let element = new RectangleElement();
        element.rectangle=rectangle;
        element.init(
            element.rectangle.GetGeometry(),
            material?material.threejs:Color.Random()
        );
        element.setTransform(element.rectangle.transform);
        return element;
    }
}
