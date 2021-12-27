import {ARenderGroup} from "../ARenderGroup";
import {SVGItem} from "../../amath/svg/SVGItem";


export class ASVGElement extends ARenderGroup{
    constructor(svgItem:SVGItem) {
        super(svgItem.object.clone());
    }
}
