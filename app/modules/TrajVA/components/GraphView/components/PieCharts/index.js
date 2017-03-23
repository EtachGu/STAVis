import React, { Component, PropTypes } from 'react';
import echarts from 'echarts';

class BarCharts extends Component {
    static propTypes = {
        className: PropTypes.string,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
		pieData: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
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
        const myChart = echarts.init(document.getElementById('pieCharts'));
		if(this.props.pieData === undefined) return;
        myChart.title = '嵌套环形图';
		const legend = this.props.pieData.legend;   //  series and row of data
		const fields = this.props.pieData.fields;   //  column of  data
		const data = this.props.pieData.data;
		const radiusUnit = legend.length !== 0 ? 36 / legend.length : 20;
		const radiusInterval = radiusUnit * 0.5;
		const seriesData = [];

		if (data[0] instanceof Array) {
			const seriesItemData = legend.map( (legend, index) => { return { value: data[index][0], name: `${legend}类的${fields[0]}` };});
			seriesData.push(
				{
					name:fields[0],
					type:'pie',
					selectedMode: 'single',
					radius: [0, '30%'],
					label: {
						normal: {
							show: false
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data:seriesItemData,
					center: ['50%', '60%']
				},
			);
		}
		for (let i = 0; i < legend.length; i++) {
			if (data[i] instanceof Array) {
				const seriesItemData = data[i].map( (item, index) => { return { value: item, name: fields[index] };});
				seriesData.push(
					{
						name:legend[i],
						type:'pie',
						radius: [`${30 + radiusUnit * i + radiusInterval}%`, `${30 + radiusUnit * (i+1)}%`],
						data:seriesItemData,
						label: {
							normal: {
								show: false
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						},
						center: ['50%', '60%']
					}
				);
			} else {
				seriesData.push(
					{
						name:legend[i],
						type:'pie',
						radius: [`${35 + radiusUnit * i + radiusInterval}%`, `${35 + radiusUnit * (i+1)}%`],
						data:{ value: data[i], name: fields }
					}
				);
			}
		}

        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'horizontal',
				top:0,
                data:fields //['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
            },
			series: seriesData
            // series: [
            //     {
            //         name:'访问来源',
            //         type:'pie',
            //         selectedMode: 'single',
            //         radius: [0, '30%'],
			//
            //         label: {
            //             normal: {
            //                 position: 'inner'
            //             }
            //         },
            //         labelLine: {
            //             normal: {
            //                 show: false
            //             }
            //         },
            //         data:[
            //             {value:335, name:'直达', selected:true},
            //             {value:679, name:'营销广告'},
            //             {value:1548, name:'搜索引擎'}
            //         ]
            //     },
            //     {
            //         name:'访问来源',
            //         type:'pie',
            //         radius: ['40%', '55%'],
			//
            //         data:[
            //             {value:335, name:'直达'},
            //             {value:310, name:'邮件营销'},
            //             {value:234, name:'联盟广告'},
            //             {value:135, name:'视频广告'},
            //             {value:1048, name:'百度'},
            //             {value:251, name:'谷歌'},
            //             {value:147, name:'必应'},
            //             {value:102, name:'其他'}
            //         ]
            //     }
            // ]
        });

    }

    render() {
        const style = {
            width: this.props.width,
            height: this.props.height
        };
        return (
            <div id="pieCharts" style={style}></div>
        );
    }
}

export default BarCharts;
