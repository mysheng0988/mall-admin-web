<template>
  <div style="margin-top: 50px">
    <el-form :model="goodsSales" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="选择优惠方式：">
        <el-radio-group v-model="promotionType" size="small">
            <el-radio-button :label="0">无优惠</el-radio-button>
            <el-radio-button :label="1">特惠促销</el-radio-button>
            <el-radio-button :label="2">会员价格</el-radio-button>
            <el-radio-button :label="3">阶梯价格</el-radio-button>
            <el-radio-button :label="4">满减价格</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="会员价格：">
        <el-input v-model="goodsSales.vipPrice"></el-input>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <!--<el-form-item label="规格参数：">-->
        <!--<el-tabs v-model="activeHtmlName" type="card">-->
          <!--<el-tab-pane label="电脑端详情" name="pc">-->
            <!--<tinymce :width="595" :height="300" v-model="value.detailHtml"></tinymce>-->
          <!--</el-tab-pane>-->
          <!--<el-tab-pane label="移动端详情" name="mobile">-->
            <!--<tinymce :width="595" :height="300" v-model="value.detailMobileHtml"></tinymce>-->
          <!--</el-tab-pane>-->
        <!--</el-tabs>-->
      <!--</el-form-item>-->
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，选择商品关联</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {fetchList as fetchProductAttrCateList} from '@/api/productAttrCate'
  import {fetchList as fetchProductAttrList} from '@/api/productAttr'
  import SingleUpload from '@/components/Upload/singleUpload'
  import MultiUpload from '@/components/Upload/multiUpload'
  import Tinymce from '@/components/Tinymce'
  let defaultGoodsSales={
    vipPrice:null,
  }
  export default {
    name: "ProductAttrDetail",
    components: {SingleUpload, MultiUpload, Tinymce},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        goodsSales: Object.assign({}, defaultGoodsSales),
        //商品属性分类下拉选项
        productAttributeCategoryOptions: [],
        promotionType:0,
        //选中的商品属性
        selectProductAttr: [],
        //选中的商品参数
        selectProductParam: [],
        //选中的商品属性图片
        selectProductPics:[],
        selectProductAttrPics: [],
        //可手动添加的商品属性
        addProductAttrValue: '',
        //商品富文本详情激活类型
        activeHtmlName: 'pc'
      }
    },
    computed: {

    },
    created() {
      //this.getProductAttrCateList();
    },
    watch: {
      // productId:function (newValue) {
      //   if(!this.isEdit)return;
      //   if(this.hasEditCreated)return;
      //   if(newValue===undefined||newValue==null||newValue===0)return;
      //   this.handleEditCreated();
      // }
    },
    methods: {
      handleEditCreated() {
        //根据商品属性分类id获取属性和参数
        if(this.value.productAttributeCategoryId!=null){
          this.handleProductAttrChange(this.value.productAttributeCategoryId);
        }
        this.hasEditCreated=true;
      },
      getProductAttrCateList() {
        // let param = {pageNum: 1, pageSize: 100};
        // fetchProductAttrCateList(param).then(response => {
        //   this.productAttributeCategoryOptions = [];
        //   let list = response.data.list;
        //   for (let i = 0; i < list.length; i++) {
        //     this.productAttributeCategoryOptions.push({label: list[i].name, value: list[i].id});
        //   }
        // });
      },
      getProductAttrList(type, cid) {
        let param = {pageNum: 1, pageSize: 100, type: type};
        // fetchProductAttrList(cid, param).then(response => {
        //   let list = response.data.list;
        //   if (type === 0) {
        //     this.selectProductAttr = [];
        //     for (let i = 0; i < list.length; i++) {
        //       let options = [];
        //       let values = [];
        //       if (this.isEdit) {
        //         if (list[i].handAddStatus === 1) {
        //           //编辑状态下获取手动添加编辑属性
        //           options = this.getEditAttrOptions(list[i].id);
        //         }
        //         //编辑状态下获取选中属性
        //         values = this.getEditAttrValues(i);
        //       }
        //       this.selectProductAttr.push({
        //         id: list[i].id,
        //         name: list[i].name,
        //         handAddStatus: list[i].handAddStatus,
        //         inputList: list[i].inputList,
        //         values: values,
        //         options: options
        //       });
        //     }
        //     if(this.isEdit){
        //       //编辑模式下刷新商品属性图片
        //       this.refreshProductAttrPics();
        //     }
        //   } else {
        //     this.selectProductParam = [];
        //     for (let i = 0; i < list.length; i++) {
        //       let value=null;
        //       if(this.isEdit){
        //         //编辑模式下获取参数属性
        //         value= this.getEditParamValue(list[i].id);
        //       }
        //       this.selectProductParam.push({
        //         id: list[i].id,
        //         name: list[i].name,
        //         value: value,
        //         inputType: list[i].inputType,
        //         inputList: list[i].inputList
        //       });
        //     }
        //   }
        // });
      },
      //获取设置的可手动添加属性值
      getEditAttrOptions(id) {
        let options = [];
        for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
          let attrValue = this.value.productAttributeValueList[i];
          if (attrValue.productAttributeId === id) {
            let strArr = attrValue.value.split(',');
            for (let j = 0; j < strArr.length; j++) {
              options.push(strArr[j]);
            }
            break;
          }
        }
        return options;
      },
      //获取选中的属性值
      getEditAttrValues(index) {
        let values = new Set();
        if (index === 0) {
          for (let i = 0; i < this.value.skuStockList.length; i++) {
            let sku = this.value.skuStockList[i];
            let spData = JSON.parse(sku.spData);
            if (spData!= null && spData.length>=1) {
              values.add(spData[0].value);
            }
          }
        } else if (index === 1) {
          for (let i = 0; i < this.value.skuStockList.length; i++) {
            let sku = this.value.skuStockList[i];
            let spData = JSON.parse(sku.spData);
            if (spData!= null && spData.length>=2) {
              values.add(spData[1].value);
            }
          }
        } else {
          for (let i = 0; i < this.value.skuStockList.length; i++) {
            let sku = this.value.skuStockList[i];
            let spData = JSON.parse(sku.spData);
            if (spData!= null && spData.length>=3) {
              values.add(spData[2].value);
            }
          }
        }
        return Array.from(values);
      },
      //获取属性的值
      getEditParamValue(id){
        for(let i=0;i<this.value.productAttributeValueList.length;i++){
          if(id===this.value.productAttributeValueList[i].productAttributeId){
            return this.value.productAttributeValueList[i].value;
          }
        }
      },
      handleProductAttrChange(value) {
        this.getProductAttrList(0, value);
        this.getProductAttrList(1, value);
      },
      getInputListArr(inputList) {
        return inputList.split(',');
      },
      handleAddProductAttrValue(idx) {
        let options = this.selectProductAttr[idx].options;
        if (this.addProductAttrValue == null || this.addProductAttrValue == '') {
          this.$message({
            message: '属性值不能为空',
            type: 'warning',
            duration: 1000
          });
          return
        }
        if (options.indexOf(this.addProductAttrValue) !== -1) {
          this.$message({
            message: '属性值不能重复',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        this.selectProductAttr[idx].options.push(this.addProductAttrValue);
        this.addProductAttrValue = null;
      },
      handleRemoveProductAttrValue(idx, index) {
        this.selectProductAttr[idx].options.splice(index, 1);
      },
      getProductSkuSp(row, index) {
        let spData = JSON.parse(row.spData);
        if(spData!=null&&index<spData.length){
          return spData[index].value;
        }else{
          return null;
        }
      },
      handleRefreshProductSkuList() {
        this.$confirm('刷新列表将导致sku信息重新生成，是否要刷新', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.refreshProductAttrPics();
          this.refreshProductSkuList();
        });
      },
      handleSyncProductSkuPrice(){
        this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.value.skuStockList!==null&&this.value.skuStockList.length>0){
            let tempSkuList = [];
            tempSkuList = tempSkuList.concat(tempSkuList,this.value.skuStockList);
            let price=this.value.skuStockList[0].price;
            for(let i=0;i<tempSkuList.length;i++){
              tempSkuList[i].price=price;
            }
            this.value.skuStockList=[];
            this.value.skuStockList=this.value.skuStockList.concat(this.value.skuStockList,tempSkuList);
          }
        });
      },
      handleSyncProductSkuStock(){
        this.$confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.value.skuStockList!==null&&this.value.skuStockList.length>0){
            let tempSkuList = [];
            tempSkuList = tempSkuList.concat(tempSkuList,this.value.skuStockList);
            let stock=this.value.skuStockList[0].stock;
            let lowStock=this.value.skuStockList[0].lowStock;
            for(let i=0;i<tempSkuList.length;i++){
              tempSkuList[i].stock=stock;
              tempSkuList[i].lowStock=lowStock;
            }
            this.value.skuStockList=[];
            this.value.skuStockList=this.value.skuStockList.concat(this.value.skuStockList,tempSkuList);
          }
        });
      },
      refreshProductSkuList() {
        this.value.skuStockList = [];
        let skuList = this.value.skuStockList;
        //只有一个属性时
        if (this.selectProductAttr.length === 1) {
          let attr = this.selectProductAttr[0];
          for (let i = 0; i < attr.values.length; i++) {
            skuList.push({
              spData: JSON.stringify([{key:attr.name,value:attr.values[i]}])
            });
          }
        } else if (this.selectProductAttr.length === 2) {
          let attr0 = this.selectProductAttr[0];
          let attr1 = this.selectProductAttr[1];
          for (let i = 0; i < attr0.values.length; i++) {
            if (attr1.values.length === 0) {
              skuList.push({
                spData: JSON.stringify([{key:attr0.name,value:attr0.values[i]}])
              });
              continue;
            }
            for (let j = 0; j < attr1.values.length; j++) {
              let spData = [];
              spData.push({key:attr0.name,value:attr0.values[i]});
              spData.push({key:attr1.name,value:attr1.values[j]});
              skuList.push({
                spData: JSON.stringify(spData)
              });
            }
          }
        } else {
          let attr0 = this.selectProductAttr[0];
          let attr1 = this.selectProductAttr[1];
          let attr2 = this.selectProductAttr[2];
          for (let i = 0; i < attr0.values.length; i++) {
            if (attr1.values.length === 0) {
              skuList.push({
                spData: JSON.stringify([{key:attr0.name,value:attr0.values[i]}])
              });
              continue;
            }
            for (let j = 0; j < attr1.values.length; j++) {
              if (attr2.values.length === 0) {
                let spData = [];
                spData.push({key:attr0.name,value:attr0.values[i]});
                spData.push({key:attr1.name,value:attr1.values[j]});
                skuList.push({
                  spData: JSON.stringify(spData)
                });
                continue;
              }
              for (let k = 0; k < attr2.values.length; k++) {
                let spData = [];
                spData.push({key:attr0.name,value:attr0.values[i]});
                spData.push({key:attr1.name,value:attr1.values[j]});
                spData.push({key:attr2.name,value:attr2.values[k]});
                skuList.push({
                  spData: JSON.stringify(spData)
                });
              }
            }
          }
        }
      },
      refreshProductAttrPics() {
        this.selectProductAttrPics = [];
        if (this.selectProductAttr.length >= 1) {
          let values = this.selectProductAttr[0].values;
          for (let i = 0; i < values.length; i++) {
            let pic=null;
            if(this.isEdit){
              //编辑状态下获取图片
              pic=this.getProductSkuPic(values[i]);
            }
            this.selectProductAttrPics.push({name: values[i], pic: pic})
          }
        }
      },
      //获取商品相关属性的图片
      getProductSkuPic(name){
        for(let i=0;i<this.value.skuStockList.length;i++){
          let spData = JSON.parse(this.value.skuStockList[i].spData);
          if(name===spData[0].value){
            return this.value.skuStockList[i].pic;
          }
        }
        return null;
      },
      //合并商品属性
      mergeProductAttrValue() {
        this.value.productAttributeValueList = [];
        for (let i = 0; i < this.selectProductAttr.length; i++) {
          let attr = this.selectProductAttr[i];
          if (attr.handAddStatus === 1 && attr.options != null && attr.options.length > 0) {
            this.value.productAttributeValueList.push({
              productAttributeId: attr.id,
              value: this.getOptionStr(attr.options)
            });
          }
        }
        for (let i = 0; i < this.selectProductParam.length; i++) {
          let param = this.selectProductParam[i];
          this.value.productAttributeValueList.push({
            productAttributeId: param.id,
            value: param.value
          });
        }
      },
      //合并商品属性图片
      mergeProductAttrPics() {
        for (let i = 0; i < this.selectProductAttrPics.length; i++) {
          for (let j = 0; j < this.value.skuStockList.length; j++) {
            let spData = JSON.parse(this.value.skuStockList[j].spData);
            if (spData[0].value === this.selectProductAttrPics[i].name) {
              this.value.skuStockList[j].pic = this.selectProductAttrPics[i].pic;
            }
          }
        }
      },
      getOptionStr(arr) {
        let str = '';
        for (let i = 0; i < arr.length; i++) {
          str += arr[i];
          if (i != arr.length - 1) {
            str += ',';
          }
        }
        return str;
      },
      handleRemoveProductSku(index, row) {
        let list = this.value.skuStockList;
        if (list.length === 1) {
          list.pop();
        } else {
          list.splice(index, 1);
        }
      },
      getParamInputList(inputList) {
        return inputList.split(',');
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
        // this.mergeProductAttrValue();
        // this.mergeProductAttrPics();
        this.$emit('nextStep')
      }
    }
  }
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }
</style>
