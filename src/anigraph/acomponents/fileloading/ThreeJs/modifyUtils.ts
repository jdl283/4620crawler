import * as THREE from "three"

/**
 * set position, scale, rotation of @param object
 * specified by the 4x4 homogeneous matrix @param m4
 * @param object object to set its position, scale and rotation
 * @param m4 4x4 homogeneous matrix m4
 */
export function setAttributesFromMatrix(
  object: THREE.Object3D,
  m4: THREE.Matrix4
) {
  object.position.add(new THREE.Vector3().setFromMatrixPosition(m4));
  object.scale.copy(new THREE.Vector3().setFromMatrixScale(m4));
  object.rotation.copy(
    new THREE.Euler().setFromRotationMatrix(
      new THREE.Matrix4().extractRotation(m4)
    )
  );
}

/** move ThreeJs obeject @param object to the center
 * of world coordinate
 */
export function moveObjectToWorldCenter(object: THREE.Object3D) {
  let center = new THREE.Vector3();
  let boundingBox = new THREE.Box3().setFromObject(object);
  boundingBox.getCenter(center);
  object.position.sub(center);
}
