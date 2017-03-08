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
        <Step status="finish" title="Login" icon={<Icon type="user" />} />
        <Step status="finish" title="Verification" icon={<Icon type="solution" />} />
        <Step status="process" title="Pay" icon={<Icon type="credit-card" />} />
        <Step status="wait" title="Done" icon={<Icon type="smile-o" />} />
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
