// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import React from 'react';

import { ResizeObserver as ResizeObserverPolyfill } from '@juggle/resize-observer';
import { setupJestCanvasMock } from 'jest-canvas-mock';

import { createStore } from '../../common/store';
import type { Store } from '../../common/store';
import {
  createRender,
  createRenderWithRouter,
  createStoreProvider,
} from './test-utils';
import type { Render, RenderWithRouter } from './test-utils';

const unmockedFetch = global.fetch;
let render: Render;
let renderWithRouter: RenderWithRouter;
let store: Store;
let StoreProvider: React.FC<{ children: JSX.Element }>;

beforeAll(() => {
  global.fetch = jest.fn();
});

afterAll(() => {
  global.fetch = unmockedFetch;
});

beforeEach(() => {
  setupJestCanvasMock();
  jest.useFakeTimers();
  store = createStore();
  render = createRender(store);
  renderWithRouter = createRenderWithRouter(store);
  StoreProvider = createStoreProvider(store);

  if (!('ResizeObserver' in window)) {
    window.ResizeObserver = ResizeObserverPolyfill;
  } else {
    throw new Error(
      'It looks like this version of jsdom includes a ResizeObserver implementation, you should look whether our mock is still needed.',
    );
  }
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
  jest.restoreAllMocks();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();

  if (window.ResizeObserver === ResizeObserverPolyfill) {
    // @ts-expect-error Typescript doesn't know what we mocked it just above.
    delete window.ResizeObserver;
  }
});

export { store, render, renderWithRouter, StoreProvider };
