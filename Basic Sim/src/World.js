import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import hdri from '../assets/hdri/dikhololo_night_1k.hdr'
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

        // Map HDRI.
        this.createHDRI();

        // Add things in the world.
        this.createAmbiance();
    }

    update(debug, connect) {
        const delta = this.clock.getDelta();

        // Update all subsystems.
        this.performerManager.update(delta, debug, connect, this.lightsManager);
        this.lightsManager.update();
        this.setManager.update(delta);
    }

    createHDRI() {
        const loader = new RGBELoader()        
        loader.load(hdri, texture => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            this.scene.background = texture;
            //this.scene.environment = texture;
        });
    }

    createAmbiance() {
        var ambientLight = new THREE.AmbientLight(0xD7D3D3);
        ambientLight.intensity = 0.2;
        var directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.intensity = 0.5;
        directionalLight.position.set(35, 35, 35);
        //this.scene.add( ambientLight );
        this.scene.add(directionalLight);	

        let spotLight = new THREE.SpotLight( 0xffffff );
        // spotLight.position.set(0, 10, 0);
        spotLight.intensity = (0.25);
        // spotLight.castShadow = true;
        spotLight.angle = Math.PI/8;
        // this.scene.add(spotLight);

        spotLight = spotLight.clone();
        spotLight.position.set(0, 5, 18);
        // spotLight.target(this.setManager.setup);
        //spotLight.lookAt(new THREE.Vector3(0, 0, 2));
        this.scene.add(spotLight);
    }
}