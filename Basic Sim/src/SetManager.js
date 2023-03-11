import * as THREE from 'three'

export class SetManager {
    constructor(scene) {
        console.log('Set Manager');

        this.scene = scene;
        this.createFloor();
    }

    update() {

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