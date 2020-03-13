import * as THREE from 'three';
import defaultFont from './../../assets/models/Spartan_Regular.json';


export function createText(text: string, options: {
    font?: any,
    size?: number,
    height?: number,
} = {}) {

    const {
        font,
        height,
        size
    } = options;

    const geo = new THREE.TextGeometry(text, {
        font: new THREE.Font(font ?? defaultFont),
        size: size ?? 5,
        height: height ?? 1
    })

    const material = new THREE.MeshBasicMaterial({ color: 0x034b59 })
    const textMesh = new THREE.Mesh(geo, material);
    textMesh.position.x = - 15;
    return textMesh;
}