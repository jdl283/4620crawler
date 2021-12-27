import {APolygonElement} from "./APolygonElement";
import {Color} from "src/anigraph/index";
import {VertexArray2D} from "../../ageometry";

export class AHandleElement extends APolygonElement{
    public index:number=-1;
    constructor(size:number=10, color?:Color){
        super(VertexArray2D.CircleVArray(size), color?color:Color.RandomRGBA());
    }
}
