<template>
  <div style="margin-top: 50px">
    <el-form  ref="productSaleForm" label-width="120px" style="width: 860px" size="small">
      <el-form-item label="商品规格：">
        <el-checkbox-group
          v-model="goodsNormsType"
          @change="checkChange"
          :min="1"
          :max="2"
          :disabled="isEdit&&goodsNormsList.length>0">
          <el-checkbox label="颜色">颜色</el-checkbox>
          <el-checkbox label="尺寸">尺寸</el-checkbox>
          <el-checkbox label="容量">容量</el-checkbox>
          <el-checkbox label="版本">版本</el-checkbox>
          <el-checkbox label="类别">类别</el-checkbox>
          <el-checkbox label="规格">规格</el-checkbox>
        </el-checkbox-group>
        <el-button class="littleMarginLeft" @click="handleAddAttrValue()">增加</el-button>
      </el-form-item>
        <el-table style="width: 100%;margin-bottom: 20px"
                  :data="goodsNormsList"
                  border>
          <el-table-column
            :label="goodsNormsType[0]"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.normsValue1"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            v-if="goodsNormsType.length===2"
            :label="goodsNormsType[1]"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.normsValue2"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格"
            width="100"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="商品原价"
            width="100"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.originalPrice"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="商品库存"
            width="100"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goodsStock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="库存预警值"
            width="100"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stockWarning"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品信息</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，填写商品属性</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {getGoodsNorms} from '@/api/goods'
  import {deleteGoodsNorms} from '@/api/product'
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
  export default {
    name: "ProductSaleDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      goodsId: {
        type: String,
        default: ""
      },
    },
    data() {
      return {
        goodsNormsType:["颜色","尺寸"],
        goodsNormsList:[],
      }
    },
    created() {
      if(this.isEdit){
        getGoodsNorms(this.goodsId).then(res=>{
          if(res.data.length>0){
            let type=res.data[0].normsName1;
            let type2=res.data[0].normsName2;
            if(type!=null||type!=""||type!=undefined){
              this.goodsNormsType[0]=type;
            }
            if(type2!=null||type2!=""||type!=undefined){
              this.goodsNormsType[1]=type2;
            }
            this.goodsNormsList=res.data;
          }

        })
        //this.goodsNormsList=this.goodsNorms;
      }

    },

    methods: {
      checkChange(value){
        this.goodsNormsList=[];
      },
      handleAddAttrValue(){
        let goodsDefaultList= Object.assign({}, defaultGoodsNorms);
        goodsDefaultList.normsName1=this.goodsNormsType[0];
        if(this.goodsNormsType.length==2){
          goodsDefaultList.normsName2=this.goodsNormsType[1];
        }
        this.goodsNormsList.push(goodsDefaultList)
      },
      handleRemoveProductSku(index, row) {
        let list = this.goodsNormsList;
        if(row.id!=null){
          deleteGoodsNorms(row.id).then(res=>{
            if(res.code==0){
              if (list.length === 1) {
                list.pop();
              } else {
                list.splice(index, 1);
              }
            }
          })
        }else{
          if (list.length === 1) {
            list.pop();
          } else {
            list.splice(index, 1);
          }
        }
      },

      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        this.$emit('nextStep',this.goodsNormsList);
      }
    }
  }
</script>

<style scoped>
  .delete{
    width: 18px;
    height: 18px;
    margin: 0 10px;
  }
  .littleMargin {
    margin-top: 10px;
  }
  .cardBg {
    margin: 18px 0;
    padding: 10px;
    background: #F8F9FC;
  }
</style>
