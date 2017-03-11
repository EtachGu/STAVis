import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// Import Components
import { Tree } from 'antd';
import taskstep from './TaskSteps';
// CSS
import 'antd/dist/antd.css';

const TreeNode = Tree.TreeNode;

class TaskPanel extends Component {

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }
  
  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  }

  render() {
    return (
      <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={this.onSelect}
        onCheck={this.onCheck}
      >
        <TreeNode title="Task" key="0-0">
          <TreeNode title="overview" key="0-0-0">
            <TreeNode title="cellPhoneUser" key="0-0-0-0"/>
            <TreeNode title="cellPhoneTrajectory" key="0-0-0-1"/>
          </TreeNode>
          <TreeNode title="analysis" key="0-0-1">
            <TreeNode title={<span style={{ color: '#08c' }}>spatio-temporal analysis</span>} key="0-0-1-0" />
          </TreeNode>
          <TreeNode title="conclusion" key="0-0-2">
            <TreeNode title={<span style={{ color: '#08c' }}>human mobility pattern</span>} key="0-0-2-0" />
          </TreeNode>
        </TreeNode>
      </Tree>
    );
  }
}

TaskPanel.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(TaskPanel);
