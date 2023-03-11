import * as THREE from 'three'

import { PerformerManager } from "./PerformerManager"
import { LightsManager } from "./LightsManager"
import { SetManager } from "./SetManager"

export class World {
    constructor(scene) {
        console.log('World');

        this.scene = scene; 
        // Manage the performers
        this.performerManager = new PerformerManager(scene);
        // Manager supersynthesis lights.
        this.lightsManager = new LightsManager(scene); 
        // Manager and prepare the mana contemporary set.
        this.setManager = new SetManager(scene);

        // World clock        
        this.clock = new THREE.Clock()

        // Add things in the world.
        this.createAmbiance();
    }

    update(debug) {
        const delta = this.clock.getDelta();

        // Update all subsystems.
        this.performerManager.update(delta, debug, this.lightsManager);
        this.lightsManager.update();
        this.setManager.update();
    }

    createAmbiance() {
        // var ambientLight = new THREE.AmbientLight(0xD7D3D3);
        // ambientLight.intensity = 1.5;
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.intensity = 1.0;
        directionalLight.position.set(0, 50, 50).normalize();
        // scene.add( ambientLight );
        this.scene.add(directionalLight);	
    }
}