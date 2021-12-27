import {button, folder} from "leva";
import * as THREE from "three";
import {
    AObjectState,
    AModel,
    ASceneController,
    ASceneModel,
    ASceneNodeModel,
    ASelectionModel,
    ClassInterface,
    NodeTransform3D,
    V3,
    Vec2,
    Color,
    AMaterialManager,
    APointLightModel,
    A2DPolygonModel, A2DPolygonView,
    ASelection, SelectionEvents,
    AMVCMap, AMVCSpec,
    SceneControllerID,
    AAppState,
    VertexArray2D,
    SetAppState,
    GetAppState, V2, Mat3, ALoadedModel, Quaternion, Vec3, VertexArray3D, AClock
} from "src/anigraph";
import {A2DSceneNodeController, AGroundModel} from "../../amvc/derived/";

interface BasicNodeModelType extends AModel {
    getModelGUIControlSpec(): void;
}

enum CreateModes {
    Polygon = 'Polygon'
}

export abstract class Basic2DAppState<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends AAppState<NodeModelType, SceneModelType> {
    @AObjectState creatingNew!: boolean;
    @AObjectState selectedColor!: Color;
    @AObjectState _isCreatingShape!: boolean;

    appClock!:AClock;
    private _lastFrameTime:number=0;
    _lastFrameInterval:number=0;
    get timeSinceLastFrame(){return this._lastFrameInterval;}

    onAnimationFrameCallback() {
        this._lastFrameInterval=this.appClock.time-this._lastFrameTime;
        this._lastFrameTime = this.appClock.time;
        super.onAnimationFrameCallback();
    }

    init() {
        super.init();
        this.appClock = new AClock();
        this.appClock.play();
    }


    constructor() {
        super();
        this.selectedColor = new Color(0.5, 0.5, 0.5);
        // this.selectedColor = Color.Random();
        this._isCreatingShape = false;

        const self = this;
        this.subscribe(this.addStateKeyListener('_currentNewModelTypeName', () => {
            for (let c in this.sceneControllers) {
                // @ts-ignore
                if (typeof this.sceneControllers[c].updateCreateShapeInteraction == 'function') {
                    // @ts-ignore
                    this.sceneControllers[c].updateCreateShapeInteraction()
                }
            }
        }));
    }

    getControlPanelStandardSpec(): {} {
        const self = this;
        let spec_controller = self._getSpecSceneController();
        let modelTypeSelection = {};
        if (spec_controller) {
            modelTypeSelection = spec_controller.guiModelOptions;
        }
        let materialOptions = self.materials.getGUIMaterialOptionsList();

        return {
            ...super.getControlPanelStandardSpec(),
            selectionControls: folder(
                {
                    freezeSelection: {
                        value: !!(self.selectionModel.isFrozen),
                        onChange: (v: boolean) => {
                            if (v) {
                                self.freezeSelection();
                            } else {
                                self.unfreezeSelection();
                            }
                        }
                    }
                },
                {collapsed: true}
            ),
            creatingNew: {
                value: self._isCreatingShape,
                onChange: (v: boolean) => {
                    self.setIsCreatingShape(v);
                }
            },
            NewModelType: {
                value: self.currentNewModelTypeName,
                options: modelTypeSelection,
                onChange: (v: string) => {
                    self.currentNewModelTypeName = v;
                }
            },
            addDefaultNode: button(() => {
                // @ts-ignore
                self.addDefaultNode();
            }),
            material: {
                value: self.currentMaterialName,
                options: materialOptions,
                onChange: (v: string) => {
                    self.currentMaterialName = v;
                }
            }
        };
    }

    async addDefaultNode(color?: Color, position?: Vec2, ...args: any[]) {
        super.addDefaultNode(this.selectedColor, position, ...args);
    }


    onSelectionChanged(selection: ASelection<NodeModelType>) {
        if (this.selectionModel.nSelectedModels) {
            // @ts-ignore
            this.selectedColor = this.selectedModels[0].color;
        }
        this.triggerGUIUpdate();
    }

    initSelection() {
        this.selectionModel = new ASelectionModel<NodeModelType>();
        this.selectionModel.initSelection();
        let selectionEvents = SelectionEvents;

        //##################//--For testing...--\\##################
        //<editor-fold desc="For testing...">
        if (!selectionEvents) {
            // @ts-ignore
            selectionEvents = (this.selectionModel.constructor).SelectionEvents;
        }
        //</editor-fold>
        //##################\\--For testing...--//##################

        this.subscribe(
            this.selectionModel.addEventListener(selectionEvents.SelectionChanged, (selection: ASelection<NodeModelType>) => {
                this.onSelectionChanged(selection);
            }),
            SelectionEvents.SelectionChanged
        );
        // this.selectionSubscriptionIsActive=false;
        this.selectionSubscriptionIsActive = true;
    }

