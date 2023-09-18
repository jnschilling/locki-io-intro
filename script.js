import * as THREE from 'three';
import { OBJLoader } from 'OBJLoader.js';

// Create a new OBJLoader instance
const loader = new OBJLoader();
// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// Load your OBJ model
loader.load('./assets/mvx_logo.obj', (obj) => {
    scene.add(obj);
});

// Set up animation
const animate = () => {
    requestAnimationFrame(animate);
    // Add animation logic here, e.g., obj.rotation.x += 0.01;
    renderer.render(scene, camera);
};

camera.position.z = 5;
animate();
