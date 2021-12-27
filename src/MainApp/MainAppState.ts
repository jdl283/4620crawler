import * as THREE from "three";
import {TexturedMaterialModel} from "./Materials/TexturedMaterialModel";
import {ATexture} from "../anigraph/arender/ATexture";
import {GroundMaterialModel} from "./Materials/GroundMaterialModel";
import {StarterAppState} from "./StarterAppState/StarterAppState";
import {CrawlerAppState} from "./StarterAppState/CrawlerAppState";
import {APointLightModel, ASceneNodeModel, Vec3} from "../anigraph";


export class MainAppState extends CrawlerAppState{
    private startTime = this._time;
    private counter = 0;
    private cameraGap = 5;
    private previousPos = new Vec3();
    private firstTime = true;
    private lockedHeight = 25;
    private flashingCounterLimit = 200;
    private bouncerSpeed = .3;

    public dashMult = 2.0;
    public lastDashTime = 0;
    public dashDuration = 1000;
    public dashCooldown = 5000;


// export class MainAppState extends StarterAppState{
    /**
     * Load any assets you want to use (e.g., custom textures, shaders, etc)
     * @returns {Promise<void>}
     * @constructor
     */
    async PrepAssets(){
        // you can delete or replace setting the textures and shaders below if you don't want to use them.
        let trippyTexture = await ATexture.LoadAsync('./images/trippy.jpeg');
        let marbleTexture = await ATexture.LoadAsync('./images/marble.jpg');
        let wallTexture = await ATexture.LoadAsync('./images/wall.jpg');
        let wallTexture2 = await ATexture.LoadAsync('./images/wall2.jpg');
        let wallTexture3 = await ATexture.LoadAsync('./images/wall3.jpg');
        let wallTexture4 = await ATexture.LoadAsync('./images/wall4.jpg');
        let wallTexture5 = await ATexture.LoadAsync('./images/wall5.jpg');
        let wallTexture6 = await ATexture.LoadAsync('./images/wall6.jpg');
        let wallTexture7 = await ATexture.LoadAsync('./images/wall7.jpg');
        let wallTexture8 = await ATexture.LoadAsync('./images/wall8.jpg');
        let wallTexture9 = await ATexture.LoadAsync('./images/wall9.jpg');
        let wallTexture10 = await ATexture.LoadAsync('./images/wall10.jpg');
        let floorTexture = await ATexture.LoadAsync('./images/floor.jpg');
        let ceilTexture = await ATexture.LoadAsync('./images/ceil.jpg');
        await this.materials.setMaterialModel('wall', new TexturedMaterialModel(wallTexture));
        await this.materials.setMaterialModel('wall2', new TexturedMaterialModel(wallTexture2));
        await this.materials.setMaterialModel('wall3', new TexturedMaterialModel(wallTexture3));
        await this.materials.setMaterialModel('wall4', new TexturedMaterialModel(wallTexture4));
        await this.materials.setMaterialModel('wall5', new TexturedMaterialModel(wallTexture5));
        await this.materials.setMaterialModel('wall6', new TexturedMaterialModel(wallTexture6));
        await this.materials.setMaterialModel('wall7', new TexturedMaterialModel(wallTexture7));
        await this.materials.setMaterialModel('wall8', new TexturedMaterialModel(wallTexture8));
        await this.materials.setMaterialModel('wall9', new TexturedMaterialModel(wallTexture9));
        await this.materials.setMaterialModel('wall10', new TexturedMaterialModel(wallTexture10));
        await this.materials.setMaterialModel('floor', new TexturedMaterialModel(floorTexture));
        await this.materials.setMaterialModel('ceil', new TexturedMaterialModel(ceilTexture));
        await this.materials.setMaterialModel('trippy', new TexturedMaterialModel(trippyTexture));
        await this.materials.setMaterialModel('marble', new TexturedMaterialModel(marbleTexture));
        await this.materials.setMaterialModel('ground', new GroundMaterialModel(marbleTexture));
    }

    /**
     * We will add the custom parameters to the gui controls with leva...
     * @returns {{enemySpeed: {min: number, max: number, step: number, value: number}}}
     */
    getControlPanelStandardSpec(): {} {
        const self = this;
        return {
            ...super.getControlPanelStandardSpec(),
            // other custom app-level specs
        }
    };

