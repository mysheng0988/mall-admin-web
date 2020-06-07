<template>
  <div class="app-container home">
    <el-card class="operate-container" shadow="never">
      <div class="shop-msg">
        <el-row :gutter="10">
          <el-col :xs="24" :sm="8">
            <svg-icon icon-class="shop" class="color-back"></svg-icon>
            <span>店铺信息</span>
          </el-col>
          <el-col :xs="24" :sm="16" style="text-align: right">
            <el-button
              icon="iconfont icon-qr-code"
              @click="handleQRCode()"
              type="warning" plain
              size="mini">
              店铺二维码
            </el-button>
            <el-button
              icon="el-icon-edit"
              @click="handleEditShop()"
              type="success" plain
              size="mini">
              编辑
            </el-button>
            <el-button
              icon="el-icon-plus"
              @click="handleAddShop()"
              type="primary" plain
              size="mini">
              添加
            </el-button>
            <el-button
              v-show="selectData.status==0"
              icon="iconfont icon-rest"
              @click="handleStatus()"
              type="danger" plain
              size="mini">
              休息
            </el-button>
            <el-button
              v-show="selectData.status==1"
              icon="iconfont icon-open"
              @click="handleStatus()"
              type="success" plain
              size="mini">
              开业
            </el-button>
            <el-button
              v-show="selectData.status==-1||selectData.status==-2"
              icon="iconfont icon-bill"
              @click=""
              type="success" plain
              size="mini">
              续费
            </el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table-container">
        <el-table ref="shopTable"
                  :data="list"
                  style="width: 100%"
                  highlight-current-row
                  :row-style="tableRowClassName"
                  @current-change="handleCurrentChange"
                  v-loading="loading"
                  border>
          <el-table-column type="index" width="60" align="center"></el-table-column>
          <el-table-column label="店铺名称" align="center" width="220" :show-overflow-tooltip="true">
            <template slot-scope="scope"><div class="table-item">{{scope.row.shopName}}</div></template>
          </el-table-column>
          <el-table-column label="店铺编码"  align="center" width="220" :show-overflow-tooltip="true">
            <template slot-scope="scope"><div class="table-item">{{scope.row.shopCode}}</div></template>
          </el-table-column>
          <el-table-column label="联系电话"  align="center" width="150">
            <template slot-scope="scope"><div class="table-item">{{scope.row.telephone}}</div></template>
          </el-table-column>
          <el-table-column label="基础运费"  align="center" width="100">
            <template slot-scope="scope"><div class="table-item">{{scope.row.freight}}元</div></template>
          </el-table-column>
          <el-table-column label="配送范围"  align="center" width="100">
            <template slot-scope="scope"><div class="table-item">{{scope.row.shopScope|formatShopScope}}</div></template>
          </el-table-column>
          <el-table-column label="店铺状态"  align="center" width="100">
            <template slot-scope="scope"><div class="table-item">{{scope.row.status| formatStatus}}</div></template>
          </el-table-column>
          <el-table-column label="店铺地址" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope"><div class="table-item">{{scope.row.address}}</div></template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <sales-volume :shop-id="selectData.id"></sales-volume>
    <await-handle></await-handle>
    <user-goods-msg :shop-id="selectData.id"></user-goods-msg>
    <order-statistics :shop-id="selectData.id"></order-statistics>

    <el-dialog :visible.sync="qrDialog" width="420px">
      <qrcode :q-text="qText" :q-size="qSize" :d-name="dName"></qrcode>
      <vue-barcode :value="qText"></vue-barcode>
    </el-dialog>

  </div>
</template>

