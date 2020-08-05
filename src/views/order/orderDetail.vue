<template>
  <div class="order-detail">
    <ul class="order-detail-card">
      <li class="order-detail-item">订单信息</li>
      <li class="order-detail-item">
        <div class="order-detail-title">订单号：</div>
        <div class="order-detail-info ellipsis">{{infos.serialNumber}}</div>
      </li>
      <li class="order-detail-item">
        <div class="order-detail-title">兑换状态：</div>
        <div class="order-detail-info">{{infos.state=='success'?'兑换成功':infos.state=='failed'?'兑换失败':'兑换中'}}</div>
      </li>
      <li class="order-detail-item">
        <div class="order-detail-title">提交时间：</div>
        <div class="order-detail-info ellipsis">{{infos.addDataTime}}</div>
      </li>
      <li class="order-detail-item">
        <div class="order-detail-title">审核时间：</div>
        <div class="order-detail-info ellipsis">{{infos.passTime||'--'}}</div>
      </li>
      <li class="order-detail-item" v-if="infos.state=='failed'">
        <div class="order-detail-title">失败说明：</div>
        <div class="order-detail-info ellipsis-2">{{infos.failedReason||'--'}}</div>
      </li>

    </ul>
    <ul class="order-detail-card">
      <li class="order-detail-item">报章信息</li>
      <li class="order-detail-item">
        <div class="order-detail-title">产品类型：</div>
        <div class="order-detail-info ellipsis">{{infos.productName}}</div>
      </li>
      <li class="order-detail-item">
        <div class="order-detail-title">兑换码：</div>
        <div class="order-detail-info ellipsis">{{infos.redeemCode}}</div>
      </li>
      <li class="order-detail-item">
        <div class="order-detail-title">备注：</div>
        <div class="order-detail-info">{{infos.remark}}</div>
      </li>
    </ul>
    <div class="order-detail-image">
      <div class="order-detail-image-title">订单截图：</div>
      <div class="order-detail-image-screenshot" @click="imagePreview">
        <img :src="infos.picPath?infos.picPath:default1point5X1Image" :onerror="error1point5X1Img">
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
import default1point5X1Image from "@/assets/images/default_logo_1.5x1.jpg";
import api from "@/util/api";
import Util from "@/util/utils";

export default {
  components: {},
  data() {
    return {
      default1point5X1Image,
      error1point5X1Img: `this.src="${default1point5X1Image}"`,
      id: null,
      infos: {}
    };
  },
  computed: {},
  created() {
    this.id = this.$route.query.id;
  },
  async mounted() {
    await this.getOrderInfo();
  },

  methods: {
    //图片预览
    imagePreview(e) {
      const imgArr = [];
      imgArr.push(e.srcElement.currentSrc);
      ImagePreview(imgArr);
    },

    async getOrderInfo() {
      const _id = this.id;
      const _info = await api
        .getOrderDetail(_id)
        .then(res => {
          if (res.code === 0) {
            this.infos = res.info;
          }
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="less">
@import "../../style/common";
.order-detail {
  &-card {
    margin-bottom: 10px;
    background: #fff;
    .order-detail-item {
      position: relative;
      padding: 10px 15px;
      display: flex;
      font-size: 16px;
      color: #333;
      .order-detail-title {
        flex: 1;
        color: #999;
        font-size: 14px;
      }
      .order-detail-info {
        flex: 2;
        color: #333;
        text-align: right;
        font-size: 14px;
      }
    }
    .order-detail-item::after {
      .backgroundLine();
    }
  }
  .order-detail-image {
    min-height: 50px;
    margin-top: -10px;
    display: flex;
    padding: 10px 15px;
    background: #fff;
    &-title {
      color: #999;
    }
    &-screenshot {
      width: 190px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      overflow: hidden;
    }
  }
}
</style>