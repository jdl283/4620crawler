import {AMaterialManager, AObjectState, ASceneNodeModel, Color, NodeTransform3D, Quaternion, V3} from "../../anigraph";
import {DragonNodeModel} from "../Nodes/Dragon/DragonNodeModel";
import {DragonNodeController} from "../Nodes/Dragon/DragonNodeController";
import {EnemyNodeModel} from "../Nodes/Enemy/EnemyNodeModel";
import {ExampleNodeModel} from "../Nodes/Example/ExampleNodeModel";
import {DragonGameControls} from "../PlayerControls/DragonGameControls";
import {ExampleDragOrbitControls} from "../PlayerControls/ExampleDragOrbitControls";
import * as THREE from "three";
import {StarterAppState} from "./StarterAppState";
import {RingNodeModel} from "../Nodes/ExampleProcedureGeometry/RingNodeModel";
import {RingSegment} from "../Nodes/ExampleProcedureGeometry/RingSegment";

export class DragonGameAppState extends StarterAppState{
    /**
     * Enemy's detection range
     * @type {number}
     */
    @AObjectState enemyRange!:number;
    /**
     * Enemy's speed
     * @type {number}
     */
    @AObjectState enemySpeed!:number;

    /**
     * We will control the dragon in our example game
     * @type {DragonNodeModel}
     */
    dragon!:DragonNodeModel;

    /**
     * A convenient getter for accessing the dragon's scene controller in the game view, which we have customized
     * in Nodes/Dragon/DragonNodeController.ts
     * @returns {ASceneNodeController<ASceneNodeModel> | undefined}
     */
    get dragonController():DragonNodeController|undefined{return this.getGameNodeControllerForModel(this.dragon) as DragonNodeController|undefined;}

    // For debugging, you can customize what happens when you select a model in the SceneGraph view (Menu->Show Scene Graph)
    handleSceneGraphSelection(m:any){
        this.selectionModel.selectModel(m);
        console.log(`Model: ${m.name}: ${m.uid}`)
        console.log(m);
        console.log(`Transform with position:${m.transform.position}\nrotation: ${m.transform.rotation} \nmatrix:\n${m.transform.getMatrix().asPrettyString()}`)
    }



    addArmModel(){
        let ringModel = new RingNodeModel();
        let joints = [
            V3(0,0,0),
            V3(0,0,50),
            V3(0,100,100),
            V3(0,-100,150),
        ]
        let radius = 5;
        ringModel.segments = [
            new RingSegment(joints[0], joints[1], radius, [Color.FromString('#ff0000'), Color.FromString('#00ff00')]),
            new RingSegment(joints[1], joints[2], radius, [Color.FromString('#00ff00'), Color.FromString('#0000ff')]),
            new RingSegment(joints[2], joints[3], radius, [Color.FromString('#0000ff'), Color.FromString('#ffffff')]),
        ]
        this.setNodeMaterial(ringModel, 'Toon');
        this.sceneModel.addNode(ringModel);
        return ringModel;
    }

    updateSpinningArms(t:number){
        // lets make arms spin...
        let arms = this.sceneModel.filterNodes((node:ASceneNodeModel)=>{return node instanceof RingNodeModel;}) as RingNodeModel[];
        for (let a of arms){
            let armlen = 25;
            let sa=2;
            let sb = 5;
            let v2=V3(Math.sin(t*sa)*armlen,Math.cos(t*sa)*armlen,50+armlen);
            let v3 = V3(Math.sin(t*sb)*armlen,Math.cos(t*sb)*armlen,0)
                .plus(v2);
            a.segments[1].end=v2;
            a.segments[2].start=v2;
            a.segments[2].end=v3;

        }
    }


    getControlPanelStandardSpec(): {} {
        const self = this;
        return {
            ...super.getControlPanelStandardSpec(),
            enemySpeed:{
                value:self.enemySpeed,
                min:0,
                max:50,
                step:0.1
            }
        }
    };

    async initDragonGame(startInGameMode:boolean=true){
        const self = this;
        this.enemySpeed = 1;
        this.enemyRange = 200;

        // add a ground plane
        self._addGroundPlane();


        let orbitEnemy = new EnemyNodeModel();
        this.sceneModel.addNode(orbitEnemy);
        orbitEnemy.setTransform(new NodeTransform3D(
            V3(0, 0, 150),
            new Quaternion(),
            V3(1, 1, 1),
            V3(-100, -100, 0)
        ));
        orbitEnemy.orbitRate = 0.1;
        orbitEnemy.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());

        let enemy2 = new EnemyNodeModel();
        this.sceneModel.addNode(enemy2);
        enemy2.setTransform(new NodeTransform3D(V3(300, 200, 150)));
        enemy2.setMaterial(this.materials.getMaterialModel(AMaterialManager.DefaultMaterials.Basic).CreateMaterial());

        //Add lucy... so that there is more stuff
        this.addModelFromFile('./models/ply/binary/Lucy100k.ply', "Lucy",
            new NodeTransform3D(
                V3(100,100,80),
                Quaternion.FromAxisAngle(V3(1,0,0),-Math.PI*0.5).times(Quaternion.FromAxisAngle(V3(0,0,1),-Math.PI*0.5)),
                V3(1,1,1).times(0.1)
            )
        );

