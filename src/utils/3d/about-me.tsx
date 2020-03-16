import * as THREE from 'three';
import { ThreeAbstract } from './3d-abstract';
import OrbitControl from './orbit-control';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import { createText } from './text';
import randomInRange from '../randomInRange';
import GLTFLoader from './GLTFLoader';



class AboutMe3D extends ThreeAbstract {
    group: THREE.Group;
    tree: THREE.Mesh;
    rocks: THREE.Mesh[];
    header: THREE.Mesh;
    astro: THREE.Object3D;

    constructor(
        private loadingManager: THREE.LoadingManager,
        private scene: THREE.Scene,
        private control: typeof OrbitControl,
        private renderer: THREE.Renderer,
        private camera: THREE.Camera,
        private parent?: THREE.Mesh | THREE.Group | THREE.Scene
    ) {
        super()

        if (!this.parent) {
            this.parent = this.scene;
        }

        this.init()
    }
    init() {
        this.setElements();
    }

    createHeader() {
        this.header = createText('About Me', {
            size: 15
        });
        this.header.rotation.set(
            1.2,
            0,
            -0.5
        )
        this.header.position.set(
            this.tree.position.x + 25,
            this.tree.position.y - 5,
            this.tree.position.z - 15,
        )
        this.group.add(this.header);
    }

    setElements() {

        let objLoader = new OBJLoader(this.loadingManager);
        let mtlLoader = new MTLLoader();
        mtlLoader.load('assets/models/NatureFreePack1.mtl', (materials) => {
            materials.preload()
            objLoader.setMaterials(materials)
            objLoader.load('assets/models/NatureFreePack1.obj', (group: THREE.Group) => {

                group.children.forEach((m: THREE.Mesh) => m?.geometry?.center());

                this.tree = group.children.find(m => m.name.includes('Tree')) as THREE.Mesh;
                this.rocks = group.children.filter(m => m.name.includes('Rock')) as THREE.Mesh[];
                const items = [...this.rocks, this.tree];
                this.group = new THREE.Group()
                this.group.add(...items);


                this.tree.geometry.center();
                this.tree.scale.set(4, 4, 4);
                this.tree.rotation.x = 1.5;
                this.tree.position.set(
                    0,
                    -30,
                    190,
                );


                let i = 0;
                const rockClone = this.rocks.map(r => r.clone());
                this.rocks = [...this.rocks, ...rockClone];
                this.group.add(...rockClone);
                for (const item of [...this.rocks, ...rockClone]) {
                    const indicator = i % 2 === 0 ? -1 : 1;

                    item.geometry.center();
                    item.scale.set(4, 4, 4);
                    item.rotateX(-1.81);
                    item.castShadow = true;
                    item.receiveShadow = true;
                    item.position.set(
                        this.tree.position.x + randomInRange(10, 15) * indicator,
                        this.tree.position.y + randomInRange(10, 15) * indicator,
                        this.tree.position.z - 15 ,
                    );

                    i++;
                }
                this.loadAstro();
                this.append();

            })
        })
    }

    loadAstro() {
        const loader = GLTFLoader(this.loadingManager);


        loader.load('assets/models/astro/scene.gltf', gltf => {
            const scene = gltf.scene as THREE.Scene;

            this.astro = scene.children[0];
            this.astro.position.set(52, -5, 155);
            this.astro.rotation.set(0.15, 0.46, -0.107);
            this.astro.scale.set(10, 10, 10);
            this.astro.castShadow = true;
            this.astro.receiveShadow = true;
            this.parent.add(this.astro);
            this.scene.add(gltf.scene);

            this.renderer.render(scene, this.camera);


        })

    }

    append() {
        this.createHeader();
        this.parent.add(...this.group.children);
    }




}

export default AboutMe3D;