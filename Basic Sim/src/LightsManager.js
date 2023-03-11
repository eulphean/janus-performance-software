import * as THREE from 'three'

export class LightsManager {
    constructor(scene) {
        console.log('Lights Manager');

        this.scene = scene; 
        this.lights = []; 
        this.createLights();
    }

    update() {

    }

    createLights() {
        // Lights
        // Prepare the cyclinder mesh for the light
        // Base Top, Base Ground, Height
        const geometry = new THREE.CylinderGeometry(0.2, 0.2, 2.0);
        const material = new THREE.MeshBasicMaterial({ color: 'black', wireframe: false });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0.2, 1.0, 0.2);
        mesh.position.set(0., 1.0, 0); // Places the light at 0

        // Push the lights in the scene.
        const theta = 1.75 * Math.PI/24; 
        const radius = 4.0; 
        for (let i = 0; i < 24; i++) {
            // Clone the mesh as a light.
            const light = mesh.clone(true);

            // Set this mesh's position.
            const x = radius * Math.cos(theta * (i + 9));
            const z = radius * Math.sin(theta * (i + 9));
            light.position.set(x, 1.0, z);

            // Add it to the scene.
            this.scene.add(light);

            this.lights.push(light);
        }
    }
}
