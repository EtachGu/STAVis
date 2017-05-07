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

//Static parameters Popover Type
const POP_SERIES = 0;
const POP_VISUALMAP = 1;
const POP_TOOLBOX = 2;
const POP_MARKAREA = 3;
const POP_MARKLINE = 4;
const POP_MARKPOINT = 5;


export class TimeViewCtrl extends React.Component {
	static propTypes = {
		name: React.PropTypes.string,
		toBack: React.PropTypes.func,
	};

	constructor(props) {
		super(props);
		this.state ={
			seriesVisible: false,
			visualMVisible: false,
			toolboxVisible: false,
			markAreaVisible: false,
			markLineVisibe: false,
			markPointVisible: false,

			visualMapType: 'piecewise',

			seriesIndex: 0
		}
	}

	showDetail = (popoverType) => {

		this.handlePopVisibleChange(true, popoverType);
	}

	handlePopVisibleChange = (visible, popoverType) => {

		switch(popoverType) {
			case POP_SERIES:
				this.setState({
					seriesVisible: visible
				});
				break;
			case POP_VISUALMAP:
				this.setState({
					visualMVisible: visible
				});
				break;
			case POP_TOOLBOX:
				this.setState({
					toolboxVisible: visible
				});
				break;
			case POP_MARKAREA:
				this.setState({
					markAreaVisible: visible
				});
				break;
			case POP_MARKLINE:
				this.setState({
					markLineVisibe: visible
				});
				break;
			case POP_MARKPOINT:
				this.setState({
					markPointVisible: visible
				});
			default: break;
		}
	}

	onVisualMapTypeChange = (e) => {

		this.setState({
			visualMapType: e.target.value
		});
	}

	confirmSetting = (popoverType) => {

		this.handlePopVisibleChange(false, popoverType);
	}

	cancelSetting = (popoverType) => {

		this.handlePopVisibleChange(false, popoverType);
	}

	// generate VisualMap setting
	generateSeries = (seriesArray, color) => {

		const everySerieInfo = seriesArray.map( item => {

			return (<div>
					<Row>
						<label>
							名称：
							{item.name}
						</label>
					</Row>
					<Row>
						<label>
							类型：
							{item.type}
						</label>
					</Row>
					<Row>
						<label>
							数量：
							{item.data.length}
						</label>
					</Row>
				</div>);
		});

		let serieInfo = everySerieInfo[this.state.seriesIndex] ? everySerieInfo[this.state.seriesIndex] : everySerieInfo[0] ;

		const advanceSetting = (
			<div className={styles.advancsetting}>
				<Row>
					<label>
						系列列表
					</label>
					<div>
						{
							[...seriesArray.map((itemVM, index)=> (
									<span
										style={{ float: "left", backgroundColor: color[ index % color.length ], width: 20, height: 20, margin: "5px 5px" }} 
										onClick={ () =>  {
												serieInfo = everySerieInfo[index];
												this.setState({
													seriesIndex: index
												});
											}
										}
									></span>
								)
							)]
						}
					</div>
				</Row>
				{serieInfo}
				<Button type="primary" onClick={() => this.confirmSetting(POP_SERIES)}>确定</Button>
				<Button type="primary" onClick={() => this.cancelSetting(POP_SERIES)}>取消</Button>
			</div>
		);

		return advanceSetting;
	}

	generateVisualMap = (visualMapArray) => {

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
						色带
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
				<Button type="primary" onClick={() => this.confirmSetting(POP_VISUALMAP)}>确定</Button>
				<Button type="primary" onClick={() => this.cancelSetting(POP_VISUALMAP)}>取消</Button>
			</div>
		);

