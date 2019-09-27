<template>
  <div class="login">
    <div class="login-in">
      <el-card class="login-card">
        <el-form ref="form" :model="form" :rules="rules">
          <el-form-item prop="userName">
            <el-input
              v-model="form.userName"
              placeholder="用户名">
              <i slot="prefix" class="el-icon-user-solid"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              placeholder="密码"
              show-password>
              <i slot="prefix" class="el-icon-user-solid"></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-form-button" type="primary" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>


  </div>
</template>
<script type="text/ecmascript-6">

  export default {
    data() {
      const checkUserName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('用户名不能为空'));
        } else {
          callback();
        }
      };
      const checkPassword = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('密码不能为空'));
        } else {
          callback();
        }
      };
      return {
        form: {
          userName: '',
          password: ''
        },
        rules: {
          userName: [
            {validator: checkUserName, trigger: 'blur'}
          ],
          password: [
            {validator: checkPassword, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleLogin() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            this.$store.dispatch('login', {
              data: {
                userName: this.form.userName,
                // password: enc(this.form.password)
                password: this.form.password
              },
              success: (response) => {
                this.$router.replace('/layout')
                // if (jsonData.global) {
                //   if (jsonData.global.result_global.flag === '1') {
                //     this.$store.commit('CLEAR_OPEND_TAG', this.$router)
                //     let userData = (jsonData.object[0].record.length > 0) ? jsonData.object[0].record[0] : null
                //     if (userData) {
                //       Cookies.set('user', userData.loginID)
                //       this.$store.dispatch('loginStorage', userData)
                //       this.$router.replace('/frame')
                //     }
                //   }
                // }
              }
            });
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../styles/login";
</style>