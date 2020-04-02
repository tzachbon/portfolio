import { easeInOutCubic } from 'js-easing-functions';
import * as THREE from 'three';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import randomInRange from '../randomInRange';
import { ThreeAbstract } from './3d-abstract';
import GLTFLoader from './GLTFLoader';
import OrbitControl from './orbit-control';
import { createText } from './text';

class ContactMe3D extends ThreeAbstract {
  group: THREE.Group;
  rocks: THREE.Mesh[];
  header: THREE.Mesh;
  robot: THREE.Object3D;
  mainStats = {
    rotation: {
      x: 5.1,
      y: -3.140000000000001,
      z: -1.8569999999999998
    },
    position: {
      x: -160,
      y: -40,
      z: 0
    },
    mailP: {
      x: -160,
      y: -50,
      z: -10
    },
    mailR: {
      x: 3.3999999999999995,
      y: -1.74,
      z: -1.4569999999999999
    }
  };

  constructor(
    private loadingManager: THREE.LoadingManager,
    private scene: THREE.Scene,
    private control: typeof OrbitControl,
    private renderer: THREE.Renderer,
    private camera: THREE.Camera,
    private parent?: THREE.Mesh | THREE.Group | THREE.Scene
  ) {
    super();

    if (!this.parent) {
      this.parent = this.scene;
    }

    this.init();
  }
  init() {
    this.setElements();
  }

  createHeader() {
    this.header = createText('Contact Me', {
      size: 15
    });
    this.header.rotation.set(
      this.mainStats.rotation.x,
      this.mainStats.rotation.y + 0.3,
      this.mainStats.rotation.z
    );
    this.header.position.set(
      this.mainStats.position.x,
      this.mainStats.position.y,
      this.mainStats.position.z
    );
    this.group.add(this.header);
  }

  zoomIn(duration = 2000) {
    let isFinished = false;

    const startPosition = {
      vector: new THREE.Vector3(
        this.camera.position.x,
        this.camera.position.y,
        this.camera.position.z
      )
    };
    const endPosition = {
      vector: new THREE.Vector3(
        // -34.91200013084606,
        // -57.47192466037821,
        // 13.903014939997403
        -28.504587879227252,
        -84.76966501998247,
        7.878963068273084
      )
    };

    let startTime = Date.now();
    // this.control.enableZoom = false
    return new Promise((res, rej) => {
      this.zoomInHelper(isFinished, res, {
        duration,
        startPosition,
        endPosition,
        startTime
      });
    });
  }

  private zoomInHelper(isFinished: boolean, resolver: Function, easeConfig) {
    const { duration, startPosition, startTime, endPosition } = easeConfig;

    const elapsed = Date.now() - startTime;

    if (elapsed < duration) {
      this.camera.position.set(
        easeInOutCubic(
          elapsed,
          startPosition.vector.x,
          endPosition.vector.x - startPosition.vector.x,
          duration
        ),
        easeInOutCubic(
          elapsed,
          startPosition.vector.y,
          endPosition.vector.y - startPosition.vector.y,
          duration
        ),
        easeInOutCubic(
          elapsed,
          startPosition.vector.z,
          endPosition.vector.z - startPosition.vector.z,
          duration
        )
      );

      requestAnimationFrame(
        this.zoomInHelper.bind(this, isFinished, resolver, easeConfig)
      );
    } else {
      isFinished = true;
      // this.control.target = this.astro.position;
      resolver(isFinished);
    }
  }

  setElements() {
    let objLoader = new OBJLoader(this.loadingManager);
    let mtlLoader = new MTLLoader();
    mtlLoader.load('assets/models/NatureFreePack1.mtl', materials => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load(
        'assets/models/NatureFreePack1.obj',
        (group: THREE.Group) => {
          group.children.forEach((m: THREE.Mesh) => m?.geometry?.center());

          this.rocks = group.children.filter(m =>
            m.name.includes('Rock')
          ) as THREE.Mesh[];
          const items = [...this.rocks];
          this.group = new THREE.Group();
          this.group.add(...items);

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
            item.rotation.set(
              this.mainStats.rotation.x,
              this.mainStats.rotation.y,
              this.mainStats.rotation.z
            );
            item.position.set(
              this.mainStats.position.x + randomInRange(10, 15) * indicator,
              this.mainStats.position.y + randomInRange(10, 15) * indicator,
              this.mainStats.position.z - 15
            );

            i++;
          }
          this.loadRobot();
          this.append();
        }
      );
    });
  }


  loadRobot() {
    const loader = GLTFLoader(this.loadingManager);

    loader.load('assets/models/robot/scene.gltf', gltf => {
      const scene = gltf.scene as THREE.Scene;
      this.robot = scene.children[0];
      this.robot.scale.set(0.1, 0.1, 0.1);
      this.robot.position.set(
        this.mainStats.mailP.x,
        this.mainStats.mailP.y - 8,
        this.mainStats.mailP.z - 20
      );
      this.robot.rotation.set(
        this.mainStats.mailR.x + 10,
        this.mainStats.mailR.y + 0.5,
        this.mainStats.mailR.z + 1.5
      );
      this.parent.add(this.robot);
      this.scene.add(gltf.scene);

      this.renderer.render(scene, this.camera);
    });
  }

  append() {
    this.createHeader();
    this.parent.add(...this.group.children);
  }
}

export default ContactMe3D;
