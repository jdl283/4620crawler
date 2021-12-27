//##################//--node transform possible parent class--\\##################
// <editor-fold desc="node transform possibel parent class">
import {Mat4, Matrix, TransformationInterface, Vector} from './index'


abstract class NodeTransform<VType extends Vector,MType extends Matrix> implements TransformationInterface{
    position!:VType;
    anchor!:VType;
    scale!:VType|number;
    rotation!:any;

    abstract getMatrix():MType;
    abstract getMat4():Mat4;
    abstract setWithMatrix(m:MType, position?:VType, rotation?:any):void;
    abstract NodeTransform3D(mat:Mat4):any;
    abstract NodeTransform2D():any;

}
export {NodeTransform};

//</editor-fold>
//##################\\--node transform possible parent class--//##################
