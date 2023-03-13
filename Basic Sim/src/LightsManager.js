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
        
        // Light mesh.
        let geometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5);
        let material = new THREE.MeshBasicMaterial({ color: 'black', wireframe: false });
        const lightMesh = new THREE.Mesh(geometry, material);

        // Box base. 
        geometry = new THREE.BoxGeometry(1, 1, 1);
        material = new THREE.MeshBasicMaterial({ color: 'black', wireframe: false });
        const baseMesh = new THREE.Mesh(geometry, material);

        for (let i = 0; i < 24; i++) {
            // Light (base + cylinder)
            const lightGroup = new THREE.Group();
            
            // Position of the light.
            const x = radius * Math.cos(theta * (i + 9));
            const z = radius * Math.sin(theta * (i + 9));

            // Create a box base and scale the height based on the wave. 
            const base = baseMesh.clone();
            const scaleY = theta * (i + 9);
            base.scale.set(0.2, scaleY * 0.12, 0.2);
            base.name = 'base';
            lightGroup.add(base); 

            // Clone the mesh as a light.
            const light = lightMesh.clone();
            const posY = theta * (i) * 0.08;
            light.position.set(0, 1.25/2 + posY, 0);
            light.name = 'light';
            lightGroup.add(light);

            lightGroup.position.set(x, 0., z);  

            // // Rotate light to look at the center.
            // lightGroup.lookAt(0, 0, 0);
            // lightGroup.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);

            // Add it to the scene.
            this.scene.add(lightGroup);

            // Entire light is a box + light mesh.
            this.lights.push(lightGroup);
        }
    }
}