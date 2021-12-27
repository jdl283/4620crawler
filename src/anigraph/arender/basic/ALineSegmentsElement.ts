import {ARenderElement} from "../ARenderElement";
import {Color} from "../../amath";
import {VertexArray, VertexArray2D} from "../../ageometry";
import {LineMaterial} from "three/examples/jsm/lines/LineMaterial";
import {LineSegmentsGeometry} from "three/examples/jsm/lines/LineSegmentsGeometry";
import {LineSegments2} from "three/examples/jsm/lines/LineSegments2";
import * as THREE from "three";
import {AMaterial} from "../../amvc/material/AMaterial";
import {ASerializable} from "../../aserial";


@ASerializable("ALineSegmentsElement")
export class ALineSegmentsElement extends ARenderElement{
    get geometry():LineSegmentsGeometry{
        return this._geometry as LineSegmentsGeometry;
    }

    onMaterialUpdate(newMaterial:AMaterial){
        if(newMaterial.threejs instanceof LineMaterial){
            super.onMaterialUpdate(newMaterial);
        }
    }
    onMaterialChange(newMaterial: AMaterial) {
        if(newMaterial.threejs instanceof LineMaterial){
            super.onMaterialUpdate(newMaterial);
        }
    }

    get threejs():LineSegments2{
        return this._element as LineSegments2;
    }

    get material():LineMaterial{
        return this._material as LineMaterial;
    }

    _createLineGeometry(){
        this._geometry = new LineSegmentsGeometry();
    }

    static Create(verts?:VertexArray<any>, color?:Color, lineWidth:number=0.0075){
        let newElement = new this(verts, color, lineWidth);
        newElement.init();
        return newElement;
    }
    init(){};



    constructor(verts?:VertexArray<any>, color?:Color, lineWidth:number=0.0075){
        super();
        this._createLineGeometry()
        this._material = new LineMaterial();
        this.material.linewidth = lineWidth;
        this.material.side=THREE.DoubleSide;
        this.material.color = color?color.asThreeJS():Color.ThreeJS(0x00ff00);
        if(verts) {
            this.setVerts(verts)
        }
        this._element = new LineSegments2(this.geometry, this.material);
        this.threejs.matrixAutoUpdate=false;
    }

    get color(){return this.material.color;}
    setColor(color:Color){
        this.material.color=color.asThreeJS();
    }

    getColor(){return Color.FromThreeJS(this.color);}

    get lineWidth(){return this.material.linewidth;}
    setLineWidth(lineWidth:number){
        this.material.linewidth=lineWidth;
    }

    setVerts2D(verts:VertexArray<any>|number[]){
        let geometry=verts;
        if(Array.isArray(verts)){
            geometry = new VertexArray2D(verts);
        }

        if(this._geometry){
            this._geometry.dispose();
        }
        this._createLineGeometry();
        this.geometry.setPositions((geometry as VertexArray<any>).position.elements);

        if(this._element){
            this._element.geometry = this._geometry;
        }
    }

}

