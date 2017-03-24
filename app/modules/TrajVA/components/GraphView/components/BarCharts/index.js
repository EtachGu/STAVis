import React, { Component, PropTypes } from 'react';
import echarts from 'echarts';

import csvparseSync  from 'csv-parse/lib/sync';

class BarCharts extends Component {
	static propTypes = {
		className: PropTypes.string,
		width: PropTypes.number.isRequired,
		height: PropTypes.number.isRequired,
		barData: PropTypes.object.isRequired
	};

	constructor(props) {
		super(props);
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

	componentDidUpdate () {
		this.initalECharts();
	}

	initalECharts = () => {
		if(this.props.barData === undefined) return;
		const myChart = echarts.init(document.getElementById('barCharts'));
		const barData = this.props.barData;
		const dataAxis = barData.fields ? barData.fields :[];
		const data = barData.data ? barData.data : [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220];

		const seriesData = [];
		for (let i = 0; i < data.length; i++) {
			if (data[i] instanceof Array) {
				seriesData.push({
					name: `人群${i}`,
					type: 'bar',
					data: data[i]
				})
			}
		}


		myChart.setOption({
		    title: {
		        text: '统计图',
		    },
			toolbox: {
				show: true,
				feature: {
					dataZoom: {
						yAxisIndex: 'none'
					},
					dataView: {readOnly: false},
					magicType: {type: ['line', 'bar', 'stack', 'tiled']},
					restore: {},
					saveAsImage: {}
				}
			},
		    xAxis: {
		        data: dataAxis,
		        axisLabel: {
		            inside: false,
		            textStyle: {
		                color: '#000'
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
		    series:seriesData
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
