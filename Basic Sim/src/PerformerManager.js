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

        // Drawing a line between the two points.
        // this.points = [];
        // this.points.push(new THREE.Vector3(-2, 5, 0));
        // this.points.push(new THREE.Vector3(2, 5, 0));
        // this.lineGeometry = new THREE.BufferGeometry().setFromPoints(this.points);
        // const lineMaterial = new THREE.LineBasicMaterial({
        //     color: 0x0000ff,
        //     linewidth: 2,
        //     linecap: 'round',
        //     linejoin: 'round'
        // });
        // const line = new THREE.Line(this.lineGeometry, lineMaterial);
        // this.scene.add(line);

        // Drawing a box between the points. 
        this.geometry = new THREE.BoxGeometry(1, 0.35, 0.35);
        this.geometry.translate(-1/2, 0, 0);
        const material = new THREE.MeshBasicMaterial( {color: 0x0} );
        this.mesh = new THREE.Mesh(this.geometry, material );
        this.scene.add(this.mesh);
    }

    update(delta, debug, connect, lightsManager) {
        let lights = lightsManager.lights;
        const newDelta = delta * 0.25; // Factor by which we slow the animation down.

        if (this.modelA) {
            this.modelA.update(debug, newDelta, lights);
        }

        if (this.modelB) {
            this.modelB.update(debug, newDelta, lights);
        }

         // Draw a line between the heads
         if (this.modelA.head && this.modelB.head) {
            const localPosA = this.modelA.head.position.clone();
            const localPosB = this.modelB.head.position.clone();

            const headAWorldPos = this.modelA.head.localToWorld(localPosA);
            const headBWorldPos = this.modelB.head.localToWorld(localPosB);

            // Calculate the distance between the two heads
            const d = headAWorldPos.distanceTo(headBWorldPos);                
            this.mesh.scale.set(d, 1, 1);

            // Where the place the cube. 
            this.mesh.position.copy(headAWorldPos);
            this.mesh.lookAt(headBWorldPos);
            this.mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);
        }

        // Connect the heads. 
        this.mesh.visible = connect;
    }
}