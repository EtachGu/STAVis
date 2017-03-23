import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// selector
import { selectSteps } from './selectors';

// Import Components
import { Tree } from 'antd';
import taskstep from './TaskSteps';
// CSS
import 'antd/dist/antd.css';

// Import Actions
import { updateTasks } from '../../TrajVAActions';

const TreeNode = Tree.TreeNode;

class TaskPanel extends Component {
	constructor(props){
		super(props);
		this.onCheck = this.onCheck.bind(this);
	}

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }
  
  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
	  const checkedNodePos = info.checkedNodesPositions.map( e => e.pos);
	  const steps = this.props.steps.map((item,index) => {
		  if (info.halfCheckedKeys.indexOf(`0-0-${index}`)){
			  item.status = "process";
		  }	else if (checkedNodePos.indexOf(`0-0-${index}`)){
			  item.status = "finish";
		  } else {
			  item.status = "wait";
		  }
		  return item;
	  });
	  this.props.updateTasksState({steps});
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
        <TreeNode title="任务阶段" key="0-0">
          <TreeNode title="概览" key="0-0-0">
            <TreeNode title="基站分布" key="0-0-0-0"/>
            <TreeNode title="人群特征" key="0-0-0-1"/>
          </TreeNode>
          <TreeNode title="分析" key="0-0-1">
            <TreeNode title={<span style={{ color: '#08c' }}>出行模式分析</span>} key="0-0-1-0" />
          </TreeNode>
          <TreeNode title="结论" key="0-0-2">
            <TreeNode title={<span style={{ color: '#08c' }}>human mobility pattern</span>} key="0-0-2-0" />
          </TreeNode>
        </TreeNode>
      </Tree>
    );
  }
}

TaskPanel.propTypes = {
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
	  updateTasksState: (taskData) => dispatch(updateTasks(taskData))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskPanel);
