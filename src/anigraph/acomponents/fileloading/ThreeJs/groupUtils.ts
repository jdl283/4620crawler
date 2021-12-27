import * as THREE from "three"

/**
 * move local origin of @param group to the center of
 * all of its children (i.e. center of its bounding box)
 * while maintaining its world position
 * @param group
 * @implements
 * eachChild.position -= center
 * group.position += center
 */
export function makeOriginCenterForGroup(group: THREE.Group) {
  let center = new THREE.Vector3();
  let boundingBox = new THREE.Box3().setFromObject(group);
  boundingBox.getCenter(center);
  for (const child of group.children) {
    child.position.sub(center);
  }
  group.position.add(center);
}
