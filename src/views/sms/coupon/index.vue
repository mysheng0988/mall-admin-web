<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px" >
          <el-form-item label="优惠券名称：">
            <el-input v-model="listQuery.couponName" class="input-width" placeholder="优惠券名称"></el-input>
          </el-form-item>
          <el-form-item label="优惠券类型：">
            <el-select v-model="listQuery.couponType" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券状态：">
            <el-select v-model="listQuery.status" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in statusOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div style="text-align: right">
        <el-button
          class="button"
          @click="handleSearchList()"
          type="primary"
          size="small">
          查询结果
        </el-button>
        <el-button
          class="button"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
        :data="list"
        style="width: 100%;"
        @selection-change="handleSelectionChange"
        v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="优惠劵名称"   align="center">
          <template slot-scope="scope"><div class="table-item">{{scope.row.couponName}}</div></template>
        </el-table-column>
        <el-table-column label="优惠券类型" align="center">
          <template slot-scope="scope"><div class="table-item">{{scope.row.couponType| formatType}}</div></template>
        </el-table-column>
        <el-table-column label="使用门槛"  align="center">
          <template slot-scope="scope"><div class="table-item">{{scope.row.limitName}}</div></template>
        </el-table-column>
        <el-table-column label="面值"  align="center">
          <template slot-scope="scope"><div class="table-item">{{scope.row.couponAmount}}元</div></template>
        </el-table-column>
        <el-table-column label="领取限制"  align="center">
          <template slot-scope="scope"><div class="table-item">每人限{{scope.row.perLimit}}张</div></template>
        </el-table-column>
        <el-table-column label="有效期"  align="center" width="200">
          <template slot-scope="scope"><div class="table-item">{{scope.row.beginTime|formatDate}}至{{scope.row.expireTime|formatDate}}</div></template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope"><div class="table-item">{{scope.row.status | formatStatus}}</div></template>
        </el-table-column>
        <el-table-column label="操作"  align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleView(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑</el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.currentPage"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import {fetchList,deleteCoupon} from '@/api/coupon';
  import {formatDate} from '@/utils/date';
  const defaultListQuery = {
    currentPage: 1,
    pageSize: 10,
    couponName: null,
    couponType: null,
    status:null
  };
  const defaultTypeOptions=[
    {
      label: '店铺通用',
      value: 0
    },
    {
      label: '指定分类',
      value: 1
    },
    {
      label: '指定商品',
      value: 2
    }
  ];
  const defaultStatusOptions=[
    {
      label: '未过期',
      value: 0
    },
    {
      label: '已过期',
      value: 1
    }
  ];
  export default {
    name:'couponList',
    data() {
      return {
        listQuery:Object.assign({},defaultListQuery),
        typeOptions:Object.assign({},defaultTypeOptions),
        statusOptions:Object.assign({},defaultStatusOptions),
        list:null,
        total:null,
        listLoading:false,
        multipleSelection:[]
      }
    },
    created(){
      this.getList();
    },
    filters:{
      formatType(type){
        if(type===0){
          return '全场通用';
        }else if(type===1){
          return '指定分类';
        }else{
          return '指定商品';
        }
      },
      formatDate(time){
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd')
      },
      formatStatus(value){
        if(value==0){
          return '未过期'
        }else{
          return '已过期';
        }
      }
    },
    methods:{
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.currentPage = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.currentPage = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.currentPage = val;
        this.getList();
      },
      handleAdd(){
        this.$router.push({path: '/sms/addCoupon'})
      },
      handleView(index, row) {
        this.$router.push({path: '/sms/couponHistory', query: {id: row.id}})
      },
      handleUpdate(index, row) {
        this.$router.push({path: '/sms/updateCoupon', query: {id: row.id}})
      },
      handleDelete(index, row) {
        this.$confirm('是否进行删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCoupon(row.id).then(response=>{
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        })
      },
      getList(){
        this.listLoading=true;
        this.list=[];
        fetchList(this.listQuery).then(response=>{
          this.listLoading = false;
          this.list = response.data.items;
          console.log(response.data)
          this.total = response.data.totalNum;
        }).catch((res)=>{
          this.listLoading = false;
        });
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


