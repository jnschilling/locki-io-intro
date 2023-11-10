import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const clock = new THREE.Clock();
const bgLoader = new THREE.TextureLoader();
const scene = new THREE.Scene();
scene.background = bgLoader.load( '/textures/profile.png' );
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / (window.innerHeight - 100),
  0.1,
  1000
);
camera.position.set(100, 150, -220);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight - 100);
document.getElementById("scene-container").appendChild(renderer.domElement);

// THE X GLTF
const loader = new GLTFLoader();

let mixer;
let model;

// Load your GLTF model
loader.load(
  "/models/tesseract_final.gltf",
  function (gltf) {
    gltf.scene.traverse(function (child) {
      if (child.type === "Mesh") {
        let m = child;
        //
        // m.receiveShadow = true;
        // m.castShadow = true;
      }
      if (child.type === "SpotLight") {
        let l = child;
        // l.castShadow = true;
        // l.shadow.bias = -0.003;
        //l.shadow.mapSize.width = 2048
        //l.shadow.mapSize.height = 2048
      }
    });
    model = gltf.scene;
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
    // progressBar.style.display = "none";
    gltf.scene.scale.set(22, 22, 22);
    gltf.scene.position.set(0, 10, 10);

    scene.add(model);
  },
  (xhr) => {},
  (error) => {
    console.log(error);
  }
);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Responsiveness of the canvas
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / (window.innerHeight - 100);
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight - 100);
  render();
}

function render() {
  renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  // play the animation contained in the gtlf
  if (mixer) {
    mixer.update(0.02); // You can adjust the animation speed here
  }
  orbit.update();
  const delta = clock.getDelta();
  if (scene) scene.rotation.y -= 0.5 * delta;
  renderer.render(scene, camera);
}

animate();
