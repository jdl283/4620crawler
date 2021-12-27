import * as THREE from "three"
import type {SVGPath} from "../svg/SVGLoader";
import {SVGLoader} from "../svg/SVGLoader";

export function createMeshesFromPath(path: SVGPath) {
  const meshes: THREE.Mesh[] = [];
  addFillMeshes(meshes);
  addStrokeMeshes(meshes);
  return meshes;

  function addFillMeshes(meshes: THREE.Mesh[]) {
    const fillColor = path.userData.style.fill;
    if (fillColor !== undefined && fillColor !== "none") {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setStyle(fillColor),
        opacity: path.userData.style.fillOpacity,
        transparent: (path.userData.style.strokeOpacity && path.userData.style.strokeOpacity < 1) ? true : false,
        side: THREE.DoubleSide,
        depthWrite: false,
        wireframe: false,
      });

      const shapes: THREE.Shape[] = SVGLoader.createShapes(path);

      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        meshes.push(mesh);
      }
    }
  }
  function addStrokeMeshes(meshes: THREE.Mesh[]) {
    const strokeColor = path.userData.style.stroke;

    if (strokeColor !== undefined && strokeColor !== "none") {
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setStyle(strokeColor),
        opacity: path.userData.style.strokeOpacity,
        transparent: (path.userData.style.strokeOpacity && path.userData.style.strokeOpacity < 1) ? true : false,
        side: THREE.DoubleSide,
        depthWrite: false,
        wireframe: false,
      });

      for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
        const subPath = path.subPaths[j];

        const geometry = SVGLoader.pointsToStroke(
          subPath.getPoints(),
          path.userData.style
        );

        if (geometry) {
          const mesh = new THREE.Mesh(geometry, material);

          meshes.push(mesh);
        }
      }
    }
  }
}

/**
 * Convert 1d position list (x1,y1,z1,x2,y2...)
 * to vertices array [[x1,y1,z1],[x2,y2,z2]]
 * @example
 * const vertices = verticesFromPositionList(positions)
 * vertices = [[1,2,0], [2,3,0]]
 */
export function verticesFromPositionList(
  positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute
): number[][] {
  const vertices = [];
  let index = 0;
  while (index < positions.array.length) {
    const vertex = [];
    for (let i = 0; i < 3; i++) {
      vertex.push(positions.array[index]);
      index++;
    }
    vertices.push(vertex);
  }
  return vertices;
}

/**
  * make vertices of @param mesh
  * centered around its local origin
  * while perserving its position in
  * world coordinate (parent coordinate)
  * @param mesh
  * @implements
  * vertices -= center
  * mesh.position += center
  */
export function makeOriginCenterForMesh(mesh: THREE.Mesh) {
  const center = getCenter(mesh);
  centerWithoutMove(mesh, center);
}

/** @returns center point of @params mesh */
export function getCenter(mesh: THREE.Mesh): THREE.Vector3 {
  mesh.geometry.computeBoundingBox();
  let center = new THREE.Vector3();
  mesh.geometry.boundingBox!.getCenter(center);
  return center;
}

/**
 * make vertices of @param mesh
 * centered around local origin
 * specified as @param center
 * while perserving its position in
 * world coordinate (parent coordinate)
 * @param mesh
 * @param center
 */
export function centerWithoutMove(mesh: THREE.Mesh, center: THREE.Vector3) {
  /**
   * @return [vertex1, vertex2,...] or [[x1,y1,z1],[x2,y2,z2],...]
   * @example return [[1,2,0], [2,3,0]]
   */
  function getVertices(mesh: THREE.Mesh) {
    const positions = mesh.geometry.getAttribute("position");
    const vertices = verticesFromPositionList(positions);
    return vertices;
  }
  const vertices = getVertices(mesh);
  // center vertices
  vertices.forEach((vertex) => {
    vertex[0] -= center.x;
    vertex[1] -= center.y;
  });
  mesh.geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices.flat(), 3)
  );
  // update position of matrix to make sure it doesn't move
  mesh.position.set(center.x, center.y, 0);
  mesh.updateMatrix();
  // make sure future references of bounding box is correct
  mesh.geometry.computeBoundingBox();
}
