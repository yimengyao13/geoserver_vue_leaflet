<template>
  <div class="map-container" id="map-container"></div>
</template>
<script>
// 引入leaflet模块
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
export default {
  name: "mapView",
  components: {},
  data() {
    return {
      map: null,
      GaodeUrl: "http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
      WMTSUrl : "http://localhost:8080/geoserver/fangjia/wms?",
      WFSUrl : "http://localhost:8080/geoserver/wfs?",
      WMSOption : {
        layers: 'community_price',
        format: 'image/png',
        transparent: true,
        // 查询函数
        // CQL_FILTER : "name='太阳宫'"
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
    // 点击地图获取要素
    this.map.on("click", ev => {
      // 构造BBOX，拼接请求url
      var latlng = ev.latlng;
      var d_gree = 0.0001;
      var min_lng = latlng['lng'] - d_gree;
      var max_lng = latlng['lng'] + d_gree;
      var min_lat = latlng['lat'] - d_gree;
      var max_lat = latlng['lat'] + d_gree;
      var feature_url = this.WFSUrl + 'request=GetFeature&version=1.1.0&typeName=fangjia:community_price&outputFormat=application/json&BBOX=' + min_lng.toFixed(6) + ',' + min_lat.toFixed(6) + ',' + max_lng.toFixed(6) + ',' + max_lat.toFixed(6) + ',EPSG:4326';
      // 单击地图，获取geojson，渲染要素
      console.log(feature_url);
      axios.get(feature_url)
        .then((response) => {
          console.log(response);
          var polygon = L.geoJSON(response.data, {
                style: {'color': "#000000",
                      'fillColor': "#ffffff",
                      'opacity': 0.7,
                      'weight': 5,
                }
            });
          polygon.addTo(this.map);
        })
        .catch(function(error) {
          console.log(error);
        });
    })
  }
};
</script>
<style>
.map-container {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
