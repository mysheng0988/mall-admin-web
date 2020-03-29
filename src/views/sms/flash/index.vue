<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-row :gutter="10">
            <el-col :xs="12" :sm="12" :md="8">
              <el-form-item label="商品名称">
                <el-input v-model="listQuery.goodsName" class="input-width" placeholder="活动名称" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" >
              <el-form-item label="选择店铺">
                <el-select filterable placeholder="按店铺查询" v-model="listQuery.shopId" style="width: 100%"  clearable @clear="clearState()">
                  <el-option
                    v-for="item in shopList"
                    :key="item.id"
                    :label="item.shopName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8" >
              <el-form-item label="活动类型">
                <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
                  <el-option v-for="item in typeOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="12" :sm="12" :md="8">
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
            </el-col>
            <el-col :xs="12" :sm="12" :md="8">
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
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div style="text-align: right">
        <el-button
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <!--<el-button size="mini" class="btn-add" @click="handleAdd()" style="margin-left: 20px">添加活动</el-button>-->
      <!--<el-button size="mini" class="btn-add" @click="handleShowSessionList()">秒杀时间段列表</el-button>-->
    </el-card>
    <div class="table-container">
      <el-table ref="flashTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">{{scope.row.goodsName}}</template>
        </el-table-column>
        <el-table-column label="商品规格" align="center">
          <template slot-scope="scope">{{scope.row.normsName}}</template>
        </el-table-column>
        <el-table-column label="秒杀状态" width="140" align="center">
          <template slot-scope="scope">{{scope.row |formatActiveStatus}}</template>
        </el-table-column>
        <el-table-column label="活动类型" width="140" align="center">
          <template slot-scope="scope">{{scope.row.type|formatType}}</template>
        </el-table-column>
        <el-table-column label="秒杀数量"  align="center">
          <template slot-scope="scope">{{scope.row.count}}</template>
        </el-table-column>
        <el-table-column label="开始时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.startDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.expireDate | formatDate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="success"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button size="mini"
                       type="danger"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
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
    <el-drawer
      title="秒杀商品设置"
      :visible.sync="drawer"
      direction="rtl"
      size="800px"
      :before-close="handleClose">
      <SecKill @closeDrawer="handleCloseDrawer" :sec-kill="secKill"></SecKill>
    </el-drawer>
  </div>
</template>
<script>
  import SecKill from '@/components/SecKill/index'
  import {fetchList, deleteSecKill, saveSecKill,getSecKill} from '@/api/secKill';
  import {formatDate} from '@/utils/date';
  import {findShop} from '@/api/shop';
  const defaultListQuery = {
    currentPage: 1,
    pageSize: 5,
    shopId:null,
    type:null,
    startDate:null,
    expireDate:null,
    goodsName: null
  };
  const defaultTypeOptions = [
    {
      label: '线上',
      value: "0"
    },
    {
      label: '线下',
      value: "1"
    }
  ];
  export default {
    name: 'flashPromotionList',
    components: { SecKill },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        typeOptions:Object.assign({}, defaultTypeOptions),
        shopList:[],
        secKill:null,
        list: null,
        total: null,
        drawer: false,
        listLoading: false,
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
    filters: {
      formatActiveStatus(row) {
        let nowTime = new Date().getTime();
        if (nowTime >= new Date(row.startDate).getTime()&& nowTime <= new Date(row.expireDate).getTime()) {
          return '活动进行中';
        } else if (nowTime > new Date(row.expireDate).getTime()) {
          return '活动已结束';
        } else {
          return '活动未开始';
        }
      },
      formatType(value) {
        if (value=="1") {
          return '线下';
        }  else {
          return '线上';
        }
      },
      formatDate(time) {
        if (time == null || time === '') {
          return 'N/A';
        }
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      }
    },
    methods: {
      clearState(){
        this.listQuery.shopId=null;
      },
      handleClose(done) {
          done();
      },
      handleCloseDrawer(){
        this.drawer=false;
        this.getList();
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.currentPage = 1;
        this.getList();
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
      handleAdd() {

      },
      handleShowSessionList() {
        this.$router.push({path: '/sms/flashSession'})
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该活动?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSecKill(row.id).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getList();
          });
        });
      },
      handleUpdate(index, row) {
        getSecKill(row.id).then(res=>{
          if(res.code==0){
            this.secKill=res.data;
            this.drawer=true;
          }else{
            this.$message.warning(res.msg)
          }
        })
      },
      getList() {
        this.listLoading = true;
        fetchList(this.listQuery).then(res => {
          this.listLoading = false;
          if(res.code==0){
            this.list = res.data.items;
            this.total = res.data.totalNum;
          }else{
            this.list=[];
            this.total=0;
            this.$message.warning(res.msg)
          }


        }).catch(() => {
        this.listLoading = false
      })
      }
    }
  }
</script>
<style scoped>



</style>