    setIsCreatingShape(v: boolean) {
        if (v && !this._isCreatingShape) {
            this.selectionModel.selectModel();
            this.setInteractionMode("CreateShape");
            this._isCreatingShape = v;
        } else if (this._isCreatingShape && !v) {
            this.setInteractionMode();
            this._isCreatingShape = v;
            this.unfreezeSelection();
        }
    }
}

class Base2DAppSceneModel extends ASceneModel<ASceneNodeModel> {
    // protected _DefaultNodeClass = Base2DAppNodeModel;
    NewNode() {
        // return new Base2DAppNodeModel();
        return new ((GetAppState() as unknown as Base2DAppAppState).currentNewModelType)();

    }
}

export class Base2DAppAppState extends Basic2DAppState<ASceneNodeModel, ASceneModel<ASceneNodeModel>> {

    NewSceneModel() {
        return new Base2DAppSceneModel();
    }

    static SetAppState() {
        const newappState = new this();
        SetAppState(newappState);
        return newappState;
    }

    _addStartingPointLight() {
        let pointLight = new APointLightModel();
        this.sceneModel.addNode(pointLight);
        pointLight.setTransform(new NodeTransform3D(
            V3(0, 0, 150),
            new Quaternion(),
            V3(1, 1, 1),
            V3(-100, -100, 0)
        ));
        pointLight.orbitRate = 0.1;
        pointLight.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());

        let pointLight2 = new APointLightModel();
        this.sceneModel.addNode(pointLight2);
        pointLight2.setTransform(new NodeTransform3D(V3(0, 0, 300)));
        pointLight2.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());
    }

    _addGroundPlane() {
        let color = Color.FromString('#118811');
        let groundPlane = new AGroundModel();
        this.setNodeMaterial(groundPlane, AMaterialManager.DefaultMaterials.Standard)
        let sz = 600;
        let sq = 0.75;
        let verts = VertexArray3D.SquareXYUV(1000);
        groundPlane.verts = verts;
        groundPlane.color = color;
        groundPlane.name = 'GroundPlane';
        // groundPlane.verts.ApplyMatrix(tform);
        this.sceneModel.addNode(groundPlane);
        groundPlane.transform.position.z = -0.5;
    }

    // _addGroundPlane() {
    //     let color = Color.FromString('#118811');
    //     let groundPlane = new AGroundModel();
    //     this.setNodeMaterial(groundPlane, AMaterialManager.DefaultMaterials.Standard)
    //     let sz = 600;
    //     let sq = 0.75;
    //     let verts = new VertexArray2D();
    //     verts.position.push(V2(-sz, -sz));
    //     verts.position.push(V2(0, -sz * sq));
    //     verts.position.push(V2(sz, -sz));
    //     verts.position.push(V2(sz * sq, 0));
    //     verts.position.push(V2(sz, sz));
    //     verts.position.push(V2(0, sz * sq));
    //     verts.position.push(V2(-sz, sz));
    //     verts.position.push(V2(-sz * sq, 0));
    //     groundPlane.verts = verts;
    //     groundPlane.color = color;
    //
    //     groundPlane.name = 'GroundPlane';
    //     // groundPlane.verts.ApplyMatrix(tform);
    //     this.sceneModel.addNode(groundPlane);
    //     groundPlane.transform.position.z = -0.5;
    // }

    onAnimationFrameCallback(){
        super.onAnimationFrameCallback()
    }

    async initSceneModel() {
        const self = this;
        // await this.loadModelFromURL('./models/ply/ascii/dolphins_colored.ply',
        self._addGroundPlane();
        self.addTestSquare(300);
        self._addStartingPointLight();
        // this.addModelAndLights();
        // await this.loadModelFromURL('./models/ply/sphere.ply',
        // await this.loadModelFromURL('./models/ply/charizard.ply',
    }

    addTestSquare(sideLength:number=50, position?:Vec2, color?:Color){
        color = color?color:Color.Random();
        let newShape = this.NewNode();
        let verts = new VertexArray2D();
        let sz=sideLength*0.5;
        verts.position.push(V2(sz, -sz));
        verts.position.push(V2(-sz, -sz));
        verts.position.push(V2(-sz, sz));
        verts.position.push(V2(sz, sz));
        newShape.color = color;
        newShape.verts = verts;
        newShape.name = "TestSquare";
        this.sceneModel.addNode(newShape);
    }

    async addModelAndLights() {
        const self = this;
        await this.loadModelFromURL('./models/ply/dragon_color_onground.ply',
            (obj: THREE.Object3D) => {
                self.modelUploaded('dragon', obj).then((model: ASceneNodeModel) => {
                        let loaded = model as ALoadedModel;
                        loaded.sourceTransform.scale = new Vec3(0.5, 0.5, 0.5)
                        loaded.setMaterial(self.materials.getMaterialModel('Toon').CreateMaterial());
                        self._addStartingPointLight();
                    }
                );
            });
    }
}



