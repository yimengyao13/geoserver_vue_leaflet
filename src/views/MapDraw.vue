<template>
  <div>
    <div class="map-container" id="map-container"></div>
    <div class="attr">
      <div class="attr_item">
          <label>属性：</label>
      </div>
      <div class="attr_item">
          <label>FID：</label>
          <input type="text" ref="fid"/>
      </div>
      <div class="attr_item">
          <label>name：</label>
          <input type="text" ref="name"/>
      </div>
      <div class="attr_item">
          <label>total：</label>
          <input type="text" ref="total"/>
      </div>
      <div class="attr_item">
          <label>average：</label>
          <input type="text" ref="average"/>
      </div>
      <button @click="upload">添加</button>
    </div>

  </div>
</template>
<script>
// 引入leaflet模块
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// 引入leaflet-draw模块
import LeafletDraw from "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
// 引入axios模块
import axios from "axios";
export default {
  name: "mapView",
  components: {},
  data() {
    return {
      map: null,
      drawnItems:null,
      GaodeUrl: "http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
      WMTSUrl : "http://localhost:8080/geoserver/fangjia/wms?",
      WMSOption : {
        layers: 'community_price',
        format: 'image/png',
        transparent: true,
      }
    };
  },
  mounted() {
    this.map = L.map("map-container");
    L.tileLayer(this.GaodeUrl, {
      maxZoom: 24,
    }).addTo(this.map);
    this.map.setView([39.909921, 116.381948], 12);
    // 加载geoserver发布的wmts服务
    L.tileLayer.wms(this.WMTSUrl,this.WMSOption).addTo(this.map);
    // 添加绘制工具
    this.drawnItems = L.featureGroup().addTo(this.map);
    this.map.addControl(new L.Control.Draw({
        edit: {
            featureGroup: this.drawnItems,
            poly: {
                allowIntersection: false
            }
        },
        draw: {
            polygon: {
                allowIntersection: false,
                showArea: false
            }
        }
    }));
    this.map.on(L.Draw.Event.CREATED,  (event) => {
        var layer = event.layer;
        this.drawnItems.addLayer(layer);
    });
  },
  methods:{
    upload(){
      // 构造WFS请求
      var fid_txt = this.$refs.fid.value;
      var name_txt = this.$refs.name.value;
      var total_txt = this.$refs.total.value;
      var average_txt = this.$refs.average.value;
      var latlngs = this.drawnItems.getLayers()[0].editing.latlngs[0][0];
      // console.log(latlngs);
      var coord_txt = '';
      for (var i = 0; i < latlngs.length; i++) {
          coord_txt = coord_txt + latlngs[i]['lng'].toFixed(6) + ','+latlngs[i]['lat'].toFixed(6) +' '
      }
      coord_txt = coord_txt +latlngs[0]['lng'].toFixed(6)+','+latlngs[0]['lat'].toFixed(6);
      var gml_txt = '<?xml version="1.0" encoding="UTF8"?>\n\
<wfs:Transaction service="WFS" version="1.0.0"\n\
               xmlns:wfs="http://www.opengis.net/wfs"\n\
               xmlns:fangjia="http://www.fangjia"\n\
               xmlns:gml="http://www.opengis.net/gml"\n\
               xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n\
               xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.fangjia http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=fangjia:community_price">\n\
<wfs:Insert>\n\
  <fangjia:community_price>\n\
    <fangjia:the_geom>\n\
      <gml:MultiPolygon srsName="http://www.opengis.net/gml/srs/epsg.xml#4326"><gml:polygonMember><gml:Polygon><gml:outerBoundaryIs><gml:LinearRing><gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">'+coord_txt+'</gml:coordinates></gml:LinearRing></gml:outerBoundaryIs></gml:Polygon></gml:polygonMember></gml:MultiPolygon>\n\
    </fangjia:the_geom>\n\
    <fangjia:name>'+name_txt+'</fangjia:name>\n\
    <fangjia:total>'+total_txt+'</fangjia:total>\n\
    <fangjia:average>'+average_txt+'</fangjia:average>\n\
  </fangjia:community_price>\n\
</wfs:Insert>\n\
</wfs:Transaction>\n\
'
      console.log(gml_txt);
      var config = {
        method: 'post',
        url: 'apis/geoserver/wfs',
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8'
        },
        data: gml_txt
      };
      axios(config)
        .then( (response) => {
          console.log(response.data);
        })
        .catch( (error) => {
          console.log(error);
        });
    }
  }
};
</script>
<style>
.map-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 900px;
  height: 100%;
}
.attr{
  position: absolute;
  left: 950px;
  top: 0;
  width: 300px;
  height: 100%;
  border: 1px;
  background:#ccc;
}
.attr_item{
  width: 300px;
  height: 50px;
  margin: 20px
}
</style>
