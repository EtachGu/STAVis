import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

// Import Components
import { Steps, Icon  } from 'antd';

// CSS
import 'antd/dist/antd.css';

const Step = Steps.Step;

class TaskSteps extends Component {

  render() {
    return (
      <Steps>
        <Step status="finish" title="overview" icon={<Icon type="global" />} />
        <Step status="finish" title="analysis" icon={<Icon type="pie-chart" />} />
        <Step status="process" title="conclusion" icon={<Icon type="solution" />} />
        <Step status="wait" title="done" icon={<Icon type="smile-o" />} />
      </Steps>
    );
  }
}

TaskSteps.propTypes = {
  ss: PropTypes.func,
};

// Retrieve data from store as props
const mapStateToProps = createStructuredSelector({
});

export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(TaskSteps);
