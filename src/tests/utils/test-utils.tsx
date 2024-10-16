import React from 'react';

import { render as rtlRender } from '@testing-library/react';
import { Provider } from 'react-redux';

import { store } from '../../common/store';

function render(ui: React.ReactElement) {
  function Wrapper({ children }: { children: React.ReactElement }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(ui, { wrapper: Wrapper });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
export { store };
