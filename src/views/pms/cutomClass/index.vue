<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="选择店铺：">
            <el-select filterable placeholder="按店铺查询" v-model="listQuery.shopId" style="width: 100%" @change="shopSelect" clearable @clear="clearState()">
              <el-option
                v-for="item in shopList"
                :key="item.id"
                :label="item.shopName"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddProductCate()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="分类名称" align="center">
          <template slot-scope="scope">{{scope.row.className}}</template>
        </el-table-column>
        <el-table-column label="商品数量" align="center">
          <template slot-scope="scope">{{scope.row.goodsAmount }}</template>
        </el-table-column>
        <el-table-column label="数量单位"  align="center">
          <template slot-scope="scope">{{scope.row.goodsUnit }}</template>
        </el-table-column>
        <el-table-column label="导航栏显示"  align="center">
          <template slot-scope="scope">
            <el-switch
              @change="handleNavStatusChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.navState">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="排序" align="center">
          <template slot-scope="scope">{{scope.row.classSort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
              size="mini"
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
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.currentPage"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {queryCustomClass,
          deleteCustomClass,
          saveCustomClass} from '@/api/classify'
  import {findShop} from '@/api/shop';
  import { Message, MessageBox } from 'element-ui'
  export default {
    name: "customClass",
    data() {
      return {
        list: null,
        shopList:[],
        listLoading: false,
        total:0,
        listQuery: {
          shopId:null,
          currentPage: 1,
          pageSize: 10
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

    methods: {
      clearState(){
        this.listQuery.shopId=null;
        //this.getList();
      },
      shopSelect(){
        this.getList();
      },
      resetParentId(){
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
        } else {
          this.parentId = 0;
        }
      },
      getList(){
        queryCustomClass(this.listQuery).then(res=>{
          if(res.code!=0){
            Message.warning(res.code)
          }
          this.list=res.data.items;
          this.total=res.data.totalNum;
        })
      },
      handleAddProductCate() {
        this.$router.push('/pms/addCustomClass');
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
      handleNavStatusChange(index, row) {
        saveCustomClass(row).then(res=>{
          this.getList();
        })
      },
      handleTransferProduct(index, row) {
        console.log('handleAddProductCate');
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateCustomClass',query:{id:row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCustomClass(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      }
    },

  }
</script>

<style scoped>

</style>
