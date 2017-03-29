import React, { Component, PropTypes } from 'react';
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';

import buslines from 'data/bus_lines.json';
import styles from './styles.css';

// data
import shanghaiJson from 'data/shanghai.json';
import metroStations from './shanghaistation';
import stationCount from './stationcount.json';

const bmapShangHai = {
    center: [121.487899486,31.24916171],
    zoom: 10,
    roam: true,
    mapStyle: {
        styleJson: [{
            'featureType': 'water',
            'elementType': 'all',
            'stylers': {
                'color': '#d1d1d1'
            }
        }, {
            'featureType': 'land',
            'elementType': 'all',
            'stylers': {
                'color': '#f3f3f3'
            }
        }, {
            'featureType': 'railway',
            'elementType': 'all',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'highway',
            'elementType': 'all',
            'stylers': {
                'color': '#fdfdfd'
            }
        }, {
            'featureType': 'highway',
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'arterial',
            'elementType': 'geometry',
            'stylers': {
                'color': '#fefefe'
            }
        }, {
            'featureType': 'arterial',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#fefefe'
            }
        }, {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'green',
            'elementType': 'all',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'subway',
            'elementType': 'all',
            'stylers': {
                'visibility': 'on',
            }
        }, {
            'featureType': 'manmade',
            'elementType': 'all',
            'stylers': {
                'color': '#d1d1d1'
            }
        }, {
            'featureType': 'local',
            'elementType': 'all',
            'stylers': {
                'color': '#d1d1d1'
            }
        }, {
            'featureType': 'arterial',
            'elementType': 'labels',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'boundary',
            'elementType': 'all',
            'stylers': {
                'color': '#fefefe'
            }
        }, {
            'featureType': 'building',
            'elementType': 'all',
            'stylers': {
                'color': '#d1d1d1'
            }
        }, {
            'featureType': 'label',
            'elementType': 'labels.text.fill',
            'stylers': {
                'color': '#999999'
            }
        }]
    }
};

class MapDiv extends Component {
	static propTypes = {
		className: PropTypes.string,
		mapType: PropTypes.number,
		geomType: PropTypes.number,
	};

	constructor(props) {
		super(props);
		this.state = {
			echartData:[],
			currentDate:'',
			color:['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f']
		}
	}

	componentDidMount() {
		// var file = "./data/bus_lines.json";
  //       var reader = new FileReader();
  //       reader.onload = function(data) {
			
  //       }
  //       reader.readAsText(file);
		//this.initalECharts(buslines);
		const convertData = function (data) {
		    const res = [];
		    for (let i = 0; i < data.length; i++) {
		        const geoCoord = metroStations[data[i].name];
		        if (geoCoord) {
		            res.push({
		                name: data[i].name,
		                value: geoCoord.concat(data[i].value)
		            });
		        }
		    }
		    return res;
		};

		const mapType = this.props.mapType;

		const coordinateSystemName = mapType == 1 ? 'geo' : 'bmap';

		// legend 图例
		const baseLegends = [ '站点'];

		const baseSeriesData =  [{
						name: '站点',
						type: 'scatter',
						coordinateSystem: coordinateSystemName,
			            symbolSize: function (val) {
			                return val[2] * 30;
			            },
			            label: {
			                normal: {
			                    formatter: '{b}',
			                    position: 'right',
			                    show: false
			                },
			                emphasis: {
			                    show: true
			                }
			            },
			            itemStyle: {
			                normal: {
			                    color: '#ddb926'
			                }
			            }
					},{
						name: 'Top5',
						type: 'scatter',
						coordinateSystem: coordinateSystemName,
			            symbolSize: function (val) {
			                return val[2] * 30;
			            },
			            showEffectOn: 'render',
			            rippleEffect: {
			                brushType: 'stroke'
			            },
			            hoverAnimation: true,
			            label: {
			                normal: {
			                    formatter: '{b}',
			                    position: 'right',
			                    show: true
			                }
			            },
			            itemStyle: {
			                normal: {
			                    color: '#f4e925',
			                    shadowBlur: 10,
			                    shadowColor: '#333'
			                }
			            },
			            zlevel: 1
					}];

		const dateSet = [];

		const optionsData = [];

		stationCount.data.forEach((item,index) => {

			dateSet.push(index < 10 ? `0${index}` : `${index}`);

			let itemSortData = item.data.sort(function (a, b) {
				return b.value - a.value;
			});
			const maxCount = itemSortData[0].value;

			if ( maxCount > 3000 ) {
				itemSortData = itemSortData.map( e => {
					e.value = e.value /maxCount;
					return e;
				})
			} else {
				itemSortData = itemSortData.map( e => {
					e.value = e.value /3000;
					return e;
				})
			}

			optionsData.push({
				series: [
					{
						data: convertData(itemSortData)
					},
					{
						data: convertData(itemSortData.slice(0, 6))
					}
				]
			});
			  
		});

					

		echarts.registerMap('shanghai', shanghaiJson);

		const chart = echarts.init(document.getElementById('map'));

		// 判断底图 类型
		mapType == 1 ? chart.setOption(
		    {
		        baseOption: {
		        	backgroundColor: '#404a59',
		            timeline: {
		            	axisType: 'category',
		            	top: 25,
		            	left: 'center',
		                data: dateSet,
		                lineStyle: {
		                	color: '#ffffff'
		                },
		                label: {
		                	normal : {
		                		textStyle: {
		                			color : '#ffffff'
		                		}
		                	}
		                },
		                controlStyle: {
		                	normal: {
		                		color: '#ffffff',
		                		borderColor: '#ffffff'
		                	}
		                },
		                zlevel: 3    //  new Canvas level = 3

		            },
		            legend: {
						orient: 'vertical',
						y: 'top',
						x:'left',
						data:baseLegends,
						textStyle: {
							color: '#fff'
						}
					},
		            title: {
		            	top: 0,
		            	left: 'center',
		            	text: `${dateSet[0]}公交站点`,
		            	textStyle: {
		            		color: '#ffffff'
		            	},
		            	zlevel: 3    //  new Canvas level = 3
		            },
		            geo:{
						map: 'shanghai',
						roam: true,
						label: {
							emphasis: {
								show: true
							}
						},
						itemStyle: {
							normal: {
								areaColor: '#323c48',
								borderColor: '#111'
							},
							emphasis: {
								areaColor: '#2a333d',
								//areaColor: rgba(128, 128, 200, 0.5),
							}
						}
					},
		            series: baseSeriesData
		        },
		        options: optionsData
		    }
		) : chart.setOption(
		    {
		        baseOption: {
		        	color: this.state.color,
		            timeline: {
		            	axisType: 'category',
		            	top: 25,
		            	left: 'center',
		                data: dateSet,
		                zlevel: 3    //  new Canvas level = 3
		            },
		            legend: {
						orient: 'vertical',
						y: 'top',
						x:'left',
						data:baseLegends,
						textStyle: {
							color: '#fff'
						}
					},
		            title: {
		            	top: 0,
		            	left: 'center',
		            	text: `${dateSet[0]}轨迹分布`,
		            	zlevel: 3    //  new Canvas level = 3
		            },
		            bmap:bmapShangHai,
		            series: baseSeriesData
		        },
		        options: optionsData
		    }
		); // echartSetOption
		
	}

	render() {
		return (
			<div id="map" className={styles.mapdiv}></div>
		);
	}
}

export default MapDiv;
