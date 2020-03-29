<template> 
  <div class="app-container">
    <shop-detail :is-edit='false'></shop-detail>
  </div>
</template>
<script>
  import ShopDetail from './components/ShopDetail'
  export default {
    name: 'addShop',
    components: { ShopDetail }
  }
</script>
<style>
</style>


