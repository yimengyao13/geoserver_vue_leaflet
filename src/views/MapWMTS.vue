<template>
  <div class="map-container" id="map-container"></div>
</template>
<script>
// 引入leaflet模块
import "leaflet/dist/leaflet.css";
import L from "leaflet";
export default {
  name: "mapView",
  components: {},
  data() {
    return {
      map: null,
      GaodeUrl: "http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
      WMTSUrl : "http://localhost:8080/geoserver/fangjia/wms?",
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
