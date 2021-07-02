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
    this.slideWrapper.addEventListener('mouseup', this.onEnd);
  }

  onStart(event) {
    event.preventDefault();
    this.dist.start = event.clientX;
    this.slide.addEventListener('mousemove', this.onMove);
  }

  onMove(event) {
    this.dist.movement = event.clientX;
    const finalPosition = this.updatePosition(this.dist.movement);
    this.moveSlide(finalPosition);
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

  init() {
    this.bind();
    this.addEvents();
  }
}