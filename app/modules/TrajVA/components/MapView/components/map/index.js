import React, { Component, PropTypes } from 'react';
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';

import buslines from 'data/bus_lines.json';
import styles from './styles.css';

// data
import shanghaiJson from 'data/shanghai.json';
import cellTracks from 'data/cellTrack_geo_collection.json';
import cellBaseStations from 'data/cellPhoneBaseStation.json';

class MapDiv extends Component {
	static propTypes = {
		className: PropTypes.string,
	};

	constructor(props) {
		super(props);
	}

	componentDidMount() {
		// var file = "./data/bus_lines.json";
  //       var reader = new FileReader();
  //       reader.onload = function(data) {
            
  //       }
  //       reader.readAsText(file);
        //this.initalECharts(buslines);
		const convertData = function (data) {
			const dataSeries = [];
			for (let i = 0; i < data.length; i++) {
				const collectSet = data[i].geometries.map( geom => {
					const coord = geom.coordinates;
					const coord_e = [];
					for(let index = 0; index < coord.length; index++){
						const lon = coord[index][0];
						const lat = coord[index][1];
						coord_e.push([lon, lat]);
					}
					const geom_e = { coords: coord_e };
					return geom_e;
				});
				dataSeries.push(collectSet);
			}
			return dataSeries;
		};
		// legend 图例
		const legendData = [ '基站'];
		const seriesData = [];
		convertData(cellTracks).forEach((item,index) => {
			legendData.push(`轨迹${index}`)
			seriesData.push({
				name: `轨迹${index}`,
				type: 'lines',
				polyline: true,
				coordinateSystem: 'geo',
				data:item,
				lineStyle: {
					normal: {
						opacity: 0.2,
						width: 1
					}
				},
				progressiveThreshold: 500,
				progressive: 200
			})
		});
		// 绘制基站
		seriesData.push({
			name: '基站',
			type: 'scatter',
			coordinateSystem: 'geo',
			data:cellBaseStations.data,
			symbolSize:1
		});

		echarts.registerMap('shanghai', shanghaiJson);
		const chart = echarts.init(document.getElementById('map'));
		chart.setOption({
			backgroundColor: '#404a59',
			geo: {
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
						areaColor: '#2a333d'
					}
				}
			},
			series:seriesData,
			legend: {
				orient: 'vertical',
				y: 'top',
				x:'left',
				data:legendData,
				textStyle: {
					color: '#fff'
				}
			},
		});


	}

	initalECharts(data) {

		const myChart = echarts.init(document.getElementById('map'));
		const hStep = 300 / (data.length - 1);
	    const busLines = [].concat.apply([], data.map(function (busLine, idx) {
	        let prevPt;
	        let points = [];
	        for (let i = 0; i < busLine.length; i += 2) {
	            let pt = [busLine[i], busLine[i + 1]];
	            if (i > 0) {
	                pt = [
	                    prevPt[0] + pt[0],
	                    prevPt[1] + pt[1]
	                ];
	            }
	            prevPt = pt;

	            points.push([pt[0] / 1e4, pt[1] / 1e4]);
	    	}
	        return {
	            coords: points,
	            lineStyle: {
	                normal: {
	                    color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
	                }
	            }
        	};
        }));

		myChart.setOption({
			bmap: {
				center: [116.46, 39.92],
				zoom: 10,
				roam: true,
				mapStyle: {
				  'styleJson': [
					{
					  'featureType': 'water',
					  'elementType': 'all',
					  'stylers': {
						'color': '#031628'
					  }
					},
					{
					  'featureType': 'land',
					  'elementType': 'geometry',
					  'stylers': {
						'color': '#000102'
					  }
					},
					{
					  'featureType': 'highway',
					  'elementType': 'all',
					  'stylers': {
						'visibility': 'off'
					  }
					},
					{
					  'featureType': 'arterial',
					  'elementType': 'geometry.fill',
					  'stylers': {
						'color': '#000000'
					  }
					},
					{
					  'featureType': 'arterial',
					  'elementType': 'geometry.stroke',
					  'stylers': {
						'color': '#0b3d51'
					  }
					},
					{
					  'featureType': 'local',
					  'elementType': 'geometry',
					  'stylers': {
						'color': '#000000'
					  }
					},
					{
					  'featureType': 'railway',
					  'elementType': 'geometry.fill',
					  'stylers': {
						'color': '#000000'
					  }
					},
					{
					  'featureType': 'railway',
					  'elementType': 'geometry.stroke',
					  'stylers': {
						'color': '#08304b'
					  }
					},
					{
					  'featureType': 'subway',
					  'elementType': 'geometry',
					  'stylers': {
						'lightness': -70
					  }
					},
					{
					  'featureType': 'building',
					  'elementType': 'geometry.fill',
					  'stylers': {
						'color': '#000000'
					  }
					},
					{
					  'featureType': 'all',
					  'elementType': 'labels.text.fill',
					  'stylers': {
						'color': '#857f7f'
					  }
					},
					{
					  'featureType': 'all',
					  'elementType': 'labels.text.stroke',
					  'stylers': {
						'color': '#000000'
					  }
					},
					{
					  'featureType': 'building',
					  'elementType': 'geometry',
					  'stylers': {
						'color': '#022338'
					  }
					},
					{
					  'featureType': 'green',
					  'elementType': 'geometry',
					  'stylers': {
						'color': '#062032'
					  }
					},
					{
					  'featureType': 'boundary',
					  'elementType': 'all',
					  'stylers': {
						'color': '#465b6c'
					  }
					},
					{
					  'featureType': 'manmade',
					  'elementType': 'all',
					  'stylers': {
						'color': '#022338'
					  }
					},
					{
					  'featureType': 'label',
					  'elementType': 'all',
					  'stylers': {
						'visibility': 'off'
					  }
					}
				  ]
				}
			},
			series: [{
				type: 'lines',
				coordinateSystem: 'bmap',
				polyline: true,
				data: busLines,
				silent: true,
				lineStyle: {
					normal: {
						// color: '#c23531',
						// color: 'rgb(200, 35, 45)',
						opacity: 0.2,
						width: 1
					}
				},
				progressiveThreshold: 500,
				progressive: 200
			}, {
				type: 'lines',
				coordinateSystem: 'bmap',
				polyline: true,
				data: busLines,
				lineStyle: {
					normal: {
						width: 0
					}
				},
				effect: {
					constantSpeed: 20,
					show: true,
					trailLength: 0.1,
					symbolSize: 1.5
				},
				zlevel: 1
			}]
		});

		// draw line 
		const lines = data.map(function (track) {
	        return {
	            coords: track.map(function (seg, idx) {
	                return seg.coord;
	            })
	        };
    	});
	    myChart.setOption({
	        bmap: {
	            center: [120.13066322374, 30.240018034923],
	            zoom: 14,
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
	                        'visibility': 'off'
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
	        },
	        series: [{
	            type: 'lines',
	            coordinateSystem: 'bmap',
	            data: lines,
	            polyline: true,
	            lineStyle: {
	                normal: {
	                    color: 'purple',
	                    opacity: 0.6,
	                    width: 1
	                }
	            }
	        }]
	    });
	}


	render() {
		return (
			<div id="map" className={styles.mapdiv}></div>
		);
	}
}

export default MapDiv;
