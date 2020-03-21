import * as THREE from 'three';
import defaultFont from '../../assets/fonts/Raleway_Bold.json';
import { DESKTOP } from '../mobile';


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
        size: size ?? 7,
        height: height ?? 5,
        curveSegments: 1,
    })

    const material = new THREE.MeshPhongMaterial({ color: '#74b9ff', side: THREE.DoubleSide })
    const textMesh = new THREE.Mesh(geo, material);
    textMesh.add(new THREE.AmbientLight('#dfe6e9', .3))
    return textMesh;
}

export default function createMainText() {
    const group = new THREE.Group();
    const title = createText('Portfolio', { size: DESKTOP ? null : 4.3 });
    const subtitle = createText('By Tzach Bonfil', { size: DESKTOP ? 3.9 : 2.3 });

    group.add(title, subtitle);
    group.children.forEach((c: THREE.Mesh) => c.geometry.center());

    subtitle.position.y -= 10;

    return group;
}