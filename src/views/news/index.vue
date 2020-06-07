<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="标题：">
            <el-input v-model="listQuery.title" placeholder="请输入新闻标题"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" style="margin-top: 5px"></i>
      <span style="margin-top: 5px">数据列表</span>
      <el-button
        class="btn-add"
        @click="handleAddNews()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="编号" width="60" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="新闻名称" align="center">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="新闻摘要" align="center">
          <template slot-scope="scope">{{scope.row.abstractText }}</template>
        </el-table-column>
        <el-table-column label="状态"  align="center" width="80">
          <template slot-scope="scope">
            <el-switch
              :active-value="true"
              :inactive-value="false"
              @change="handleUpdateNewsState(scope.row)"
              v-model="scope.row.state">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleUpdate( scope.row.id)">编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.id)">删除
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
  import {getNewsList,updateNewsState,deleteNewsId} from '@/api/newsData'
    export default {
        name: "index",
        data(){
          return{
            list: [],
            shopList:[],
            listLoading: false,
            total:0,
            listQuery: {
              title:"",
              currentPage: 1,
              pageSize: 10
            },
          }
        },
      created() {
        this.getList();
      },
      methods:{
        handleAddNews(){
          this.$router.push({path: '/news/add'})
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
        handleUpdateNewsState(data){
          updateNewsState(!data.state,data.id).then(res=>{
            if(res.code==0){
              this.$message.success("更新成功")
            }else{
              this.$message.warning(res.message)
            }

          })
        },
        handleUpdate(val){
          this.$router.push({
            path:"/news/update",
            query:{
              id:val
            }
          })
        },
        handleDelete(val){
          deleteNewsId(val).then(res=>{
            if(res.code==0){
              this.$message.success("删除成功")
              this.getList()
            }

          })
        },
        getList(){
          getNewsList(this.listQuery).then(res=>{
            console.log(res)
            if(res.code==0){
              this.list=res.data.items;
              this.total=res.data.totalNum;
            }
          })
        }
      }
    }
</script>

<style scoped lang="scss">

</style>
