import React, { Component, PropTypes } from 'react';
import echarts from 'echarts';

class BarCharts extends Component {
    static propTypes = {
        className: PropTypes.string,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
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

    initalECharts = () => {
        const myChart = echarts.init(document.getElementById('pieCharts'));

        myChart.title = '嵌套环形图';

        myChart.setOption({
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['直达','营销广告','搜索引擎','邮件营销','联盟广告','视频广告','百度','谷歌','必应','其他']
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    selectedMode: 'single',
                    radius: [0, '30%'],

                    label: {
                        normal: {
                            position: 'inner'
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:335, name:'直达', selected:true},
                        {value:679, name:'营销广告'},
                        {value:1548, name:'搜索引擎'}
                    ]
                },
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['40%', '55%'],

                    data:[
                        {value:335, name:'直达'},
                        {value:310, name:'邮件营销'},
                        {value:234, name:'联盟广告'},
                        {value:135, name:'视频广告'},
                        {value:1048, name:'百度'},
                        {value:251, name:'谷歌'},
                        {value:147, name:'必应'},
                        {value:102, name:'其他'}
                    ]
                }
            ]
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
