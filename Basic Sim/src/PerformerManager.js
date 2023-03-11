import * as THREE from 'three'
import { Agent } from './Agent';

export class PerformerManager {
    constructor(scene) {
        console.log('Performer Manager');

        this.scene = scene;
        // Create the agent
        this.agent = new Agent(scene);
    }

    update(delta, debug, lightsManager) {
        let lights = lightsManager.lights;
        if (this.agent) {
            this.agent.update(delta, debug, lights);
        }
    }
}