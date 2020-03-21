export abstract class ThreeAbstract {
    protected shouldRan = true;

    protected abstract init()

    protected mainLoop() {

        if (this.shouldRan) {
            requestAnimationFrame(this.mainLoop.bind(this));
        }
    }

    startAnimation() {
        this.shouldRan = true;
        this.mainLoop();
    }

    stopAnimation() {
        this.shouldRan = false;
    }
}