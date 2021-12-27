import {
    SetAppState,
    Base2DAppAppState,
    APointLightModel,
    NodeTransform3D,
    V3,
    Quaternion,
    AMaterialManager,
    Color,
    Vec2,
    ASceneNodeModel,
    ALoadedModel,
    Vec3,
    VertexArray3D,
    ASceneNodeController,
    ASceneController,
    ASceneModel,
} from "../../anigraph";
import * as THREE from "three";
import {TexturedMaterialModel} from "../Materials/TexturedMaterialModel";
import {ATexture} from "../../anigraph/arender/ATexture";
import {ExampleNodeModel} from "../Nodes/Example/ExampleNodeModel";
import {GameSceneController} from "../SceneControllers/GameSceneController";
import {ExampleDragOrbitControls} from "../PlayerControls/ExampleDragOrbitControls";
import {GroundModel} from "../Nodes/Ground/GroundModel";
import {GroundMaterialModel} from "../Materials/GroundMaterialModel";


enum SceneControllerNames{
    MapScene='MapScene',
    GameScene = 'GameScene'
}


export class StarterAppState extends Base2DAppAppState{
    /**
     * We will add the custom parameters to the gui controls with leva...
     * @returns {{enemySpeed: {min: number, max: number, step: number, value: number}}}
     */

        //</editor-fold>
        //##################\\--Example Game Attributes--//##################
    static SceneControllerNames=SceneControllerNames;
    static SetAppState() {
        const newappState = new this();
        SetAppState(newappState);
        return newappState;
    }

    get selectedModel(){
        return this.selectionModel.singleSelectedModel;
    }
    get selectedController():ASceneNodeController<ASceneNodeModel>|ASceneController<ASceneNodeModel, ASceneModel<ASceneNodeModel>>{
        return this.getGameNodeControllerForModel(this.selectedModel)??this.gameSceneController;
    }
    get gameSceneController():GameSceneController{
        return this.sceneControllers[SceneControllerNames.GameScene] as GameSceneController;
    }
    get threejsSceneRoot(){return this.gameSceneController.view.threejs;}
    get threejsCamera(){return this.gameSceneController.view.threeCamera;}
    getGameNodeControllerForModel(model?:ASceneNodeModel):ASceneNodeController<ASceneNodeModel>|undefined{
        if(model) {
            return this.gameSceneController.getNodeControllerForModel(model) as ASceneNodeController<ASceneNodeModel>;
        }
    }
    get mapSceneController(){
        return this.sceneControllers[SceneControllerNames.MapScene];
    }

    get gameCamera(){
        return this.gameSceneController.camera;
    }

    get gameCameraNode(){
        return this.gameSceneController.cameraNode;
    }

    //##################//--Setting up the scene--\\##################
    //<editor-fold desc="Setting up the scene">


    async initDebug(startInGameMode:boolean=false){
        const self = this;
        // add a ground plane

        self._addGroundPlane();
        self._addStartingPointLight();
        let trippyBall = await ExampleNodeModel.CreateDefaultNode(25);
        trippyBall.transform.position = V3(-100, 100,10);
        // see the trippy material for context. it's basically just textured with a colorful pattern
        trippyBall.setMaterial('trippy')
        this.sceneModel.addNode(trippyBall);
        this.gameSceneController.setCurrentInteractionMode(ExampleDragOrbitControls);


        // Pro tip: try pressing 'P' while in orbit mode to print out a camera pose to the console...
        // this will help you set up your camera in your scene...
        this.gameSceneController.camera.setPose(
            new NodeTransform3D(
                V3(2.2623523997293558, -128.47426789504541, 125.05297357609061),
                new Quaternion(-0.48287245789277944, 0.006208070367882366, -0.005940267920390677, 0.8756485382206308)
            )
        )
    }


