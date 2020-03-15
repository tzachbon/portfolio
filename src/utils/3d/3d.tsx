
import { BehaviorSubject } from 'rxjs';
import * as THREE from 'three';
import { ThreeAbstract } from './3d-abstract';
import { Planet } from './planet';
import { Stars } from './stars';
import createMainText from './text';
import { easeInSine } from 'js-easing-functions';
import OrbitControl from './orbit-control';

class Animation extends ThreeAbstract {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private isDragging = false;
    private loadingManager: THREE.LoadingManager;
    private directionalLightUp: THREE.DirectionalLight;
    private planet: Planet;
    private main: THREE.Mesh | THREE.Group;
    private zoomInFinished = true;
    private readonly maxZoom = this.isMobile ? 85 : 50;
    private text: THREE.Group;
    public tween;
    public control: typeof OrbitControl;
    public mainItem: THREE.Mesh | THREE.Group;
    public rotationMap = new Map<string, THREE.Mesh | THREE.Light>();
    rotationSpeed = 0.001;
    private tree: THREE.Mesh;
    public loadingStatus = new BehaviorSubject<number>(0)
    private stars: Stars;
    private cameraPos = {
        x: -15,
        y: -5,
        z: 20
    };




    constructor(
        public domParent: HTMLElement,
        private isMobile: boolean
    ) {
        super();
        this.init();

        (window as any).animation = this;
    }

    protected init() {
        this.startLoadingManager();
        this.startScene();
        this.startLighting()
        this.startCamera();
        this.startOrbitControl();


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;

        this.domParent.appendChild(this.renderer.domElement);

        this.appendStars();
        this.appendPlanet();
        // this.appendText()

        this.initEventListeners();
        this.mainLoop();

    }


    startOrbitControl() {
        this.control = new OrbitControl(this.camera, this.domParent);
        this.control.enableDamping = true;
        this.control.enableRotate = false;
        this.control.enableZoom = false;
        this.control.enablePan = false;
        this.control.minDistance = this.maxZoom;
        this.control.maxDistance = 500;
    }

    startLoadingManager() {

        this.loadingManager = new THREE.LoadingManager();

        this.loadingManager.onProgress = (url, loaded, total) => {

            const percentage = loaded * 100 / total;
            this.loadingStatus.next(percentage);
        }

        this.loadingManager.onLoad = () => {
            this.loadingStatus.next(100);
            this.loadingStatus.complete();
        }
    }

    startScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
    }

    startCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            1,
            1000
        )

        this.camera.position.z = 500;
        this.camera.position.y = 25;
        this.scene.add(this.camera)
    }

    startLighting() {
        this.directionalLightUp = new THREE.DirectionalLight(0xffffff);
        this.directionalLightUp.castShadow = true;
        this.directionalLightUp.receiveShadow = true;
        this.directionalLightUp.shadow = new THREE.DirectionalLightShadow(
            new THREE.PerspectiveCamera(500, 100, 100, 2500)
        )
        this.directionalLightUp.shadow.bias = 0.05;
        this.directionalLightUp.shadow.mapSize.width = 2048;
        this.directionalLightUp.shadow.mapSize.width = 1024;
        this.scene.add(this.directionalLightUp);
    }

    appendPlanet() {
        this.planet = new Planet(this.loadingManager, this.scene, this.control);
        this.main = this.planet.star;
    }

    appendText() {
        this.text = createMainText();
        this.text.position.set(
            0,
            5,
            -50
        );
        this.camera.add(this.text);
    }

    appendStars() {
        this.stars = new Stars();
        this.stars.stars.forEach((star, i) => this.rotationMap.set(`star_${i}`, star));
        this.scene.add(...this.stars.stars)
    }

    zoomIn() {



        let i = 0;
        let isFinished = false;

        this.zoomInFinished = isFinished

        const duration = 10000;
        const startPosition = this.directionalLightUp.position.z;
        const endPosition = 100;

        let startTime = Date.now();

        this.camera.remove(this.text);
        this.text && this.text.position.set(
            this.directionalLightUp.position.x - 2,
            this.directionalLightUp.position.y - 2,
            this.directionalLightUp.position.z - 42,
        )
        this.scene.add(this.text);

        return new Promise((res, rej) => {
            this.zoomInHelper(i, isFinished, res, {
                duration,
                startPosition,
                endPosition,
                startTime
            });
        })
            .then(() => this.zoomInFinished = true)
            .then(() => this.control.enableZoom = true)
    }

    private zoomInHelper(index: number, isFinished: boolean, resolver: Function, easeConfig) {

        const {
            duration,
            startPosition,
            startTime
        } = easeConfig;

        const elapsed = Date.now() - startTime;

        if (elapsed < duration) {
            this.directionalLightUp.position.z = easeInSine(elapsed, startPosition, this.maxZoom, duration);
        }



        if (this.camera.position.z > this.maxZoom && !isFinished) {
            this.camera.position.z -= (++index / 20);

            requestAnimationFrame(this.zoomInHelper.bind(this, index, isFinished, resolver, easeConfig))

        } else {
            this.rotationSpeed = .0007;
            isFinished = true;
            resolver(isFinished);
        }
    }

    private lookAt() {
        this.camera.lookAt(this.mainItem?.position ?? 0, 0, 0);
    }

    private cameraRotation() {


        this.rotationMap.forEach(element => {
            let x = element.position.x;
            let z = element.position.z;

            element.position.x = x * Math.cos(this.rotationSpeed) + z * Math.sin(this.rotationSpeed);
            element.position.z = z * Math.cos(this.rotationSpeed) - x * Math.sin(this.rotationSpeed);
        })

    }


    protected mainLoop() {

        this.cameraRotation();

        this.lookAt();

        this.control.update();
        this.renderer.render(this.scene, this.camera)

        if (this.shouldRan) {
            requestAnimationFrame(this.mainLoop.bind(this));
        }
    }

    private initEventListeners() {

        window.addEventListener('resize', e => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();

            this.renderer.setSize(window.innerWidth, window.innerHeight);

        }, false);


        window.addEventListener('mousemove', ({ movementX, movementY }) => {

            this.camera.position.x -= movementX / 500;
            this.camera.position.y -= movementY / 500;

        })

        // window.addEventListener('wheel', e => {
        //     if (!this.zoomInFinished) return;

        //     const delta = e.deltaY / 50;
        //     this.zoom(delta);
        // })




    }


    zoom(delta: number) {

        const z = this.camera.position.z + delta;
        if ((z > 500 && delta > 0) || (z <= (this.maxZoom) && delta < 0)) return;

        this.camera.position.x += delta;
        this.camera.position.y += delta;
        this.camera.position.z += delta;

        setTimeout(() => {

            this.directionalLightUp.position.x = this.camera.position.x;
            this.directionalLightUp.position.y = this.camera.position.y;
            this.directionalLightUp.position.z = this.camera.position.z;

        }, 250);
    }

}




export default Animation;