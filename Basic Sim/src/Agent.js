import model from '../assets/model.glb'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { SphereGeometry } from 'three';

export class Agent {
    constructor(scene) {
        console.log('Loading Model');
        const gltfLoader = new GLTFLoader();
        this.dancer = '';
        this.animationMixer = '';

        const geometry = new SphereGeometry(1, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.posMesh = new THREE.Mesh(geometry, material);
        this.posMesh.scale.set(0.2, 0.2, 0.2);
        scene.add(this.posMesh);

        // Save the position of the head that we can use to attach 
        // our raycaster.
        this.head = '';

        // Raycaster baby!
        this.raycaster = new THREE.Raycaster();
        this.worldForwardVector = new THREE.Vector3();

        // Load model. 
        gltfLoader.load(model, gltf => {
            this.dancer = new THREE.Group();
            this.dancer.add(gltf.scene); 
            console.log(this.dancer);
            gltf.scene.traverse(child => {
                // console.log(child.name);
                if (child.name === 'mixamorigSpine') {
                    // I have found the head.
                    this.head = child;   
                }
            });

            console.log(this.head);

            const dancerAnimation = gltf.animations[0];
            this.animationMixer = new THREE.AnimationMixer(this.dancer);
            const action = this.animationMixer.clipAction(dancerAnimation);
            action.play();
            scene.add(this.dancer);
        });
    }

    update(delta, debug, lights) {
        if (this.animationMixer) {
            this.animationMixer.update(delta * 0.25);
        }

        if (debug) {
            this.posMesh.visible = false;
        } else {
            this.posMesh.visible = true;
        }

        const headPos = this.head.position;
        if (headPos) {
            const worldPos = this.head.localToWorld(headPos);
            this.posMesh.position.set(worldPos.x, worldPos.y, worldPos.z);

            // Get forward vector in the world
            this.head.getWorldDirection(this.worldForwardVector);

            // Raycaster always pointing forward.
            this.raycaster.set(worldPos, this.worldForwardVector.normalize());

            // Intersect the objects
            // Updates the lights
            if (lights) {
                lights.forEach(l => {
                    const intersects = this.raycaster.intersectObject(l);
                    if (intersects) {
                        intersects.forEach(i => {
                            // Change the material to a random color. 
                            const newMat = i.object.material.clone();
                            if (newMat.color.r === 1 && newMat.color.g === 1 && newMat.color.b === 1) {
                                newMat.color.set('black');
                            } else {
                                newMat.color.set('white');
                            }
                            i.object.material = newMat;
                        });
                    }
                })
            }
        }
    }
}