		return advanceSetting;
	}

	generateToolBox = (toolboxArray) => {

		if (typeof toolboxArray === 'undefined')
			return null;

		const everyToolBoxInfo = toolboxArray.map( item => {

			return (<div>
					<Row>
						<label>
							开关
							<Switch
								style={{ float: "right" }}
								size="small"
								defaultChecked={item.show}
								onChange={(checked) => item.show = checked}
							/>
						</label>
					</Row>
					<Row>
						<label>
							布局朝向
							<div>
								<RadioGroup
										value={item.orient}
										onChange={(e) => item.orient = e.target.value}
									>
										<Radio.Button value="horizontal">水平</Radio.Button>
										<Radio.Button value="vertical">垂直</Radio.Button>
								</RadioGroup>
							</div>
						</label>
					</Row>
				</div>);
		});

		let toolboxInfo = everyToolBoxInfo[0] ? everyToolBoxInfo[0] : (<div></div>);

		const advanceSetting = (
			<div className={styles.advancsetting}>
				<Row>
					<label>
						工具集合
					</label>
					<div>
						{
							[...toolboxArray.map((itemVM, index)=> (
									<span style={{ float: "left", backgroundColor: COLOR_BAR[ index % COLOR_BAR.length ], width: 20, height: 20, margin: "5px 5px" }} 
									onClick={() =>  toolboxInfo = everyToolBoxInfo[index]}></span>
								)
							)]
						}
					</div>
				</Row>
				{toolboxInfo}
				<Button type="primary" onClick={() => this.confirmSetting(POP_TOOLBOX)}>确定</Button>
				<Button type="primary" onClick={() => this.cancelSetting(POP_TOOLBOX)}>取消</Button>
			</div>
		);

		return advanceSetting;
	}


  render() {

  	const timeCharts = echarts.getInstanceByDom(document.getElementById('timeCharts'));

  	const timeOption = timeCharts.getOption();

  	const seriesSetting =  this.generateSeries(timeOption.series, timeOption.color);

	const visualMapSetting = this.generateVisualMap(timeOption.visualMap);

	const toolboxSetting = this.generateToolBox(timeOption.toolbox);

	const markAreaSetting = null; //this.generateMarkArea();

	const markLineSetting = null ;//(<div></div>);

	const markPointSetting = null;

	return (
		<div>
			<Row>
				<label style={{ fontWeight:'bold' }}>
					时间视图设置
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
					系列集合
					<Popover
						placement="right"
						title="系列集合 Series"
						content={seriesSetting}
						trigger="click"
						visible={this.state.seriesVisible}
						onVisibleChange={(visible) => this.handlePopVisibleChange(visible, POP_SERIES)}
					>
						<Button
							style={{ float: "right", borderWidth: 0 }}
							size="small"
							icon="caret-right"
							onClick={() => this.showDetail(POP_SERIES)}
						/>
					</Popover>
				</label>
			</Row>
			<Row>
				<label>
					 视觉映射
					<Popover
						placement="right"
						title="视觉映射"
						content={visualMapSetting}
						trigger="click"
						visible={this.state.visualMVisible}
						onVisibleChange={(visible) => this.handlePopVisibleChange(visible, POP_VISUALMAP)}
					>
						<Button
							style={{ float: "right", borderWidth: 0 }}
							size="small"
							icon="caret-right"
							onClick={() => this.showDetail(POP_VISUALMAP)}
						/>
					</Popover>
				</label>
			</Row>
			<Row>
				<label>
					工具箱
					<Popover
						placement="right"
						title="工具箱 toolbox"
						content={toolboxSetting}
						trigger="click"
						visible={this.state.toolboxVisible}
						onVisibleChange={(visible) => this.handlePopVisibleChange(visible,POP_TOOLBOX)}
					>
						<Button
							style={{ float: "right", borderWidth: 0 }}
							size="small"
							icon="caret-right"
							onClick={() => this.showDetail(POP_TOOLBOX)}
						/>
					</Popover>
				</label>
			</Row>
			<Row>
				<label>
					区域标记
					<Popover
						placement="right"
						title="区域标记 markArea "
						content={markAreaSetting}
						trigger="click"
						visible={this.state.markAreaVisible}
						onVisibleChange={(visible) => this.handlePopVisibleChange(visible, POP_MARKAREA)}
					>
						<Button
							style={{ float: "right", borderWidth: 0 }}
							size="small"
							icon="caret-right"
							onClick={() => this.showDetail(POP_MARKAREA)}
						/>
					</Popover>
				</label>
			</Row>
			<Row>
				<label>
					线标记
					<Popover
						placement="right"
						title="线标记 markLine "
						content={markLineSetting}
						trigger="click"
						visible={this.state.markLineVisibe}
						onVisibleChange={(visible) => this.handlePopVisibleChange(visible, POP_MARKLINE)}
					>
						<Button
							style={{ float: "right", borderWidth: 0 }}
							size="small"
							icon="caret-right"
							onClick={() => this.showDetail(POP_MARKLINE)}
						/>
					</Popover>
				</label>
			</Row>
			<Row>
				<label>
					点标记
					<Popover
						placement="right"
						title="点标记 markPoint "
						content={markPointSetting}
						trigger="click"
						visible={this.state.markPointVisible}
						onVisibleChange={(visible) => this.handlePopVisibleChange(visible, POP_MARKPOINT)}
					>
						<Button
							style={{ float: "right", borderWidth: 0 }}
							size="small"
							icon="caret-right"
							onClick={() => this.showDetail(POP_MARKPOINT)}
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
)(TimeViewCtrl)
