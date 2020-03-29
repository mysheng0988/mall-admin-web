<template> 
  <div class="app-container">
      <coupon-detail :isEdit="true"></coupon-detail>
  </div>
</template>
<script>
  import CouponDetail from './components/CouponDetail'
  export default {
    name: 'updateCoupon',
    components: { CouponDetail }
  }
</script>
<style scoped>
</style>


