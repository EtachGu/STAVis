import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// import components
import { Input, Icon, Collapse, Radio, DatePicker }  from 'antd';
const Panel = Collapse.Panel;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;

// css styles
import 'antd/dist/antd.css';
import styles from './styles.css';

class ControlPanel extends Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
	  this.state = {
		  radioDataBaseValue:1
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
	onDatePickerChange = () => {

	};

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
				 <RangePicker onChange={this.onDatePickerChange} />
			  </div>
          </Panel>
          <Panel header={<span><Icon type="filter" /> 参数设置</span>} key="2">
            <p>{text}</p>
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
});

export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel);
