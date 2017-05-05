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
import styles from './styles.css';

// Import Actions
import { updateTasks } from '../../TrajVAActions';

const TreeNode = Tree.TreeNode;

class TaskPanel extends Component {
	constructor(props){
		super(props);
		this.onCheck = this.onCheck.bind(this);
    this.state = {
      selectedNode: null,
      overviewTrData: [ { name: "基站分布",key: "0-0-0-0" }, { name: "人群特征", key: "0-0-0-1" } ],
      analysisTrData: [ { name: "出行模式分析",key: "0-0-1-0" } ],
      concolusionTrD: [ { name: "人群出行模式",key: "0-0-2-0" } ],
    };
	}

  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  }
  
  onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
	  const checkedNodePos = info.checkedNodesPositions.map( e => e.pos);
	  const steps = this.props.steps.map((item,index) => {
		  if (info.halfCheckedKeys.includes(`0-0-${index}`)){
			  item.status = "process";
		  }	else if (checkedNodePos.includes(`0-0-${index}`)){
			  item.status = "finish";
		  } else {
			  item.status = "wait";
		  }
		  return item;
	  });
	  if(checkedNodePos.includes('0-0')){
		  steps[3].status = "finish";
	  } else {
		  steps[3].status = "wait";
	  }
	  this.props.updateTasksState({steps});
  }

  onRightClick = (e) => {

    // document.oncontextmenu = () => false;
    const oEvent = e.event;
    const oDiv = document.getElementById('tasktreemenu');   
    oDiv.style.display ='block';
    oDiv.style.left = oEvent.clientX + 'px';
    oDiv.style.top = oEvent.clientY + 'px';
    if (oEvent.preventDefault) oEvent.preventDefault();

    const onremovehandle = () => {
       oDiv.style.display = 'none';
       window.removeEventListener('click', onremovehandle);
    }
    window.addEventListener('click', onremovehandle);

    this.setState({selectedNode:e.node});
  }

  taskmenuClick = (e) => {
    console.log(e);
  }

  menuClick = (e) => {
    console.log(e);
    if(e.target.tagName === 'LI') {
      switch(e.target.value) {
        case 0: this.rename(e);break;
        case 1: this.addNewNode(e);break;
        case 2: this.removeNode(e);break;
        default: break;
      }
    }
  }

  rename = (e) => {
    const oDiv = document.getElementById('tasktreemenu');   
    oDiv.style.display ='none';
    const key = this.state.selectedNode.props.eventKey;

    const element = this.state.selectedNode.refs.selectHandle;
    const name = element.text;

    const oldInnerHTML = element.innerHTML;
    element.innerHTML = `<input id="input1" type="text" value=${name}>`;
    const inputbox = document.getElementById('input1');
    inputbox.style.offsetTop = element.offsetTop;
    inputbox.style.offsetLeft = element.offsetLeft;
    inputbox.style.offsetWidth = element.offsetWidth;
    inputbox.style.offsetHeight = element.offsetHeight;

    inputbox.focus();

    inputbox.addEventListener("blur", ( event ) => {
      const newName = event.target.value;

      event.target.parentNode.removeChild(event.target);

      // find key node
      const overviewTrData = this.state.overviewTrData;
      let node = overviewTrData.find((item) => item.key === key);
      if (node) {
        node.name = newName;
        this.setState({
          overviewTrData
        });
        return;
      }

      const analysisTrData = this.state.analysisTrData;
      node = analysisTrData.find((item) => item.key === key);
      if (node) {
        node.name = newName;
        this.setState({
          analysisTrData
        });
        return;
      }


      const concolusionTrD = this.state.concolusionTrD;
      node = concolusionTrD.find((item) => item.key === key);
      if (node) {
        node.name = newName;
        this.setState({
          concolusionTrD
        });
        return;
      }

      element.innerHTML = oldInnerHTML;

    }, true);

  }

  addNewNode = (e) => {

  }

  removeNode = (e) => {

  }

  generateTreeNode = (data) => {

    return data.map((item, index) => (<TreeNode title={item.name} key={item.key}/>));
  }

  render() {
    return (
      <div>
        <Tree
          checkable
          defaultExpandedKeys={['0-0-0', '0-0-1']}
          defaultSelectedKeys={['0-0-0', '0-0-1']}
          defaultCheckedKeys={['0-0-0', '0-0-1']}
          onSelect={this.onSelect}
          onCheck={this.onCheck}
          onRightClick={this.onRightClick}
        >
          <TreeNode title="任务阶段" key="0-0">
            <TreeNode title="概览" key="0-0-0">
              { [...this.generateTreeNode(this.state.overviewTrData)] }
            </TreeNode>
            <TreeNode title="分析" key="0-0-1">
               { [...this.generateTreeNode(this.state.analysisTrData)] }
            </TreeNode>
            <TreeNode title="结论" key="0-0-2">
               { [...this.generateTreeNode(this.state.concolusionTrD)] }
            </TreeNode>
          </TreeNode>
        </Tree>
        <div id="tasktreemenu" className={styles.taskmenu} onClick={this.taskmenuClick}>
          <ul onClick={this.menuClick}>
            <li className={styles.menuli} value={0}>重命名</li>
            <li className={styles.menuli} value={1}>添加</li>
            <li className={styles.menuli} value={2}>删除</li>
          </ul>
        </div>
      </div>
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
