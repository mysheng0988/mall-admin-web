<template> 
  <div class="app-container">
    <shop-detail  :shop-id='shopId' :is-edit='true'></shop-detail>
  </div>
</template>
<script>
  import ShopDetail from './components/ShopDetail'
  export default {
    name: 'update',
    data(){
      return {
        shopId:''
      };
    },
    components: { ShopDetail },
    mounted(){
      this.shopId=this.$route.query.id;
    }
  }
</script>
<style>
</style>


