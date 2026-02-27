import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import usersReducer from "./slices/userSlice";
import employeesReducer from "./slices/employeeSlice";
import projectsReducer from "./slices/projectSlice";
import rolesReducer from "./slices/roleSlice";

const persistConfig = {
  key: "persist-rbac",
  storage,
  whitelist: ["auth"]
};

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  employees: employeesReducer,
  projects: projectsReducer,
  roles: rolesReducer
});

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER
        ]
      }
    })
});

export const persistor = persistStore(store);

export default store