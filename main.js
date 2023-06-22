import * as THREE from "three";

import WebGPU from "three/addons/capabilities/WebGPU.js";
import WebGPURenderer from "three/addons/renderers/webgpu/WebGPURenderer.js";

import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let camera, scene, renderer, controls;

init();
animate();

function init() {
  if (WebGPU.isAvailable() === false) {
    document.body.appendChild(WebGPU.getErrorMessage());
    throw new Error("No WebGPU support");
  }

  const container = document.createElement("div");
  document.body.appendChild(container);

  // Progress bar
  const progress = document.createElement("progress");
  progress.value = 0;
  container.appendChild(progress);

  // Text inside progress bar
  const textDiv = document.createElement("span");
  let textNode = document.createTextNode("Hello World");
  textDiv.appendChild(textNode);
  container.appendChild(textDiv);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 50);
  camera.position.set(7, 7, 7);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("#424549");

  // Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 5);
  dirLight.position.set(1, 1, 0);
  scene.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xffffff, 5);
  dirLight2.position.set(0, 1, 1);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0xffffff, 5);
  dirLight3.position.set(-1, 1, -1);
  scene.add(dirLight3);

  // Model
  const loader = new GLTFLoader();
  loader.load(
    "public/1686239375582.gltf",
    function (gltf) {
      gltf.scene.scale.set(0.01, 0.01, 0.01);
      gltf.scene.position.y = -3.5;
      gltf.scene.position.z = -0.5;
      scene.add(gltf.scene);
      //   progress.remove(); // Remove progress bar
      progress.className = "hidden";
      textDiv.className = "hidden";
      render();
    },
    // called while loading is progressing
    function (xhr) {
      var progressValue = Math.ceil((xhr.loaded / xhr.total) * 100);
      progress.value = progressValue;
      textNode.data = "Loading . . . "; // Commented out until fixed: + progressValue + "%";
    },
    // called when loading has errors
    function (error) {
      textNode.data = "ERROR :(";
      console.log("Error while loading gltf model.");
    }
  );

  renderer = new WebGPURenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.addEventListener("change", render); // use if there is no animation loop
  controls.minDistance = 5;
  controls.maxDistance = 20;
  controls.autoRotate = true;
  controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
  controls.dampingFactor = 0.05;
  controls.autoRotateSpeed = 1;
  controls.target.set(0, 0, 0);
  controls.update();

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

//

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}
