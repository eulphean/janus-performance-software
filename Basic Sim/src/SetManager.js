import * as THREE from 'three'
import space from '../assets/models/space.glb'
import setup from '../assets/models/setup.glb'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export class SetManager {
    constructor(scene) {
        console.log('Set Manager');

        this.scene = scene;
        this.space = '';

        // Setup has an animation.
        this.setup = '';
        this.animationMixer = '';
        // this.createFloor();
        this.createSpace();
    }

    update(delta) {
        if (this.animationMixer) {
            this.animationMixer.update(delta);
        }
    }

    createSpace() {
        // Import the model.
        // Setup the materials for the space.
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(space, gltf => {
            this.space = gltf.scene;
            this.space.scale.set(0.1, 0.1, 0.1);
            this.space.enableShadows = true;
            this.scene.add(this.space);
        });

        gltfLoader.load(setup, gltf => {
            this.setup = gltf.scene;
            this.setup.position.set(0, 0, 1.5);
            const animation = gltf.animations[0];
            this.animationMixer = new THREE.AnimationMixer(this.setup);
            const action = this.animationMixer.clipAction(animation);
            action.play();
            action.setLoop(THREE.LoopRepeat);
            this.scene.add(this.setup);
        })

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