import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import light from '../assets/light.glb'

export class LightsManager {
    constructor(scene) {
        console.log('Lights Manager');

        this.scene = scene; 
        this.light = '';
        this.lights = []; 
        this.loadLight();
    }

    update() {

    }

    loadLight() {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(light, gltf => {
            this.light = new THREE.Group();
            this.light.add(gltf.scene);
            //this.scene.add(this.light);
            this.createLights();
        })
        // Then create it.
    }

    createLights() {
        // Push the lights in the scene.
        const theta = 1.75 * Math.PI/24; 
        const radius = 4.0; 
        for (let i = 0; i < 24; i++) {
            // Clone the mesh as a light.
            const light = this.light.children[0].clone();

            // Set this mesh's position.
            const x = radius * Math.cos(theta * (i + 9));
            const z = radius * Math.sin(theta * (i + 9));
            light.position.set(x, 0.0, z);
            //light.rotateOnAxis(new THREE.Vector3(0, 1, 0), theta);
            light.lookAt(0, 0, 0);
            light.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);

            // Add it to the scene.
            this.scene.add(light);

            this.lights.push(light);
        }

    }
}

// // Lights
//         // Prepare the cyclinder mesh for the light
//         // Base Top, Base Ground, Height
//         const geometry = new THREE.CylinderGeometry(0.2, 0.2, 2.0);
//         const material = new THREE.MeshBasicMaterial({ color: 'black', wireframe: false });
//         const mesh = new THREE.Mesh(geometry, material);
//         mesh.scale.set(0.2, 1.0, 0.2);
//         mesh.position.set(0., 1.0, 0); // Places the light at 0

