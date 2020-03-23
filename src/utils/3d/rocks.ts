import { ThreeAbstract } from './3d-abstract';
import OrbitControl from './orbit-control';
import * as THREE from 'three';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import randomInRange from '../randomInRange';


class Rocks3D extends ThreeAbstract {
    rocks: THREE.Mesh[] = []
    private positions = [
        {
            x: -32.5,
            y: 157.11,
            z: 52.76
        },
        {
            x: -129.30218412579325,
            y: -17.740716551533183,
            z: 96.36738752585529
        },
        {
            x: 42.26864270983003,
            y: -133.43200643325838,
            z: 90.04400372823153,
        },
        {
            x: 147.97001140849574,
            y: 40.056777221246705,
            z: 75.13824164970077
        }
    ]

    constructor(
        private loadingManager: THREE.LoadingManager,
        private scene: THREE.Scene,
        private control: typeof OrbitControl,
        private renderer: THREE.Renderer,
        private camera: THREE.Camera,
        private parent?: THREE.Mesh | THREE.Group | THREE.Scene
    ) {
        super()
        this.init();
    }

    init() {

        this.createRocks();

        this.mainLoop();

    }

    createRocks() {
        let objLoader = new OBJLoader(this.loadingManager);
        let mtlLoader = new MTLLoader();
        mtlLoader.load('assets/models/NatureFreePack1.mtl', (materials) => {
            materials.preload()
            objLoader.setMaterials(materials)
            objLoader.load('assets/models/NatureFreePack1.obj', (group: THREE.Group) => {

                group.children.forEach((m: THREE.Mesh) => m?.geometry?.center());
                this.rocks = group.children.filter(m => m.name.includes('Rock')) as THREE.Mesh[];


                for (let i = 0; i < 2; i++) {
                    const rocksClone = this.rocks.slice().map(r => r.clone());
                    this.rocks = [...this.rocks, ...rocksClone];
                }

                this.rocks.forEach((rock, i) => {
                    rock.geometry.center();
                    rock.scale.set(12, 12, 12);
                    rock.castShadow = true;
                    rock.rotateX(-1.81);
                    (rock.material as THREE.MeshPhongMaterial).color = new THREE.Color('#74b9ff');
                    this.setRockPosition(rock);

                    i++;
                    this.parent.add(rock);
                })

            })
        })
    }

    mainLoop() {

        if (this.shouldRan) {
            requestAnimationFrame(this.mainLoop.bind(this))
        }
    }

    setRockPosition(rock: THREE.Mesh) {
        const index = Math.round(randomInRange(0, this.positions.length - 1));
        const position = { ...this.positions[index] };

        Object.entries(position).forEach(([key, value]) => position[key] = value + randomInRange(-20, 20));

        rock.position.set(position.x, position.y, position.z);
    }
}

export default Rocks3D;