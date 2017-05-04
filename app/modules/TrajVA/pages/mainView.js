import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Import Components
import { Layout, Icon } from 'antd';
import ControlPanel from '../components/ControlPanel';
import GraphView from '../components/GraphView';
import MapView from '../components/MapView';
import TimeView from '../components/TimeView';
import TaskPanel from '../components/TaskPanel';
import TaskSteps from '../components/TaskPanel/TaskSteps';

// selector 
import {selectControl} from './selectors';

// Import Actions
import { addTrajSetRequest, addStatisticRequest } from '../TrajVAActions';

// Import Selectors
import { getTrajVA } from '../TrajVAReducer';

// Import Styles
import 'antd/dist/antd.css';
import styles from './styles.css';

const { Header, Footer, Sider, Content } = Layout;

class MainView extends Component {
	constructor(props) {
		super(props);
		this.state = {
			slideCollapse: false,
		};
	}
	
	componentDidMount() {
		const requestBody = {
			trajName: this.props.control.trajName,
			datetime: this.props.control.datetime,
			timeunit: '1hh',
			id: []
		};
		this.props.chooseDataSet(requestBody);
		
		const requestStatistic = [
			{
				collectName: this.props.control.trajName,
				type: "avg",
				datetime:this.props.control.datetime,
				timeunit: '1hh',
				fields: []
			}
		];
		this.props.requestStatistics(requestStatistic);
	}

	tgeSlideCollapse = () => {
		this.setState({
			slideCollapse:!this.state.slideCollapse
		});
	}

	render() {
		return (
			<Layout className={styles.mainview} >
				<Sider
					className={this.state.slideCollapse ? styles['sider-hidden'] : styles.content }
				>
					<TaskPanel />
					<ControlPanel />
				</Sider>
				<Layout className={styles.content} >
					<Header className={styles.header}>
						<Icon
							className={styles.trgmenu}
							type={this.state.slideCollapse ? 'menu-unfold' : 'menu-fold'}
							onClick={this.tgeSlideCollapse}
						/>
						<div className={styles.tasktree}>
							<TaskSteps></TaskSteps>	
						</div>
					</Header>
					<Content className={styles.content}>
						<MapView />
						{ this.props.control.isTimeViewVisible ? <TimeView /> : <div /> }
					</Content>
					<Footer>
						
					</Footer>
				</Layout>
				{ 
					this.props.control.isGraphViewVisible ?
						<div className={styles['sider-right']}>
							 <GraphView /> 
						</div>
					: 
						<div />
				}
			</Layout>
		);
	}
}

MainView.propTypes = {
	ee: React.PropTypes.any,
	control: PropTypes.object.isRequired
};

// 任何时候，只要 Redux store 发生改变，mapStateToProps 函数就会被调用。
const mapStateToProps = createStructuredSelector({
	control: selectControl
});

// 如果你省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注入到你的组件 props 中。
export function mapDispatchToProps(dispatch) {
	return {
		changeRoute: (url) => dispatch(push(url)),
		chooseDataSet: (params) => addTrajSetRequest(params)(dispatch),
		requestStatistics: (params) => addStatisticRequest(params)(dispatch)
	};
}

// react-redux 的使用方式
// connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
// 连接 React 组件与 Redux store。
export default connect(mapStateToProps, mapDispatchToProps)(MainView);