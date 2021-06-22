<template>
  <div class="map-container" id="map-container"></div>
  </div>
</template>
<script>
// 引入leaflet模块
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// 引入leaflet-draw模块
import LeafletDraw from "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
// 引入点图标
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
export default {
  name: "mapView",
  components: {},
  data() {
    return {
      map: null,
      drawnItems: null,
      GaodeUrl: "http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
    };
  },
  mounted() {
    // 定义点图标
    var DefaultIcon = L.icon({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    this.map = L.map("map-container");
    L.tileLayer(this.GaodeUrl, {
      maxZoom: 24,
    }).addTo(this.map);
    this.map.setView([39.909921, 116.381948], 12);
    // 在地图中心，添加一个点
    L.marker(L.latLng(39.909921, 116.381948), {icon:DefaultIcon}).addTo(this.map);

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
        },
        marker: {
          icon: DefaultIcon
        }
      }
    }));
    this.map.on(L.Draw.Event.CREATED, (event) => {
      var layer = event.layer;
      this.drawnItems.addLayer(layer);
    });
  },
  methods: {
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
