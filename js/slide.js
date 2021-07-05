import debounce from './debounce';

export class Slide {
  constructor(slide, slideWrapper) {
    this.slide = document.querySelector(slide);
    this.slideWrapper = document.querySelector(slideWrapper);
    this.dist = {
      start: 0,
      movement: 0,
      final: 0,
    };
  }

  addEvents() {
    this.slideWrapper.addEventListener('mousedown', this.onStart);
    this.slideWrapper.addEventListener('touchstart', this.onStart);
    this.slideWrapper.addEventListener('mouseup', this.onEnd);
    this.slideWrapper.addEventListener('touchend', this.onEnd);
    window.addEventListener('resize', this.onResize);
  }

  onStart(event) {
    let movetype;
    if (event.type === 'mousedown') {
      event.preventDefault();
      this.dist.start = event.clientX;
      movetype = 'mousemove';
    } else {
      this.dist.start = Math.floor(event.changedTouches[0].clientX);
      movetype = 'touchmove';
    }
    this.slide.addEventListener(movetype, this.onMove);
    this.slideTransition(false);
  }

  onMove(event) {
    if (event.type === 'mousemove') {
      this.dist.movement = event.clientX;
      const finalPosition = this.updatePosition(this.dist.movement);
      this.moveSlide(finalPosition);
    } else {
      this.dist.movement = event.changedTouches[0].clientX;
      const finalPosition = this.updatePosition(this.dist.movement);
      this.moveSlide(finalPosition);
    }
  }

  updatePosition(move) {
    this.difference = (move - this.dist.start) * 1.6;
    return this.difference + this.dist.final;
  }

  moveSlide(moveX) {
    this.moveX = moveX;
    this.slide.style.transform = `translate3d(${moveX}px, 0px, 0px)`;
  }

  onEnd() {
    this.slide.removeEventListener('mousemove', this.onMove);
    this.dist.final = this.moveX;
    this.changeSlideOnEnd();
    this.slideTransition(true);
  }

  changeSlideOnEnd() {
    if (this.difference > 120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else if (this.difference < -120 && this.index.next !== undefined) {
      this.activeNextSlide();
    } else {
      this.changeSlide(this.index.actual);
    }
  }

  slidePosition(slide) {
    const margin = (this.slideWrapper.offsetWidth - slide.offsetWidth) / 2;
    return -(slide.offsetLeft - margin);
  }

  slidesConfig() {
    this.slidesArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element);
      return {
        position,
        element,
      };
    });
  }

  slidesIndexNav(index) {
    const checkLast = this.slidesArray.length - 1;
    this.index = {
      prev: index ? index - 1 : undefined,
      actual: index,
      next: index === checkLast ? undefined : index + 1,
    };
    this.addClass();
  }

  changeSlide(index) {
    const activeSlide = this.slidesArray[index].position;
    this.moveSlide(activeSlide);
    this.dist.final = activeSlide;
    this.slidesIndexNav(index);
  }

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      this.changeSlide(this.index.prev);
      if (this.pagLocation === null || this.havePagination) {
        this.handleClasses(true);
      }
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      this.changeSlide(this.index.next);
      if (this.pagLocation === null || this.havePagination) {
        this.handleClasses(true);
      }
    }
  }

  slideTransition(active) {
    this.slide.style.transition = active ? 'transform .3s' : '';
  }

  addClass() {
    this.slidesArray.forEach((slide) => {
      slide.element.classList.remove('active');
    });
    this.slidesArray[this.index.actual].element.classList.add('active');
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.actual);
    }, 1000);
  }

  bind() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);
    this.onResize = debounce(this.onResize.bind(this), 200);
  }

  init() {
    this.bind();
    this.slidesConfig();
    this.addEvents();
    this.changeSlide(0);
    return this;
  }
}

export default class SlideNav extends Slide {
  constructor(slide, slideWrapper, prev, next, pagLocation) {
    super(slide, slideWrapper);
    this.prevBtn = document.querySelector(prev);
    this.nextBtn = document.querySelector(next);
    this.pagLocation = document.querySelector(pagLocation);
    this.havePagination = false;
  }

  createPagination(addThumbs) {
    const ul = document.createElement('ul');
    ul.setAttribute('data-control', 'slide');
    ul.classList.add('custom-controls');
    this.slidesArray.forEach((item, index) => {
      const addThumb = `<img src="../img/foto${index + 1}-thumb.jpg">`;
      ul.innerHTML += `<li>${addThumbs ? addThumb : ''}</li>`;
    });
    this.pagLocation.appendChild(ul);
    this.pagination = ul;
  }

  handleClasses(add) {
    this.arrayPagination.forEach((item) => {
      item.classList.remove('active');
    });
    if (add) {
      this.arrayPagination[this.index.actual].classList.add('active');
    }
  }

  addNavPagination() {
    this.createPagination(true);
    this.arrayPagination = [...this.pagination.children];
    this.arrayPagination.forEach((item, index) => {
      item.addEventListener('click', (() => {
        this.changeSlide(index);
        this.handleClasses(false);
        item.classList.add('active');
      }));
    });
  }

  addNav() {
    this.init();
    this.prevBtn.addEventListener('click', this.activePrevSlide);
    this.nextBtn.addEventListener('click', this.activeNextSlide);
  }

  addPagination() {
    this.init();
    this.addNavPagination();
    this.arrayPagination[0].classList.add('active');
    this.havePagination = true;
  }
}
