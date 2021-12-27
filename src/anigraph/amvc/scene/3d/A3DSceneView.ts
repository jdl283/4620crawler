import * as THREE from "three";
import {ASceneView} from "../ASceneView";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {ASceneNodeModel} from "../../node/base/ASceneNodeModel";
import {ASceneModel} from "../ASceneModel";
import {ASceneController} from "../ASceneController";
import {FlyControls} from "three/examples/jsm/controls/FlyControls";

export class A3DSceneView<NodeModelType extends ASceneNodeModel, SceneModelType extends ASceneModel<NodeModelType>> extends ASceneView<NodeModelType, SceneModelType> {
    public renderer!: THREE.WebGLRenderer;
    public controller!: ASceneController<NodeModelType, SceneModelType>;
    public controls!:any;

    constructor() {
        super()
    }

    initGraphics() {
        super.initGraphics();
        // this.setSkyBoxToSpace();
    }

    CreateView(){return new A3DSceneView();}


    _initLighting() {
    }

    // initRenderer(parameters?: { [name: string]: string }) {
    //     let params = parameters ? parameters : {
    //         antialias: true,
    //         alpha: true
    //     }
    //     this.renderer = new THREE.WebGLRenderer(params);
    //     this.renderer.setPixelRatio(window.devicePixelRatio);
    //     this.renderer.setSize(window.innerWidth, window.innerHeight);
    //     // this.renderer.setSize(this.controller.container.clientWidth, this.controller.container.clientHeight);
    //
    //     this.onWindowResize = this.onWindowResize.bind(this);
    //     // this.getDOMElement().addEventListener("resize", this.onWindowResize)
    //     window.addEventListener("resize", this.onWindowResize)
    //
    // }

    setSkyBoxToSpace(){
        const format = '.jpg';
        let path = './images/cube/MilkyWay/dark-s_';
        const urls = [
            path + 'px' + format, path + 'nx' + format,
            path + 'py' + format, path + 'ny' + format,
            path + 'pz' + format, path + 'nz' + format
        ];
        // const urls = [
        //     path + 'nx' + format, path + 'px' + format,
        //     path + 'ny' + format, path + 'py' + format,
        //     path + 'nz' + format, path + 'pz' + format
        // ];
        const reflectionCube = new THREE.CubeTextureLoader().load( urls );
        reflectionCube.rotation = Math.PI*0.25;
        // refractionCube.mapping = THREE.CubeRefractionMapping;
        this.threejs.background = reflectionCube;
    }

    // initCameraControls(){
    //     // this.initOrbitControls();
    //     // this.initFlyControls();
    //     this.initTrackballControls();
    //     // this.controls = new TrackballControls( this.camera, this.renderer.domElement );
    // }

    initTrackballControls(){
        this.controls = new TrackballControls( this.threeCamera, this.renderer.domElement );
        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;
        this.controls.minDistance = 0.5;
        this.controls.maxDistance = 1000;
        this.controls.keys = [ 'KeyA', 'KeyS', 'KeyD' ];
    }

    // initArcballControls(){
    //     this.controls = new ArcballControls( this.camera, this.renderer.domElement );
    // }

    initOrbitControls(){
        // this.controls = ;
        this.controls = new OrbitControls( this.threeCamera, this.renderer.domElement );
        this.controls.listenToKeyEvents( window ); // optional
        this.controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        this.controls.dampingFactor = 0.05;

        this.controls.screenSpacePanning = true;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 500;

        // this.controls.maxPolarAngle = Math.PI / 2;

    }


}
