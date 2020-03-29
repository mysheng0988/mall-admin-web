<template>
  <div class="amap-page-container" >
    <el-amap
      vid="amapDemo"
      :center="center"
      :zoom="zoom"
      :plugin="plugin"
      class="amap-demo"
      :events="events">
      <el-amap-marker vid="component-marker" :offset=[-10,-40] :position='center'  ></el-amap-marker>
    </el-amap>
  </div>
</template>
<script>
  module.exports = {
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      aLng:{
        type: Number,
        default: 0
      },
      aLat:{
        type: Number,
        default: 0
      }
    },
    data() {
      let self = this;
      return {
        zoom: 18,
        center: [107.598915, 37.594023],
        lng:107.598915,
        lat:37.594023,
        address: '',
        loaded: false,
        plugin: [{
          pName: 'Geolocation',
          events: {
            init(o) {
              // o 是高德地图定位插件实例
              if(self.isEdit){
                return
              }
              //AMapUI.loadUI(...)
              o.getCurrentPosition((status, result) => {
                console.log(result)
                if (result && result.position) {
                  self.lng = result.position.lng;
                  self.lat = result.position.lat;
                  self.center = [self.lng, self.lat];
                  self.address=result.formattedAddress;
                  self.loaded = true;
                  self.$nextTick();
                  let address={};
                  address.longitude=self.lng;
                  address.latitude=self.lat;
                  address.address=self.address
                  self.$emit('p-address',address)
                }
              });
            }
          }
        }],
        events: {
          click(e) {
            let { lng, lat } = e.lnglat;
            self.lng = lng;
            self.lat = lat;
            self.center=[lng,lat];
              var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: "all"
              });
              geocoder.getAddress([lng ,lat], function(status, result) {
                if (status === 'complete' && result.info === 'OK') {
                  if (result && result.regeocode) {
                    self.address = result.regeocode.formattedAddress;
                    self.$nextTick();
                    let address={};
                      address.longitude=self.lng;
                      address.latitude=self.lat;
                      address.address=self.address
                    self.$emit('p-address',address)
                  }
                }
              });
          }
        },
      };
    },
    methods:{
      showMap(){
        if(this.isEdit){
          this.center=[this.aLng,this.aLat];
          this.lng=this.aLng;
          this.lat=this.aLat;
        }


      }
    }
  };
</script>

<style>
  .amap-page-container{
    padding: 10px 20px;
  }
  .amap-demo {
    height: 300px!important;
  }
</style>