<script>

  import {str2Date} from '@/utils/date';
  import img_home_order from '@/assets/images/home_order.png';
  import img_home_today_amount from '@/assets/images/home_today_amount.png';
  import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
  import SalesVolume from "./components/SalesVolume"
  import AwaitHandle from "./components/AwaitHandle"
  import UserGoodsMsg from "./components/UserGoodsMsg"
  import OrderStatistics from "./components/OrderStatistics"
  import qrcode from "@/components/qrcode/qrcode"
  import VueBarcode from "vue-barcode"
  import {findShop} from "../../api/shop";
  const DATA_FROM_BACKEND = {
    columns: ['date', 'orderCount','orderAmount'],
    rows: [
      {date: '2018-11-01', orderCount: 10, orderAmount: 1093},
      {date: '2018-11-02', orderCount: 20, orderAmount: 2230},
      {date: '2018-11-03', orderCount: 33, orderAmount: 3623},
      {date: '2018-11-04', orderCount: 50, orderAmount: 6423},
      {date: '2018-11-05', orderCount: 80, orderAmount: 8492},
      {date: '2018-11-06', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-07', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-08', orderCount: 60, orderAmount: 6293},
      {date: '2018-11-09', orderCount: 50, orderAmount: 5293},
      {date: '2018-11-10', orderCount: 30, orderAmount: 3293},
      {date: '2018-11-11', orderCount: 20, orderAmount: 2293},
      {date: '2018-11-12', orderCount: 80, orderAmount: 8293},
      {date: '2018-11-13', orderCount: 100, orderAmount: 10293},
      {date: '2018-11-14', orderCount: 10, orderAmount: 1293},
      {date: '2018-11-15', orderCount: 40, orderAmount: 4293}
    ]
  };

  export default {
    name: 'home',
    components: {
      SalesVolume,
      AwaitHandle,
      UserGoodsMsg,
      OrderStatistics,
      qrcode,
      VueBarcode
    },
    data() {
      return {
        selectData:[],
        qrDialog:false,
        qText:"",
        dName:"",
        qSize:300,
        list:[],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一月',
            onClick(picker) {
              const end = new Date();
              let start = new Date();
              start.setFullYear(2018);
              start.setMonth(10);
              start.setDate(1);
              end.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        orderCountDate: '',
        chartSettings: {
          xAxisType: 'time',
          area:true,
          axisSite: { right: ['orderAmount']},
          labelMap: {'orderCount': '订单数量', 'orderAmount': '订单金额'}},
         chartData: {
          columns: [],
          rows: []
        },
        loading: false,
        dataEmpty: false,
        img_home_order,
        img_home_today_amount,
        img_home_yesterday_amount
      }
    },
    filters:{
      formatStatus(status){
        if(status==0){
          return '正在营业';
        }else if(status==1){
          return '休息中';
        }else if(status==-1){
          return '已到期';
        }else if(status==-2){
          return "请您充值";
        }
      },
      formatShopScope(value){
        if(value==0){
          return '用户自提';
        }else if(value==-1){
          return '城区内';
        }else{
          return value+"km";
        }
      },
    },
    mounted(){
      this.handleInitShop();
    },

    methods:{
      handleQRCode(){
          this.qText=this.selectData.shopCode;
          this.dName=this.selectData.shopName;
          this.qrDialog=true;
      },
      handleInitShop(){
        this.loading=true;
        findShop().then((res) => {
          this.list=res.data;
          this.loading = false;
          this.checkedData();
        }).catch(() => {
          this.loading = false
        })
      },
      handleStatus(){
        let id=this.selectData.id;
        let status=this.selectData.status;
        shopStatus(id,status).then((res) => {
          this.loading = false;
          Message.success(res.msg)
          this.handleInitShop();
        }).catch(() => {
          this.loading = false
        })
      },
      handleEditShop(){
        this.$router.push({path: 'home/update',query:{id:this.selectData.id}});
       // this.dialogFormVisible=true
      },
      checkedData(){
        this.$refs.shopTable.setCurrentRow(this.list[0]);
        this.selectData=this.list[0];
      },
      tableRowClassName(row){
        if(row.row.status==1){
          return {"background-color":"#FDF6EC"}
        }else if(row.row.status==-1){
          return {"background-color":"#FAB6B6"}
        }else if(row.row.status==-2){
          return {"background-color":"#F0F9EB"}
        }

      },
      handleAddShop(){
        this.$router.push({path: 'home/addShop'});
      },
      handleCurrentChange(currentRow,oldCurrentRow){
        this.selectData=currentRow;
        sessionStorage.setItem("shopId",currentRow.id)
        sessionStorage.setItem("shopName",currentRow.shopName)
        this.qText=currentRow.shopCode;
        this.dName=currentRow.shopName;
      },

    }
  }
</script>

<style scoped>
  .shop-msg{
    height: 44px;
    line-height: 44px;
    margin-bottom: 10px;
  }
  .btn-handle{
    width: 120px;
    height: 44px;
  }
  .table-item{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .color-back{
    color: #666666;
  }
  .viewer{
    position: relative;
    margin-top: 20px;
    width: 100%;
    height: 0;
    padding-bottom: 100%;
    overflow: hidden;
  }
  viewer img {
    position:  absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .mine-layout {
    position: absolute;
    right: 140px;
    top: 107px;
    width: 250px;
    height: 235px;
  }
  .address-content{
    padding: 20px;
    font-size: 18px
  }
</style>
