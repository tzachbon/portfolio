
import Animation from '../utils/3d/3d';
import { observable, action } from 'mobx'

class Store {
    @observable animation: Animation;

    @action
    zoomIn() {
        return this.animation.zoomIn();
    }
}

export default Store;