import React from 'react';
import { connect } from 'react-redux';
import echarts from 'echarts';
import { createStructuredSelector } from 'reselect';
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
	Tabs,
}  from 'antd';

const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;
const Option = Select.Option;
const TabPane = Tabs.TabPane;

// Import Actions
import { updateControls } from '../../../TrajVAActions';

// selectors
import { selectControls } from '../selectors';


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
const POP_AXIS3D = 6;


export class MapViewCtrl extends React.Component {

	constructor(props) {
		super(props);
		this.state ={
			seriesVisible: false,
			visualMVisible: false,
			toolboxVisible: false,
			markAreaVisible: false,
			markLineVisibe: false,
			markPointVisible: false,
			axisVisible: false,

			visualMapType: 'piecewise',

			seriesIndex: 0,
			map2D3D: props.controlsState.map3d ? '3D' : '2D',

			xAxis3DIndex: 0,
			yAxis3DIndex: 0,
			zAxis3DIndex: 0,
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
				break;
			case POP_AXIS3D:
				this.setState({
					axisVisible: visible
				});
				break;
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

	generateAxis = (xAxis3D, yAxis3D, zAxis3D) => {

		if (!(xAxis3D && yAxis3D && zAxis3D)) return null;

		const generateAxisInfo = (axis, axisOrient) => {

			const axisInfo =  axis.map(item => {
				return (
					<div>
						<Row>
							<label>
									开关
								<Switch
									style={{ float: "right" }}
									size="small"
									defaultChecked={axis.show}
									onChange={(checked) => axis.show = checked}
								/>
							</label>
						</Row>
						<Row>
							<label>
								名称: {item.name}
							</label>
						</Row>
					</div>
				);
			});

			// choose axis Index
			const chooseAxisIndex = (axisOrient, index = -1) => {
				switch(axisOrient) {
					case 'xAxis3D':
						if (index === -1) return this.state.xAxis3DIndex;
						this.setState({
							xAxis3DIndex: index
						});
						break;
					case 'yAxis3D':
						if (index === -1) return this.state.yAxis3DIndex;
						this.setState({
							yAxis3DIndex: index
						});
						break;
					case 'zAxis3D':
						if (index === -1) return this.state.zAxis3DIndex;
						this.setState({
							zAxis3DIndex: index
						});
						break;
					default: break;
				}
			}

			return (
				<div>
					<Row>
						<label>
							系列列表
						</label>
						<div>
							{
								[...axisInfo.map((itemVM, index)=> (
										<span
											style={{ float: "left", backgroundColor: COLOR_BAR[ index % COLOR_BAR.length ], width: 20, height: 20, margin: "5px 5px" }} 
											onClick={ () =>  { chooseAxisIndex(axisOrient, index) }}
										></span>
									)
								)]
							}
						</div>
					</Row>
					{axisInfo[chooseAxisIndex(axisOrient)]}
				</div>
			);
		};

		const advanceSetting = (
			<div className={styles.advancsetting}>
				<label>
					坐标轴集合
				</label>
				<Tabs defaultActiveKey="1">
					<TabPane tab="xAxis3D" key="1">{ generateAxisInfo(xAxis3D) }</TabPane>
					<TabPane tab="yAxis3D" key="2">{ generateAxisInfo(yAxis3D) }</TabPane>
					<TabPane tab="zAxis3D" key="3">{ generateAxisInfo(zAxis3D) }</TabPane>
				</Tabs>
				<Button type="primary" onClick={() => this.confirmSetting(POP_AXIS3D)}>确定</Button>
				<Button type="primary" onClick={() => this.cancelSetting(POP_AXIS3D)}>取消</Button>
			</div>
		);

		return advanceSetting;
	}

	on2D3DChange = (e) => {

		const controlsObject = this.props.controlsState;
		controlsObject.map3d = e.target.value === '3D';
		const controlsNew = Object.assign({}, controlsObject);
		this.props.updateControlState(controlsNew);

		this.setState({map2D3D: e.target.value})
	}



  render() {

  	const mapCharts = echarts.getInstanceByDom(document.getElementById('map'));

  	const mapOption = mapCharts ? mapCharts.getOption() : null;

  	const seriesSetting =  mapOption ? this.generateSeries(mapOption.series, mapOption.color) : null;

	const visualMapSetting = mapOption ? this.generateVisualMap(mapOption.visualMap) : null;

	const toolboxSetting = mapOption ?  this.generateToolBox(mapOption.toolbox) : null;

	const markAreaSetting = null; //this.generateMarkArea();

	const markLineSetting = null ;//(<div></div>);

	const markPointSetting = null;

	const axisSetting = mapOption ?  this.generateAxis(mapOption.xAxis3D, mapOption.yAxis3D, mapOption.zAxis3D) : null;

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
					2D/3D切换
					<div>
						<RadioGroup
							value={this.state.map2D3D}
							onChange={this.on2D3DChange}
							size="small"
						>
							<Radio.Button value="2D">2D</Radio.Button>
							<Radio.Button value="3D">3D</Radio.Button>
						</RadioGroup>
					</div>
				</label>
			</Row>
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
			<Row>
				<label>
					坐标轴设置
					<Popover
						placement="right"
						title="坐标轴设置 axis"
						content={axisSetting}
						trigger="click"
						visible={this.state.axisVisible}
						onVisibleChange={(visible) => this.handlePopVisibleChange(visible, POP_AXIS3D)}
					>
						<Button
							style={{ float: "right", borderWidth: 0 }}
							size="small"
							icon="caret-right"
							onClick={() => this.showDetail(POP_AXIS3D)}
						/>
					</Popover>
				</label>
			</Row>
		</div>
	);
  }
}

MapViewCtrl.propTypes = {
	name: React.PropTypes.string,
	toBack: React.PropTypes.func,
	updateControlState: React.PropTypes.func
};


// 任何时候，只要 Redux store 发生改变，mapStateToProps 函数就会被调用。
const mapStateToProps = createStructuredSelector({
 	controlsState: selectControls
});

// 如果你省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注入到你的组件 props 中。
export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
    updateControlState: (controlData) => dispatch(updateControls(controlData)),
  };
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(MapViewCtrl)
