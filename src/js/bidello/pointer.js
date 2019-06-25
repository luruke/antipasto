import bidello from 'bidello';
import { Vector2, Vector3} from 'three';
import { clamp } from 'math-toolbox';
import camera from '/js/camera';
import { viewport } from './viewport';

class Pointer {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.isTouching = true;
    this.distance = 0;

    this.hold = new Vector2();
    this.last = new Vector2();
    this.delta = new Vector2();
    this.move = new Vector2();
    this.world = new Vector3();
    this.normalized = new Vector2();
    this._tmp = new Vector3();

    this.bind();
  }

  bind() {
    const container = window;

    container.addEventListener('touchstart', this.onStart.bind(this), {
      passive: false
    });
    container.addEventListener('touchmove', this.onMove.bind(this), {
      passive: false
    });
    container.addEventListener('touchend', this.onEnd.bind(this), {
      passive: false
    });
    container.addEventListener('touchcancel', this.onEnd.bind(this), {
      passive: false
    });

    container.addEventListener('mousedown', this.onStart.bind(this));
    container.addEventListener('mousemove', this.onMove.bind(this));
    container.addEventListener('mouseup', this.onEnd.bind(this));
    container.addEventListener('contextmenu', this.onEnd.bind(this));
  }

  convertEvent(e) {
    e.preventDefault();
    e.stopPropagation();

    const t = {
      x: 0,
      y: 0,
    };

    if (!e) {
      return t;
    }

    if (e.windowsPointer) {
      return e;
    }

    if (e.touches || e.changedTouches) {
      if (e.touches.length) {
        t.x = e.touches[0].pageX;
        t.y = e.touches[0].pageY;
      } else {
        t.x = e.changedTouches[0].pageX;
        t.y = e.changedTouches[0].pageY;
      }
    } else {
      t.x = e.pageX;
      t.y = e.pageY;
    }

    t.x = clamp(0, viewport.width, t.x);
    t.y = clamp(0, viewport.height, t.y);

    return t;
  }

  onStart(event) {
    const e = this.convertEvent(event);

    this.isTouching = true;
    this.x = e.x;
    this.y = e.y;

    this.hold.set(e.x, e.y);
    this.last.set(e.x, e.y);
    this.delta.set(0, 0);
    this.move.set(0, 0);

    this.normalized.x = ((this.x / viewport.width) * 2) - 1;
    this.normalized.y = (-(this.y / viewport.height) * 2) + 1;
    this.distance = 0;

    bidello.trigger({
      name: 'pointerStart'
    }, {
      pointer: this,
    });
  }

  onMove(event) {
    const e = this.convertEvent(event);

    if (this.isTouching) {
      this.move.x = e.x - this.hold.x;
      this.move.y = e.y - this.hold.y;
    }

    // if (this.last.x !== e.x || this.last.y !== e.y) {
    //   this.last.set(this.x, this.y);
    // }

    this.x = e.x;
    this.y = e.y;
    this.delta.x = e.x - this.last.x;
    this.delta.y = e.y - this.last.y;

    this.distance += this.delta.length();

    this.normalized.x = ((this.x / viewport.width) * 2) - 1;
    this.normalized.y = (-(this.y / viewport.height) * 2) + 1;

    this._tmp.x = this.normalized.x;
    this._tmp.y = this.normalized.y;
    this._tmp.z = 0.5;
    this._tmp.unproject(camera);
    const dir = this._tmp.sub(camera.position).normalize();
    const dist = -camera.position.z / dir.z;
    this.world.copy(camera.position).add(dir.multiplyScalar(dist));

    bidello.trigger({
      name: 'pointerMove'
    }, {
      pointer: this,
    });

    if (this.isTouching) {
      bidello.trigger({
        name: 'pointerDrag'
      }, {
        pointer: this,
      });
    }
  }

  onEnd() {
    this.isTouching = false;
    this.move.set(0, 0);

    bidello.trigger({
      name: 'pointerEnd'
    }, {
      pointer: this,
    });
  }
}

export const pointer = new Pointer();