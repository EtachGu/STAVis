import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import moment from 'moment';

// import components
import { Input, Icon, Collapse, Radio, DatePicker, Button }  from 'antd';
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;

// css styles
import 'antd/dist/antd.css';
import styles from './styles.css';

// Import Actions
import { addTrajSetRequest, updateControls } from '../../TrajVAActions';

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
		  dateRange:['2016-03-01','2016-03-02']	// [startDate, endDate]  string type
	  }
  };

  callback = (key) => {
    console.log(key);
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
		switch (dataType) {
			case 1:
				// emit the event for query the cellPhoneTrack
				if(dateRange[0] !== '' && dateRange[0] !== ''){
					const requestBody = {
						trajName: "cellPhoneTrack",
						datetime: dateRange,
						timeunit: "1hh",
						id: ['(低)','(中)','(高)']//[1,2,3,4,5,6]
					};
					this.props.updateTrajectory(requestBody);
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

  render() {
    const text = "control text";
	  const radioStyle = {
		  display: 'block',
		  height: '30px',
		  lineHeight: '30px',
	  };
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
			  <div>
				 <RangePicker
					 defaultValue={
					 	[moment(this.state.dateRange[0]), moment(this.state.dateRange[1])]
					 }
					 onChange={this.onDatePickerChange}
				 />
			  </div>
			  <Button type="primary" icon="search" onClick={this.confirmQueryTrack}>确定</Button>
          </Panel>
          <Panel header={<span><Icon type="filter" /> 参数设置</span>} key="2">
             <RadioGroup onChange={this.onRadioMapChange} value={this.state.radioMapValue}>
				  <Radio style={radioStyle} value={1}>行政区图</Radio>
				  <Radio style={radioStyle} value={2}>百度地图</Radio>
			  </RadioGroup>
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
