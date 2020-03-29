<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="secKill"
             :rules="rules"
             ref="secKillFrom"
             label-width="150px"
             size="small">
      <el-form-item label="商品名称：" prop="goodsName">
        <el-input v-model="secKill.goodsName" class="input-width" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="商品规格：" >
        <el-input v-model="secKill.normsName" class="input-width" maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="秒杀价格：" prop="spikePrice">
        <el-input v-model="secKill.spikePrice" placeholder="面值只能是数值，限2位小数" class="input-width">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="活动类型：">
        <el-select v-model="secKill.type">
          <el-option
            v-for="type in typeOptions"
            :key="type.value"
            :label="type.label"
            :value="type.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品原价：" prop="spikePrice">
        <el-input v-model="secKill.oldPrice" placeholder="面值只能是数值，限2位小数" class="input-width" readonly>
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item label="秒杀量：" prop="count">
        <el-input v-model.number="secKill.count" placeholder="只能输入正整数" class="input-width"></el-input>
      </el-form-item>
      <el-form-item label="开始时间：" prop="startDate">
        <el-date-picker
          type="datetime"
          default-time="00:00:00"
          placeholder="选择日期"
          :pickerOptions="pickerOptions0"
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="secKill.startDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="到期时间：" prop="expireDate">
        <el-date-picker
          type="datetime"
          placeholder="选择日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="23:59:59"
          :pickerOptions="pickerOptions1"
          v-model="secKill.expireDate"></el-date-picker>
      </el-form-item>
      <el-form-item label="备注：">
        <el-input
          class="input-width"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          maxlength="200" show-word-limit
          v-model="secKill.comments">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('secKillFrom')">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {saveSecKill, getSecKill} from '@/api/secKill'
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
    name: 'secKillDetail',
    props: {
      secKill: {
        type: Object,
      }
    },
    data() {
      return {
        typeOptions:Object.assign({},defaultTypeOptions),
        pickerOptions0: {
          disabledDate: (time) => {
            if (this.secKill.expireDate!=null) {
              let expireDate=new Date(this.secKill.expireDate);
              return time.getTime() <Date.now() || time.getTime() > expireDate.getTime();
            } else {
              return time.getTime() < Date.now();
            }

          }
        },
        pickerOptions1: {
          disabledDate: (time) => {
            if(this.secKill.startDate!=null){
              let startDate=new Date(this.secKill.startDate);
              return time.getTime() < startDate.getTime();
            }else{
              return time.getTime() < Date.now();
            }
          }
        },
        rules: {
          goodsName: [
            {required: true, message: '商品名称不能为空', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 50 个字符', trigger: 'blur'}
          ],
          startDate: [
            {required: true, message: '请选择开始时间', trigger: 'blur'}
          ],
          expireDate: [
            {required: true, message: '请选择到期时间', trigger: 'blur'}
          ],
          count: [
            {type: 'number',required: true, message: '只能输入正整数', trigger: 'blur'}
          ],
          spikePrice: [
            {required: true,message: '价格0.01-100000，限2位小数',trigger: 'blur'}
          ],
        },
      }
    },
    created(){
      console.log(this.secKill)
    },
    methods: {
      onSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {

              saveSecKill(this.secKill).then(res => {
                if(res.code==0){
                  this.$message({
                    message: res.msg,
                    type: 'success',
                    duration:1000
                  });
                  this.$refs[formName].resetFields();
                  this.$emit('closeDrawer')
                }else {
                  this.$message({
                    message: res.msg,
                    type: 'warning',
                    duration:1000
                  });
                }

              });

            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
    }
  }
</script>
<style scoped>
  .input-width {
    width: 70%;
  }
</style>


