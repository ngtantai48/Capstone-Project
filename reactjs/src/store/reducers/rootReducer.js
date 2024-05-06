import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

import appReducer from './appReducer';
import adminReducer from './adminReducer';
import userReducer from './userReducer';

const persistCommonConfig = {
    storage,
    stateReconciler: autoMergeLevel2,
};

const adminPersistConfig = {
    ...persistCommonConfig,
    key: 'admin',
    whitelist: ['isLoggedIn', 'adminInfo'],
};

const createRootReducer = (history) => combineReducers({
    router: connectRouter(history),
    admin: persistReducer(adminPersistConfig, adminReducer),
    user: userReducer,
    app: appReducer,
});

export default createRootReducer;
