import { ThreeAbstract } from './3d-abstract';
import { MTLLoader, OBJLoader } from 'three-obj-mtl-loader'
import * as THREE from 'three';
import { toRadians } from './math';
import OrbitControl from './orbit-control';
import AboutMe3D from './about-me';
import MyWork3D from './my-work';



export class Planet extends ThreeAbstract {
    star: THREE.Group;
    previousMousePosition = { x: 0, y: 0 };
    isDragging = false;
    targetRotationX = 0;
    targetRotationOnMouseDownX = 0;
    targetRotationY = 0;
    targetRotationOnMouseDownY = 0;
    mouseX = 0;
    mouseXOnMouseDown = 0;
    mouseY = 0;
    mouseYOnMouseDown = 0;
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    finalRotationY: number;
    aboutMe: AboutMe3D;
    myWork: MyWork3D;
    clouds: THREE.Group[] = [];

    constructor(
        private loadingManager: THREE.LoadingManager,
        private scene: THREE.Scene,
        private control: typeof OrbitControl,
        private renderer: THREE.Renderer,
        private camera: THREE.Camera
    ) {
        super()
        this.init()
    }


    protected init() {

        this.appendEventListener();
        this.appendStars();

        this.mainLoop();
    }

    private appendStars() {

        let objLoader = new OBJLoader(this.loadingManager);
        let mtlLoader = new MTLLoader();

        new THREE.TextureLoader(this.loadingManager)
            .load(
                './assets/images/Abstract_003_NRM.jpg',
                (texture) => {

                    objLoader.load(
                        'assets/models/Earth_Low.obj',
                        (obj: THREE.Group) => {

                            this.star = obj;
                            this.star.scale.set(0.15, 0.15, 0.15);
                            this.star.children.forEach((m: THREE.Mesh) => {
                                const material = (m.material as THREE.MeshPhongMaterial);
                                material.map = texture;
                            })
                            this.star.receiveShadow = true;
                            this.star.position.set(0, 0, 0);

                            mtlLoader.load('assets/models/NatureFreePack1.mtl', (materials) => {
                                materials.preload()
                                objLoader.setMaterials(materials)
                                objLoader.load('assets/models/NatureFreePack1.obj', (group: THREE.Group) => {
                                    this.star.children.forEach((m: THREE.Mesh) => m?.geometry?.center());
                                    this.append();
                                    this.createAboutMe();
                                    this.createMyWork();
                                    this.control.target = this.star.position;
                                })
                            })
                        }
                    )
                },
                (xhr) => { },
                (xhr) => { console.log('An error happened'); }
            )
    }


    protected mainLoop() {

        this.starRotation();

        if (this.shouldRan) {
            requestAnimationFrame(this.mainLoop.bind(this));
        }
    }

    createMyWork() {
        this.myWork = new MyWork3D(this.loadingManager, this.scene, this.control, this.renderer, this.camera, this.star);
    }

    createAboutMe() {
        this.aboutMe = new AboutMe3D(this.loadingManager, this.scene, this.control, this.renderer, this.camera, this.star);
    }

    append() {
        this.scene.add(this.star);

    }




    starRotation() {
        if (!this.star || !this.isDragging) return;

        this.star.rotation.y += (this.targetRotationX - this.star.rotation.y) * 0.1;

        //vertical rotation 
        this.finalRotationY = (this.targetRotationY - this.star.rotation.x);
        //     this.star.rotation.x += finalRotationY * 0.05;

        //     finalRotationY = (targetRotationY - this.star.rotation.x);  
        if (this.star.rotation.x <= 1 && this.star.rotation.x >= -1) {

            this.star.rotation.x += this.finalRotationY * 0.1;
        }
        if (this.star.rotation.x > 1) {

            this.star.rotation.x = 1
        }

        if (this.star.rotation.x < -1) {

            this.star.rotation.x = -1
        }
    }

