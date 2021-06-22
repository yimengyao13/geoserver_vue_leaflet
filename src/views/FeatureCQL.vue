<template>
  <div>
    <div class="cql">
      <input type="text" ref="getValue"/>
      <button @click="cql">查询</button>
    </div>
    <div class="map-container" id="map-container"></div>
  </div>
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
  },
  methods:{
    cql(){
      // 根据输入构建查询url
      var feature_url = this.WFSUrl + 'request=GetFeature&version=1.1.0&typeName=fangjia:community_price&outputFormat=application/json&CQL_FILTER='+encodeURIComponent(this.$refs.getValue.value);
      console.log(feature_url);
      axios.get(feature_url)
        .then((response) =>{
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
    }
  }
};
</script>
<style>
.map-container {
  position: absolute;
  left: 0;
  top: 50px;
  width: 100%;
  height: 100%;
}
.cql{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 40px;
}
</style>
