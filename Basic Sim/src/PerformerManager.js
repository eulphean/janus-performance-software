import * as THREE from 'three'
import modelA from '../assets/models/modelA.glb'
import modelB from '../assets/models/modelB.glb'
import { Agent } from './Agent';

export class PerformerManager {
    constructor(scene) {
        console.log('Performer Manager');

        this.scene = scene;

        // Create the agents
        let startPos = new THREE.Vector3(1.5, 0, 0);
        let startRot = -Math.PI/2;
        this.modelA = new Agent(scene, modelA, startPos, startRot);
        startPos = new THREE.Vector3(-1.5, 0, 0);
        startRot = Math.PI/2;
        this.modelB = new Agent(scene, modelB, startPos, startRot);
    }

    update(delta, debug, lightsManager) {
        let lights = lightsManager.lights;
        const newDelta = delta * 0.25; // Factor by which we slow the animation down.
        if (this.modelA) {
            this.modelA.update(debug, newDelta, lights);
        }

        if (this.modelB) {
            this.modelB.update(debug, newDelta, lights);
        }
    }
}