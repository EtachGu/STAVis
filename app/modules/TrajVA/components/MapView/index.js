import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';

// components
import MapDiv from './components/map';
import STMapDiv from './components/statisticMap';
import Map3D from './components/map3d';

// styles
import styles from './styles.css';

// select
import {
  selectTrajectory,
  selectControlsGeomType,
  selectControlsMapType,
  selectControlsMap3d
} from './selectors';

class MapView extends Component {

  constructor(props) {
    super(props);

  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.mapType !== nextProps.mapType || this.props.geomType !== nextProps.geomType || this.props.map3d !== nextProps.map3d) {
      return true;
    }
    if (this.props.trajectories !== nextProps.trajectories) {
      return true;
    }
    return false;
  }

  initialMap() {
    const opacity = 0.6;
    const map = new  ol.Map({
      renderer:('webgl'),
      layers: [
        new ol.layer.Tile({
          // source: new ol.source.ImageWMS({
          //     url:'http://demo.opengeo.org/geoserver/wms',
          //     params:{'LAYERS':'ne:ne'},
          //     serverType:'geoserver'})
          //
          title:'OSM',
          visible: true,
          source: new ol.source.OSM({opaque:'false'}),
          opacity:opacity
        }),
        new ol.layer.Tile({
          // source: new ol.source.MapQuest({layer: 'sat'})
          // source: new ol.source.OSM({opaque:'false'})
          // source: new ol.source.Raster()
          // source: new ol.source.ImageWMS({
          //     url:'http://demo.opengeo.org/geoserver/wms',
          //     params:{'LAYERS':'ne:ne'},
          //     serverType:'geoserver'})
          //source: new ol.source.CartDB()
          title:'toner-hybrid',
          visible: false,
          source: new ol.source.Stamen({
            //layer: 'terrain-background'
            // layer: 'terrain'
            layer: 'toner-hybrid'
          }),
          // source: new ol.source.MapQuest({layer: 'osm'}),
          opacity:opacity
          // : {
          //     extension: 'png',
          //     opaque: false
          // },
          // 'terrain-lines': {
          //     extension: 'png',
          //     opaque: false
          // },
          // 'toner-background': {
          //     extension: 'png',
          //     opaque: true
          // },
          // 'toner': {
          //     extension: 'png',
          //     opaque: true
          // },
          // 'toner-hybrid': {
          //     extension: 'png',
          //     opaque: false
          // },
          // 'toner-labels': {
          //     extension: 'png',
          //     opaque: false
          // },
          // 'toner-lines': {
          //     extension: 'png',
          //     opaque: false
          // },
          // 'toner-lite': {
          //     extension: 'png',
          //     opaque: true
          // },
          // 'watercolor': {
          //     extension: 'jpg',
          //     opaque: true
          // }
        }),
        //        //        导入GeoJson文件数据
        //       new ol.layer.Vector({
        //         source: new ol.source.Vector({
        //           url: '../data2.geojson',
        //           format: new ol.format.GeoJSON()
        //         })
        // //              设置点的格式"MultiPoint",
        // //              style:
        //       })
        new ol.layer.Tile({
          title:'MapQuest osm',
          visible: false,
          source: new ol.source.MapQuest({layer: 'osm'}),
          opacity:opacity
        }),
        new ol.layer.Tile({
          //
          // source: new ol.source.OSM({opaque:'false'})
          // source: new ol.source.Raster()
          // source: new ol.source.ImageWMS({
          //     url:'http://demo.opengeo.org/geoserver/wms',
          //     params:{'LAYERS':'ne:ne'},
          //     serverType:'geoserver'})
          //source: new ol.source.CartDB()
          title:'MapQuest sat',
          visible: false,
          source: new ol.source.MapQuest({layer: 'sat'}),
          opacity:opacity
        }),
        new ol.layer.Tile({
          title:'ImageWMS',
          visible: false,
          source: new ol.source.ImageWMS({
            url:'http://demo.opengeo.org/geoserver/wms',
            params:{'LAYERS':'ne:ne'},
            serverType:'geoserver'}),
          opacity:opacity
        })
      ],
      target: 'map',
      // controls: ol.control.defaults({
      //     attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
      //         collapsible: false
      //     })
      // }),
      //            比例尺
      controls: ol.control.defaults().extend([
        new ol.control.ScaleLine()
      ]),
      view: new ol.View({
        center: ol.proj.transform([114.34500, 30.59389], 'EPSG:4326', 'EPSG:3857'),
        zoom:4,
        minZoom: 2
      })
    });
  }

  render() {
    const mapData = this.props.trajectories.data;
    const mapType = this.props.mapType;
    const geomType = this.props.geomType;
    let mapEChartsSeriesType;
    switch (geomType) {
      // case 1: mapDiv = (<STMapDiv className={styles.mapdiv} mapData={mapData} mapType={mapType} geomType={geomType}/>); break;
      // case 2: mapDiv = (<MapDiv className={styles.mapdiv} mapData={mapData} mapType={mapType} geomType={geomType}/>); break;
      case 1: mapEChartsSeriesType = 'scatter'; break;
      case 2: mapEChartsSeriesType = 'lines'; break;
      case 3: mapEChartsSeriesType = 'heatmap'; break;
      default: break; 
    }
    let mapDiv = (<MapDiv className={styles.mapdiv} mapData={mapData} mapType={mapType} geomType={mapEChartsSeriesType}/>);
    if (this.props.map3d) mapDiv = (<Map3D className={styles.mapdiv} mapData={mapData} mapType={mapType} geomType={mapEChartsSeriesType}/>)
    return (
      <div>
        {mapDiv}
      </div>
    );
  }
}

MapView.propTypes = {
  ij: React.PropTypes.any,
  trajectories: React.PropTypes.object,
  geomType: React.PropTypes.number,
  mapType: React.PropTypes.number,
  map3d: React.PropTypes.boolean,
};

// 任何时候，只要 Redux store 发生改变，mapStateToProps 函数就会被调用。
const mapStateToProps = createStructuredSelector({
  trajectories:selectTrajectory,
  geomType: selectControlsGeomType,
  mapType: selectControlsMapType,
  map3d: selectControlsMap3d,
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
export default connect(mapStateToProps, mapDispatchToProps)(MapView);