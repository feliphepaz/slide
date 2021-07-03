export default class Slide {
  constructor(slide, slideWrapper) {
    this.slide = document.querySelector(slide);
    this.slideWrapper = document.querySelector(slideWrapper);
    this.dist = {
      start: 0,
      movement: 0,
      final: 0,
    }
  }

  addEvents() {
    this.slideWrapper.addEventListener('mousedown', this.onStart);
    this.slideWrapper.addEventListener('touchstart', this.onStart);
    this.slideWrapper.addEventListener('mouseup', this.onEnd);
    this.slideWrapper.addEventListener('touchend', this.onEnd);
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
  }

  bind() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);
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
    }
    console.log(this.index);
  }

  changeSlide(index) {
    const activeSlide = this.slidesArray[index].position;
    this.moveSlide(activeSlide);
    this.dist.final = activeSlide;
    this.slidesIndexNav(index);
  }

  init() {
    this.bind();
    this.slidesConfig();
    this.addEvents();
  }
}