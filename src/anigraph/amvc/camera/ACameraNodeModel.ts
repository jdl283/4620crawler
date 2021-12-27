import {ASceneNodeModel} from "../node/base/ASceneNodeModel";
import {ACamera, HasCamera} from "./ACamera";
import {AObject, AObjectState} from "../../aobject";
import * as THREE from "three";
import {Color, Mat4, NodeTransform3D, V3, Vec3} from "../../amath";
import {ASerializable} from "../../aserial";
import {VertexArray3D} from "../../ageometry";
import {ACameraNodeView} from "./ACameraNodeView";
import {APerspectiveCamera} from "./APerspectiveCamera";
import {AOrthoCamera} from "./AOrthoCamera";
import {AClock} from "../AClock";

const CAMERA_CLOCK_SUBSCRIPTION:string="CAMERA_CLOCK_SUBSCRIPTION";

@ASerializable("ACameraNodeModel")
export class ACameraNodeModel extends ASceneNodeModel implements HasCamera {
    static DefaultVisualizationImagePlaneDepth:number=30;
    @AObjectState visualizeFrustum: boolean;
    @AObjectState visualizationImagePlaneDepth: number;
    lastTimeUpdate:number=0;

    protected _clock:AClock;
    get clock(){return this._clock;}
    @AObjectState motionInputVector!:Vec3;

    protected _camera!: ACamera;
    get camera() {
        return this._camera;
    }

    get pose(){return this.camera.pose;}
    get projection(){return this.camera.projection;}

    setPose(pose:NodeTransform3D){
        this.camera.pose=pose;
    }
    setProjection(m:Mat4){
        this.camera.projection = m;
    }

    get movementSpeed(){return this.camera.movementSpeed;}
    constructor(camera?: THREE.Camera | ACamera, ...args: any[]) {
        super();
        if (camera instanceof ACamera) this._camera = camera;
        // if (camera instanceof THREE.Camera) this._camera = ACamera.FromThreeJS(camera);
        if (!this.camera) {
            if(camera instanceof APerspectiveCamera || camera instanceof THREE.PerspectiveCamera){
                this._camera = new APerspectiveCamera();
            }else if (camera instanceof AOrthoCamera || camera instanceof THREE.OrthographicCamera){
                this._camera = new AOrthoCamera();
            }else{
                this._camera = new APerspectiveCamera();
            }
        }
        this.motionInputVector = V3();
        this._clock = new AClock();

        this.visualizeFrustum = false;
        const self = this;
        this._setCameraListeners();
        this.color = Color.RandomRGBA();
        this.color.a = 0.5;
        this.subscribe(this.addStateKeyListener('visualizationImagePlaneDepth', ()=>{
            self.verts = VertexArray3D.FrustumFromProjectionMatrix(self.camera.getProjection(), self.visualizationImagePlaneDepth);
        }))
        this.visualizationImagePlaneDepth = ACameraNodeModel.DefaultVisualizationImagePlaneDepth;
        this.addClockListener();
        this.clock.play();

    }

    onTimeUpdate(t:number){
        let dTime = t-this.lastTimeUpdate;
        this.camera.pose.position=this.camera.pose.position.plus(
            this.camera.pose.rotation.Mat3().times(this.motionInputVector).times(this.camera.movementSpeed*dTime)
        );
    }

    addClockListener(){
        const self = this;
        this.subscribe(this.clock.addTimeListener((t:number)=>{
            self.onTimeUpdate(t);
            self.lastTimeUpdate = t;
        }),
            CAMERA_CLOCK_SUBSCRIPTION
        );
    }

    allowMovement(){
        this.clock.play();
    }
    stopMovement(){
        this.clock.pause();
    }

    get transform() {
        return this.camera.getPose();
    }

    setTransform(t: NodeTransform3D) {
        // this will trigger this.transform to update
        this.camera.setPose(t);
    }

    addTransformListener(callback: (self: AObject) => void, handle?:string, synchronous:boolean=true) {
        return this.addCameraPoseListener(callback, handle, synchronous);
    }

    _setCameraListeners() {
        const self = this;
        const POSE_UPDATE_HANDLE = ACamera.CameraUpdateEvents.POSE_UPDATED + '_ACameraNodeModel_' + this.serializationLabel;
        const PROJECTION_UPDATE_HANDLE = ACamera.CameraUpdateEvents.PROJECTION_UPDATED + '_ACameraNodeModel_' + this.serializationLabel;
        this.unsubscribe(POSE_UPDATE_HANDLE, false);
        this.unsubscribe(PROJECTION_UPDATE_HANDLE, false);
        this.subscribe(this.camera.addPoseListener(() => {
                self._transform = this.camera.getPose();
                self.signalEvent(ACamera.CameraUpdateEvents.POSE_UPDATED);
            }),
            POSE_UPDATE_HANDLE
        )
        this.subscribe(this.camera.addProjectionListener(() => {
                self.verts = VertexArray3D.FrustumFromProjectionMatrix(self.camera.getProjection(), self.visualizationImagePlaneDepth);
                self.signalEvent(ACamera.CameraUpdateEvents.PROJECTION_UPDATED);
            }),
            PROJECTION_UPDATE_HANDLE
        );
    }

