<template> 
  <div class="app-container">
    <coupon-detail :isEdit="false"></coupon-detail>
  </div>
</template>
<script>
  import CouponDetail from './components/CouponDetail'
  export default {
    name: 'addCoupon',
    components: { CouponDetail }
  }
</script>
<style scoped>
</style>


