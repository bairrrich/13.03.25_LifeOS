/**
 * Jest setup file
 */
import '@testing-library/jest-dom';

// Mock for window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock for localStorage с реальным хранилищем в памяти
const localStorageStore: Record<string, string> = {};
const localStorageMock = {
  getItem: jest.fn((key: string) => localStorageStore[key] || null),
  setItem: jest.fn((key: string, value: string) => {
    localStorageStore[key] = value;
  }),
  removeItem: jest.fn((key: string) => {
    delete localStorageStore[key];
  }),
  clear: jest.fn(() => {
    Object.keys(localStorageStore).forEach(key => delete localStorageStore[key]);
  }),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock for CustomEvent
global.CustomEvent = class CustomEvent extends Event {
  detail: any;
  constructor(type: string, eventInitDict?: CustomEventInit) {
    super(type, eventInitDict);
    this.detail = eventInitDict?.detail;
  }
} as any;

// Mock for Notification
global.Notification = class Notification extends EventTarget {
  static permission: NotificationPermission = 'default';
  static requestPermission: () => Promise<NotificationPermission> = jest.fn(() => Promise.resolve('default'));
  constructor(title: string, options?: NotificationOptions) {
    super();
  }
} as any;

// Mock for AudioContext
(window as any).AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn(() => ({
    connect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    frequency: { value: 0 },
    type: 'sine',
  })),
  createGain: jest.fn(() => ({
    connect: jest.fn(),
    gain: {
      setValueAtTime: jest.fn(),
      exponentialRampToValueAtTime: jest.fn(),
    },
  })),
  destination: {},
  currentTime: 0,
}));
