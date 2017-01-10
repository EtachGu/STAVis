/**
 * app.js
 *
 * 整个应用的总入口
 */

// 让redux-saga支持es6语法包
import 'babel-polyfill';

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Container from 'container';

class App extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Container />
            </div>
        );
    }
}

ReactDOM.render(<App/>,document.getElementById('app'));

