import '@testing-library/jest-dom';

// Mock scrollIntoView in JSDOM
window.HTMLElement.prototype.scrollIntoView = function() {};

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Web Audio API
class AudioContextMock {
  sampleRate = 44100;
  currentTime = 0;
  state = 'suspended';
  
  createBuffer() {
    return {
      getChannelData: () => new Float32Array(100),
      sampleRate: 44100,
      length: 100,
      duration: 100 / 44100,
      numberOfChannels: 1
    };
  }
  
  createBufferSource() {
    return {
      buffer: null,
      loop: false,
      connect: () => {},
      disconnect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  
  createGain() {
    return {
      gain: {
        value: 1,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
        connect: () => {},
      },
      connect: () => {},
      disconnect: () => {},
    };
  }
  
  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        setValueAtTime: () => {},
      },
      connect: () => {},
      disconnect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  
  close() {
    return Promise.resolve();
  }
}

Object.defineProperty(window, 'AudioContext', {
  value: AudioContextMock,
});
Object.defineProperty(window, 'webkitAudioContext', {
  value: AudioContextMock,
});

Object.defineProperty(window, 'crypto', {
  value: {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
    randomUUID: () => 'test-uuid-1234'
  }
});

