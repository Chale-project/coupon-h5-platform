<template>
  <div class="order">
    <div class="order-type">
      <van-tabs v-model="orderType" @change="switchType">
        <van-tab title="全部"></van-tab>
        <van-tab title="兑换中"></van-tab>
        <van-tab title="兑换成功"></van-tab>
        <van-tab title="兑换失败"></van-tab>
      </van-tabs>
    </div>
    <!-- <div class="order-date-time">
      <van-cell-group>
        <van-cell title="当前发货时间周期" :value="curDateTimeStr" is-link @click="choiceDateTime" />
      </van-cell-group>
    </div> -->
    <div class="order-content">
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了..." :offset="10" @load="onLoad">
        <div class="order-item" v-for="(v,i) in orderList" :key="i" @click="navigateTo(v.id)">
          <div class="order-institution">
            <div class="order-header ellipsis">{{v.addDataTime}}</div>
            <div class="order-institution-name order-info ellipsis">{{v.organizationName}}</div>
          </div>
          <div class="order-product">
            <div class="order-header ellipsis">产品名称</div>
            <div class="order-product-name order-info ellipsis">{{v.productName}}</div>
          </div>
          <div class="order-money">
            <div class="order-header ellipsis">兑换金额</div>
            <div class="order-exchange-money order-info ellipsis">￥{{v.exchangePrice/100}}</div>
          </div>
          <div class="order-status">
            <van-icon :name="v.state=='success'?'checked':v.state=='failed'?'clear':'clock-o'" :color="v.state=='success'?'#1989fa':v.state=='failed'?'#f44':''" size="20px" />
          </div>
        </div>
      </van-list>
    </div>
    <!-- 时间日期选择组件 -->
    <van-popup v-model="showDateTime" position="bottom">
      <van-datetime-picker v-model="curDateTime" type="date" @confirm="confirmDateTime" @cancel="cancelDateTime" />
    </van-popup>
  </div>
</template>

<script>
import {
  Tab,
  Tabs,
  List,
  Cell,
  CellGroup,
  Icon,
  Dialog,
  Popup,
  DatetimePicker
} from "vant";
import api from "@/util/api";
import Util from "@/util/utils";

export default {
  name: "orderList",

  components: {
    [Tab.name]: Tab,
    [Tabs.name]: Tabs,
    [Icon.name]: Icon,
    [List.name]: List,
    [Cell.name]: Cell,
    [Popup.name]: Popup,
    [Dialog.name]: Dialog,
    [CellGroup.name]: CellGroup,
    [DatetimePicker.name]: DatetimePicker
  },
  data() {
    return {
      orderType: 0,
      orderStatus: null,
      currentPage: 0,
      pageSize: 20,
      totalPage: 1,
      orderList: [],
      curDateTimeStr: "",
      showDateTime: !1,
      curDateTime: null,
      loading: !1,
      finished: !1
    };
  },
  computed: {},
  created() {
    const _orderType = this.$route.query.orderType;
    this.orderType = _orderType;

    switch (_orderType) {
      case 1:
        this.orderStatus = "waiting";
        break;
      case 2:
        this.orderStatus = "success";
        break;
      case 3:
        this.orderStatus = "failed";
        break;
      default:
        this.orderStatus = null;
    }
  },
  mounted() {
    this.setCurDateTime();
  },

  methods: {
    //init
    init() {
      this.orderList = [];
      this.currentPage = 0;
      this.totalPage = 1;
      this.loading = !1;
      this.finished = !1;
    },

    //跳转详情
    navigateTo(_id) {
      this.$router.push({ name: "orderDetail", query: { id: _id } });
    },

    //切换订单分类状态
    switchType(e) {
      const _index = e;
      this.orderType = _index;
      switch (_index) {
        case 1:
          this.orderStatus = "waiting";
          break;
        case 2:
          this.orderStatus = "success";
          break;
        case 3:
          this.orderStatus = "failed";
          break;
        default:
          this.orderStatus = null;
      }

      this.init();
      this.onLoad();
    },

    //初始化当前时间
    setCurDateTime() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dateTime = [year, month, day].map(Util.formatNumber).join("-");
      this.curDateTimeStr = dateTime;
      this.curDateTime = date;
    },

    //选择订单周期时间
    choiceDateTime() {
      this.showDateTime = !0;
    },

    //确认时间
    confirmDateTime(e) {
      const dateTimeStr = Util.formatTime(e);
      this.curDateTimeStr = dateTimeStr;
      this.showDateTime = !1;
      this.init();
      this.onLoad();
    },

    //取消时间
    cancelDateTime() {
      this.showDateTime = !1;
    },

    //获取商品列表
    async getOrderList() {
      const _order = await api
        .getOrderList({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          where: {
            // time: this.curDateTimeStr,
            state: this.orderStatus
          }
        })
        .then(res => {
          if (res.code == 0) {
            let data = res.result,
              _list = data.list,
              list = this.orderList;
            this.loading = !1;
            this.totalPage = data.totalPage;
            // this.curDateTimeStr = data.curDataTime;
            if (_list.length > 0) {
              this.finished = !1;
              this.orderList = list.concat(_list);
            } else {
              this.finished = !0;
            }
          }
        })
        .catch(err => {});
    },

    // 上拉加载更多
    async onLoad() {
      this.currentPage += 1;
      if (this.currentPage > this.totalPage) {
        this.finished = !0;
        this.loading = !1;
      } else {
        await this.getOrderList();
      }
    }
  }
};
</script>

<style lang="less">
@import "../../style/common";
.order {
  position: relative;
  &-type {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 44px;
    z-index: 99;
  }
  &-date-time {
    position: fixed;
    top: 44px;
    left: 0;
    right: 0;
    height: 44px;
    z-index: 99;
  }
  &-content {
    padding-top: 44px;
    .order-item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      text-align: center;
      background: #fff;
      .order-institution {
        width: 30%;
        padding: 0 5px;
      }
      .order-product {
        width: 35%;
        padding: 0 5px;
      }
      .order-money {
        width: 25%;
        padding: 0 5px;
      }
      .order-status {
        width: 10%;
        padding: 0 5px;
        text-align: left;
      }
      .order-header {
        padding-bottom: 5px;
        font-size: 12px;
        color: #999;
      }
      .order-info {
        color: #333;
      }
    }
    .order-item::before {
      .backgroundLine();
    }
    .order-item::after {
      font: normal normal normal 14px/1 "vant-icon";
      position: absolute;
      content: "\F00A";
      width: 14px;
      height: 14px;
      right: 5px;
      top: 50%;
      transform: translateY(-50%);
      overflow: hidden;
    }
  }
}
</style>