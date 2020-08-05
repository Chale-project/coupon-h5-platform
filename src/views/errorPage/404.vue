<template>
  <div class="error404">
    <div class="error404-body-con">
      <div class="error404-body-con-title">4
        <span>
          <van-icon name="close" /></span>4
      </div>
      <p class="error404-body-con-message">YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST</p>
      <div class="error404-btn-con">
        <van-button @click="backPage" round block type="primary">返回</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Card, Button, Icon } from "vant";
Vue.use(Card)
  .use(Button)
  .use(Icon);
export default {
  name: "err404",
  mounted() {
    console.log(this.$router);
  },
  methods: {
    backPage() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="less">
@import "./404.less";
.color1 {
  color: black;
}
.error404-btn-con {
  padding: 20px 15px;
  .van-button {
    margin-bottom: 10px;
  }
}
</style>
