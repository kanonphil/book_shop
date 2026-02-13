import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import authReducer from "./authSlice";
import persistReducer from "redux-persist/es/persistReducer";
import persistStore from "redux-persist/es/persistStore";

// Persist 설정 객체
const persistConfig = {
  key: 'root',          // localStorage에 저장될 key 이름
  storage,              // 어디에 저장할지 (localStorage)
  whitelist: ['auth'],  // 어떤 reducer를 저장할지
}

const persistedReducer = persistReducer(persistConfig, authReducer)

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);