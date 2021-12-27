import {AModel} from "../base/AModel";
import {ASceneNodeModel} from "../node/base/ASceneNodeModel";
import {AAppState, GetAppState} from "../AAppState";
import {ASerializable} from "src/anigraph/aserial";
import {AObjectNode, AObjectState} from "../../aobject";
import {Color, Mat3, V2, Vec2} from "../../amath";
import {VertexArray2D} from "../../ageometry";
import {AAmbientLightModel} from "../node/lights/AAmbientLightModel";
import {AMaterialManager} from "../material/AMaterialManager";

// import {ACameraNodeModel} from "../camera/ACameraNodeModel";

export enum SceneEvents{
    NodeAdded="NodeAdded",
    NodeRemoved="NodeRemoved",
    NodeMoved="NodeMoved",
}

@ASerializable("ASceneModel")
export abstract class ASceneModel<NodeModelType extends ASceneNodeModel> extends AModel{
    @AObjectState ambientLight!:AAmbientLightModel;
    abstract NewNode():NodeModelType;
    public appState!:AAppState<NodeModelType, ASceneModel<NodeModelType>>;
    // public lighting:!ASceneLighting;
    public materials:AMaterialManager;

    addNode(newNode:ASceneNodeModel, parent?:ASceneNodeModel, position?:number){
        if(!newNode.material){
            GetAppState().setNodeMaterial(newNode);
        }
        let newparent = parent?parent:this;
        newparent.addChild(newNode, position);
        const self = this;
        this.signalNodeAdded(newNode);
        newNode.mapOverDescendants((c:AObjectNode)=>{
            self.signalNodeAdded(c as ASceneNodeModel);
            GetAppState().triggerGUIUpdate();
        });
    }

    removeNode(node:ASceneNodeModel){
        node._removeFromParent()
        node.dispose();
        this.signalNodeRemoved(node);
    }

    constructor(name?:string) {
        super(name);
        this.materials = new AMaterialManager();
        // this.lighting= new ASceneLighting();
    }

    getNodeList(){
        return this.getDescendantList() as ASceneNodeModel[];
    }

    filterNodes(fn:(child:ASceneNodeModel, index?:number, array?:ASceneNodeModel[])=>boolean){
        return this.getNodeList().filter(fn);
    }

    // getLightNodes(){
    //     return this.filterNodes((node:ASceneNodeModel)=>{return (node instanceof ALightModel);})
    // }
    // getCameraNodes(){
    //     return this.filterNodes((node:ASceneNodeModel)=>{return (node instanceof ACameraNodeModel);})
    // }

    CreateTestModel(position?:Vec2, color?:Color){
        position = position?position:V2();
        color = color?color:Color.FromString('#55aa55');
        let newShape = this.NewNode();
        let sz = 25;
        let sq=0.5;
        let tform = Mat3.Translation2D(position).times(Mat3.Rotation(Math.PI/3)).times(Mat3.Translation2D(sz*3, sz*2));
        let verts = new VertexArray2D();
        verts.position.push(V2(-sz, -sz));
        verts.position.push(V2(0,-sz*sq));
        verts.position.push(V2(sz, -sz));
        verts.position.push(V2(sz*sq, 0));
        verts.position.push(V2(sz, sz));
        verts.position.push(V2(-sz, sz));
        newShape.color = color;
        newShape.verts.ApplyMatrix(tform);
        // newShape.recenterAnchor();
        // newShape.verts = verts;
        // this.sceneController.model.addNode(newShape);
        return newShape;
    }



    signalNodeAdded(model:ASceneNodeModel){
        this.signalEvent(SceneEvents.NodeAdded, model);
    };

    signalNodeRemoved(model:ASceneNodeModel){
        this.signalEvent(SceneEvents.NodeRemoved, model);
    };

    signalNodeMoved(model:ASceneNodeModel){
        this.signalEvent(SceneEvents.NodeMoved, model);
    }

    getSceneModelControlSpec(){
        let self = this;
        return {
            Name: {
                value: self.name,
                onChange: (v: string) => {
                    self.name = v;
                }
            },
        }
    }

}





