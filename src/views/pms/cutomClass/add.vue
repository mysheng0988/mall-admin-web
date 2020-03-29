<template> 
  <div class="app-container">
    <custom-class-detail :is-edit='false'></custom-class-detail>
  </div>

</template>
<script>
  import CustomClassDetail from './components/CustomClassDetail'
  export default {
    name: 'addProductCate',
    components: { CustomClassDetail }
  }
</script>
<style>
</style>


