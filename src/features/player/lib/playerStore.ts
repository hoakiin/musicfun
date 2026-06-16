type Listener = () => void;

let _currentTime = 0;
let _duration = 0;
let _isPlaying = false;
const _listeners = new Set<Listener>();

const notify = () => _listeners.forEach((fn) => fn());

export const playerStore = {
  get currentTime() {
    return _currentTime;
  },
  set currentTime(value: number) {
    _currentTime = value;
    notify();
  },

  get duration() {
    return _duration;
  },
  set duration(value: number) {
    _duration = value;
    notify();
  },

  get isPlaying() {
    return _isPlaying;
  },
  set isPlaying(value: boolean) {
    _isPlaying = value;
    notify();
  },

  subscribe(fn: Listener) {
    _listeners.add(fn);
    return () => {
      _listeners.delete(fn);
    };
  },
};
