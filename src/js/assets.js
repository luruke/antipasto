import Loader from 'resource-loader';
import bidello from 'bidello';
import deferred from './utils/deferred';

const Resource = Loader.Resource;
const RESOURCES = [
  // {
  //   name: 'audio_cubeup',
  //   url: 'voo-hub/assets/sound/cube-up.mp3',
  //   loadType: Resource.LOAD_TYPE.XHR,
  //   xhrType: Resource.XHR_RESPONSE_TYPE.BLOB,
  // },

  // {
  //   name: 'audio_cubedown',
  //   url: 'voo-hub/assets/sound/cube-down.mp3',
  //   loadType: Resource.LOAD_TYPE.XHR,
  //   xhrType: Resource.XHR_RESPONSE_TYPE.BLOB,
  // },

  {
    name: 'photo',
    url: require('/assets/photo.jpg')
  },
];

class Assets {
  load() {
    this.deferred = deferred();
    this.loader = new Loader();

    bidello.trigger({ name: 'loadStart' });

    RESOURCES.forEach(res => {
      this.loader.add(res);
    });

    this.loader.onProgress.add(this.onProgress.bind(this));
    this.loader.load(this.finish.bind(this));

    return deferred;
  }

  onProgress() {
    bidello.trigger({ name: 'loadProgress' }, { progress: this.loader.progress });
  }

  finish() {
    this.resources = this.loader.resources;
    this.deferred.resolve();
    
    bidello.trigger({ name: 'loadEnd' }, { resources: this.resources });
  }
}

export default new Assets();
