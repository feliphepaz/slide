import SlideNav from './js/slide';

const slideNav = new SlideNav('.slide', '.slide-wrapper', '.prev', '.next', '.pag-location');
slideNav.addNav();
slideNav.addPagination();
