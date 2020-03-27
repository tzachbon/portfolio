export default {
  getCoords: (elem: HTMLElement) => {
    const doc = document.documentElement;
    const menu = document.getElementById('main-menu');
    const scrollT =
      (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

    const boxTop = Math.round(elem.getBoundingClientRect().top);

    const body = document.body;
    const docEl = document.documentElement;

    const clientTop = docEl.clientTop || body.clientTop || 0;

    return boxTop + scrollT - clientTop - window.innerHeight;
  }
};
