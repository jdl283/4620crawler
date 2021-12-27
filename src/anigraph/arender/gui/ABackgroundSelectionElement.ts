import * as THREE from "three";
import {Color, Mat4, Vec4} from "../../amath";
import {VertexArray3D} from "../../ageometry";
import {ATriangleMeshElement} from "../basic/ATriangleMeshElement";


export class ABackgroundSelectionElement extends ATriangleMeshElement{
    init(verts?: VertexArray3D, material?:Color|THREE.Color|THREE.Material|THREE.Material[]) {
        verts = verts?verts:VertexArray3D.SquareXYUV(2.0);
        super.init(verts, material?material:this._createDefaultMaterial());
    }


    _createDefaultMaterial(){
        return new THREE.MeshBasicMaterial({
            color: 0x22aa22,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 0.0
        })
    }

    setOpacity(alpha:number) {
        // @ts-ignore
        this._element.material.opacity=alpha;
    }


    /**
     *
     * @param camera
     * @param bg_offset percent away from extrema of frustum to put plane
     * @private
     */
    public setToNearPlane(camera:THREE.Camera, bg_offset:number=0.001){
        let planeMatrix= this._getNearPlaneMatrix(camera);
        let bgmat = planeMatrix.clone();
        let neworigin =bgmat.c3.plus(bgmat.c2.times(bg_offset));
        bgmat.c2=new Vec4(0.0,0.0, 1.0, 0.0);
        bgmat.c3=neworigin;
        this.setTransform(bgmat);
    }
    public setToFarPlane(camera:THREE.Camera, bg_offset:number=0.001){
        let planeMatrix= this._getFarPlaneMatrix(camera)
        let bgmat = planeMatrix.clone();
        let neworigin =bgmat.c3.minus(bgmat.c2.times(bg_offset));
        bgmat.c2=new Vec4(0.0,0.0, 1.0, 0.0);
        bgmat.c3=neworigin;
        this.setTransform(bgmat);
    }


    /**
     * gets a matrix with:
     * x column: the vector from the left of the near plane to the right of the near plane in world coords
     * y column: the vector from the bottom of the near plane to the top of the near plane in world coords
     * z column: the vector from the near to the far plane in world coords
     * w column: the location of the middle of the near plane
     */
    _getNearPlaneMatrix(camera:THREE.Camera){
        let camPVMI = Mat4.FromThreeJS(camera.projectionMatrix)
            .times(Mat4.FromThreeJS(camera.matrixWorldInverse))
            .getInverse();

        let maxMat = Mat4.Identity();
        // set depth of x and y columns to near plane
        maxMat.r2=new Vec4(-1,-1,1,0);
        // set homogeneous coords of columns to 1
        maxMat.r3=new Vec4(1,1,1,1);

        maxMat = camPVMI.times(maxMat);
        let minMat = Mat4.Scale3D(-1);
        // set depth of x y and z to near plane
        minMat.r2=new Vec4(-1,-1,-1,-1);
        // set homogeneous coords of columns to 1
        minMat.r3 = new Vec4(1,1,1,1);
        minMat = camPVMI.times(minMat);

        let rmat = new Mat4();
        rmat.c0=maxMat.c0.getHomogenized().minus(minMat.c0.getHomogenized());
        rmat.c1=maxMat.c1.getHomogenized().minus(minMat.c1.getHomogenized());
        rmat.c2=maxMat.c2.getHomogenized().minus(minMat.c2.getHomogenized());
        rmat.c3 = minMat.c3.getHomogenized();
        return rmat;
    }

    /**
     * gets a matrix with:
     * x column: the vector from the left of the far plane to the right of the far plane in world coords
     * y column: the vector from the bottom of the far plane to the top of the far plane in world coords
     * z column: the vector from the near to the far plane in world coords
     * w column: the location of the middle of the far plane
     */
    _getFarPlaneMatrix(camera:THREE.Camera){
        // let camPVMI = Mat4.FromThreeJS(this.camera.projectionMatrixInverse)
        //     .times(Mat4.FromThreeJS(this.camera.matrixWorld))
        //     .getInverse();
        // return Mat4.Identity();



        // let camPVMI =Mat4.FromThreeJS(camera.matrixWorldInverse).times(
        //     Mat4.FromThreeJS(camera.projectionMatrixInverse));

        // return Mat4.Scale3D(100);

        let camPVMI = Mat4.FromThreeJS(camera.projectionMatrix)
            .times(Mat4.FromThreeJS(camera.matrixWorldInverse))
            .getInverse();

        let maxMat = Mat4.Identity();
        // set depth of x and y columns to far plane
        maxMat.r2=new Vec4(1,1,1,0);
        // set homogeneous coords of columns to 1
        maxMat.r3=new Vec4(1,1,1,1);

        maxMat = camPVMI.times(maxMat);
        let minMat = Mat4.Scale3D(-1);
        // set depth of x y and z to far plane
        minMat.r2=new Vec4(1,1,-1,1);
        // set homogeneous coords of columns to 1
        minMat.r3 = new Vec4(1,1,1,1);
        minMat = camPVMI.times(minMat);

        let rmat = new Mat4();
        rmat.c0=maxMat.c0.getHomogenized().minus(minMat.c0.getHomogenized());
        rmat.c1=maxMat.c1.getHomogenized().minus(minMat.c1.getHomogenized());
        rmat.c2=maxMat.c2.getHomogenized().minus(minMat.c2.getHomogenized());
        rmat.c3 = minMat.c3.getHomogenized();
        return rmat;
    }


}
