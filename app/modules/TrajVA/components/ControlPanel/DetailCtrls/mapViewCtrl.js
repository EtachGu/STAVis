import React from 'react';
import { connect } from 'react-redux';
import echarts from 'echarts';
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


const COLOR_BAR = ['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'];

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
		this.setState({
			adSettingVisible: true
		});
	}

	handlePopVisibleChange = (visible) => {
		this.setState({
			adSettingVisible: visible
		});
	}

	onVisualMapTypeChange = (e) => {
		this.setState({
			visualMapType: e.target.value
		});
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

  	const mapCharts = echarts.getInstanceByDom(document.getElementById('map'));

  	const mapOption = mapCharts.getOption();

  	const visualMapArray = mapOption.visualMap;

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
			<Row>
				<label>
					主题
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
			<Row>
				<label>
					视觉系列列表
				</label>
				<div>
					{[...visualMapArray.map((itemVM, index)=> (<span style={{ float: "left", backgroundColor: COLOR_BAR[ index / COLOR_BAR.length ], width: 20, height: 20, margin: "5px 5px" }} ></span>))]}
				</div>
			</Row>
			<Button type="primary" onClick={this.confirmSetting}>确定</Button>
			<Button type="primary" onClick={this.cancelSetting}>取消</Button>
		</div>
	);

	return (
		<div>
			<Row>
				<label style={{ fontWeight:'bold' }}>
					地图视图设置
				</label>
				<Button
					style={{ float: "right" }}
					size="small"
					icon="left"
					onClick={this.props.toBack}
				>
					返回
				</Button>
			</Row>
			<hr style={{ marginTop: 5, marginBottom: 5 }} />
			<Row>
				<label>
					 视觉映射
					<Popover
						placement="right"
						title="视觉映射"
						content={advanceSetting}
						trigger="click"
						visible={this.state.adSettingVisible}
						onVisibleChange={this.handlePopVisibleChange}
					>
						<Button
							style={{ float: "right", borderWidth: 0 }}
							size="small"
							icon="caret-right"
							onClick={this.showDetail}
						/>
					</Popover>
				</label>
			</Row>
			<h4 style={{ marginTop: 10, marginBottom: 5 }}>系列几何设置</h4>
			<hr style={{ marginTop: 5, marginBottom: 5 }} />
			<Row>
				
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
