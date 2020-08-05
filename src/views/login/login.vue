
<template>
  <div class="page login">
    <div class="login-logo">
      <img src="@/assets/images/logo_login.png" alt="">
    </div>
    <div class="login-form">
      <van-cell-group :border="false">
        <van-field v-model="mobile" maxlength="11" clearable placeholder="请输入手机号" />
        <van-field type="password" v-model="password" clearable placeholder="请输入密码"></van-field>
      </van-cell-group>
    </div>
    <div class="login-but">
      <van-button type="info" size="large" round :disabled="loginBtn" @click="goToLogin">登录</van-button>
    </div>
    <div class="login-others">
      还没有账号 <router-link :to="{ name: 'register',query:{agentId:agentId}}" replace>立即注册</router-link>
    </div>
  </div>
</template>
<script>
import { CellGroup, Field, Button } from "vant";
import api from "@/util/api";
import Util from "@/util/utils";
import { mapActions } from "vuex";
import md5 from "md5";

export default {
  name: "login",
  components: {
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    [Button.name]: Button
  },
  data() {
    return {
      agentId: null,
      mobile: "",
      password: "",
      loginBtn: !1
    };
  },
  created() {
    this.agentId = this.$route.query.agentId;
  },

  methods: {
    ...mapActions(["login"]),

    //检验手机号验证码输入
    checkMobileCode() {
      let mobileReg = /^(1)[0-9]{10}$/;
      let _mobile = this.mobile;
      let _password = this.password;
      if (!mobileReg.test(_mobile)) {
        Util.notifyError("请输入有效手机号！");
        return false;
      } else if (!_password) {
        Util.notifyError("请输入密码！");
        return false;
      } else {
        return true;
      }
    },

    goToLogin() {
      let flag = this.checkMobileCode();
      if (flag) {
        let param = {
          agentId: this.agentId,
          mobilePhone: this.mobile,
          password: md5(this.password)
        };
        this.login(param)
          .then(res => {
            this.$router.replace({ name: "activity" });
          })
          .finally(() => {
            this.registerBtn = !1;
          });
      }
    }
  }
};
</script>

<style lang="less">
@import "../../style/common";
html {
  background: none;
}
.login {
  padding: 10px 15px;
  &-logo {
    width: 170px;
    margin: 50px auto;
    img {
      width: 100%;
    }
  }
  &-form,
  &-but {
    margin: 10px 15px;
    padding-top: 10px;
  }
  &-form {
    .van-cell:last-child::after {
      content: " ";
      position: absolute;
      pointer-events: none;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      left: 15px;
      right: 0;
      bottom: 0;
      -webkit-transform: scaleY(0.5);
      transform: scaleY(0.5);
      border-bottom: 1px solid #ebedf0;
    }
  }
  &-others {
    padding: 10px 15px;
    color: #999;
    a {
      color: #1989fa;
    }
  }
}
</style>
