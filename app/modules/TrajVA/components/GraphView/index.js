import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// selectors
import { selectStatistics } from './selectors';

// components
import BarCharts from './components/BarCharts';
import PieCharts from './components/PieCharts';

// css
import styles from './styles.css';

class GraphView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const barWidth = 350;
    const barHeight = 350;

	const barData = this.props.statisticsData.length > 0 ? {
		fields:this.props.statisticsData[0].fields,
		data:this.props.statisticsData[0].data
	} : {};
	const pieData = barData;

    return (
      <div>
        <BarCharts className={styles.charts} width={barWidth} height={barHeight} barData={barData}/>
        <PieCharts className={styles.charts} width={barWidth} height={barHeight} pieData={pieData}/>
      </div>
    );
  }
}

GraphView.propTypes = {
	lk: React.PropTypes.any,
	statisticsData: PropTypes.array.isRequired
};

// 任何时候，只要 Redux store 发生改变，mapStateToProps 函数就会被调用。
const mapStateToProps = createStructuredSelector({
  statisticsData: selectStatistics
});

// 如果你省略这个 mapDispatchToProps 参数，默认情况下，dispatch 会注入到你的组件 props 中。
export function mapDispatchToProps(dispatch) {
  return {
    changeRoute: (url) => dispatch(push(url)),
  };
}

// react-redux 的使用方式
// connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])
// 连接 React 组件与 Redux store。
export default connect(mapStateToProps, mapDispatchToProps)(GraphView);