    // For debugging, you can customize what happens when you select a model in the SceneGraph view (Menu->Show Scene Graph)
    handleSceneGraphSelection(m:any){
        this.selectionModel.selectModel(m);
        console.log(`Model: ${m.name}: ${m.uid}`)
        console.log(m);
        console.log(`Transform with position:${m.transform.position}\nrotation: ${m.transform.rotation} \nmatrix:\n${m.transform.getMatrix().asPrettyString()}`)
    }

    /**
     * Initialize the scene model
     * @returns {Promise<void>}
     */
    async initSceneModel() {
        // delete this and replace with your own code
        super.initSceneModel()
        // this.initDebug();
    }

    /**
     * Not-so-basic animation loop
     */
    onAnimationFrameCallback() {
        this.counter = this.counter + 1;
        if (this.counter > this.flashingCounterLimit) {
            this.counter = 0;
        }

        // delete this and replace with your own code
        super.onAnimationFrameCallback()
        //console.log(this._time)
        //if (this._time - 1000 > this.startTime) {
        if (CrawlerAppState.orblight != null) {
            if (this.firstTime) {
                this.firstTime = false;
                let initTransform = this.gameCameraNode.transform;
                initTransform.position = new Vec3(50, 25, 50);
                initTransform.rotation.y = 1.5;
                this.gameCameraNode.setTransform(initTransform);
            }
        //if (this. != null) {
            if (this.gameCameraNode != null) {

                if (this._time - this.lastDashTime < this.dashDuration) {
                    let changeVec = this.gameCameraNode.transform.position.minus(this.previousPos);
                    changeVec = changeVec.times(this.dashMult - 1);
                    this.gameCameraNode.transform.position = this.gameCameraNode.transform.position.plus(changeVec);
                    this.gameCameraNode.setTransform(this.gameCameraNode.transform);
                }

                /*let boundObjects = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
                    return (typeof node.getBounds === 'function');
                });*/
                let boundObjects = this.sceneModel.filterNodes((node: ASceneNodeModel) => {
                    return (node.name === 'wall' || node.name == 'finish');
                });

                for (let i = 0; i < CrawlerAppState.bouncers.length; ++i) {
                    let light = CrawlerAppState.bouncers[i];
                    let dir = CrawlerAppState.bouncerMap.get(light);
                    if (dir === 0) {
                        light.transform.position.x = light.transform.position.x + this.bouncerSpeed;
                    }
                    if (dir === 1) {
                        light.transform.position.x = light.transform.position.x - this.bouncerSpeed;
                    }
                    if (dir === 2) {
                        light.transform.position.z = light.transform.position.z + this.bouncerSpeed;
                    }
                    if (dir === 3) {
                        light.transform.position.z = light.transform.position.z - this.bouncerSpeed;
                    }
                    light.setTransform(light.transform);

                    if (this.counter % 5 === 0) {
                        for (let i = 0; i < CrawlerAppState.bouncers.length; ++i) {
                            let light = CrawlerAppState.bouncers[i];
                            if (Math.abs(light.transform.position.x - this.gameCameraNode.transform.position.x) > 100) {
                                continue;
                            }
                            if (Math.abs(light.transform.position.y - this.gameCameraNode.transform.position.y) > 100) {
                                continue;
                            }
                            if (Math.abs(light.transform.position.z - this.gameCameraNode.transform.position.z) > 100) {
                                continue;
                            }
                            let max = CrawlerAppState.bouncers[i].getBounds().maxPoint
                            let min = CrawlerAppState.bouncers[i].getBounds().minPoint

                            let transform = this.gameCameraNode.transform;
                            let pos = transform.position;

                            if (max != null && min != null) {
                                let maxPoint = new Vec3();
                                let minPoint = new Vec3();

                                maxPoint.x = max.x + 0;
                                maxPoint.y = max.y + 0;
                                maxPoint.z = max.z + 0;

                                minPoint.x = min.x + 0;
                                minPoint.y = min.y + 0;
                                minPoint.z = min.z + 0;

                                maxPoint = maxPoint.plus(light.transform.position)
                                minPoint = minPoint.plus(light.transform.position)

                                let lessThan = pos.x < maxPoint.x && pos.y < maxPoint.y && pos.z < maxPoint.z
                                let greaterThan = pos.x > minPoint.x && pos.y > minPoint.y && pos.z > minPoint.z
                                //console.log(maxPoint.x + " " + maxPoint.y + " " + maxPoint.z)
                                //console.log(pos.x + " - " + pos.y + " - " + pos.z + ", " + lessThan + ", " + greaterThan)
                                if (lessThan && greaterThan) {
                                    let initTransform = this.gameCameraNode.transform;
                                    initTransform.position = new Vec3(50, 25, 50);
                                    initTransform.rotation.y = 1.5;
                                    this.gameCameraNode.setTransform(initTransform);                                }
                            }
                        }
                    }

                    //Bounce off walls detection (low priority, so low tick rate)
                    if (this.counter % 50 === 0) {
                        for (let i = 0; i < boundObjects.length; ++i) {
                            let obj = boundObjects[i]
                            if (Math.abs(obj.transform.position.x - light.transform.position.x) > 100) {
                                continue;
                            }
                            if (Math.abs(obj.transform.position.y - light.transform.position.y) > 100) {
                                continue;
                            }
                            if (Math.abs(obj.transform.position.z - light.transform.position.z) > 100) {
                                continue;
                            }
                            let max = boundObjects[i].getBounds().maxPoint
                            let min = boundObjects[i].getBounds().minPoint

                            let transform = light.transform;
                            let pos = transform.position;

                            if (max != null && min != null) {
                                let maxPoint = new Vec3();
                                let minPoint = new Vec3();

                                maxPoint.x = max.x + 0;
                                maxPoint.y = max.y + 0;
                                maxPoint.z = max.z + 0;

                                minPoint.x = min.x + 0;
                                minPoint.y = min.y + 0;
                                minPoint.z = min.z + 0;

                                maxPoint = maxPoint.plus(obj.transform.position)
                                minPoint = minPoint.plus(obj.transform.position)

                                let lessThan = pos.x < maxPoint.x && pos.y < maxPoint.y && pos.z < maxPoint.z
                                let greaterThan = pos.x > minPoint.x && pos.y > minPoint.y && pos.z > minPoint.z
                                //console.log(maxPoint.x + " " + maxPoint.y + " " + maxPoint.z)
                                //console.log(pos.x + " - " + pos.y + " - " + pos.z + ", " + lessThan + ", " + greaterThan)
                                if (lessThan && greaterThan) {
                                    console.log("collided");
                                    let already = false;
                                    if (dir === 0) {
                                        light.transform.position.x = light.transform.position.x - (this.bouncerSpeed * 11);
                                        CrawlerAppState.bouncerMap.set(light, 1);
                                        already = true;
                                    }
                                    if (dir === 1 && !already) {
                                        light.transform.position.x = light.transform.position.x + (this.bouncerSpeed * 11);
                                        CrawlerAppState.bouncerMap.set(light, 0);
                                        already = true;
                                    }
                                    if (dir === 2 && !already) {
                                        light.transform.position.z = light.transform.position.z - (this.bouncerSpeed * 11);
                                        CrawlerAppState.bouncerMap.set(light, 3);
                                        already = true;
                                    }
                                    if (dir === 3 && !already) {
                                        light.transform.position.z = light.transform.position.z + (this.bouncerSpeed * 11);
                                        CrawlerAppState.bouncerMap.set(light, 2);
                                        already = true;
                                    }
                                }
                            }
                        }
                    }
                }

                CrawlerAppState.orblight.intensity = (.5 * Math.abs((this.counter / this.flashingCounterLimit) - .5));
                CrawlerAppState.orblight.orbitRate = 1;
                //console.log(boundObjects.length)
                for (let i = 0; i < boundObjects.length; ++i) {
                    let obj = boundObjects[i]
                    if (Math.abs(obj.transform.position.x - this.gameCameraNode.transform.position.x) > 100) {
                        continue;
                    }
                    if (Math.abs(obj.transform.position.y - this.gameCameraNode.transform.position.y) > 100) {
                        continue;
                    }
                    if (Math.abs(obj.transform.position.z - this.gameCameraNode.transform.position.z) > 100) {
                        continue;
                    }
                    let max = boundObjects[i].getBounds().maxPoint
                    let min = boundObjects[i].getBounds().minPoint

                    let transform = this.gameCameraNode.transform;
                    let pos = transform.position;

                    if (max != null && min != null) {
                        let maxPoint = new Vec3();
                        let minPoint = new Vec3();

                        maxPoint.x = max.x + 0;
                        maxPoint.y = max.y + 0;
                        maxPoint.z = max.z + 0;

                        minPoint.x = min.x + 0;
                        minPoint.y = min.y + 0;
                        minPoint.z = min.z + 0;

                        maxPoint = maxPoint.plus(obj.transform.position)
                        minPoint = minPoint.plus(obj.transform.position)

                        maxPoint = maxPoint.plus(new Vec3(this.cameraGap, this.cameraGap, this.cameraGap));
                        minPoint = minPoint.plus(new Vec3(-this.cameraGap, -this.cameraGap, -this.cameraGap));

                        /*maxPoint.x = maxPoint.x + this.cameraGap;
                        maxPoint.y = maxPoint.y + this.cameraGap;
                        maxPoint.z = maxPoint.z + this.cameraGap;

                        minPoint.x = minPoint.x + this.cameraGap;
                        minPoint.y = minPoint.y + this.cameraGap;
                        minPoint.z = minPoint.z + this.cameraGap;*/

                        let lessThan = pos.x < maxPoint.x && pos.y < maxPoint.y && pos.z < maxPoint.z
                        let greaterThan = pos.x > minPoint.x && pos.y > minPoint.y && pos.z > minPoint.z
                        //console.log(maxPoint.x + " " + maxPoint.y + " " + maxPoint.z)
                        //console.log(pos.x + " - " + pos.y + " - " + pos.z + ", " + lessThan + ", " + greaterThan)
                        if (lessThan && greaterThan) {
                            console.log("inside");
                            if (obj.name === 'finish') {
                                let list = this.sceneModel.getNodeList();
                                for (let i = 0; i < list.length; ++i) {
                                    let thing = list[i];
                                    console.log(thing.name);
                                    if (thing.name === 'ACameraNodeModel') {
                                        /// ?
                                    }
                                    if (thing.name === 'light' || thing.name === 'orblight') {
                                        thing.transform.position.z = 10000;
                                        thing.setTransform(thing.transform);
                                        this.sceneModel.removeNode(thing);
                                    }
                                    if (thing.name === 'wall') {
                                        this.sceneModel.removeNode(thing);
                                    }
                                    if (thing.name === 'finish') {
                                        this.sceneModel.removeNode(thing);
                                    }
                                }

                                this.firstTime = false;
                                let initTransform = this.gameCameraNode.transform;
                                initTransform.position = new Vec3(50, 25, 50);
                                initTransform.rotation.y = 1.5;
                                this.previousPos = initTransform.position;
                                this.gameCameraNode.setTransform(initTransform);

                                this.initExampleScene1();
                            } else {
                                let modTransform = this.gameCameraNode.transform;
                                modTransform.position = this.previousPos;
                                this.gameCameraNode.setTransform(modTransform)
                                let xDiff = 0;
                                let yDiff = 0;
                                let zDiff = 0;

                                let xMax = false;
                                let yMax = false;
                                let zMax = false;
                                transform.position.y = this.lockedHeight;
                                this.gameCameraNode.setTransform(transform);
                            }
                        }
                    }
                }
                /*if (this.gameCameraNode.transform.position.x > 100) {
                    let transform = this.gameCameraNode.transform;
                    transform.position.x = 100;
                    this.gameCameraNode.setTransform(transform);
                }*/
            }
            this.gameCameraNode.transform.position.y = this.lockedHeight;
            this.gameCameraNode.setTransform(this.gameCameraNode.transform);
            this.previousPos = this.gameCameraNode.transform.position;
        }
    }
}
