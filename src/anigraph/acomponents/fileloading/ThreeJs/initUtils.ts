import * as THREE from "three";

export function initCamera(): THREE.PerspectiveCamera {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.000001,
    1000000
  );
  camera.position.set(0, 0, 5);
  return camera;
}

export function initRenderer(container: HTMLElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}

export function initScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  return scene;
}
export function initGrid(scene: THREE.Scene) {
  const grid = new THREE.GridHelper(10, 100);
  grid.rotation.x = Math.PI / 2;
  grid.name="gridHelper"
  scene.add(grid);
}

export function enableWindowResize(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
  window.addEventListener("resize", onWindowResize);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}



