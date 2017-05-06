import React from 'react';
import { connect } from 'react-redux';

// import components
import {
	Input,
	Icon,
	Collapse,
	Radio,
	DatePicker,
	Button,
	Switch,
	Popover,
	Select,
	Row,
	Col,
	Slider,
	InputNumber,
}  from 'antd';

const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;

//css
import styles from '../styles.css';


export class MapViewCtrl extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
		toBack: React.PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.state ={
			adSettingVisible: false,
			visualMapType: 'piecewise'
		}
	}

	showDetail = () => {

	}

	handlePopVisibleChange = () => {

	}

	onVisualMapTypeChange = () => {

	}

	confirmSetting = () => {
		this.setState({
			adSettingVisible: false
		});
	}

	cancelSetting = () => {
		this.setState({
			adSettingVisible: false
		});
	}


  render() {

	const advanceSetting = (
		<div className={styles.advancsetting}>
			<Row>
				<label>
					类型
					<div>
						<RadioGroup
								value={this.state.visualMapType}
								onChange={this.onVisualMapTypeChange}
							>
								<Radio.Button value="continuous">连续型</Radio.Button>
								<Radio.Button value="piecewise">分段型</Radio.Button>
						</RadioGroup>
					</div>
				</label>
			</Row>
			<Button type="primary" onClick={this.confirmSetting}>确定</Button>
			<Button type="primary" onClick={this.cancelSetting}>取消</Button>
		</div>
	);

	return (
		<div>
			<Row>
				<label>
					地图视图设置
					<Button
						style={{ float: "left" }}
						className={styles['btn-detail']}
						size="small"
						icon="left"
						onClick={this.props.toBack}
					/>
				</label>
			</Row>
			<Row>
				<label>
					 视觉映射
					<Popover
						placement="right"
						title="设置"
						content={advanceSetting}
						trigger="click"
						visible={this.state.adSettingVisible}
						onVisibleChange={this.handlePopVisibleChange}
					>
						<Button
							style={{ float: "right" }}
							className={styles['btn-detail']}
							size="small"
							icon="caret-right"
							onClick={this.showDetail}
						/>
					</Popover>
				</label>
			</Row>

		</div>
	);
  }
}


function mapStateToProps(state) {
	return {

	};
}


export default connect(
	mapStateToProps,
// Implement map dispatch to props
)(MapViewCtrl)
