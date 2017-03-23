import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// selector
import { selectSteps } from './selectors';

// Import Components
import { Steps, Icon  } from 'antd';

// CSS
import 'antd/dist/antd.css';

const Step = Steps.Step;

class TaskSteps extends Component {

  render() {
	  const steps = this.props.steps;
    return (
      <Steps>
        <Step status={steps[0].status || "wait"} title="概览" icon={<Icon type="global" />} />
        <Step status={steps[1].status || "wait"} title="分析" icon={<Icon type="pie-chart" />} />
        <Step status={steps[2].status || "wait"} title="结论" icon={<Icon type="solution" />} />
        <Step status={steps[3].status || "wait"} title="完成" icon={<Icon type="smile-o" />} />
      </Steps>
    );
  }
}

TaskSteps.propTypes = {
  ss: PropTypes.func,
    steps: PropTypes.array.isRequired
};

// Retrieve data from store as props
const mapStateToProps = createStructuredSelector({
	steps: selectSteps
});

export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskSteps);
