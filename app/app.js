/**
 * app.js
 *
 * 整个应用的总入口
 */
// 引入第三方控件
// 让redux-saga支持es6语法包
import 'babel-polyfill';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';

import configureStore from './store';
import routes from './routes';

// 创建带history的redux store，让store和history结合在一起的一部分。
// 使用react-router提供的browserHistory 。
const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Router history={browserHistory}>
          {routes}
        </Router>
    </Provider>,
    document.getElementById('app')
);