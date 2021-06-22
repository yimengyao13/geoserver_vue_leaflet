<template>
  <div class="attr_item">
    <p>输入gml文本内容：</p>
    <textarea class="textarea" ref="gmltxt"></textarea>
    <p></p>
    <button @click="upload">上传</button>
  </div>
</template>
<script>
// 引入axios模块
import axios from "axios";
export default {
  name: "mapView",
  components: {},
  data() {
    return {
    };
  },
  mounted() {
  },
  methods: {
    upload() {
      var config = {
        method: 'post',
        url: 'apis/geoserver/wfs',
        headers: {
          'Content-Type': 'text/xml;charset=UTF-8'
        },
        data: this.$refs.gmltxt.value
      };
      axios(config)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }
};
</script>
<style>
.attr_item {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #ccc;
}
.textarea {
   width: 400px;
   height: 400px;
}
</style>
