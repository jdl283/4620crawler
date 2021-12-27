import {APolygonElement} from "./APolygonElement";
import {Color} from "../../amath";
import {VertexArray2D} from "../../ageometry";


export class AAnchorElement extends APolygonElement{
    GetVerts(...args:any[]):VertexArray2D{
        return VertexArray2D.Anchor(...args);
    }

    constructor(outerRadius:number=15, innerRadius:number=5, color?:Color){
        super();
        this.init(this.GetVerts(outerRadius, innerRadius), color?color:Color.FromString('#444444'));
    }
}





