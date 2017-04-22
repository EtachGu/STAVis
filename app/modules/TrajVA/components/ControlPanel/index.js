import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

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

// css styles
import 'antd/dist/antd.css';
import styles from './styles.css';

// Import Actions
import { addTrajSetRequest, updateControls, addClusterTrackRequest } from '../../TrajVAActions';

// selectors
import { selectControls } from './selectors';

class ControlPanel extends Component {
	static propTypes = {
		name: React.PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			radioMapValue:1,
			radioDataBaseValue:1,
			radioGeomTypeValue: 2,
			dateRange:['2016-03-01','2016-03-02'],	// [startDate, endDate]  string type
			adSettingVisible: false,
			timeunit: '1hh',
			id: [2,3,4,5,6],
			isClstSettingOpen: false, // Cluster 开关
			clstPointMin: 5,   //  cluster 点集 的 核心数
			clstPointDis: 500,  //  cluster 点集 的 核心距离
			clstTrjMin: 10, 	// LCS-DBSCAN 线集合 核心数
			clstTrjDis: 500,   // LCS-DBSCAN 线集合  线段之间距离
			clstTrjNearNum: 20,    // LCS-DBSCAN 线集合 邻近数
			clstTrjMinLength: 500,  //  LCS-DBSCAN 线集合 最短的长度
		}
	};

	callback = (key) => {
		// console.log(key);
	};
	// on DataBase change
	onRadioDataBaseChange =  (e) => {
		this.setState({
			radioDataBaseValue: e.target.value,
		});
	};
	// onDatePickerChange
	onDatePickerChange = (date, dateString) => {
		this.setState({
			dateRange: dateString
		});
	};

	confirmQueryTrack = () => {
		const dataType = this.state.radioDataBaseValue;
		const dateRange = this.state.dateRange;
		const timeunit = this.state.timeunit;
		const id = this.state.id;
		switch (dataType) {
			case 1:
				// emit the event for query the cellPhoneTrack
				if(dateRange[0] !== '' && dateRange[0] !== ''){
					
					if (this.props.controlsState.isClstSettingOpen) {

						const requestBody = {
							collectionName: "cellPhoneTrack",
							datetime: dateRange,
							fields: "",
							"id": this.props.controlsState.id,
							parameter: {
								distance: this.props.controlsState.clstPointDis,
								minTrs: this.props.controlsState.clstPointMin
							}
						}

						this.props.updateClusterTraj(requestBody);
						
					} else {

						const requestBody = {
							trajName: "cellPhoneTrack",
							datetime: dateRange,
							timeunit: timeunit,
							id: id, // [2,3,4,5,6]//['(低)','(中)','(高)']//
						};

						this.props.updateTrajectory(requestBody);
					}
				}
				break;
			case 2:break;
			case 3:
				break;
			default:
		}
	};

	// handle for Map 
	onRadioMapChange = (e) => {
		this.setState({
			radioMapValue: e.target.value,
		});
		//  update the control State
		const controlsObject = this.props.controlsState;
		controlsObject.mapType = e.target.value;
		const controlsNew = Object.assign({}, controlsObject);
		this.props.updateControlState(controlsNew);
	}

	// handle geomTpe
	onRadioGeomTypeChange = (e) => {
		this.setState({
			radioGeomTypeValue: e.target.value,
		});
		//  update the control State
		const controlsObject = this.props.controlsState;
		controlsObject.geomType = e.target.value;
		const controlsNew = Object.assign({}, controlsObject);
		this.props.updateControlState(controlsNew);
	}

	// handle change of Switch 
	onSwitchChangeConnect = (checked) => {
		if (checked) {
			echarts.connect('group1');
			const barCharts = echarts.getInstanceByDom(document.getElementById('barCharts'));
			const pieCharts = echarts.getInstanceByDom(document.getElementById('pieCharts'));
			const mapCharts = echarts.getInstanceByDom(document.getElementById('map'));
			
			pieCharts.on('legendselectchanged', (event) => {
				const legendName = event.name;
				const isSelected = event.selected[legendName];
				
				mapCharts.dispatchAction({
					type: isSelected ? 'legendSelect' : 'legendUnSelect',
					// 图例名称
					name: legendName
				});

				barCharts.dispatchAction({
					type: isSelected ? 'legendSelect' : 'legendUnSelect',
					// 图例名称
					name: legendName
				});
			});

			mapCharts.on('legendselectchanged', (event) => {
				const legendName = event.name;
				const isSelected = event.selected[legendName];
				
				pieCharts.dispatchAction({
					type: isSelected ? 'legendSelect' : 'legendUnSelect',
					// 图例名称
					name: legendName
				});

				barCharts.dispatchAction({
					type: isSelected ? 'legendSelect' : 'legendUnSelect',
					// 图例名称
					name: legendName
				});
			});

		} else {
			// echarts.disconnect('group1');
			const barCharts = echarts.getInstanceByDom(document.getElementById('barCharts'));
			const pieCharts = echarts.getInstanceByDom(document.getElementById('pieCharts'));
			const mapCharts = echarts.getInstanceByDom(document.getElementById('map'));
			pieCharts.off('legendselectchanged');
			mapCharts.off('legendselectchanged');

		}		
	}

	/**
	 * handle Advance Setting Poper
	 */
	// handle Advance Setting Poper
	handlePopVisibleChange = (visible) => {
		this.setState({
			adSettingVisible: visible
		});
		if (visible) {
			const controlsObject = this.props.controlsState;
			this.setState({
				timeunit: controlsObject.timeunit,
				id: controlsObject.id,
				isClstSettingOpen: controlsObject.isClstSettingOpen, // Cluster 开关
				clstPointMin: controlsObject.clstPointMin,   //  cluster 点集 的 核心数
				clstPointDis: controlsObject.clstPointDis,  //  cluster 点集 的 核心距离
				clstTrjMin: controlsObject.clstTrjMin, 	// LCS-DBSCAN 线集合 核心数
				clstTrjDis: controlsObject.clstTrjDis,   // LCS-DBSCAN 线集合  线段之间距离
				clstTrjNearNum: controlsObject.clstTrjNearNum,    // LCS-DBSCAN 线集合 邻近数
				clstTrjMinLength: controlsObject.clstTrjMinLength,  //  LCS-DBSCAN 线集合 最短的长度
			});
		}
	}

	onRadioTimeUnitChange = (e) => {
		this.setState({ timeunit: e.target.value });
	}

	onChangeInputID = (e) => {
		this.setState({
			id: e.target.value.split(',').map((item) => {
						if (/^[0-9]+$/.test(item)) {
							return +item;
						}
						return item;
					}), //[2,3,4,5,6]
		});		
	}

	// handle slider of DBSCAN setting
	onChangeClstPointMin = (value) => {
		this.setState({ clstPointMin: value });
	}

	onChangeClstPointDis = (value) => {
		this.setState({ clstPointDis: value });
	}

	onChangeClstTrjMin = (value) => {
		this.setState({ clstTrjMin: value });
	}

	onChangeClstTrjDis = (value) => {
		this.setState({ clstTrjDis: value });
	}

	onChangeClstTrjNearNum = (value) => {
		this.setState({ clstTrjNearNum: value });
	}

	onChangeClstTrjMinLength = (value) => {
		this.setState({ clstTrjMinLength: value });
	}

	onSwitchClusterSetting = (checked) => {
		this.setState({ isClstSettingOpen: checked });
	}

	confirmSetting = () => {	
	
		this.setState({
			adSettingVisible: false
		});
		
		const controlsObject = this.props.controlsState;
		controlsObject.timeunit = this.state.timeunit;
		controlsObject.id = this.state.id;
		controlsObject.isClstSettingOpen = this.state.isClstSettingOpen; // Cluster 开关
		controlsObject.clstPointMin = this.state.clstPointMin;   //  cluster 点集 的 核心数
		controlsObject.clstPointDis = this.state.clstPointDis;  //  cluster 点集 的 核心距离
		controlsObject.clstTrjMin = this.state.clstTrjMin; 	// LCS-DBSCAN 线集合 核心数
		controlsObject.clstTrjDis = this.state.clstTrjDis;   // LCS-DBSCAN 线集合  线段之间距离
		controlsObject.clstTrjNearNum = this.state.clstTrjNearNum;    // LCS-DBSCAN 线集合 邻近数
		controlsObject.clstTrjMinLength = this.state.clstTrjMinLength;  //  LCS-DBSCAN 线集合 最短的长度

		const controlsNew = Object.assign({}, controlsObject);
		this.props.updateControlState(controlsNew);
	}

	cancelSetting = () => {
		const controlsObject = this.props.controlsState;
		this.setState({
			timeunit: controlsObject.timeunit,
			id: controlsObject.id,
			isClstSettingOpen: controlsObject.isClstSettingOpen, // Cluster 开关
			clstPointMin: controlsObject.clstPointMin,   //  cluster 点集 的 核心数
			clstPointDis: controlsObject.clstPointDis,  //  cluster 点集 的 核心距离
			clstTrjMin: controlsObject.clstTrjMin, 	// LCS-DBSCAN 线集合 核心数
			clstTrjDis: controlsObject.clstTrjDis,   // LCS-DBSCAN 线集合  线段之间距离
			clstTrjNearNum: controlsObject.clstTrjNearNum,    // LCS-DBSCAN 线集合 邻近数
			clstTrjMinLength: controlsObject.clstTrjMinLength,  //  LCS-DBSCAN 线集合 最短的长度
			adSettingVisible: false
		});
	}

	/**
	 * onSwitchVisibleTimeView
	 *
	 **/
	onSwitchVisibleTimeView = (checked) => {

		const controlsObject = this.props.controlsState;
		controlsObject.isTimeViewVisible = checked;
		const controlsNew = Object.assign({}, controlsObject);
		this.props.updateControlState(controlsNew);
		
	}

	onSwitchVisibleGraphView = (checked) => {

		const controlsObject = this.props.controlsState;
		controlsObject.isGraphViewVisible = checked;
		const controlsNew = Object.assign({}, controlsObject);
		this.props.updateControlState(controlsNew);
		
	}

	render() {
		const text = "control text";
		const radioStyle = {
			display: 'block',
			height: '30px',
			lineHeight: '30px',
		};
		const advanceSetting = (
			<div className={styles.advancsetting}>
				<Row>
					<label>
						时间粒度
						<div>
							<RadioGroup
									value={this.state.timeunit}
									onChange={this.onRadioTimeUnitChange}
								>
									<Radio.Button value="1mm">1mm</Radio.Button>
									<Radio.Button value="1hh">1hh</Radio.Button>
									<Radio.Button value="1dd">1dd</Radio.Button>			
							</RadioGroup>
						</div>
					</label>
					
				</Row>
				<Row>
					<label>
						人群ID
						<Input
							value={this.state.id}
							onChange={this.onChangeInputID}
						/>
					</label>
				</Row>
				{
					// 判断是否 为点 集
					this.state.radioGeomTypeValue === 1 ? (
						<div className={styles.clustersetting}>
							<Row type="flex" justify="space-between">
								<Col span={16}>
									<h4> DBSCAN聚类参数	</h4>
								</Col>
								<Col span={8}>
									<Switch
										style={{ float: "right" }}
										size="small"
										checked={this.state.isClstSettingOpen} 
										onChange={this.onSwitchClusterSetting}
									/>	
								</Col>
							</Row>
							<hr style={{ marginTop: 2, marginBottom: 2 }} />
							<Row> 核心数 </Row>
							<Row>
								<Col span={14}>
									<Slider
										min={1}
										max={50}
										onChange={this.onChangeClstPointMin}
										value={this.state.clstPointMin}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
								<Col span={10}>
									<InputNumber
										min={1}
										max={50}
										style={{ float: "right" }}
										value={this.state.clstPointMin}
										onChange={this.onChangeClstPointMin}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
							</Row>
							<Row> 核心距离 </Row>
							<Row>
								<Col span={14}>
									<Slider
										min={100}
										max={10000}
										onChange={this.onChangeClstPointDis}
										value={this.state.clstPointDis}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
								<Col span={10}>
									<InputNumber
										min={100}
										max={10000}
										style={{ float: "right" }}
										value={this.state.clstPointDis}
										onChange={this.onChangeClstPointDis}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
							</Row>
						</div>
					) : (
						<div className={styles.clustersetting}>
							<Row type="flex" justify="space-between">
								<Col span={16}>
									<h4> LCS-DBSCAN聚类参数	</h4>
								</Col>
								<Col span={8}>
									<Switch
										style={{ float: "right" }}
										size="small"
										checked={this.state.isClstSettingOpen} 
										onChange={this.onSwitchClusterSetting}
									/>	
								</Col>
							</Row>
							<hr style={{ marginTop: 2, marginBottom: 2 }} />
							<Row> 核心数 </Row>
							<Row>
								<Col span={14}>
									<Slider
										min={1}
										max={50}
										onChange={this.onChangeClstTrjMin}
										value={this.state.clstTrjMin}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
								<Col span={10}>
									<InputNumber
										min={1}
										max={50}
										style={{ float: "right" }}
										value={this.state.clstTrjMin}
										onChange={this.onChangeClstTrjMin}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
							</Row>
							<Row> 核心距离 </Row>
							<Row>
								<Col span={14}>
									<Slider
										min={100}
										max={10000}
										onChange={this.onChangeClstTrjDis}
										value={this.state.clstTrjDis}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
								<Col span={10}>
									<InputNumber
										min={100}
										max={10000}
										style={{ float: "right" }}
										value={this.state.clstTrjDis}
										onChange={this.onChangeClstTrjDis}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
							</Row>
							<Row> 轨迹邻近个数 </Row>
							<Row>
								<Col span={14}>
									<Slider
										min={1}
										max={1000}
										onChange={this.onChangeClstTrjNearNum}
										value={this.state.clstTrjNearNum}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
								<Col span={10}>
									<InputNumber
										min={1}
										max={1000}
										style={{ float: "right" }}
										value={this.state.clstTrjNearNum}
										onChange={this.onChangeClstTrjNearNum}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
							</Row>
							<Row> 轨迹最小长度 </Row>
							<Row>
								<Col span={14}>
									<Slider
										min={100}
										max={10000}
										onChange={this.onChangeClstTrjMinLength}
										value={this.state.clstTrjMinLength}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
								<Col span={10}>
									<InputNumber
										min={100}
										max={10000}
										style={{ float: "right" }}
										value={this.state.clstTrjMinLength}
										onChange={this.onChangeClstTrjMinLength}
										disabled={!this.state.isClstSettingOpen}
									/>
								</Col>
							</Row>
						</div>
					)
				}
				<Button type="primary" onClick={this.confirmSetting}>确定</Button>
				<Button type="primary" onClick={this.cancelSetting}>取消</Button>
			</div>
		);
		return (
			<div>
				<Input prefix={<Icon type="user" />} />
				<Collapse defaultActiveKey={['1']} onChange={this.callback}>
					<Panel header={<span><Icon type="database"/> 数据集</span>} key="1">
						<RadioGroup onChange={this.onRadioDataBaseChange} value={this.state.radioDataBaseValue}>
							<Radio style={radioStyle} value={1}>手机数据</Radio>
							<Radio style={radioStyle} value={2}>公交卡数据</Radio>
							<Radio style={radioStyle} value={3}>出租车数据</Radio>
						</RadioGroup>
						<hr style={{ marginTop: 5, marginBottom: 5 }} />
						<RadioGroup onChange={this.onRadioGeomTypeChange} value={this.state.radioGeomTypeValue} size="small">
							<Radio.Button value={1}>点集</Radio.Button>
							<Radio.Button value={2}>线集</Radio.Button>
						</RadioGroup>
						<div>
							<RangePicker
								defaultValue={
									[moment(this.state.dateRange[0]), moment(this.state.dateRange[1])]
								}
								onChange={this.onDatePickerChange}
							/>
						</div>
						<Popover
							placement="right"
							title="设置"
							content={advanceSetting}
							trigger="click"
							visible={this.state.adSettingVisible}
							onVisibleChange={this.handlePopVisibleChange}
						>
							<Button>高级设置</Button>
						</Popover>
						<Button type="primary" icon="search" onClick={this.confirmQueryTrack}>确定</Button>
					</Panel>
					<Panel header={<span><Icon type="filter" /> 参数设置</span>} key="2">
						<RadioGroup onChange={this.onRadioMapChange} value={this.state.radioMapValue}>
							<Radio style={radioStyle} value={1}>行政区图</Radio>
							<Radio style={radioStyle} value={2}>百度地图</Radio>
						</RadioGroup>
						<hr style={{ marginTop: 5, marginBottom: 5 }} />
						<div>
							<label>
								视图联动
								<Switch
									style={{ float: "right" }}
									size="small"
									defaultChecked={false}
									onChange={this.onSwitchChangeConnect}
								/>	
							</label>
						</div>
						
						<h4>通用设置</h4>
						<hr style={{ marginTop: 5, marginBottom: 5 }} />
						<Row>
							<label>
								时间视图开关
								<Switch
									style={{ float: "right" }}
									size="small"
									defaultChecked={true}
									onChange={this.onSwitchVisibleTimeView}
								/>	
							</label>
						</Row>
						<Row>
							<label>
								统计视图开关
								<Switch
									style={{ float: "right" }}
									size="small"
									defaultChecked={true}
									onChange={this.onSwitchVisibleGraphView}
								/>	
							</label>
						</Row>
					</Panel>
					<Panel header={<span><Icon type="setting" /> 其他</span>} key="3">
						<p>{text}</p>
					</Panel>
				</Collapse>
			</div>
		);
	}
}

ControlPanel.propTypes = {
	tt: PropTypes.func,
};

// Retrieve data from store as props
const mapStateToProps = createStructuredSelector({
	controlsState: selectControls
});

export function mapDispatchToProps(dispatch) {
	return {
	changeRoute: (url) => dispatch(push(url)),
		updateTrajectory: (requestBody) => addTrajSetRequest(requestBody)(dispatch),
		updateControlState: (controlData) => dispatch(updateControls(controlData)),
		updateClusterTraj: (requestBody) => addClusterTrackRequest(requestBody)(dispatch),
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
