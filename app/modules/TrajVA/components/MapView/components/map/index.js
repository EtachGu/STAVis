import React, { Component, PropTypes } from 'react';
import echarts from 'echarts';
import bmap from 'echarts/extension/bmap/bmap';
import _ from 'lodash';

import buslines from 'data/bus_lines.json';
import styles from './styles.css';

// data
import shanghaiJson from 'data/shanghai.json';
// import cellTracks from 'data/cellTrack_geo_collection.json';
import cellBaseStations from 'data/cellPhoneBaseStation.json';
// import metroStations from 'data/shMetroStations.json';

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
		geomType: PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			echartData:[],
			currentDate:'',
			color:['#8dd3c7','#ffffb3','#bebada','#fb8072','#80b1d3','#fdb462','#b3de69','#fccde5','#d9d9d9','#bc80bd','#ccebc5','#ffed6f'],
			isEChartDataNew: false,
		}
	}

	componentDidMount() {
		// var file = "./data/bus_lines.json";
  //       var reader = new FileReader();
  //       reader.onload = function(data) {
			
  //       }
  //       reader.readAsText(file);
		//this.initalECharts(buslines);
		
		// init data from static File

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
		// convertData(cellTracks).forEach((item,index) => {
		// 	legendData.push(`轨迹${index}`)
		// 	seriesData.push({
		// 		name: `轨迹${index}`,
		// 		type: 'lines',
		// 		polyline: true,
		// 		coordinateSystem: 'geo',
		// 		data:item,
		// 		lineStyle: {
		// 			normal: {
		// 				opacity: 0.2,
		// 				width: 1
		// 			}
		// 		},
		// 		// zlevel: 2,
		// 		// effect: {
		// 		// 	show: true,
		// 		// 	period: 6,
		// 		// 	trailLength: 0,
		// 		// 	symbol: "arrow",
		// 		// 	symbolSize: 15
		// 		// },
		// 		// lineStyle: {
		// 		// 	normal: {
		// 		// 		width: 1,
		// 		// 		opacity: 0.6,
		// 		// 	}
		// 		// },
		// 		progressiveThreshold: 500,
		// 		progressive: 200
		// 	})
		// });
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

		this.setEChartGeoOption(chart);

		chart.setOption({
			backgroundColor: '#404a59',
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

		if (this.props.mapData) {
			this.generateEChartsData(this.props.mapData);
		}

		//
		console.log(document.getElementById('map').clientWidth);
		const width = document.getElementById('map').clientWidth;
		const height =  width * 0.80;
		chart.resize({
			width,
			height
		});
		window.addEventListener('resize', this.handleResize);
		
	}

	componentWillReceiveProps(nextProps){
		if(this.props.mapData && this.props.mapData != nextProps.mapData) {
			
			if(nextProps.mapData) {
				this.generateEChartsData(nextProps.mapData);
			}// if mapdata valid
		}// if props updated

		if(this.props.geomType && this.props.geomType != nextProps.geomType) {
			this.setState({
				isEChartDataNew: true
			})
		}

		if(this.props.mapType && this.props.mapType != nextProps.mapType) {
			this.setState({
				isEChartDataNew: true
			})
		}
	}

	componentDidUpdate() {

		//  update Map ECharts
		if (this.state.isEChartDataNew) {
			
			this.updateMapECharts();

			this.setState({
				isEChartDataNew: false
			})	
		}
		

		this.updateMapEChartsStyle();
	}

	componentWillUnmount() {
    	window.removeEventListener('resize', this.handleResize);
  	}


  	generateEChartsData = (mapData) => {

		const clusterTracks = mapData;
		
		// 依据时间粒度划分的 数据集合
		const trajDataSet = [];

		for(let i = 0; i < clusterTracks.length; i++) {

			// 每一个元素 为个单元时间粒度的 轨迹集合
			const groupName = clusterTracks[i]._id;
			const geom =  clusterTracks[i].trajectories;
			const clusterid = clusterTracks[i].clusterid;

			const nowTracksByCluster = [];  // 该时间粒度下，不同人群的轨迹集合

			// 将每个时间粒度内的元素 依据各自的群体类别进行划分
			geom.forEach((item,index) => {
				const clusterName = `人群${clusterid[index]}`;

				let everyCluster = nowTracksByCluster.find((everyCluster) => everyCluster.name == clusterName);

				if(everyCluster == undefined) {
					everyCluster = {};
					everyCluster.name = clusterName;
					everyCluster.geoms = [];
					everyCluster.count = 0;
					nowTracksByCluster.push(everyCluster);
				}
				const geojson = JSON.parse(item);
				const coord = geojson.coordinates;
				const coord_e = [];
				for(let index = 0; index < coord.length; index++){
					const lon = coord[index][0];
					const lat = coord[index][1];
					coord_e.push([lon, lat]);
				}
				const geom_e = { coords: coord_e };

				// 将该类别的轨迹 添加到集合
				everyCluster.geoms.push(geom_e);

				// 添加每个系列的属性
				if (geojson.count) {
					everyCluster.count = geojson.count;
				}
				
			});

			const legendData = nowTracksByCluster.map( e => e.name);

			const seriesData = nowTracksByCluster.map( e => e.geoms);

			const seriesProperty = nowTracksByCluster.map( e => e.count);

			// 将每个时间粒度下的 数据添加到 集合
			trajDataSet.push({
				date:groupName,
				legends:legendData,
				series:seriesData,
				seriesProperty: seriesProperty
			});
		}

		let startDate = '';

		if (trajDataSet.length > 0) startDate = trajDataSet[0].date;

		this.setState({
			currentDate: startDate, 
			echartData: trajDataSet,
			isEChartDataNew: true
		})
  	}

	// update Trajectories ECharts
	updateMapECharts = () => {

		const chart = echarts.init(document.getElementById('map'));

		const mapType = this.props.mapType;  // 1 = geo 2 =bmap

		if(this.state.currentDate != '' && chart) {

			// update options
			const currentDate = this.state.currentDate;
			
			// const currentEchartsData = this.state.echartData.find(e => e.date == currentDate );
			const currentEchartsData = this.state.echartData;


			// toolbox option
			const toolboxOtpion = {
				show: true,
				iconStyle: {
		            normal: {
		                borderColor: '#ddd'
		            }
		        },
				feature : {
		            mark : {show: true},
		            dataView : {show: true, readOnly: false},
		            restore : {show: true},
		            saveAsImage : {show: true}
		        },
		        right: 20
			};

			// series Type
			const seriesType = this.props.geomType;

			// add Time line
			if (currentEchartsData.length > 1) {

				const coordinateSystemName = mapType == 1 ? 'geo' : 'bmap';
				
				const dateSet = currentEchartsData.map(e => `${e.date}`);

				// create Base option series
				const baseSeriesData = [];   // for baseOption series
				const baseLegends = [];     // for baseOption legends

				currentEchartsData.map( currDateEcData =>{ 

					const legendNameSet = currDateEcData.legends;

					const linesWidths = currDateEcData.seriesProperty;

					for (var i = 0; i < legendNameSet.length; i++) {

						const legendName = legendNameSet[i];

						if (baseLegends.indexOf(legendName) == -1) {

							baseLegends.push(legendName);

							this.generateBaseSeriesOptionSet(seriesType, legendName, coordinateSystemName, baseSeriesData,linesWidths[i]);
						}
					}
					

				});

				// create Options data
				const optionsData = [];

				// 从每一天中 提出系列数据集合
				
				for (var i = 0; i < currentEchartsData.length; i++) {
					
					const currDateEcData = currentEchartsData[i];

					const date = currDateEcData.date;
					const legendData = currDateEcData.legends;
					const series = currDateEcData.series;

					const seriesSet = baseLegends.map(legendName => {

						const indexSeries = legendData.indexOf(legendName);
						if(indexSeries !== -1) {
							// add 该系列数据
							let seriesData = series[indexSeries];
							switch (seriesType) {
								case 'scatter': seriesData = _.flatten(seriesData.map((points) => points.coords)); break;
								case 'lines': break;
								case 'heatmap': seriesData = _.flatten(seriesData.map((points) => points.coords)).map( c => c.concat([1]) ); break;
								default: break;
							}
							
							return {data:seriesData};
						}
						return {};

					});

					// add BaseStation
					seriesSet.push({data:cellBaseStations.data})

					optionsData.push({
						title: {
				           	text: `${date}轨迹分布`
				        },
				        series: seriesSet
					});

				}

				
				// add BaseSation
				baseLegends.push('基站');

				baseSeriesData.push({
					name: '基站',
					type: 'scatter',
					// coordinateSystem: 'geo',
					coordinateSystem: coordinateSystemName,
					itemStyle: {
						normal: {
							color: '#ff0000',
							opacity: 0.2,
						}
					},
					symbolSize:1
				});

				chart.clear();
				
				// 判断底图 类型
				mapType == 1 ? chart.setOption(
				    {
				        baseOption: {
				        	backgroundColor: '#404a59',
				        	color: this.state.color,
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
				                zlevel: 1    //  new Canvas level = 3

				            },
				            toolbox: toolboxOtpion,
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
				            	textStyle: {
				            		color: '#ffffff'
				            	},
				            	zlevel: 1    //  new Canvas level = 3
				            },
				            geo: this.setEChartGeoOption(),
				            series: baseSeriesData,
				            visualMap: this.props.geomType === 'heatmap' ? this.generateVisualMap() : null
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
				                zlevel: 1    //  new Canvas level = 3
				            },
				            toolbox: toolboxOtpion,
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
				            	zlevel: 1    //  new Canvas level = 3
				            },
				            bmap:bmapShangHai,
				            series: baseSeriesData,
				            visualMap: this.props.geomType === 'heatmap' ? this.generateVisualMap() : null
				        },
				        options: optionsData
				    }
				); // echartSetOption

			} else {
				// one Date
				const legendData = currentEchartsData[0].legends.map( e => e);
				const series = currentEchartsData[0].series;

				const linesWidths = currentEchartsData[0].seriesProperty;
				
				const seriesData = [];

				const coordinateSystemName = mapType == 1 ? 'geo' : 'bmap';

				this.generateSeriesOptionSet(series, seriesType, legendData, coordinateSystemName, seriesData, linesWidths);

				//create VisualMap array

				const visualMapOption = this.generateVisualMap(series,legendData);

				// 绘制基站
				legendData.push('基站');
				seriesData.push({
					name: '基站',
					type: 'scatter',
					// coordinateSystem: 'geo',
					coordinateSystem: coordinateSystemName,
					data:cellBaseStations.data,
					itemStyle: {
						normal: {
							color: '#ff0000',
							opacity: 0.2,
						}
					},
					symbolSize:1
				});

				const color = this.state.color;

				// add 
				// seriesData.push({
				// 	mapType: 'shanghai',
				// 	type: 'map',
				// 	center: [121.487899486,31.24916171],
				// 	roam: true,
				// 	label: {
				// 		emphasis: {
				// 			show: true
				// 		}
				// 	},
				// 	itemStyle: {
				// 		normal: {
				// 			// areaColor: '#323c48',
				// 			areaColor: 'rgba(128, 128, 128, 0.5)',
				// 			borderColor: '#111'
				// 		},
				// 		emphasis: {
				// 			// areaColor: '#2a333d',
				// 			areaColor: 'rgba(128, 128, 200, 0.5)',
				// 		}
				// 	}
				// });

				chart.clear();

				mapType === 1 ?  this.setEChartGeoOption(chart) : chart.setOption({ bmap:bmapShangHai });			

				chart.setOption({
					backgroundColor: '#404a59',
					color:color,
					series:seriesData,
				 	toolbox: toolboxOtpion,
					legend: {
						orient: 'vertical',
						y: 'top',
						x:'left',
						data:legendData,
						textStyle: {
							color: '#fff'
						}
					},
					visualMap: this.props.geomType === 'heatmap' ? this.generateVisualMap() : null
				});
				

			}// one date Echarts
			
		}// end if  currentDate is validate

		this.handleResize();
	}

	updateMapEChartsStyle = () => {

		const chart = echarts.getInstanceByDom(document.getElementById('map'));

		const option = chart.getOption();
	}

	generateSeriesOptionSet = (series, seriesType, legendData, coordinateSystemName, outputSeriesData, linesWidths) => {

		switch (seriesType) {
			case 'scatter' : 
				// add Scatter seriesData
				series.forEach((item,index) => {
					outputSeriesData.push({
						name: legendData[index],
						type: seriesType,
						coordinateSystem: coordinateSystemName,
						data:_.flatten(item.map((points) => points.coords)),
					})
				}); break;
			case 'lines': 
				// add Lines seriesData
				series.forEach((item,index) => {
					outputSeriesData.push({
						name: legendData[index],
						type: seriesType,
						polyline: true,
						// coordinateSystem: 'geo',
						coordinateSystem: coordinateSystemName,
						data:item,
						// lineStyle: {
						// 	normal: {
						// 		opacity: 0.2,
						// 		width: 1
						// 	}
						// },
						// zlevel: 2,
						effect: {
							show: true,
							period: 6,
							trailLength: 0,
							symbol: "pin",
							symbolSize: 5
						},
						lineStyle: {
							normal: {
								width: linesWidths[index] || 0.5,
								opacity: 0.1,
								curveness: 0.2,
							}
						},
						progressiveThreshold: 500,
						progressive: 200
					});

				}); break;
			case 'heatmap' : 
				// add Scatter seriesData
				series.forEach((item,index) => {
					outputSeriesData.push({
						name: legendData[index],
						type: seriesType,
						coordinateSystem: coordinateSystemName,
						data:_.flatten(item.map((points) => points.coords)).map(e => e.concat([1])),
						pointSize: 5,
						blurSize: 6
					})
				}); break;
			default: break;
		}
	}

	generateBaseSeriesOptionSet = (seriesType, legendName, coordinateSystemName, outputbaseSeriesData,linesWidth) => {

		switch (seriesType) {
			case 'scatter': 
				// add Scatter seriesData
				outputbaseSeriesData.push({
					name: legendName,
					type: seriesType,
					coordinateSystem: coordinateSystemName,
				}); break;
			case 'lines': 
				// add Lines seriesData
				outputbaseSeriesData.push({
					name: legendName,
					type: seriesType,
					polyline: true,
					coordinateSystem: coordinateSystemName,
					// lineStyle: {
					// 	normal: {
					// 		opacity: 0.2,
					// 		width: 1
					// 	}
					// },
					// zlevel: 2,
					effect: {
						show: true,
						period: 6,
						trailLength: 0,
						symbol: "pin",
						symbolSize: 5
					},
					lineStyle: {
						normal: {
							width: linesWidth || 0.5,
							opacity: 0.1,
							curveness: 0.2
						}
					},
					progressiveThreshold: 500,
					progressive: 200
				}); break;
			case 'heatmap':
				// add Scatter seriesData
				series.forEach((item,index) => {
					outputSeriesData.push({
						name: legendData[index],
						type: seriesType,
						coordinateSystem: coordinateSystemName,
						data:_.flatten(item.map((points) => points.coords)).map(e => e.concat([1])),
						pointSize: 5,
						blurSize: 6
					})
				}); break;
			default: break;
		}
	}

	generateVisualMap = (series, legendData) => {

	// const visualMap = legendData.map( (item, index) => {
	// 	const visualMapItem = {
	// 		show: false,
	//            top: 'top',
	//            min: 0,
	//            max: 5,
	//            seriesIndex: index,
	//            calculable: true,
	//            inRange: {
	//                color: ['blue', 'blue', 'green', 'yellow', 'red']
	//            }
	// 	};
	// 	return visualMapItem;
	// });
		
		const visualMapItem = {
				show: false,
	            top: 'top',
	            min: 0,
	            max: 5,
	            calculable: true,
	            inRange: {
	                color: ['blue', 'blue', 'green', 'yellow', 'red']
	            }
			};

		return visualMapItem;
	}

	setEChartGeoOption = (echartsInstance) => {
		const geoOption =  {
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
			},
			silent: true,
		};

		if (echartsInstance) {
			echartsInstance.setOption({
				geo: geoOption
			});	
		}

		return geoOption;
	}

	setEChartBmapOption = (echartsInstance) => {
		if (echartsInstance) {
			echartsInstance.setOption({ bmap:bmapShangHai });
		}
	}

	convertData =  (data) => {
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

	handleResize = () => {
		const chart = echarts.getInstanceByDom(document.getElementById('map'));
		const width = document.getElementById('map').clientWidth;
		const height =  width * 0.8;
		chart.resize({
			width,
			height
		});

		const bmapDiv = document.getElementsByClassName('ec-extension-bmap').item(0);
		// if (bmapDiv) bmapDiv.setAttribute('style',`width: 100%;height: ${height}px;position: relative;overflow: hidden;`);
		if (bmapDiv) bmapDiv.style.height = `${height}px`;

	}

	render() {
		return (
			<div id="map" className={styles.mapdiv}></div>
		);
	}
}

export default MapDiv;
