import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js'

// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true
renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement)
document.getElementById('scene-container').appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement)
// Create a new OBJLoader instance
const loader = new GLTFLoader();
// Load your OBJ model
loader.load('/models/mvx_logo.glb', function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.type === 'Mesh') {
            let m = child
            m.receiveShadow = true
            m.castShadow = true
        }
        if (child.type === 'SpotLight') {
            let l = child
            l.castShadow = true
            l.shadow.bias = -0.003
            //l.shadow.mapSize.width = 2048
            //l.shadow.mapSize.height = 2048
        }
    })
    progressBar.style.display = 'none'
    scene.add(gltf.scene)
    // gltf.animations; // Array<THREE.AnimationClip>
    // gltf.scene; // THREE.Group
    // gltf.scenes; // Array<THREE.Group>
    // gltf.cameras; // Array<THREE.Camera>
    // gltf.asset; // Object
    },
    (xhr) => {
        if (xhr.lengthComputable) {
            var percentComplete = (xhr.loaded / xhr.total) * 100
            progressBar.value = percentComplete
            progressBar.style.display = 'block'
        }
    },
    (error) => {
        console.log(error)
    } 
);
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}
const stats = new Stats()
document.body.appendChild(stats.dom)
var animate = function () {
    requestAnimationFrame(animate)
    controls.update()
    render()
    stats.update()
}
function render() {
    renderer.render(scene, camera)
}
animate()
