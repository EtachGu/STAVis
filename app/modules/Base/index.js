import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';

import styles from './styles.css';

class BasePage extends React.Component {
	render() {
		return (
			<div>
				<Helmet titleTemplate="%s" />
				{React.Children.toArray(this.props.children)}
			</div>
		);
	}
}

BasePage.propTypes = {
	children: React.PropTypes.node,
};

export default BasePage;
