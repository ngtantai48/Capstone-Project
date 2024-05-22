import { logger } from 'redux-logger';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import { createStore, applyMiddleware, compose } from 'redux';
import { createStateSyncMiddleware } from 'redux-state-sync';
import { persistStore } from 'redux-persist';

import createRootReducer from './store/reducers/rootReducer';
import actionTypes from './store/actions/actionTypes';

const environment = process.env.NODE_ENV || 'development';
const isDevelopment = environment === 'development';

export const history = createBrowserHistory({
    basename: process.env.REACT_APP_ROUTER_BASE_NAME,
});

const reduxStateSyncConfig = {
    whitelist: [
        actionTypes.APP_START_UP_COMPLETE,
        actionTypes.CHANGE_LANGUAGE
    ],
};

const rootReducer = createRootReducer(history);

const middleware = [
    routerMiddleware(history),
    thunk,
    createStateSyncMiddleware(reduxStateSyncConfig),
];

// if (isDevelopment) {
//     const { logger } = require('redux-logger');
//     middleware.push(logger);
// }

const composeEnhancers = (isDevelopment && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({})
    : compose;

const reduxStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middleware)),
);

export const persistor = persistStore(reduxStore);

export default reduxStore;
export const dispatch = reduxStore.dispatch;
