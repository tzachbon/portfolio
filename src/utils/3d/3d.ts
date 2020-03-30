import { easeInSine } from 'js-easing-functions';
import { BehaviorSubject } from 'rxjs';
import * as THREE from 'three';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader';
import randomInRange from '../randomInRange';
import { ThreeAbstract } from './3d-abstract';
import AboutMe3D from './about-me';
import MyWork3D from './my-work';
import OrbitControl from './orbit-control';
import { Planet } from './planet';
import { Stars } from './stars';
import createMainText from './text';
import { DESKTOP } from '../mobile';
import { easeInOutCubic } from 'js-easing-functions';
import { SECTION_ROUTES } from '../../store/store';

class Animation extends ThreeAbstract {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private loadingManager: THREE.LoadingManager;
  private directionalLightUp: THREE.DirectionalLight;
  public planet: Planet;
  private zoomInFinished = true;
  private readonly maxZoom = !DESKTOP ? 85 : 60;
  private text: THREE.Group;
  public tween;
  public control: typeof OrbitControl;
  public mainItem: THREE.Mesh | THREE.Group;
  public enablePlanetRotation = true;
  public rotationMap = new Map<
    string,
    THREE.Mesh | THREE.Light | THREE.Group
  >();
  rotationSpeed = 0.001;
  public loadingStatus = new BehaviorSubject<number>(0);
  private stars: Stars;
  public initRotation = {
    x: 0,
    y: 0,
    z: 0
  };

  constructor(public domParent: HTMLElement, private isMobile: boolean) {
    super();
    this.init();

    (window as any).animation = this;
  }

  protected init() {
    this.startLoadingManager();
    this.startScene();
    this.startCamera();
    this.startLighting();
    this.startOrbitControl();

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.VSMShadowMap;

    this.domParent.appendChild(this.renderer.domElement);

    this.appendStars();
    this.appendPlanet();
    this.appendClouds();
    // this.appendHelper();

    this.initEventListeners();
    this.mainLoop();
  }

  private startOrbitControl() {
    this.control = new OrbitControl(this.camera, this.domParent);
    this.control.enableDamping = true;
    this.control.enableRotate = false;
    this.control.enableZoom = true;
    this.control.enablePan = false;
    this.control.minDistance = this.maxZoom;
    this.control.maxDistance = 500;
  }

  private startLoadingManager() {
    this.loadingManager = new THREE.LoadingManager();

    this.loadingManager.onProgress = (url, loaded, total) => {
      const percentage = (loaded * 100) / total;
      this.loadingStatus.next(percentage);
    };

    this.loadingManager.onLoad = () => {
      this.loadingStatus.next(100);
      this.loadingStatus.complete();
    };
  }

