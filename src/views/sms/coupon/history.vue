<template> 
  <div class="app-container">
    <div class="table-layout">
      <el-row>
        <el-col :span="5" class="table-cell-title">名称</el-col>
        <el-col :span="5" class="table-cell-title">优惠券类型</el-col>
        <el-col :span="5" class="table-cell-title">使用门槛</el-col>
        <el-col :span="5" class="table-cell-title">面值</el-col>
        <el-col :span="4" class="table-cell-title">限制条件</el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-cell">{{coupon.couponName}}</el-col>
        <el-col :span="5" class="table-cell">{{coupon.couponType | formatCouponType}}</el-col>
        <el-col :span="5" class="table-cell">满{{coupon.limitAmount}}元可用</el-col>
        <el-col :span="5" class="table-cell">{{coupon.couponAmount}}元</el-col>
        <el-col :span="4" class="table-cell">每人限领{{coupon.perLimit}}张</el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-cell-title">有效期</el-col>
        <el-col :span="5" class="table-cell-title">总发行量</el-col>
        <el-col :span="5" class="table-cell-title">已领取数量</el-col>
        <el-col :span="5" class="table-cell-title">已使用数量</el-col>
        <el-col :span="4" class="table-cell-title">状态</el-col>
      </el-row>
      <el-row>
        <el-col :span="5" class="table-cell" style="font-size: 13px">
          {{coupon.beginTime}}至{{coupon.expireTime}}
        </el-col>
        <el-col :span="5" class="table-cell">{{coupon.couponCount}}</el-col>
        <el-col :span="5" class="table-cell">{{coupon.useCount}}</el-col>
        <el-col :span="5" class="table-cell">{{coupon.reserveCount}}</el-col>
        <el-col :span="4" class="table-cell">{{coupon.status| formatStatus}}</el-col>
      </el-row>
    </div>
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="使用状态：">
            <el-select v-model="listQuery.useStatus" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in useTypeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单编号：">
            <el-input v-model="listQuery.orderSn" class="input-width" placeholder="订单编号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-table ref="couponHistoryTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column label="优惠码" width="160" align="center">
          <template slot-scope="scope">{{scope.row.couponCode}}</template>
        </el-table-column>
        <el-table-column label="领取会员" width="140" align="center">
          <template slot-scope="scope">{{scope.row.memberNickname}}</template>
        </el-table-column>
        <el-table-column label="领取方式" width="100" align="center">
          <template slot-scope="scope">{{scope.row.getType | formatGetType}}</template>
        </el-table-column>
        <el-table-column label="领取时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="当前状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row.useStatus | formatCouponHistoryUseType}}</template>
        </el-table-column>
        <el-table-column label="使用时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.useTime | formatTime}}</template>
        </el-table-column>
        <el-table-column label="订单编号" align="center">
          <template slot-scope="scope">{{scope.row.orderSn===null?'N/A':scope.row.orderSn}}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {formatDate} from '@/utils/date';
  import {getCoupon} from '@/api/coupon';
  import {fetchList as fetchCouponHistoryList} from '@/api/couponHistory';
  const defaultCouponOptions={
    shopId:"",
    shopName:"",
    couponName: null,
    couponAmount: null,
    couponCount:null,
    couponType: null,
    useCount:0,
    reserveCount:0,
    perLimit: 1,
    limitName: null,
    limitAmount: 100,
    beginTime: null,
    expireTime: null,
  }
  const defaultTypeOptions = [
    {
      label: '全场赠券',
      value: 0
    },
    {
      label: '会员赠券',
      value: 1
    },
    {
      label: '购物赠券',
      value: 2
    },
    {
      label: '注册赠券',
      value: 3
    }
  ];
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    useStatus: null,
    orderSn: null,
    couponId: null
  };
  const defaultUseTypeOptions= [
    {
      label: "未使用",
      value: 0
    },
    {
      label: "已使用",
      value: 1
    },
    {
      label: "已过期",
      value: 2
    }
  ];
  export default {
    name: 'couponHistoryList',
    data() {
      return {
        coupon: Object.assign({}, defaultCouponOptions),
        listQuery: Object.assign({}, defaultListQuery),
        useTypeOptions:Object.assign({},defaultUseTypeOptions),
        list:null,
        total:null,
        listLoading:false
      }
    },
    created() {
      this.getCouponMsg();
      // this.listQuery.couponId=this.$route.query.id;
      // this.getList();
    },
    filters: {
      formatType(type) {
        for (let i = 0; i < defaultTypeOptions.length; i++) {
          if (type === defaultTypeOptions[i].value) {
            return defaultTypeOptions[i].label;
          }
        }
        return '';
      },
      formatCouponType(useType) {
        if (useType === 0) {
          return '全场通用';
        } else if (useType === 1) {
          return '指定分类';
        } else {
          return '指定商品';
        }
      },
      formatStatus(value){
        if(value==0){
          return '未过期'
        }else{
          return '已过期';
        }
      },
    },
    methods: {
      getCouponMsg(){
        getCoupon(this.$route.query.id).then(response => {
          let data=response.data;
          console.log(data)
          this.coupon = Object.assign(defaultCouponOptions,data);
        });
      },
      getList(){
        this.listLoading=true;
        fetchCouponHistoryList(this.listQuery).then(response=>{
          this.listLoading=false;
          this.list=response.data.list;
          this.total=response.data.total;
        });
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.listQuery.couponId=this.$route.query.id;
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
        this.getList();
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      }
    }
  }
</script>
<style scoped>


  .filter-container {
    margin-top: 20px;
  }

  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }

  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }

  .table-cell-title {
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
</style>


