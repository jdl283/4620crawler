import * as THREE from "three";
import {ASerializable} from "../../../aserial";
import {AniGraphEnums} from "../../../basictypes";
import {BoundingBox2D, Color, Mat4, V2, V3} from "../../../amath";
import {AAnchorElement, AHandleElement, ALineElement} from "../../../arender";
import {ASelectionModel, ASelectionView} from "../index";
import {A2DSelectionController} from "./A2DSelectionController";
import {ASceneNodeModel} from "../../node";

@ASerializable("A2DSelectionView")
export class A2DSelectionView<NodeModelType extends ASceneNodeModel> extends ASelectionView<NodeModelType, ASelectionModel<NodeModelType>>{
    public handles:AHandleElement[]=[];
    public anchorElement!:AAnchorElement;
    public boundary!:ALineElement;
    public controller!:A2DSelectionController<NodeModelType>;
    static HandleColor = Color.FromString('#b7b7b7');
    static HandleSize = 5;
    static LineWidth = 0.0025;
    // static LineDash = true;

    get model():ASelectionModel<NodeModelType>{
        return this.controller.model;
    }

    constructor() {
        super();
        // fonna let this one slide cause we're just using it for offset in z
        this.threejs = new THREE.Object3D();
        this.threejs.name = this.serializationLabel;
        this.threejs.matrixAutoUpdate=false;
        this.showSelectionBox = true;
    }

    setHUDTransform(m:Mat4){
        m.assignTo(this.threejs.matrix);
    }

    init(){
        super.init();
    }

    onGeometryUpdate(){
        let selectedModels = this.model.selectedModels;
        if(!selectedModels.length){
            this.threejs.visible = false;
            return;
        }else{
            this.threejs.visible = true;
        }


        let singleSelectedModel = this.model.singleSelectedModel;
        if(!singleSelectedModel) {
            this.anchorElement.visible = false;
        }else{
            let bboxtransform = singleSelectedModel.getWorldTransform();
            this.anchorElement.visible = true;
            this.anchorElement.setTransform(Mat4.Translation2D(bboxtransform.position));
        }
        let corners = this.model.bounds.corners;
        this.boundary.setVerts(this.model.bounds.GetBoundaryLinesVertexArray2D());
        this.handles[0].setTransform(Mat4.Translation2D(corners[0]));
        this.handles[0].threejs.name="Handle0";
        this.handles[1].setTransform(Mat4.Translation2D(corners[1]))
        this.handles[1].threejs.name="Handle1";
        this.handles[2].setTransform(Mat4.Translation2D(corners[2]))
        this.handles[2].threejs.name="Handle2";
        this.handles[3].setTransform(Mat4.Translation2D(corners[3]))
        this.handles[3].threejs.name="Handle3";

        this.handles[0].threejs.userData[AniGraphEnums.OccludesInteractions]=true;
        this.handles[1].threejs.userData[AniGraphEnums.OccludesInteractions]=true;
        this.handles[2].threejs.userData[AniGraphEnums.OccludesInteractions]=true;
        this.handles[3].threejs.userData[AniGraphEnums.OccludesInteractions]=true;
        this.setHUDTransform(this.sceneController.camera.getHUDTransform());
    }

    initGraphics() {
        super.initGraphics();
        const self = this;
        const model = self.model;

        let t = this.sceneView.camera.getWorldSpaceProjectionOnNearPlane(V3());
        Mat4.Translation3D(t).assignTo(this.threejs.matrix);

        // this.boundary = new ALineElement(VertexArray2D.BoxLinesVArray());
        this.boundary = new ALineElement(BoundingBox2D.FromVec2s([V2(), V2(1,1)]).GetBoundaryLinesVertexArray());
        this.boundary.material.linewidth = A2DSelectionView.LineWidth;
        this.boundary.material.color = Color.ThreeJS('#777777');
        this.addElement(this.boundary);

        this.anchorElement = new AAnchorElement();
        this.anchorElement.threejs.userData['AniGraphType']='AAnchorElement';
        this.addElement(this.anchorElement);

        for(let h=0;h<4;h++){
            let handle = new AHandleElement(this.model.handleSize, A2DSelectionView.HandleColor);
            handle.init();
            handle.threejs.userData['handleID'] = h;
            this.handles.push(handle);
            this.addElement(handle);
        }

        this.subscribe(this.model.addStateKeyListener('bounds', ()=>{
            self.onGeometryUpdate();
        }));
        this.subscribe(this.addStateKeyListener('showSelectionBox', ()=>{
            self._updateShowSelectionBox();
        }))
        this._updateShowSelectionBox();
        this.threejs.visible=false;
    }

    _updateShowSelectionBox(v?:boolean){
        if(v!==undefined){
            this.showSelectionBox = v;
        }
        this.boundary.visible=this.showSelectionBox;
        for(let h of this.handles){
            h.visible=this.showSelectionBox;
        }
    }
}
