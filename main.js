import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import Stats from 'three/addons/libs/stats.module.js'

const textureLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(100, 150, -220);

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene-container').appendChild(renderer.domElement);

// ---------------------------------------------------------------------
// DirectLight
// ---------------------------------------------------------------------
const dirLight = new THREE.DirectionalLight( 0xffffff, 50 );
dirLight.target.position.set( 0, -10, 0 );
dirLight.add( dirLight.target );
dirLight.lookAt( 0, 0, 0 );
dirLight.name = 'DirectionalLight';
const helper = new THREE.DirectionalLightHelper(dirLight);
//scene.add(  helper  );
//scene.add( dirLight );
// ---------------------------------------------------------------------
// DirectLight
// ---------------------------------------------------------------------
const AmbientLight = new THREE.AmbientLight( 0xffffff );

scene.add( AmbientLight );
// ---------------------------------------------------------------------
// PointLight
// ---------------------------------------------------------------------
const light2 = new THREE.PointLight(0xffffff, 1, 100);
light2.position.set( 0, 0, 0 );
//light2.lookAt( 0, -100, 0 );
scene.add(light2);

//const helper2 = new THREE.PointLightHelper(light2);
//scene.add(helper2);

//scene.add( cube );

// load an obj
// let object 
// const loader = new OBJLoader();
// loader.load( 'models/mvx_logo.obj', function ( obj ) {

// 	object = obj;
// 	object.scale.multiplyScalar( 10 );
// 	object.position.y = - 30;
// 	console.log(object)
// 	scene.add( object );

// } );

// THE X GLTF
const loader = new GLTFLoader();
const texture = textureLoader.load( '/textures/hack.jpg' );
texture.flipY = false;

let mixer;
let model;

// Load your GLTF model
loader.load('/models/tesseract_final.gltf', function (gltf) {
    gltf.scene.traverse(function (child) {
        if (child.type === 'Mesh') {
            let m = child
			//
			console.log(m)
            m.receiveShadow = true
            m.castShadow = true
            if (child.name === 'mvx') {
                // test texture add
                m.material.map = texture;
                m.material.emissiveIntensity = 2.5;
            }
            
        }
        if (child.type === 'SpotLight') {
            let l = child
			console.log(l)
            l.castShadow = true
            l.shadow.bias = -0.003
            //l.shadow.mapSize.width = 2048
            //l.shadow.mapSize.height = 2048
        }

    })
    model = gltf.scene
    mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
        mixer.clipAction(clip).play();
    });
    progressBar.style.display = 'none'
	gltf.scene.scale.set(22, 22, 22)
	gltf.scene.position.set(0,10,10)

    scene.add(model)

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

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();

// Responsiveness of the canvas
window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function render() {
    renderer.render(scene, camera)
}

// showing some stats ?
const stats = new Stats()
document.body.appendChild(stats.dom)


function animate() {
	requestAnimationFrame( animate );
    // play the animation contained in the gtlf
    if (mixer) {
        mixer.update(0.02); // You can adjust the animation speed here
    }
	orbit.update();
	const delta = clock.getDelta();
	if ( scene) scene.rotation.y -= 0.5 * delta;
	//cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;
	stats.update();
	renderer.render( scene, camera );
}

animate();