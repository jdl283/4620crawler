import {ASceneNodeView} from "../../../node/base/ASceneNodeView";
import {ASceneNodeController} from "../../../node/base/ASceneNodeController";
import {ASpriteModel} from "./ASpriteModel";

export class ASpriteView extends ASceneNodeView<ASpriteModel>{
    // public element!:ASpriteElement;
    public controller!:ASceneNodeController<ASpriteModel>;
    //
    // get model():ASpriteModel{
    //     return (this.controller.model as ASpriteModel);
    // }
    //
    // constructor() {
    //     super();
    //     this.threejs = NewObject3D();
    // }
    //
    // init(){
    //     super.init();
    // }
    //
    // setTexture(texture:ATexture){
    //     this.element.setTexture(texture);
    // }
    //
    // onGeometryUpdate(){
    //     super.onGeometryUpdate();
    //     this.element.setVerts(this.model.verts);
    // }
    //initGraphics() {
    //     //     super.initGraphics();
    //     //     const self = this;
    //     //     const model = self.model;
    //     //     this.element = new ASpriteElement();
    //     //     this.element.init(this.model.verts, this.model.texture);
    //     //     this.addElement(this.element);
    //     //     this.controller.subscribe(
    //     //         this.model.addStateKeyListener('texture', ()=>{
    //     //             self.setTexture(model.texture);
    //     //         })
    //     //     )
    //     // }
    //
}
