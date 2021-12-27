import {ARenderElementBase} from "../ARenderElement";
import {Color} from "../../amath";
import {VertexArray} from "../../ageometry";

export abstract class ABasic3DElement extends ARenderElementBase {
    abstract getColor():Color;
    abstract setColor(color: Color | THREE.Color): void;
    abstract setVerts(verts:VertexArray<any>|number[]):void;
    setOpacity(v:number){};
}

