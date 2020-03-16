import * as THREE from 'three';
import { ThreeAbstract } from './3d-abstract';
import OrbitControl from './orbit-control';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import { createText } from './text';
import randomInRange from '../randomInRange';
import GLTFLoader from './GLTFLoader';


class MyWork3D extends ThreeAbstract {
    group: THREE.Group;
    tree: THREE.Mesh;
    rocks: THREE.Mesh[];
    header: THREE.Mesh;
    saucer: THREE.Object3D;
    indicator = 1;

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
        this.header = createText('My Work', {
            size: 15
        });
        this.header.rotation.set(
            -1.2,
            3,
            0
        )
        this.header.position.set(
            this.tree.position.x - 20,
            this.tree.position.y - 5,
            this.tree.position.z + 25,
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
                const children = [...group.children];
                const index = children.findIndex(m => m.name.includes('Tree'));
                children.splice(index, 1);

                this.tree = children.find(m => m.name.includes('Tree')) as THREE.Mesh;
                this.rocks = group.children.filter(m => m.name.includes('Rock')) as THREE.Mesh[];
                const items = [...this.rocks, this.tree];
                this.group = new THREE.Group()
                this.group.add(...items);


                this.tree.geometry.center();
                this.tree.scale.set(4, 4, 4);
                this.tree.rotateX(-1.81);
                this.tree.position.set(
                    50,
                    -30,
                    -200,
                );


                let i = 0;
                const rockClone = this.rocks.map(r => r.clone());
                this.rocks = [...this.rocks, ...rockClone];
                this.group.add(...rockClone);
                for (const item of [...this.rocks, ...rockClone]) {
                    const indicator = i % 2 === 0 ? -1 : 1;

                    item.geometry.center();
                    item.scale.set(4, 4, 4);
                    item.castShadow = true;
                    item.receiveShadow = true;
                    item.rotateX(-1.81);
                    item.position.set(
                        this.tree.position.x + randomInRange(10, 15) * indicator,
                        this.tree.position.y + randomInRange(10, 15) * indicator,
                        this.tree.position.z + 20,
                    );

                    i++;
                }
                this.loadSaucer();
                this.append();
                this.mainLoop();

            })
        })
    }

    mainLoop() {

        this.rotateSaucer();

        if (this.shouldRan) {
            requestAnimationFrame(this.mainLoop.bind(this));
        }

    }

    rotateSaucer() {
        if (!this.saucer) return;

        let ADD = 0.05;

        if (this.saucer.position.z < -53) this.indicator = 1;
        if (this.saucer.position.z > -47) this.indicator = -1;

        if (this.saucer.position.z < -51 || this.saucer.position.z > -45) {
            ADD = 0.01;
        }

        this.saucer.position.z += (ADD * this.indicator);

    }


    append() {
        this.createHeader();
        this.parent.add(...this.group.children);
    }

    loadSaucer() {
        const loader = GLTFLoader(this.loadingManager);


        loader.load('assets/models/saucer/scene.gltf', gltf => {
            console.log(gltf);


            const scene = gltf.scene as THREE.Scene;
            this.saucer = scene.children[0];
            this.saucer.position.set(-43, -55, -50);
            this.saucer.rotation.set(3.25, -0.34, -0.107);
            this.saucer.scale.set(100, 100, 100);
            this.saucer.castShadow = true;
            this.saucer.receiveShadow = true;
            this.parent.add(this.saucer);
            this.scene.add(gltf.scene);

            const mixer = new THREE.AnimationMixer(scene);
            gltf.animations.forEach(clip => {
                mixer.clipAction(clip).play();
            })

            this.renderer.render(scene, this.camera);


        })
    }




}

export default MyWork3D;