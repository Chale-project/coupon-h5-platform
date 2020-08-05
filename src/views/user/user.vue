<template>
  <div class="user">
    <div class="user-header">
      <img class="user-poster" src="@/assets/images/user_center.png">
      <div class="user-name ellipsis">{{userInfo.merchantName}}</div>
    </div>
    <van-row class="user-links">
      <van-col span="8">
        <van-icon name="pending-payment" />
        <router-link :to="{ name:'order', query: { orderType: 1}}">
          待处理
        </router-link>
      </van-col>
      <van-col span="8">
        <van-icon name="logistics" />
        <router-link :to="{ name:'order', query: { orderType: 2}}">
          配送中
        </router-link>
      </van-col>
      <van-col span="8">
        <van-icon name="sign" />
        <router-link :to="{ name:'order', query: { orderType: 3}}">
          已收货
        </router-link>
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell icon="records" title="全部订单" is-link url="/order?orderType=0" />
    </van-cell-group>

    <van-cell-group>
      <van-cell icon="notes-o" title="欠款列表" is-link url="/debt" />
      <van-cell icon="balance-pay" title="额度查询" is-link url="/quota" />
    </van-cell-group>

    <!-- 底部nav -->
    <NavTabBar />

  </div>
</template>

<script>
import { Row, Col, Icon, Cell, CellGroup } from "vant";
import NavTabBar from "@/components/navTabBar";
import { mapState } from "vuex";
export default {
  components: {
    NavTabBar,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["userInfo"])
  },
  mounted() {}
};
</script>

<style lang="less">
@import "../../style/common";

.user {
  &-header {
    position: relative;
    .user-name {
      width: 200px;
      text-align: center;
      .cl();
      bottom: 14px;
      font-weight: bold;
      .textColor(#425263);
    }
    img {
      width: 100%;
      display: block;
    }
  }

  &-group {
    margin-bottom: 15px;
  }
  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;
    a {
      .textColor(#666);
    }
    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}
</style>