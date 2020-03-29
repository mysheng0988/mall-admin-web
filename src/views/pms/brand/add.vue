<template> 
  <div class="app-container">
    <brand-detail :is-edit='false'></brand-detail>
  </div>
</template>
<script>
  import BrandDetail from './components/BrandDetail'
  export default {
    name: 'addBrand',
    components: { BrandDetail }
  }
</script>
<style>
</style>


