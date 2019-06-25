import bidello from 'bidello';

class Viewport {
  constructor() {
    this.width = this.calculateWidth();
    this.height = this.calculateHeight();
    this.ratio = this.width / this.height;

    this.onResize = this.onResize.bind(this);
    this.onResize();

    window.addEventListener('resize', this.onResize);
  }

  calculateWidth() {
    return window.innerWidth;
  }

  calculateHeight() {
    return window.innerHeight;
  }

  onResize() {
    this.width = this.calculateWidth();
    this.height = this.calculateHeight();
    this.ratio = this.width / this.height;

    bidello.trigger({ name: 'resize', fireAtStart: true }, {
      width: this.width,
      height: this.height,
      ratio: this.ratio,
    })
  }
}

export const viewport = new Viewport();
