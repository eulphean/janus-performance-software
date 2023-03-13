
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as THREE from 'three'
import { SphereGeometry, Vector3 } from 'three';
import { LIGHT_COLOR } from './LightsManager';

export class Agent {
    constructor(scene, modelPath, startPos, startRot) {
        console.log('Loading Model');
        this.scene = scene; 

        const gltfLoader = new GLTFLoader();
        this.model = '';
        this.animationMixer = '';    
        // Raycaster baby!
        this.raycaster = new THREE.Raycaster();
        this.worldForwardVector = new THREE.Vector3();

        // Save the position of the head that we can use to attach 
        // our raycaster.
        this.head = '';
        this.spine = '';
        const geometry = new SphereGeometry(1, 10, 10);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.posMesh = new THREE.Mesh(geometry, material);
        this.posMesh.scale.set(0.2, 0.2, 0.2);
        this.scene.add(this.posMesh);

        // Load model. 
        gltfLoader.load(modelPath, gltf => {
            this.model = new THREE.Group();
            this.model.add(gltf.scene); 
            this.model.rotateOnAxis(new Vector3(0, 1, 0), startRot);
            this.model.position.set(startPos.x, startPos.y, startPos.z);
            gltf.scene.traverse(child => {
                if (child.name === 'mixamorigSpine') {
                    // I have found the head.
                    this.spine = child;   
                }

                if (child.name === 'mixamorigNeck') {
                    this.head = child;
                }
            });

            const animation = gltf.animations[0];
            this.animationMixer = new THREE.AnimationMixer(this.model);
            const action = this.animationMixer.clipAction(animation);
            action.play();
            action.setLoop(THREE.LoopRepeat);
            this.scene.add(this.model);
        });
    }

    update(debug, delta, lights) {
        if (this.animationMixer) {
            this.animationMixer.update(delta);
        }

        if (debug) {
            this.posMesh.visible = false;
        } else {
            this.posMesh.visible = true;
        }

        // Clone the position so you don't modify the original.
        // It's important else you'll see glitches.
        if (this.spine) {
            const spinePos = this.spine.position.clone();
            const worldPos = this.spine.localToWorld(spinePos);
            this.posMesh.position.set(worldPos.x, worldPos.y, worldPos.z);

            // Get forward vector in the world
            this.spine.getWorldDirection(this.worldForwardVector);

            // Raycaster always pointing forward.
            this.raycaster.set(worldPos, this.worldForwardVector.normalize());

            // Intersect the objects
            // Updates the lights
            if (lights) {
                lights.forEach(l => {
                    const intersects = this.raycaster.intersectObject(l, true);
                    intersects.forEach(i => { 
                        if (i.object.name === 'light') {
                            const newMat = i.object.material.clone();
                            if (newMat.color.equals(LIGHT_COLOR)) {
                                newMat.color.set('white');
                            } else {
                                newMat.color.set(LIGHT_COLOR);
                            }
                            i.object.material = newMat;
                        }
                    });
                })
            }
        }
    }
}