<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>

      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="选择店铺">
            <el-select filterable placeholder="按店铺查询" v-model="listQuery.shopId" style="width: 100%" @change="shopSelect" clearable @clear="clearState()">
              <el-option
                v-for="item in shopList"
                :key="item.id"
                :label="item.shopName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告名称">
            <el-input v-model="listQuery.title" class="input-width" placeholder="广告名称"></el-input>
          </el-form-item>
          <el-form-item label="广告位置">
            <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in typeOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="广告状态">
            <el-select v-model="listQuery.state" placeholder="全部" clearable class="input-width">
              <el-option v-for="item in stateOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker
              class="input-width"
              v-model="listQuery.startDate"
              value-format="yyyy-MM-dd"
              type="date"
              :pickerOptions="pickerOptions0"
              placeholder="请选择时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="到期时间">
            <el-date-picker
              class="input-width"
              v-model="listQuery.expireDate"
              value-format="yyyy-MM-dd"
              type="date"
              :pickerOptions="pickerOptions1"
              placeholder="请选择时间">
            </el-date-picker>
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
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加广告</el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="homeAdvertiseTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="广告名称" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="广告位置" width="120" align="center">
          <template slot-scope="scope">{{scope.row.type | formatType}}</template>
        </el-table-column>
        <el-table-column label="广告图片" width="180" align="center">
          <template slot-scope="scope">
            <el-image
              style="width: 160px; height: 120px"
              :src="imgUri+scope.row.imgPath"
              fit="fit"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" width="220" align="center">
          <template slot-scope="scope">
              {{scope.row.startDate | formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="到期时间" width="220" align="center">
          <template slot-scope="scope">{{scope.row.expireDate | formatTime}}</template>
        </el-table-column>
        <el-table-column label="广告状态" width="120" align="center">
          <template slot-scope="scope">{{scope.row.state | formatState}}</template>
        </el-table-column>
        <el-table-column label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="batch-operate-container">
      <el-select
        size="small"
        v-model="operateType" placeholder="批量操作">
        <el-option
          v-for="item in operates"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button
        style="margin-left: 20px"
        class="search-button"
        @click="handleBatchOperate()"
        type="primary"
        size="small">
        确定
      </el-button>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total,sizes,prev,pager,next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.currentPage"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import img from '@/components/common'
  import {fetchList,updateStatus,deleteHomeAdvertise} from '@/api/homeAdvertise';
  import {formatDate} from '@/utils/date';
  import {findShop} from '@/api/shop';
  const defaultListQuery = {
    currentPage: 1,
    pageSize: 10,
    shopId: null,
    title: null,
    type: null,
    startDate:null,
    expireDate:null,
  };
  const defaultTypeOptions = [
    {
      label: '首页轮播',
      value: "0"
    },
    {
      label: '附近轮播',
      value: "1"
    }
  ];
  const defaultStateOptions = [
    {
      label: '未过期',
      value: "0"
    },
    {
      label: '已过期',
      value: "1"
    }
  ];
  export default {
    name: 'homeAdvertiseList',
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions: Object.assign({}, defaultTypeOptions),
        stateOptions: Object.assign({}, defaultStateOptions),
        shopList:[],
        imgUri:img.imagePath,
        list: null,
        total: null,
        listLoading: false,
        multipleSelection: [],
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.listQuery.expireDate!=null) {
              let expireDate=new Date(this.listQuery.expireDate);
              return  time.getTime() > expireDate.getTime();
            }

          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if(this.listQuery.startDate!=null){
              let startDate=new Date(this.listQuery.startDate);
              return time.getTime() < startDate.getTime();
            }
          }
        },
        operates: [
          {
            label: "删除",
            value: 0
          }
        ],
        operateType: null
      }
    },
    created() {
      findShop().then((res) => {
        this.shopList=res.data;
        this.loading = false;
      }).catch(() => {
        this.loading = false
      })
      this.getList();
    },
    filters:{
      formatType(type){
        if(type==="1"){
          return '附近轮播';
        }else if(type==="0"){
          return '首页轮播';
        }else {
          return '店铺轮播';
        }
      },
      formatState(type){
        if(type==="1"){
          return '已过期';
        }else{
          return '未过期';
        }
      },
      formatTime(time){
        if(time==null||time===''){
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    methods: {
      clearState(){
        this.listQuery.shopId=null;
        this.getList();
      },
      shopSelect(){
        this.getList();
      },
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

      handleDelete(index,row){
        this.deleteHomeAdvertise(row.id);
      },
      handleBatchOperate(){
        if (this.multipleSelection < 1) {
          this.$message({
            message: '请选择一条记录',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        let ids = [];
        for (let i = 0; i < this.multipleSelection.length; i++) {
          ids.push(this.multipleSelection[i].id);
        }
        if(this.operateType===0){
          this.deleteHomeAdvertise(ids);
        }else {
          this.$message({
            message: '请选择批量操作类型',
            type: 'warning',
            duration: 1000
          });
        }
      },
      handleAdd(){
        this.$router.push({path: '/sms/addAdvertise'})
      },
      handleUpdate(index,row){
        this.$router.push({path: '/sms/updateAdvertise', query: {id: row.id}})
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(res => {
          this.listLoading = false;
          if(res.code==0){
            this.list = res.data.items;
            this.total = res.data.totalNum;
          }else {
            this.$message.warning(res.msg)
            this.listLoading = false;
            this.list=[]
            this.total=0;
          }
        })
      },
      deleteHomeAdvertise(ids){
        this.$confirm('是否要删除该广告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteHomeAdvertise(ids).then(res=>{
            if(res.code==0){
              this.getList();
              this.$message({
                type: 'success',
                message: res.msg
              });
            }else{
              this.$message({
                type: 'warning',
                message: res.msg
              });
            }
          });
        })
      }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