  private startScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
  }

  private startCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    this.camera.position.z = 1000;
    this.camera.position.y = 25;
    this.camera.castShadow = false;
    this.scene.add(this.camera);
  }

  private startLighting() {
    this.directionalLightUp = new THREE.DirectionalLight(0xffffff);
    this.directionalLightUp.castShadow = true;
    this.directionalLightUp.receiveShadow = true;
    this.directionalLightUp.shadow = new THREE.DirectionalLightShadow(
      new THREE.PerspectiveCamera(500, 100, 100, 2500)
    );
    this.directionalLightUp.shadow.bias = 0.05;
    this.directionalLightUp.shadow.mapSize.width = 2048;
    this.directionalLightUp.shadow.mapSize.width = 1024;
    this.scene.add(this.directionalLightUp);
  }

  private appendClouds() {
    let objLoader = new OBJLoader(this.loadingManager);
    let mtlLoader = new MTLLoader();

    mtlLoader.load('assets/models/clouds/cloud.mtl', materials => {
      materials.preload();
      objLoader.setMaterials(materials);
      objLoader.load('assets/models/clouds/cloud.obj', (group: THREE.Group) => {
        for (let i = 0; i < 20; i++) {
          const cloud = group.clone();

          cloud.children.forEach((m: THREE.Mesh) => {
            m?.geometry?.center();
            (m.material as THREE.MeshPhongMaterial).color = new THREE.Color(
              0xffffff
            );
          });
          this.scene.add(cloud);

          cloud.position.x = randomInRange(-150, 150, -100, 100);
          cloud.position.y = randomInRange(-150, 150, -100, 100);
          cloud.position.z = randomInRange(-150, 150, -100, 100);

          const randomScale = randomInRange(0.02, 0.04);
          cloud.scale.set(randomScale, randomScale, randomScale);
          this.rotationMap.set(`cloud_${i}`, cloud);
        }
      });
    });
  }

  private appendHelper(size = 400) {
    const axesHelper = new THREE.AxesHelper(size);
    this.scene.add(axesHelper);
  }

  private appendPlanet() {
    this.planet = new Planet(
      this.loadingManager,
      this.scene,
      this.control,
      this.renderer,
      this.camera,
      this
    );
  }

  private appendText() {
    this.text = createMainText();
    this.text.position.set(0, 5, -50);
    this.camera.add(this.text);
  }

  private appendStars() {
    this.stars = new Stars();
    this.stars.stars.forEach((star, i) =>
      this.rotationMap.set(`star_${i}`, star)
    );
    this.scene.add(...this.stars.stars);
  }

  zoomIn() {
    let i = 0;
    let isFinished = false;

    this.zoomInFinished = isFinished;

    const duration = 10000;
    const startPosition = this.directionalLightUp.position.z;
    const endPosition = 100;

    let startTime = Date.now();

    this.scene.add(this.text);

    this.control.enableZoom = false;

    return new Promise((res, rej) => {
      this.zoomInHelper(i, isFinished, res, {
        duration,
        startPosition,
        endPosition,
        startTime
      });
    })
      .then(() => (this.zoomInFinished = true))
      .then(() => (this.control.enableZoom = true));
  }

  private zoomInHelper(
    index: number,
    isFinished: boolean,
    resolver: Function,
    easeConfig
  ) {
    const { duration, startPosition, startTime } = easeConfig;

    const elapsed = Date.now() - startTime;

    if (elapsed < duration) {
      this.directionalLightUp.position.z = easeInSine(
        elapsed,
        startPosition,
        this.maxZoom,
        duration
      );
    }

    if (this.camera.position.z > this.maxZoom && !isFinished) {
      this.camera.position.z -=
        ++index / (this.camera.position.z > 100 ? 20 : 100);

      requestAnimationFrame(
        this.zoomInHelper.bind(this, index, isFinished, resolver, easeConfig)
      );
    } else {
      this.rotationSpeed = 0.0007;
      isFinished = true;
      resolver(isFinished);
    }
  }

  private cameraRotation() {
    this.rotationMap.forEach(element => {
      let x = element.position.x;
      let z = element.position.z;

      element.position.x =
        x * Math.cos(this.rotationSpeed) + z * Math.sin(this.rotationSpeed);
      element.position.z =
        z * Math.cos(this.rotationSpeed) - x * Math.sin(this.rotationSpeed);
    });
  }

  zoomInOnSection(section: keyof typeof SECTION_ROUTES): Promise<any> {
    const planet = this.planet;
    const section3d = planet[section as keyof Planet] as MyWork3D | AboutMe3D;

    if (!section3d) return this.resetRotation();

    this.control.enableZoom = false;

    this.zoomInFinished = false;
    return Promise.all([this.resetRotation(), section3d.zoomIn()])
      .then(() => (this.zoomInFinished = true))
      .then(() => (this.control.enableZoom = true));
  }

  resetRotation(duration = 2000) {
    let isFinished = false;

    const startPosition = {
      x: this.planet.star.rotation.x,
      y: this.planet.star.rotation.y,
      z: this.planet.star.rotation.z
    };

    const endPosition = {
      ...this.initRotation
    };

    this.planet.resetRotation();

    let startTime = Date.now();
    // this.control.enableZoom = false
    return new Promise((res, rej) => {
      this.resetRotationHelper(isFinished, res, {
        duration,
        startPosition,
        endPosition,
        startTime
      });
    });
  }

  private resetRotationHelper(
    isFinished: boolean,
    resolver: Function,
    easeConfig
  ) {
    const { duration, startPosition, startTime, endPosition } = easeConfig;

    const elapsed = Date.now() - startTime;

    if (elapsed < duration) {
      this.planet.star.rotation.set(
        easeInOutCubic(
          elapsed,
          startPosition.x,
          endPosition.x - startPosition.x,
          duration
        ),
        easeInOutCubic(
          elapsed,
          startPosition.y,
          endPosition.y - startPosition.y,
          duration
        ),
        easeInOutCubic(
          elapsed,
          startPosition.z,
          endPosition.z - startPosition.z,
          duration
        )
      );

      requestAnimationFrame(
        this.resetRotationHelper.bind(this, isFinished, resolver, easeConfig)
      );
    } else {
      isFinished = true;
      // this.control.target = this.astro.position;
      resolver(isFinished);
    }
  }

  protected mainLoop() {
    this.cameraRotation();

    this.updateLighting();

    this.control.update();

    this.renderer.render(this.scene, this.camera);

    if (this.shouldRan) {
      requestAnimationFrame(this.mainLoop.bind(this));
    }
  }

  private initEventListeners() {
    window.addEventListener(
      'resize',
      e => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
      },
      false
    );

    window.addEventListener('mousemove', ({ movementX, movementY }) => {
      if (this.zoomInFinished) {
        this.camera.position.x -= movementX / 250;
        this.camera.position.y -= movementY / 250;
      }
    });

    // window.addEventListener('wheel', e => {
    //     if (!this.zoomInFinished) return;

    //     const delta = e.deltaY / 50;
    //     this.zoom(delta);
    // })
  }

  private updateLighting() {
    this.directionalLightUp.position.copy(this.camera.position);
  }
}

export default Animation;
