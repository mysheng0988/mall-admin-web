<template> 
  <div class="app-container">
    <news-detail :is-edit='true'></news-detail>
  </div>

</template>
<script>
  import newsDetail from './components/newsDetail'
  export default {
    name: 'addNews',
    components: { newsDetail }
  }
</script>
<style>
</style>


