import React, { Component, PropTypes } from 'react';
import echarts from 'echarts';
import cellTrackAvg from 'data/cellTrackCluster10_avg.csv';
import csvparseSync  from 'csv-parse/lib/sync';

class BarCharts extends Component {
	static propTypes = {
		className: PropTypes.string,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			barData:cellTrackAvg
		};
		// csvparseSync('data/cellTrackCluster10_avg.csv', (err, output) => {
		// 	this.state.barData = output;
		// })
	}

	componentDidMount() {
		// const file = "./data/bus_lines.json";
  //       const reader = new FileReader();
  //       reader.onload = function(data) {
            
  //       }
  //       reader.readAsText(file);
        this.initalECharts();
	}

	initalECharts = () => {

		const myChart = echarts.init(document.getElementById('barCharts'));
		const barData = this.state.barData;
		const dataAxis = ['点', '击', '柱', '子', '或', '者', '两', '指', '在', '触', '屏', '上', '滑', '动', '能', '够', '自', '动', '缩', '放'];
		const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];
		const yMax = 500;
		const dataShadow = [];

		for (let i = 0; i < data.length; i++) {
		    dataShadow.push(yMax);
		}

		myChart.setOption({
		    title: {
		        text: '特性示例：渐变色 阴影 点击缩放',
		        subtext: 'Feature Sample: Gradient Color, Shadow, Click Zoom'
		    },
		    xAxis: {
		        data: dataAxis,
		        axisLabel: {
		            inside: true,
		            textStyle: {
		                color: '#fff'
		            }
		        },
		        axisTick: {
		            show: false
		        },
		        axisLine: {
		            show: false
		        },
		        z: 10
		    },
		    yAxis: {
		        axisLine: {
		            show: false
		        },
		        axisTick: {
		            show: false
		        },
		        axisLabel: {
		            textStyle: {
		                color: '#999'
		            }
		        }
		    },
		    dataZoom: [
		        {
		            type: 'inside'
		        }
		    ],
		    series: [
		        { // For shadow
		            type: 'bar',
		            itemStyle: {
		                normal: {color: 'rgba(0,0,0,0.05)'}
		            },
		            barGap:'-100%',
		            barCategoryGap:'40%',
		            data: dataShadow,
		            animation: false
		        },
		        {
		            type: 'bar',
		            itemStyle: {
		                normal: {
		                    color: new echarts.graphic.LinearGradient(
		                        0, 0, 0, 1,
		                        [
		                            {offset: 0, color: '#83bff6'},
		                            {offset: 0.5, color: '#188df0'},
		                            {offset: 1, color: '#188df0'}
		                        ]
		                    )
		                },
		                emphasis: {
		                    color: new echarts.graphic.LinearGradient(
		                        0, 0, 0, 1,
		                        [
		                            {offset: 0, color: '#2378f7'},
		                            {offset: 0.7, color: '#2378f7'},
		                            {offset: 1, color: '#83bff6'}
		                        ]
		                    )
		                }
		            },
		            data: data
		        }
		    ]
		});

		// Enable data zoom when user click bar.
		const zoomSize = 6;
		myChart.on('click', function (params) {
		    console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
		    myChart.dispatchAction({
		        type: 'dataZoom',
		        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
		        endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
		    });
		});
	}

	render() {
		const style = {
			width: this.props.width,
			height: this.props.height
		};
		return (
			<div id="barCharts" style={style}></div>
		);
	}
}

export default BarCharts;
