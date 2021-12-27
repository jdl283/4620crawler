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
    ASceneModel, BoundingBox3D,
} from "../../anigraph";
import * as THREE from "three";
import {TexturedMaterialModel} from "../Materials/TexturedMaterialModel";
import {ATexture} from "../../anigraph/arender/ATexture";
import {ExampleNodeModel} from "../Nodes/Example/ExampleNodeModel";
import {GameSceneController} from "../SceneControllers/GameSceneController";
import {GroundModel} from "../Nodes/Ground/GroundModel";
import {GroundMaterialModel} from "../Materials/GroundMaterialModel";
import { Maze } from "../Maze/Maze";
import {CrawlerPlayerControls} from "../PlayerControls/CrawlerPlayerControls";


enum SceneControllerNames{
    MapScene='MapScene',
    GameScene = 'GameScene'
}


export class CrawlerAppState extends Base2DAppAppState{
    /**
     * We will add the custom parameters to the gui controls with leva...
     * @returns {{enemySpeed: {min: number, max: number, step: number, value: number}}}
     */

    //</editor-fold>
    //##################\\--Example Game Attributes--//##################
    static SceneControllerNames=SceneControllerNames;
    private mapDim = 20;
    private finishCoords = new Vec3();
    static orblight:APointLightModel;
    static bouncers: APointLightModel[] = [];
    static bouncerMap = new Map();

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
        this.gameSceneController.setCurrentInteractionMode(CrawlerPlayerControls);


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
        //self._addGroundPlane();

        let m = new Maze(this.mapDim,this.mapDim);
        let groundCenter = m.cells.length / 2 * 50;

        let groundNode = new GroundModel();
        groundNode.name = 'GroundPlane';
        groundNode.transform.rotation.x = 1;
        groundNode.transform.position.y = 0;
        groundNode.transform.position.z = groundCenter;
        groundNode.transform.position.x = groundCenter;
        groundNode.setMaterial('floor');
        groundNode.setTransform(groundNode.transform);
        this.sceneModel.addNode(groundNode);

        this.gameSceneController.setCurrentInteractionMode(CrawlerPlayerControls);

        let ceilNode = new GroundModel();
        ceilNode.name = 'GroundPlane';
        ceilNode.transform.rotation.x = 1;
        ceilNode.transform.position.y = 50;
        ceilNode.transform.position.z = groundCenter;
        ceilNode.transform.position.x = groundCenter;
        ceilNode.setMaterial('ceil');
        ceilNode.setTransform(ceilNode.transform);
        this.sceneModel.addNode(ceilNode);
        //self.addPointLight(V3(groundCenter, 60, groundCenter), 0.01);

        self.currentNewModelTypeName = ExampleNodeModel.SerializationLabel();
        //self._addStartingPointLight();
        //self.addPointLight(V3(0, 0, 300));

        //let leveltype = 2;

        let leveltype:number;
        let levelChooser = Math.random();

        if(levelChooser > 0.66){
            leveltype = 3;
        }
        else if(levelChooser > 0.33){
            leveltype = 2;
        }
        else{
            leveltype = 1;
        }


        //console.log(m.furthestPos);