    resetRotation() {
        this.previousMousePosition = { x: 0, y: 0 };
        this.isDragging = false;
        this.targetRotationX = 0;
        this.targetRotationOnMouseDownX = 0;
        this.targetRotationY = 0;
        this.targetRotationOnMouseDownY = 0;
        this.mouseX = 0;
        this.mouseXOnMouseDown = 0;
        this.mouseY = 0;
        this.mouseYOnMouseDown = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
    }

    onMove = e => {

        if (e.touches) {
            const [touch] = e.touches;
            console.log(touch);

            e.offsetX = touch.clientX;
            e.offsetY = touch.clientY;
        }

        const deltaMove = {
            x: e.offsetX - this.previousMousePosition.x,
            y: e.offsetY - this.previousMousePosition.y
        };

        if (this.isDragging) {

            const deltaRotationQuaternion = new THREE
                .Quaternion()
                .setFromEuler(
                    new THREE.Euler(
                        toRadians(deltaMove.y * .15),
                        toRadians(deltaMove.x * .15),
                        0,
                        'XYZ'
                    )
                );

            this.star.quaternion.multiplyQuaternions(deltaRotationQuaternion, this.star.quaternion);
        }

        this.previousMousePosition = {
            x: e.offsetX,
            y: e.offsetY
        };

    }

    private appendEventListener() {


        document.addEventListener('mousedown', this.onDocumentMouseDown.bind(this), false);
        document.addEventListener('touchstart', this.onDocumentTouchStart.bind(this), false);
        document.addEventListener('touchmove', this.onDocumentTouchMove.bind(this), false);

    }



    onDocumentMouseDown(event) {


        this.isDragging = true;


        document.addEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        document.addEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
        document.addEventListener('mouseout', this.onDocumentMouseOut.bind(this), false);

        this.mouseXOnMouseDown = event.clientX - this.windowHalfX;
        this.targetRotationOnMouseDownX = this.targetRotationX;

        this.mouseYOnMouseDown = event.clientY - this.windowHalfY;
        this.targetRotationOnMouseDownY = this.targetRotationY;

    }

    onDocumentMouseMove(event) {

        if (!this.isDragging) return;

        this.mouseX = event.clientX - this.windowHalfX;
        this.mouseY = event.clientY - this.windowHalfY;

        this.targetRotationY = this.targetRotationOnMouseDownY + (this.mouseY - this.mouseYOnMouseDown) * 0.02;
        this.targetRotationX = this.targetRotationOnMouseDownX + (this.mouseX - this.mouseXOnMouseDown) * 0.02;

    }

    onDocumentMouseUp(event) {

        this.isDragging = false;


        document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        document.removeEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
        document.removeEventListener('mouseout', this.onDocumentMouseOut.bind(this), false);

    }

    onDocumentMouseOut(event) {


        document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this), false);
        document.removeEventListener('mouseup', this.onDocumentMouseUp.bind(this), false);
        document.removeEventListener('mouseout', this.onDocumentMouseOut.bind(this), false);

    }

    onDocumentTouchStart(event) {

        if (event.touches.length == 1) {

            this.isDragging = true;
            this.control.enabled = false;


            this.mouseXOnMouseDown = event.touches[0].pageX - this.windowHalfX;
            this.targetRotationOnMouseDownX = this.targetRotationX;

            this.mouseYOnMouseDown = event.touches[0].pageY - this.windowHalfY;
            this.targetRotationOnMouseDownY = this.targetRotationY;

        }

    }

    onDocumentTouchMove(event) {

        if (event.touches.length == 1) {

            this.isDragging = true;
            this.control.enabled = false;


            this.mouseX = event.touches[0].pageX - this.windowHalfX;
            this.targetRotationX = this.targetRotationOnMouseDownX + (this.mouseX - this.mouseXOnMouseDown) * 0.05;

            this.mouseY = event.touches[0].pageY - this.windowHalfY;
            this.targetRotationY = this.targetRotationOnMouseDownY + (this.mouseY - this.mouseYOnMouseDown) * 0.05;

        }

    }

}