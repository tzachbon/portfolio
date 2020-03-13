
import * as THREE from 'three';
import { ThreeAbstract } from './3d-abstract';
import { Stars } from './stars';
import { createText } from './text';


class Animation extends ThreeAbstract {
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private isDragging = false;
    private loadingManager: THREE.LoadingManager;
    private directionalLightUp: THREE.DirectionalLight;
    private planet: /* THREE.Mesh */ THREE.Group;
    private cubes: THREE.Mesh[] = [];
    private plane: THREE.Mesh;
    private littleMoon: THREE.Mesh;
    private raycaster = new THREE.Raycaster();
    private main: THREE.Mesh;
    private mouse = new THREE.Vector2();
    private mediumMoon: THREE.Mesh;
    private theta = 0;
    public mainItem: THREE.Mesh | THREE.Group;
    public rotationMap = new Map<string, THREE.Mesh | THREE.Light>();
    rotationSpeed = 0.001;
    private tree: THREE.Mesh;
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
    }

    protected init() {

        this.startScene();
        this.startLighting()
        this.startCamera();


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.VSMShadowMap;

        this.domParent.appendChild(this.renderer.domElement);

        this.appendStars();
        this.appendText('test')


        this.initEventListeners();
        this.mainLoop();

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

        this.camera.position.z = this.isMobile ? 500 : 200;
        this.camera.position.x = this.isMobile ? -50 : this.camera.position.x;
        this.camera.position.y = 25;
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
        this.rotationMap.set('light', this.directionalLightUp);
        this.scene.add(this.directionalLightUp);
    }

    appendText(text: string) {
        const textRef = createText(text);
        this.rotationMap.set('text', textRef);
        this.scene.add(textRef);
    }

    appendStars() {
        this.stars = new Stars();
        this.scene.add(...this.stars.stars)
    }

    zoomIn() {

        let i = 0;
        let isFinished = false;

        this.zoomInHelper(i, isFinished);
    }

    private zoomInHelper(index: number, isFinished: boolean) {
        const maxZoom = this.isMobile ? 85 : 40;
        if (this.camera.position.z > maxZoom && !isFinished) {
            this.camera.position.z -= (1 * (++index / 100));

            requestAnimationFrame(this.zoomInHelper.bind(this, index, isFinished))

        } else {
            this.rotationSpeed = .0003;
            isFinished = true;
        }
    }

    private lookAt() {
        this.camera.lookAt(this.mainItem?.position ?? 0, 0, 0);
    }

    private cameraRotation() {

        let x = this.camera.position.x;
        let z = this.camera.position.z;
        this.camera.position.x = x * Math.cos(this.rotationSpeed) + z * Math.sin(this.rotationSpeed);
        this.camera.position.z = z * Math.cos(this.rotationSpeed) - x * Math.sin(this.rotationSpeed);
        this.rotationMap.forEach(element => element.position.set(this.camera.position.x, this.camera.position.y, this.camera.position.z))

    }


    protected mainLoop() {
        this.cameraRotation();

        this.lookAt();

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
    }





}

export default Animation;