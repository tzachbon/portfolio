import Animation from '../utils/3d/3d';
import { observable, action } from 'mobx';

export const SECTION_ROUTES = {
  aboutMe: 'about-me',
  myWork: 'my-work',
  workFlow: 'work-flow',
  contactMe: 'contact-me'
};

class Store {
  @observable animation: Animation;

  @action
  zoomIn() {
    return this.animation.zoomIn();
  }
}

export default Store;
