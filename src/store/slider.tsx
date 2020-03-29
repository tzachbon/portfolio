import { observable, action } from 'mobx';
import { Subject } from 'rxjs';

const portalManagement1 = 'assets/images/my-work/portal-management/1.png';
const portalManagement2 = 'assets/images/my-work/portal-management/2.png';
const portalManagement3 = 'assets/images/my-work/portal-management/3.png';
const chatMeApp1 = 'assets/images/my-work/chat-me-app/1.png';
const chatMeApp2 = 'assets/images/my-work/chat-me-app/2.png';
const chatMeApp3 = 'assets/images/my-work/chat-me-app/3.png';
const boniPhotos1 = 'assets/images/my-work/boni-photos/1.png';
const boniPhotos2 = 'assets/images/my-work/boni-photos/2.png';
const boniPhotos3 = 'assets/images/my-work/boni-photos/3.png';
const boniPhotos4 = 'assets/images/my-work/boni-photos/4.png';
const intelligo1 = 'assets/images/my-work/intelligo/1.png';
const intelligo2 = 'assets/images/my-work/intelligo/2.png';
const intelligo3 = 'assets/images/my-work/intelligo/3.png';
const intelligo4 = 'assets/images/my-work/intelligo/4.png';
const intelligo5 = 'assets/images/my-work/intelligo/5.png';
const intelligo6 = 'assets/images/my-work/intelligo/6.png';
const newForm1 = 'assets/images/my-work/new-form/1.png';
const newForm2 = 'assets/images/my-work/new-form/2.png';
const newForm3 = 'assets/images/my-work/new-form/3.png';
const sixEye1 = 'assets/images/my-work/six-eye/1.png';
const sixEye2 = 'assets/images/my-work/six-eye/2.png';
const sixEye3 = 'assets/images/my-work/six-eye/3.png';

class SliderStore {
  @observable private slideAction$ = new Subject<'next' | 'previous'>();
  @observable slideAction = this.slideAction$.asObservable();
  @observable slides = [
    {
      name: 'intelligo',
      images: [
        intelligo1,
        intelligo2,
        intelligo3,
        intelligo4,
        intelligo5,
        intelligo6
      ],
      desc:
        'A great platform for creating background checks, my role is the frontend team leader in addition to performing some backend tasks.',
      link: 'http://intelligo.ai'
    },
    {
      name: 'chat me app',
      images: [chatMeApp1, chatMeApp2, chatMeApp3],
      desc: 'Chat me app is a platform for chat messaging and chat group.',
      link: 'http://chat-me-app-free.herokuapp.com'
    },
    {
      name: 'new form',
      images: [newForm1, newForm2, newForm3],
      desc:
        'Digital form creation system, everything drag and drop. Co-managing team forms and managing their information.',
      link: ''
    },
    {
      name: 'boni-photos',
      images: [boniPhotos1, boniPhotos2, boniPhotos3, boniPhotos4],
      desc:
        'Landing site for a photography company with a sophisticated messaging backend system and receiving updates on the amount of users and views',
      link: 'http://boni-photos.herokuapp.com'
    },
    {
      name: 'six-eye',
      images: [sixEye1, sixEye2, sixEye3],
      desc:
        'Real-time forklift control system, working with websocket and map coordinating at any given moment.',
      link: ''
    },
    {
      name: 'portal management',
      images: [portalManagement1, portalManagement2, portalManagement3],
      desc:
        'Information management system for investment company, server retrieval and information management via bi.',
      link: ''
    }
  ];

  @action
  goNext = () => {
    this.slideAction$.next('next');
  };

  @action
  goPrevious = () => {
    this.slideAction$.next('previous');
  };
}

export default SliderStore;