        for(let i = 0; i<m.cells.length; i++){
            for(let j = 0; j<m.cells[0].length; j++) {
                if(i === m.furthestPos[0] && j === m.furthestPos[1]){
                    let trippyBall = await ExampleNodeModel.CreateDefaultNode(10);
                    trippyBall.transform.position = V3(i*50, 25 ,j*50);
                    trippyBall.name = 'finish';

                    trippyBall.setMaterial('trippy')
                    this.sceneModel.addNode(trippyBall);
                    this.finishCoords = trippyBall.getWorldPosition();
                    CrawlerAppState.orblight = new APointLightModel();
                    this.sceneModel.addNode(CrawlerAppState.orblight);
                    CrawlerAppState.orblight.name = 'orblight';
                    CrawlerAppState.orblight.color = Color.FromRGBA(1,1,1);
                    CrawlerAppState.orblight.transform.position=V3(i*50, 25 ,j*50);
                    CrawlerAppState.orblight.intensity=.5;
                    console.log("placed exit");
                }
                else if(m.cells[i][j].isWall === 1) {
                    let wall = await ExampleNodeModel.CreateCubeNode(50, 50, 50);
                    wall.transform.position = V3(i*50, 25, j*50);
                    wall.color.a = 0;
                    wall.name = 'wall';

                    if(leveltype === 1){
                        if(Math.random() > 0.9){
                            wall.setMaterial('wall3');
                        }
                        else if(Math.random() > 0.6){
                            wall.setMaterial('wall2');
                        }
                        else{
                            wall.setMaterial('wall');
                        }

                    }
                    else if(leveltype === 2){
                        if(Math.random() > 0.95){
                            wall.setMaterial('wall6');
                        }
                        else if(Math.random() > 0.88){
                            wall.setMaterial('wall5');
                        }
                        else{
                            wall.setMaterial('wall4');
                        }
                    }
                    else if(leveltype === 3){
                        if(Math.random() > 0.9){
                            wall.setMaterial('wall10');
                        }
                        else if(Math.random() > 0.8){
                            wall.setMaterial('wall9');
                        }
                        else{
                            if(Math.random() > 0.5){
                                wall.setMaterial('wall8');
                            }
                            else{
                                wall.setMaterial('wall7');
                            }
                        }
                    }

                    this.sceneModel.addNode(wall);
                }
                else if(Math.random() > 0.96) {
                    if (leveltype === 1) {
                        self.addPointLight(V3(i * 50, 60, j * 50), 0.1, Color.FromRGBA([1, .6, 0]), 'light');
                    }
                    if (leveltype === 2) {
                        self.addPointLight(V3(i * 50, 60, j * 50), 0.1, Color.FromRGBA([1, 1, 0]), 'light');
                    }
                    if (leveltype === 3) {
                        self.addPointLight(V3(i * 50, 60, j * 50), 0.1, Color.FromRGBA([0, 0, 1]),'light');
                    }
                }
                else if (Math.random() > .9) {
                    let pointLight = new APointLightModel();
                    this.sceneModel.addNode(pointLight);
                    CrawlerAppState.bouncers.push(pointLight);
                    let rand = Math.random();
                    if (rand <= .25) {CrawlerAppState.bouncerMap.set(pointLight, 0)}
                    if (rand > .25 && rand <= .5) {CrawlerAppState.bouncerMap.set(pointLight, 1)}
                    if (rand > .5 && rand <= .75) {CrawlerAppState.bouncerMap.set(pointLight, 2)}
                    if (rand > .75) {CrawlerAppState.bouncerMap.set(pointLight, 3)}

                    pointLight.name = 'bouncer';
                    pointLight.color = Color.FromRGBA([1, 0, 0]);
                    pointLight.transform.position = V3(i * 50, 25, j * 50);
                    pointLight.transform.scale = .2
                    pointLight.orbitRate = 2;
                    pointLight.setTransform(pointLight.transform);
                    pointLight.intensity=.05;
                }
            }
        }


        //m.printMaze();
        //this.addDragon();

        // add Lucy. We will specify a transform to position and scale her in the scene.
        // this.addModelFromFile('./models/ply/binary/Lucy100k.ply', "Lucy",
        //     new NodeTransform3D(
        //         V3(100,100,80),
        //         Quaternion.FromAxisAngle(V3(1,0,0),-Math.PI*0.5).times(Quaternion.FromAxisAngle(V3(0,0,1),-Math.PI*0.5)),
        //         V3(1,1,1).times(0.1)
        //     )
        // );

        // this.addModelFromFile('./models/wall.ply', "Wall",
        //     new NodeTransform3D(
        //         V3(100,100,80),
        //         Quaternion.FromAxisAngle(V3(1,0,0),-Math.PI*0.5).times(Quaternion.FromAxisAngle(V3(0,0,1),-Math.PI*0.5)),
        //         V3(1,1,1).times(0.1)
        //     )
        // );
    }

    addPointLight(position:Vec3, intensity:number=1, c:Color, name:string, ...args:any[]){
        let pointLight = new APointLightModel();
        this.sceneModel.addNode(pointLight);
        pointLight.name = name;
        pointLight.color = c;
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

        let groundPlane2 = await GroundModel.CreateDefaultNode();
        groundPlane2.name = 'GroundPlane';
        this.sceneModel.addNode(groundPlane2);
        groundPlane2.transform.position.z = 10;
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
        let wallTexture = await ATexture.LoadAsync('./images/wall.jpg');
        await this.materials.setMaterialModel('wall', new TexturedMaterialModel(wallTexture));
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
        this.initExampleScene1();
        // this.initDebug();
    }

    /**
     * Basic animation loop
     */
    onAnimationFrameCallback(){}



    //</editor-fold>
    //##################\\--Customize Here--//##################
}


