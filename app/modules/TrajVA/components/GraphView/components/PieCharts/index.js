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

    // 不同群体的特点
    initalECharts = () => {
        const myChart = echarts.init(document.getElementById('pieCharts'));
		if(this.props.pieData === undefined) return;
        myChart.title = '嵌套环形图';
		const legend = this.props.pieData.legend;   //  series and row of data
		const fields = this.props.pieData.fields;   //  column of  data
		const data = this.props.pieData.data;
		const radiusUnit = legend.length !== 0 ? 56 / legend.length : 20;
		const radiusInterval = radiusUnit * 0.25;
		const seriesData = [];

		const legendData = legend.map( e => ({ name:`人群${e}`,icon:'circle'}));
		for (let i = 0; i < legend.length; i++) {
			if (data[i] instanceof Array) {
				const seriesItemData = data[i].map( (item, index) => { return { value: item, name: fields[index] };});
				seriesItemData.shift();
				seriesData.push(
					{
						name:`人群${i+1}`,
						type:'pie',
						radius: [`${5 + radiusUnit * i + radiusInterval}%`, `${5 + radiusUnit * (i+1)}%`],
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
            legend: [{
                orient: 'horizontal',
				bottom:0,
                data:legendData
            },{
				orient:'horizontal',
				top: 0,
				data: fields
			}],
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
