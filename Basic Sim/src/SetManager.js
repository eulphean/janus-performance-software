import * as THREE from 'three'
import space from '../assets/models/space.glb'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class SetManager {
    constructor(scene) {
        console.log('Set Manager');

        this.scene = scene;
        this.space = '';
        // this.createFloor();
        this.createSpace();
    }

    update() {

    }

    createSpace() {
        // Import the model.
        // Setup the materials for the space.
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(space, gltf => {
            this.space = gltf.scene;
            this.space.scale.set(0.1, 0.1, 0.1);
            this.space.enableShadows = true;
            console.log(this.space);
            this.scene.add(this.space);
        });

    }

    createFloor() {
        // Floor
        console.log('Creating floor');
        const geometry = new THREE.PlaneGeometry(2, 2, 2)
        const material = new THREE.MeshBasicMaterial({ color: 'grey', wireframe: false, side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotateX(Math.PI/2);
        mesh.scale.set(6, 6, 6);
        this.scene.add(mesh);
    }
}


// gltf.scene.traverse(child => {
//     // console.log(child.name);
//     if (child.name === 'mixamorigSpine') {
//         // I have found the head.
//         this.head = child;   
//     }
// });