        //add an example node model
        // the CreateDefaultNode methods are asynchronous in case we want to load assets,
        // this means we should await the promise that they return to use it.
        let trippyBall = await ExampleNodeModel.CreateDefaultNode(25);
        trippyBall.transform.position = V3(-100, 300,10);

        // see the trippy material for context. it's basically just textured with a colorful pattern
        trippyBall.setMaterial('trippy')
        this.sceneModel.addNode(trippyBall);

        // how to add a new node directly to the scene...
        // let newModel = new ExampleNodeModel()
        // let newModel = await ExampleNodeModel.CreateDefaultNode(30);
        // newModel.setMaterial('trippy');
        this.dragon = await DragonNodeModel.CreateDefaultNode();
        this.sceneModel.addNode(this.dragon);
        this.dragon.transform.rotation = Quaternion.RotationZ(-Math.PI*0.5);
        this.dragon.transform.scale=0.25;
        this.dragon.setMaterial('Toon');



        if(startInGameMode) {
            //now let's activate the example third person controls...
            this.gameSceneController.setCurrentInteractionMode(DragonGameControls);
        }else{
            // or orbit controls...
            this.gameSceneController.setCurrentInteractionMode(ExampleDragOrbitControls);
        }


        // Pro tip: try pressing 'P' while in orbit mode to print out a camera pose to the console...
        // this will help you set up your camera in your scene...
        this.gameSceneController.camera.setPose(
            new NodeTransform3D(
                V3(2.2623523997293558, -128.47426789504541, 125.05297357609061),
                new Quaternion(-0.48287245789277944, 0.006208070367882366, -0.005940267920390677, 0.8756485382206308)
            )
        )

        let arm = this.addArmModel();
        arm.transform.position = V3(-200,200,0);

        /***
         * IF YOU WANT A THREEJS PLAYGROUND!
         * You can work directly in threejs using the threejs scene at this.threejsScene, which corresponds to
         * this.gameSceneController.view.threejs
         * You can get the camera with this.threejsCamera
         */
        let threejsRoot = this.threejsSceneRoot;
        const tngeometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 );
        const tnmaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const torusKnot = new THREE.Mesh( tngeometry, tnmaterial );
        // we will put it in the corner...
        torusKnot.position.set(300,300,200);
        threejsRoot.add(torusKnot);
    }

    exampleDragonGameCallback(){
        // You can get the current time, and the amount of time that has passed since
        // the last frame was rendered...
        let currentGameTime = this.appClock.time;
        let timeSinceLastFrame = this.timeSinceLastFrame;

        // let's get all of the enemy nodes...
        let enemies = this.sceneModel.filterNodes((node:ASceneNodeModel)=>{return node instanceof EnemyNodeModel;});
        // let enemies = this.sceneModel.filterNodes((node:ASceneNodeModel)=>{return (typeof node.getBounds === 'function');});

        // Note that you can use the same approach to select any subset of the node models in the scene.
        // You can use this, for example, to get all of the models that you want to detect collistions with

        for(let l of enemies){
            // let's get the vector from an enemy to the dragon...
            let vToDragon = this.dragon.transform.position.minus(l.transform.getObjectSpaceOrigin());

            // if the dragon is within the enemy's detection range then somthin's going down...
            if(vToDragon.L2()<this.enemyRange){
                // if the dragon isn't spinning, then it's vulnerable and the enemy will chase after it on red alert
                if(!this.dragon.isSpinning){
                    l.color = Color.FromString("#ff0000");
                    l.transform.position = l.transform.getObjectSpaceOrigin().plus(vToDragon.getNormalized().times(this.enemySpeed))
                }else {
                    //if the dragon IS spinning, the enemy will turn blue with fear and run away...
                    l.color= Color.FromString("#0000ff");
                    l.transform.position = l.transform.getObjectSpaceOrigin().plus(vToDragon.getNormalized().times(-this.enemySpeed))
                }
                //enemies don't orbit in pursuit...
                l.transform.anchor = V3(0, 0, 0);
            }else{
                //if they don't see the dragon they go neutral...
                l.color = Color.FromString("#ffffff");
            }
        }

        // you can also get time since last frame with this.timeSinceLastFrame
        this.updateSpinningArms(this.appClock.time);

        // Note that you can get the bounding box of any model by calling
        // e.g., for the dragon, this.dragon.getBounds()
        // or for an enemy model enemy.getBounds()

    }

    async initSceneModel(){
        // this will run the dragon game... replace with another init example to start in orbit view.
        let startInDragonMode:boolean=true;
        this.gameSceneController.addControlType(DragonGameControls);
        this.initDragonGame(startInDragonMode);
    }

    /**
     * Basic animation loop
     */
    onAnimationFrameCallback(){
        super.onAnimationFrameCallback()
        if(this.dragon){
            this.exampleDragonGameCallback();
        }
    }

}

