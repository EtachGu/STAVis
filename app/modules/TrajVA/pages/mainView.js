import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Import Components
import { Layout } from 'antd';
import ControlPanel from '../components/ControlPanel';
import GraphView from '../components/GraphView';
import MapView from '../components/MapView';
import TimeView from '../components/TimeView';
import TaskPanel from '../components/TaskPanel';

// Import Actions
import { addTaxiOD, addTaxiODRequest, fetchTaxiODs, fetchTaxiOD } from '../TrajVAActions';

// Import Selectors
import { getTrajVA } from '../TrajVAReducer';

// Import Styles
import 'antd/dist/antd.css';
import styles from './styles.css';

const { Header, Footer, Sider, Content } = Layout;

class MainView extends Component {
	componentDidMount() {
		
	}

	render() {
		return (
			<Layout >
				<Header className={styles.header}>header</Header>
				<Layout className={styles.content} >
					<Sider className={styles.content}>
						<TaskPanel />
						<ControlPanel />
					</Sider>
					<Content className={styles.content}>
						<MapView />
						<TimeView />
					</Content>
					<Sider className={styles.content}>
						<GraphView />
					</Sider>
				</Layout>
				<Footer>footer</Footer>
			</Layout>
		);
	}
}

MainView.propTypes = {
	ee: React.PropTypes.any,
};

// 任何时候，只要 Redux store 发生改变，mapStateToProps 函数就会被调用。
const mapStateToProps = createStructuredSelector({
});

// 如果你省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注入到你的组件 props 中。
export function mapDispatchToProps(dispatch) {
	return {
		changeRoute: (url) => dispatch(push(url)),
	};
}

// react-redux 的使用方式
// connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
// 连接 React 组件与 Redux store。
export default connect(mapStateToProps, mapDispatchToProps)(MainView);