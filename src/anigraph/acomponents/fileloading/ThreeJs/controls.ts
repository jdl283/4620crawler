import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js";
import {TransformControls} from "three/examples/jsm/controls/TransformControls.js";

export type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export type { TransformControls } from "three/examples/jsm/controls/TransformControls.js";


export function initOrbitControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): OrbitControls {
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableRotate = false;
  return orbitControls
}

export function initTransformControls(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, scene: THREE.Scene, orbitControls: OrbitControls): TransformControls {
  const transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.name = "TransformController"
  transformControls.addEventListener("change", () => { renderer.render(scene, camera); });
  transformControls.addEventListener("dragging-changed", (event) => {
    orbitControls.enabled = !event.value;
  });
  scene.add(transformControls);
  window.addEventListener("keydown", (event: KeyboardEvent) => {

    switch (event.code) {
      case "KeyW": // W
        event.preventDefault();
        transformControls.setMode("translate");
        break;

      case "KeyE": // E
        event.preventDefault();
        transformControls.setMode("rotate");
        break;

      case "KeyR": // R
        event.preventDefault();
        transformControls.setMode("scale");
        break;

      case "Equal": // +, =, num+
        event.preventDefault();
        transformControls.setSize(transformControls.size + 0.1);
        break;

      case "Minus": // -, _, num-
        event.preventDefault();
        transformControls.setSize(
          Math.max(transformControls.size - 0.1, 0.1)
        );
        break;

      case "KeyX": // X
        event.preventDefault();
        transformControls.showX = !transformControls.showX;
        break;

      case "KeyY": // Y
        event.preventDefault();
        transformControls.showY = !transformControls.showY;
        break;

      case "KeyZ": // Z
        event.preventDefault();
        transformControls.showZ = !transformControls.showZ;
        break;
    }
  });
  return transformControls
}