    async initExampleScene1(){
        const self = this;
        self._addGroundPlane();
        self.currentNewModelTypeName = ExampleNodeModel.SerializationLabel();
        self._addStartingPointLight();
        this.addDragon();

        // add Lucy. We will specify a transform to position and scale her in the scene.
        this.addModelFromFile('./models/ply/binary/Lucy100k.ply', "Lucy",
            new NodeTransform3D(
                V3(100,100,80),
                Quaternion.FromAxisAngle(V3(1,0,0),-Math.PI*0.5).times(Quaternion.FromAxisAngle(V3(0,0,1),-Math.PI*0.5)),
                V3(1,1,1).times(0.1)
            )
        );
    }



    addPointLight(position:Vec3, intensity:number=1, ...args:any[]){
        let pointLight = new APointLightModel();
        this.sceneModel.addNode(pointLight);
        if(position){
            pointLight.transform.position=position;
        }
        pointLight.intensity=intensity;
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

    /**
     * add a ground plane
     * @param wraps - how many times the texture repeats
     * @private
     */
    async _addGroundPlane(wraps:number=4.5) {
        let groundPlane = await GroundModel.CreateDefaultNode();
        groundPlane.name = 'GroundPlane';
        this.sceneModel.addNode(groundPlane);
        groundPlane.transform.position.z = -0.5;
    }

    addTestSquare(sideLength:number=200, position?:Vec2, color?:Color){
        color = color?color:Color.Random();
        let newShape = this.NewNode();
        let verts = VertexArray3D.SquareXYUV(sideLength);
        newShape.color = color;
        newShape.verts = verts;
        newShape.name = "TestSquare";
        this.sceneModel.addNode(newShape);
    }

    async addDragon(transform?:NodeTransform3D, materialName:string='Toon') {
        const self = this;
        await this.loadModelFromURL('./models/ply/dragon_color_onground.ply',
            (obj: THREE.Object3D) => {
                self.modelUploaded('dragon', obj).then((model: ASceneNodeModel) => {
                        let loaded = model as ALoadedModel;
                        loaded.sourceTransform.scale = new Vec3(0.4, 0.4, 0.4)
                        loaded.setMaterial(self.materials.getMaterialModel(materialName).CreateMaterial());
                    }
                );
            });
    }

    async addModelFromFile(path:string, name:string, transform:NodeTransform3D, materialName:string='Toon') {
        const self = this;
        await this.loadModelFromURL(path,
            (obj: THREE.Object3D) => {
                self.modelUploaded(name, obj).then((model: ASceneNodeModel) => {
                        let loaded = model as ALoadedModel;
                        loaded.sourceTransform = transform??new NodeTransform3D();
                        loaded.setMaterial(self.materials.getMaterialModel(materialName).CreateMaterial());
                    }
                );
            });
    }

    // For debugging, you can customize what happens when you select a model in the SceneGraph view (Menu->Show Scene Graph)
    handleSceneGraphSelection(m:any){
        this.selectionModel.selectModel(m);
        console.log(`Model: ${m.name}: ${m.uid}`)
        console.log(m);
        console.log(`Transform with position:${m.transform.position}\nrotation: ${m.transform.rotation} \nmatrix:\n${m.transform.getMatrix().asPrettyString()}`)
    }

    /**
     * Load any assets you want to use (e.g., custom textures, shaders, etc)
     * @returns {Promise<void>}
     * @constructor
     */
    async PrepAssets(){
        let trippyTexture = await ATexture.LoadAsync('./images/trippy.jpeg');
        let marbleTexture = await ATexture.LoadAsync('./images/marble.jpg');
        this.materials.setMaterialModel('trippy', new TexturedMaterialModel(trippyTexture));
        await this.materials.setMaterialModel('marble', new TexturedMaterialModel(marbleTexture));
        await this.materials.setMaterialModel('ground', new GroundMaterialModel(marbleTexture));
    }

    /**
     * Initialize the scene model
     * @returns {Promise<void>}
     */
    async initSceneModel() {
        // Replace the provided examples, which you can use as a starting point/reference
        // this.initExampleScene1();
        // this.initDebug();
    }

    /**
     * Basic animation loop
     */
    onAnimationFrameCallback(){}



    //</editor-fold>
    //##################\\--Customize Here--//##################
}
