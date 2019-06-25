import bidello from 'bidello';

class Raf {
  constructor() {
    this.time = window.performance.now();

    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.onTick = this.onTick.bind(this);
    this.start();
  }

  start() {
    this.startTime = window.performance.now();
    this.oldTime = this.startTime;
    this.isPaused = false;

    this.onTick(this.startTime);
  }

  pause() {
    this.isPaused = true;
  }

  onTick(now) {
    this.time = now;

    if (!this.isPaused) {
      this.delta = (now - this.oldTime) / 1000;
      this.oldTime = now;

      bidello.trigger({ name: 'raf' }, {
        delta: this.delta,
        now
      });
    }

    window.requestAnimationFrame(this.onTick);
  }
}

export const raf = new Raf();
