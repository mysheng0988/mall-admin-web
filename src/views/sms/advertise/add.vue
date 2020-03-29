<template> 
  <div class="app-container">
    <home-advertise-detail :isEdit="false"></home-advertise-detail>
  </div>
</template>
<script>
  import HomeAdvertiseDetail from './components/HomeAdvertiseDetail'
  export default {
    name: 'addHomeAdvertise',
    components: { HomeAdvertiseDetail }
  }
</script>
<style></style>