    signalCameraProjectionUpdate() {
        this.signalEvent(ACamera.CameraUpdateEvents.PROJECTION_UPDATED);
    }

    addCameraProjectionListener(callback: (self: AObject) => void, handle?: string, synchronous:boolean=true) {
        return this.camera.addProjectionListener(callback, handle, synchronous);
        // return this.addEventListener(ACamera.CameraUpdateEvents.PROJECTION_UPDATED, callback, handle);
    }

    signalCameraPoseUpdate() {
        this.signalEvent(ACamera.CameraUpdateEvents.POSE_UPDATED);
    }

    addCameraPoseListener(callback: (self: AObject) => void, handle?: string, synchronous:boolean=true) {
        return this.camera.addPoseListener(callback, handle, synchronous);
        // return this.addEventListener(ACamera.CameraUpdateEvents.POSE_UPDATED, callback, handle);
    }


    static CreatePerspectiveFOV(fovy: number, aspect: number, near?: number, far?: number) {
        let camera = APerspectiveCamera.CreatePerspectiveFOV(fovy, aspect, near, far)
        let cameraModel = new ACameraNodeModel(camera);
        cameraModel.verts = VertexArray3D.FrustumFromProjectionMatrix(cameraModel.camera.getProjection());
        return cameraModel;
    }

    static CreatePerspectiveNearPlane(left: number, right: number, bottom: number, top: number, near?: number, far?: number) {
        let camera = APerspectiveCamera.CreatePerspectiveNearPlane(left, right, bottom, top, near, far)
        let cameraModel = new ACameraNodeModel(camera);
        cameraModel.verts = VertexArray3D.FrustumFromProjectionMatrix(cameraModel.camera.getProjection());
        return cameraModel;
    }

    moveForward(speed?:number){
        let dpos = speed??this.movementSpeed;
        this.motionInputVector.z=-dpos;
    }
    moveBackward(speed?:number){
        let dpos = speed??this.movementSpeed;
        this.motionInputVector.z=dpos;
    }
    moveUp(speed?:number){
        let dpos = speed??this.movementSpeed;
        this.motionInputVector.y=dpos;
    }
    moveDown(speed?:number){
        let dpos = speed??this.movementSpeed;
        this.motionInputVector.y=-dpos;
    }
    moveRight(speed?:number){
        let dpos = speed??this.movementSpeed;
        this.motionInputVector.x=dpos;
    }
    moveLeft(speed?:number){
        let dpos = speed??this.movementSpeed;
        this.motionInputVector.x=-dpos;
    }


    haltForward(){
        this.motionInputVector.z=Math.min(0, this.motionInputVector.z);
    }
    haltBackward(){
        this.motionInputVector.z=Math.max(0, this.motionInputVector.z);
    }
    haltUp(){
        this.motionInputVector.y=Math.max(0, this.motionInputVector.y);
    }
    haltDown(){
        this.motionInputVector.y=Math.min(0, this.motionInputVector.y);
    }
    haltRight(){
        this.motionInputVector.x=Math.max(0, this.motionInputVector.x);
    }
    haltLeft(){
        this.motionInputVector.x=Math.min(0, this.motionInputVector.x);
    }


    get forward(){return this.camera.forward;}
    get right(){return this.camera.right;}
    get up(){return this.camera.up;}

    stepForward(distance?:number){
        let stepSize = distance??this.movementSpeed;
        this.camera.setPosition(this.camera.pose.position.plus(this.forward.times(stepSize)));
    }
    stepBackward(distance?:number){
        let stepSize = distance??this.movementSpeed;
        this.camera.setPosition(this.camera.pose.position.plus(this.forward.times(-stepSize)));
    }
    stepUp(distance?:number){
        let stepSize = distance??this.movementSpeed;
        this.camera.setPosition(this.camera.pose.position.plus(this.up.times(stepSize)));
    }
    stepDown(distance?:number){
        let stepSize = distance??this.movementSpeed;
        this.camera.setPosition(this.camera.pose.position.plus(this.up.times(-stepSize)));
    }
    stepRight(distance?:number){
        let stepSize = distance??this.movementSpeed;
        this.camera.setPosition(this.camera.pose.position.plus(this.right.times(stepSize)));
    }
    stepLeft(distance?:number){
        let stepSize = distance??this.movementSpeed;
        this.camera.setPosition(this.camera.pose.position.plus(this.right.times(-stepSize)));
    }



    getModelGUIControlSpec() {
        const self = this;
        const customSpec = {
            VisDepth: {
                value: self.visualizationImagePlaneDepth,
                min: 1,
                max: 500,
                step: 0.1,
                onChange: (v: any) => {
                    self.visualizationImagePlaneDepth = v;
                }
            },
        }
        return {...super.getModelGUIControlSpec(), ...customSpec}
    }
}
