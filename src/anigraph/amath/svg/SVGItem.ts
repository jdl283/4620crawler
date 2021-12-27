import {Object3DModelWrapper} from "../../ageometry/Object3DModelWrapper";
import {SVGLoader, SVGParsedData} from "../../acomponents/fileloading/svg/SVGLoader";
import {ThreeJSObjectFromParsedSVG} from "../../acomponents/fileloading/svg/SvgToThreeJsObject";
import {Mat3} from "../Mat3";
import {Mat4} from "../Mat4";

export class SVGItem extends Object3DModelWrapper{
    protected svgText: string;
    protected parsedSVG:SVGParsedData;

    constructor(svgText: string) {
        let parsedSVG = SVGItem.ParseSVGText(svgText);
        let refObject3D = ThreeJSObjectFromParsedSVG(parsedSVG);
        super(refObject3D);
        this.svgText = svgText;
        this.parsedSVG = parsedSVG
    }

    get scale(){
        return this.sourceScale;
    }

    setScale(scale:number){
        this.setSourceScale(scale);
        this._setMatrix(Mat4.Scale2D(scale));
    }

    protected _setMatrix(mat:Mat3|Mat4){
        if(mat instanceof Mat3){
            Mat4.From2DMat3(mat).assignTo(this.object.matrix);;
        }else{
            mat.assignTo(this.object.matrix);
        }
    }

    static ParseSVGText(svgText: string) {
        const loader = new SVGLoader();
        const svgParsedData: SVGParsedData = loader.parse(svgText);
        return svgParsedData;
    }

}
