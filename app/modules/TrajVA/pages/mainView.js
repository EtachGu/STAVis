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
import TaskSteps from '../components/TaskPanel/TaskSteps';

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
			<Layout className={styles.mainview} >
				<Sider className={styles.content}>
					<TaskPanel />
					<ControlPanel />
				</Sider>
				<Layout className={styles.content} >
					<Header className={styles.header}>
						<TaskSteps></TaskSteps>
					</Header>
					<Content className={styles.content}>
						<MapView />
					</Content>
					<Footer>
						<TimeView />
					</Footer>
				</Layout>
				<div className={styles['sider-right']}>
					<GraphView />
				</div>
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