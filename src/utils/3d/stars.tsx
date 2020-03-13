import { ThreeAbstract } from './3d-abstract';
import randomInRange from '../randomInRange';
import { createSphere } from './create-sphere';

export class Stars extends ThreeAbstract {
    stars: THREE.Mesh[] = [];


    constructor(
        private maxStars = 1000,
        private starsMaxRange = 500
    ) {
        super()
        this.init()
    }

    protected init() {
        for (let i = 0; i < this.maxStars; i++) {
            const star = createSphere({
                radius: Math.random(),
            });

            star.position.x = randomInRange(-this.starsMaxRange, this.starsMaxRange);
            star.position.y = randomInRange(-this.starsMaxRange, this.starsMaxRange);
            star.position.z = randomInRange(-this.starsMaxRange, this.starsMaxRange);

            this.stars.push(star);
        }

        // this.mainLoop()
    }

    protected mainLoop() {

        if (this.shouldRan) {
            requestAnimationFrame(this.mainLoop.bind(this));
        }
    }


}