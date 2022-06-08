import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';

import alert from '../reducers/AlertSlice';
import checkedRevisions from '../reducers/CheckedRevisions';
import search from '../reducers/SearchSlice';
import selectedRevisions from '../reducers/SelectedRevisions';

const reducer = combineReducers({
  alert,
  search,
  checkedRevisions,
  selectedRevisions,
});

export const store = configureStore({
  reducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;