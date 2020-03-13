import * as THREE from 'three';
import { Texture } from 'three';

export const createSphere = (options: {
    radius?: number,
    widthSegments?: number,
    heightSegments?: number,
    phiStart?: number,
    phiLength?: number,
    thetaStart?: number,
    thetaLength?: number,
    map?: Texture | null,
    color?: number | string
    castShadow?: boolean,
    receiveShadow?: boolean,
    texturePath?: string,
    loader?: THREE.LoadingManager
} = {}) => {

    const {
        radius,
        widthSegments,
        heightSegments,
        phiStart,
        phiLength,
        thetaStart,
        thetaLength,
        map,
        color,
        castShadow,
        receiveShadow,
        texturePath,
        loader
    } = options;

    const geometry = new THREE.SphereGeometry(radius ?? 25, widthSegments ?? 30, heightSegments ?? 30);
    let texture: THREE.Texture;


    if (texturePath) {
        texture = new THREE.TextureLoader(loader).load(
            // resource URL
            texturePath,
            // Function when resource is loaded
            (texture) => {
                material.map = texture; // set the material's map when when the texture is loaded
            },
            // Function called when download progresses
            (xhr) => {
                material.needsUpdate = true;
            },
            // Function called when download errors
            (xhr) => {
                console.log('An error happened');
            }
        )
    }

    const material = new THREE.MeshPhongMaterial({
        color: color ?? '#ffffff',
        side: THREE.DoubleSide,
        map: texture ?? null
    })

    const sphere = new THREE.Mesh(geometry, material);

    sphere.castShadow = castShadow ?? true;
    sphere.receiveShadow = receiveShadow ?? true;
    return sphere;
}