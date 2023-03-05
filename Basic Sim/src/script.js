import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { Agent } from './Agent.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();
let agent; let lights = []; 
// Add the plane, lights, and the model in the scene. 
setupStage();

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.lookAt(new THREE.Vector3(0, 0, 0));
camera.position.z = 6;
camera.position.y = 3;
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('skyblue'));

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    // update animation mixer;
    const delta = clock.getDelta();
    if (agent) {
        agent.update(delta, lights);
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function setupStage() {
    // Axis
    const axesHelper = new THREE.AxesHelper(5);
    // scene.add(axesHelper);

    createFloor();
    createLights();
    createAmbiance();
    createModel(); 
}

function createAmbiance() {
    // var ambientLight = new THREE.AmbientLight(0xD7D3D3);
    // ambientLight.intensity = 1.5;
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.intensity = 1.0;
    directionalLight.position.set(0, 50, 50).normalize();
    // scene.add( ambientLight );
    scene.add(directionalLight);	
}

function createModel() {
    agent = new Agent(scene);
}

function createFloor() {
    // Floor
    console.log('Creating floor');
    const geometry = new THREE.PlaneGeometry(2, 2, 2)
    const material = new THREE.MeshBasicMaterial({ color: 'grey', wireframe: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotateX(Math.PI/2);
    mesh.scale.set(6, 6, 6);
    scene.add(mesh);
}

function createLights() {
    console.log('Creating lights');
    // Lights
    // Prepare the cyclinder mesh for the light
    // Base Top, Base Ground, Height
    const geometry = new THREE.CylinderGeometry(0.2, 0.2, 2.0);
    const material = new THREE.MeshBasicMaterial({ color: 'black', wireframe: false });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(0.2, 1.0, 0.2);
    mesh.position.set(0., 1.0, 0); // Places the light at 0

    // Push the lights in the scene.
    const theta = 1.75 * Math.PI/24; 
    const radius = 4.0; 
    for (let i = 0; i < 24; i++) {
        // Clone the mesh as a light.
        const light = mesh.clone(true);

        // Set this mesh's position.
        const x = radius * Math.cos(theta * (i + 9));
        const z = radius * Math.sin(theta * (i + 9));
        light.position.set(x, 1.0, z);

        // Add it to the scene.
        scene.add(light);

        lights.push(light);
    }
}