<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input style="width: 203px" v-model="listQuery.goodsName" placeholder="商品名称汉字或首字符"></el-input>
          </el-form-item>
          <el-form-item label="商品编号：">
            <el-input style="width: 203px" v-model="listQuery.goodsCode" placeholder="商品编号"></el-input>
          </el-form-item>
          <el-form-item label="商品分类：">
            <el-cascader style="width: 203px"
              clearable
              v-model="selectProductCateValue"
              :options="productCateOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="商品品牌：">
            <el-input style="width: 203px" v-model="listQuery.goodsBrand" placeholder="商品品牌"></el-input>
          </el-form-item>
          <el-form-item label="上架状态：">
            <el-select style="width: 203px" v-model="listQuery.goodsState" placeholder="全部" clearable @clear="clearState(0)">
              <el-option
                v-for="item in publishStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="审核状态：">
            <el-select  style="width: 203px" v-model="listQuery.examineState" @clear="clearState(1)" placeholder="全部" clearable>
              <el-option
                v-for="item in verifyStatusOptions"
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
      <el-button
        class="btn-add"
        @click="handleAddProduct()"
        size="mini">
        添加
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="productTable"
                :data="list"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                @expand-change="handleToggleRow"
                v-loading="listLoading"
                border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column type="expand"
                         label="SUK库存"
                         width="100">
          <template slot-scope="scope">
            <el-table style="width: 100%"
                      v-if="scope.row.goodsNorms.length>0"
                      :data="scope.row.goodsNorms"
                      border>
              <el-table-column v-if='scope.row.goodsNorms[0].normsName1' :label="scope.row.goodsNorms[0].normsName1"
                align="center">
                <template slot-scope="props">
                  <el-input v-model="props.row.normsValue1"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                v-if="scope.row.goodsNorms[0].normsName2"
                :label="scope.row.goodsNorms[0].normsName2"
                align="center">
                <template slot-scope="props">
                  <el-input v-model="props.row.normsValue2"></el-input>
                </template>
              </el-table-column>

              <el-table-column
                label="价格"
                width="120"
                align="center">
                <template slot-scope="props">
                  <el-input v-model="props.row.goodsPrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="原价"
                width="120"
                align="center">
                <template slot-scope="props">
                  <el-input v-model="props.row.originalPrice"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="商品库存"
                width="120"
                align="center">
                <template slot-scope="props">
                  <el-input v-model="props.row.goodsStock"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="库存预警值"
                width="100"
                align="center">
                <template slot-scope="props">
                  <el-input v-model="props.row.stockWarning"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="300"
                align="center">
                <template slot-scope="props">
                    <el-button
                      type="success"
                      size="mini"
                      @click="addNorms( props.row)">增加
                    </el-button>
                    <el-button
                      type="primary"
                      size="mini"
                      @click="saveNorms(props.$index, props.row)">保存
                    </el-button>

                    <el-button
                      type="warning"
                      size="mini"
                      @click="addSecKill(props.$index, props.row,scope.row.goodsMsg)">秒杀
                    </el-button>
                    <el-button
                      type="danger"
                      size="mini"
                      @click="deleteNorms(props.$index, props.row,scope.row.goodsNorms)">删除
                    </el-button>
                </template>
              </el-table-column>
            </el-table>
           </template>
        </el-table-column>
        <el-table-column label="商品编号" width="120" align="center">
          <template slot-scope="scope">{{scope.row.goodsMsg.goodsCode}}</template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.goodsMsg.goodsName}}</p>
            <p>类型：{{scope.row.goodsMsg.classifyCode}}</p>
          </template>
        </el-table-column>
        <el-table-column label="图片" width="150" align="center">
          <template slot-scope="scope">
            <viewer :images="scope.row.goodsImg" title="商品图片">
              <div class="img-container">
                <img  class="img" width="120" height="120"  v-for="(src,index) in scope.row.goodsImg"
                     :key="index"
                     :src="imgUri+scope.row.goodsImg[index].goodsImage"/>
              </div>

            </viewer>
          </template>
        </el-table-column>
        <el-table-column label="价格/原价" width="130" align="center" >
          <template slot-scope="scope" v-if="scope.row.goodsNorms.length>0">
            <p>价格：￥{{scope.row.goodsNorms[0].goodsPrice}}</p>
            <p>原价：￥{{scope.row.goodsNorms[0].originalPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="标签" width="140" align="center">
          <template slot-scope="scope">
            <p>上架：
              <el-switch
                @change="handlePublishStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.goodsMsg.goodsState">
              </el-switch>
            </p>
            <p>新品：
              <el-switch
                @change="handleNewStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.goodsMsg.goodsNews">
              </el-switch>
            </p>
            <p>推荐：
              <el-switch
                @change="handleRecommendStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.goodsMsg.goodsRecommend">
              </el-switch>
            </p>
            <p>预告：
              <el-switch
                @change="handleNoticeStatusChange(scope.$index, scope.row)"
                :active-value="1"
                :inactive-value="0"
                v-model="scope.row.goodsMsg.goodsNotice">
              </el-switch>
            </p>
          </template>
        </el-table-column>
        <!--<el-table-column label="SKU库存" width="100" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="销量" width="100" align="center">
          <template slot-scope="scope">{{scope.row.goodsMsg.salesVolume}}</template>
        </el-table-column>
        <el-table-column label="审核状态" width="100" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.goodsMsg.examineState | verifyStatusFilter}}</p>
            <p>
              <el-button
                type="text"
                @click="handleShowVerifyDetail(scope.$index, scope.row)">审核详情
              </el-button>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <p>
              <el-button
                size="mini"
                @click="handleShowProduct(scope.$index, scope.row)">查看
              </el-button>
              <el-button
                size="mini"
                @click="handleUpdateProduct(scope.$index, scope.row)">编辑
              </el-button>
            </p>
            <p>
              <el-button
                size="mini"
                @click="handleShowLog(scope.$index, scope.row)">日志
              </el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
              </el-button>
            </p>
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
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.currentPage"
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
  let defaultGoodsNorms={
    id:null,
    goodsId:null,
    normsName1:'',
    normsValue1:'',
    normsName2:'',
    normsValue2: '',
    originalPrice:0,
    goodsPrice:0,
    goodsStock:99,
    goodsVolume:0,
    stockWarning:9,
    createDate:null,
    updateDate:null,
    comments:'',
  }
  import SecKill from '@/components/SecKill/index'
  import { Message, MessageBox } from 'element-ui'
  import img from '@/components/common'
  import {
    fetchList,
    updateGoodsNorms,
    deleteGoodsNorms,
    saveGoodsNorms,
    updateGoodsStatus,
    updateNewsState,
    deleteGoodsMsg,
    updateRecommendStatus,
    updateNoticeStatus,
  } from '@/api/product'
  import {fetchList as fetchBrandList} from '@/api/brand'
  const defaultListQuery = {
    goodsName:null,
    goodsBrand: null,
    goodsCode: null,
    goodsState: null,
    examineState: null,
    classifyCode:null,
    currentPage: 1,
    pageSize: 10,
  };
  const defaultSecKill = {
    id:null,
    shopId:null,
    sellerId: null,
    goodsId: null,
    goodsName: null,
    normsId: null,
    normsName:null,
    type:null,
    count:0,
    spikePrice: 0,
    oldPrice: 0,
    startDate:null,
    expireDate:null,
    comments:null
  };
  export default {
    name: "productList",
    components: { SecKill },
    data() {
      return {
        imgUri:img.imagePath,
        normsName1:"",
        normsName2:"",
        drawer:false,
        editSkuInfo:[],
        operates: [
          {
            label: "商品上架",
            value: "publishOn"
          },
          {
            label: "商品下架",
            value: "publishOff"
          },
          {
            label: "设为推荐",
            value: "recommendOn"
          },
          {
            label: "取消推荐",
            value: "recommendOff"
          },
          {
            label: "设为新品",
            value: "newOn"
          },
          {
            label: "取消新品",
            value: "newOff"
          },
          {
            label: "转移到分类",
            value: "transferCategory"
          },
          {
            label: "移入回收站",
            value: "recycle"
          }
        ],
        operateType: null,
        listQuery: Object.assign({}, defaultListQuery),
        secKill: Object.assign({}, defaultSecKill),
        list: null,
        total: null,
        listLoading: true,
        selectProductCateValue: null,
        multipleSelection: [],
        productCateOptions: [],
        brandOptions: [],
        publishStatusOptions: [{
          value: 1,
          label: '上架'
        }, {
          value: 0,
          label: '下架'
        }],
        verifyStatusOptions: [{
          value: 1,
          label: '审核通过'
        }, {
          value: 0,
          label: '未审核'
        }, {
          value: -1,
          label: '审核未通过'
        }]
      }
    },
    created() {
      this.getList();
    },
    watch: {
      selectProductCateValue: function (newValue) {
        if (newValue != null && newValue.length == 2) {
          this.listQuery.goodsBrand = newValue[1];
        } else {
          this.listQuery.goodsBrand = null;
        }

      }
    },
    filters: {
      verifyStatusFilter(value) {
        if (value === 1) {
          return '审核通过';
        } else {
          return '未审核';
        }
      }
    },
    methods: {
      handleClose(done) {
        done();
      },
      handleCloseDrawer(){
        this.drawer=false;
      },
      clearState(value){
        if(value==0){
          this.listQuery.goodsState=null;
        }else{
          this.listQuery.examineState=null;
        }
      },
      addSecKill(index,row,data){
        this.secKill.shopId=data.shopId;
        this.secKill.goodsId=data.id;
        this.secKill.goodsName=data.goodsName;
        this.secKill.normsId=row.id;
        this.secKill.normsName=row.normsValue1+" "+row.normsValue2;
        this.secKill.oldPrice=row.goodsPrice;
        this.drawer=true;
      },
      handleToggleRow(row,expanded){
        this.editSkuInfo=row.goodsNorms;
      },
      deleteNorms(index,row,data){
        let list =data;
        if(list.length==1){
          Message.warning("只有一条数据不允许删除!")
          return;
        }
        if(row.id!=null){
          deleteGoodsNorms(row.id).then(res=>{
            if(res.code==0){
              if (list.length === 1) {
                list.pop();
              } else {
                list.splice(index, 1);
              }
            }else{
              Message.warning(res.msg)
            }
          })
        }

      },
      saveNorms(index,row){
        saveGoodsNorms(row).then(res=>{
          if(res.code==0){
            Message.success(res.msg)
          }else {
            Message.warning(res.msg)
          }
        })
      },
      addNorms(row){
        let newNorms=Object.assign({}, defaultGoodsNorms);
          newNorms.goodsId=row.goodsId;
          newNorms.normsName1=row.normsName1,
          newNorms.normsName2=row.normsName2,
        this.editSkuInfo.push(newNorms)
      },
      getProductSkuSp(row, index) {
        let spData = JSON.parse(row.spData);
        if(spData!=null&&index<spData.length){
          return spData[index].value;
        }else{
          return null;
        }
      },
      getList() {
        this.listLoading = false;
        fetchList(this.listQuery).then(res => {
          if(res.code!=0){
            Message.warning(res.msg)
          }
          this.listLoading = false;
          this.list = res.data.items;

          this.total = res.data.totalNum;
        });
      },
      getBrandList() {
        fetchBrandList({pageNum: 1, pageSize: 100}).then(response => {
          this.brandOptions = [];
          let brandList = response.data.list;
          for (let i = 0; i < brandList.length; i++) {
            this.brandOptions.push({label: brandList[i].name, value: brandList[i].id});
          }
        });
      },
      handleShowSkuEditDialog(index,row){
        this.editSkuInfo.dialogVisible=true;
        this.editSkuInfo.stockList=row.goodsNorms;
        this.normsName1=row.goodsNorms[0].normsName1;
        this.normsName2=row.goodsNorms[0].normsName2;
      },
      handleEditSkuConfirm(){
        if(this.editSkuInfo.stockList==null||this.editSkuInfo.stockList.length<=0){
          this.$message({
            message: '暂无sku信息',
            type: 'warning',
            duration: 1000
          });
          return
        }
        this.$confirm('是否要进行修改', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(()=>{
          updateGoodsNorms({"normsList":this.editSkuInfo.stockList}).then(res=>{
            console.log(res)
            this.$message({
              message: '修改成功',
              type: 'success',
              duration: 1000
            });
            this.editSkuInfo.dialogVisible=false;
          });
        });
      },
      handleSearchList() {
        this.listQuery.currentPage = 1;
        this.getList();
      },
      handleAddProduct() {
        this.$router.push({path:'/pms/addProduct'});
      },
      handleDelete(index,row){

        this.$confirm('是否删除该商品?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteGoodsMsg(row.goodsMsg.id).then(res=>{
            if(res.code==0){
              this.$message.success(res.msg)
              this.getList();
            }else {
              this.$message.warning(res.msg)
            }
          })
        })
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handlePublishStatusChange(index, row) {
        updateGoodsStatus({"goodsId":row.goodsMsg.id,"goodsState":row.goodsMsg.goodsState}).then(res=>{
          if(res.code==0){
              Message.success(res.msg)
            this.getList();
          }
        })
      },
      handleNoticeStatusChange(index,row){
        updateNoticeStatus({"goodsId":row.goodsMsg.id,"goodsNotice":row.goodsMsg.goodsNotice})
          .then(res=>{
            if(res.code==0){
              Message.success(res.msg)
              this.getList();
            }
          })
      },
      handleNewStatusChange(index, row) {
        updateNewsState({"goodsId":row.goodsMsg.id,"goodsNews":row.goodsMsg.goodsNews}).then(res=>{
          if(res.code==0){
            Message.success(res.msg)
            this.getList();
          }
        })
      },
      handleRecommendStatusChange(index, row) {
        updateRecommendStatus({"goodsId":row.goodsMsg.id,"goodsRecommend":row.goodsMsg.goodsRecommend})
          .then(res=>{
            if(res.code==0){
              Message.success(res.msg)
              this.getList();
            }
          })

      },
      handleResetSearch() {
        this.selectProductCateValue = [];
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleUpdateProduct(index,row){
        this.$router.push({path:'/pms/updateProduct',query:{id:row.goodsMsg.id}});
      },
      handleShowProduct(index,row){
        console.log("handleShowProduct",row);
      },
      handleShowVerifyDetail(index,row){
        console.log("handleShowVerifyDetail",row);
      },
      handleShowLog(index,row){
        console.log("handleShowLog",row);
      },
      updateRecommendStatus(recommendStatus, ids) {
        let params = new URLSearchParams();
        params.append('ids', ids);
        params.append('recommendStatus', recommendStatus);
        updateRecommendStatus(params).then(response => {
          this.$message({
            message: '修改成功',
            type: 'success',
            duration: 1000
          });
        });
      },
    }
  }
</script>
<style scoped>
  .img-container{
    position: relative;
    width: 120px;
    height: 120px;
  }
  .img-container .img{
    position: absolute;
    left: 0;
    top: 0;
  }
  .button{
    width: 80px;
    margin:0 30px;
  }
  .el-button{
    margin: 5px;
  }
</style>


