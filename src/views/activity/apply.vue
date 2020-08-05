<template>
  <div class="activity-apply">
    <!-- 产品类型 -->
    <panel title="产品类型" info="(点击选择兑换的商品)" class="activity-apply-product" color="#f44">
      <van-row class="activity-apply-product-content" gutter="15" v-if="productList.length>0">
        <van-col span="12" v-for="(v,i) in productList" :key="i">
          <div :class="v.checked?'product-list active ellipsis':'product-list ellipsis'" @click="checkProduct(i)">{{v.productName}}</div>
        </van-col>
      </van-row>
      <div class="no-data" v-else>没有产品了！</div>
      <div class="activity-apply-product-tips">
        温馨提示：报单信息与选择商品不符的一律不予核销，损失自负！
      </div>
    </panel>

    <!-- 订单截图 -->
    <panel title="订单截图" info="(上传积分兑换订单截图)" class="activity-apply-screenshot" color="#f44">
      <van-row class="activity-apply-screenshot-content" gutter="15">
        <van-col span="12">
          <div class="screenshot-left">
            <div class="example-image" @click="imagePreview">
              <img :src="exampleImage?exampleImage:default1X1Image" :onerror="error1X1Img">
            </div>
            <div class="example-title">查看示例图</div>
          </div>
        </van-col>
        <van-col span="12">
          <div class="screenshot-right">
            <van-uploader class="upload-image" :before-read="beforeRead" :after-read="onRead">
              <img :src="form.picPath" v-if="form.picPath">
              <template v-else>
                <van-loading v-if="imgLoading" />
                <van-icon name="photograph" size="24px" v-else />
              </template>
            </van-uploader>
            <div class="example-title">点击上传</div>
          </div>
        </van-col>
      </van-row>
    </panel>

    <!-- 兑换码 -->
    <panel title="兑换码" class="activity-apply-redeemcode" color="#f44">
      <div class="activity-apply-redeemcode-content">
        <van-field v-model="form.redeemCode" placeholder="请输入兑换码" />
      </div>
    </panel>

    <!-- 备注 -->
    <panel title="备注" class="activity-apply-remark" color="#1989fa">
      <div class="activity-apply-remark-content">
        <van-field v-model="form.remark" type="textarea" placeholder="请输入备注信息" rows="3" autosize />
      </div>
    </panel>

    <div class="footer-container">
      <van-button block type="info" :disabled="applyDisabled" @click="butSubmitApply">提交</van-button>
    </div>

  </div>

</template>
<script>
import {
  Row,
  Col,
  Icon,
  Loading,
  Uploader,
  Field,
  CellGroup,
  ImagePreview
} from "vant";

import panel from "@/components/panel";

import api from "@/util/api";
import Util from "@/util/utils";
import default1X1Image from "@/assets/images/default_logo_1x1.jpg";
import { setTimeout } from "timers";

export default {
  name: "apply",
  components: {
    panel,
    [Row.name]: Row,
    [Col.name]: Col,
    [Field.name]: Field,
    [Loading.name]: Loading,
    [Uploader.name]: Uploader,
    [CellGroup.name]: CellGroup
  },
  data() {
    return {
      default1X1Image,
      error1X1Img: `this.src="${default1X1Image}"`,
      applyDisabled: !1,
      id: null,
      productList: [],
      exampleImage: "",
      imgLoading: !1,
      form: {
        organizationId: "",
        productId: "",
        picPath: "",
        redeemCode: null,
        remark: null
      }
    };
  },

  created() {
    this.id = this.$route.query.id;
    this.form.organizationId = this.$route.query.id;
  },
  async mounted() {
    await this.getProductList();
  },

  methods: {
    //选择产品
    checkProduct(i) {
      const _product = this.productList;
      _product.map((item, index) => {
        if (index === i) {
          item.checked = !0;
          this.form.productId = item.productNumber;
        } else {
          item.checked = !1;
        }
      });
    },

    //图片预览
    imagePreview(e) {
      const imgArr = [];
      imgArr.push(e.srcElement.currentSrc);
      ImagePreview(imgArr);
    },

    //上传前
    beforeRead(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        Util.notifyError("图片大小超出2M限制！");
      }
      return isLt2M;
    },

    //上传
    onRead(info) {
      this.imgLoading = !0;
      Util.fileUpload(info.file)
        .then(res => {
          if (res.code === 0) {
            const path = res.url;
            this.imgLoading = !1;
            this.form.picPath = path;
            Util.showToastSuccess("上传成功!");
          } else {
            this.imgLoading = !1;
            this.form.picPath = "";
            Util.notifyError(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //数据校验
    checkData() {
      let flag = !0;
      if (!this.form.organizationId) {
        Util.notifyError("请传入有效的机构ID！");
        flag = !1;
        return false;
      } else if (!this.form.productId) {
        Util.notifyError("请选择兑换的产品！");
        flag = !1;
        return false;
      } else if (!this.form.picPath) {
        Util.notifyError("请上传订单截图！");
        flag = !1;
        return false;
      } else if (!this.form.redeemCode) {
        Util.notifyError("请填写兑换码！");
        flag = !1;
        return false;
      } else {
        flag = !0;
      }
      return flag;
    },

    //提交申请
    butSubmitApply() {
      const _flag = this.checkData();
      _flag && this.submitApply();
    },

    async submitApply() {
      this.applyDisabled = !0;
      const _data = this.form;
      const _apply = await api
        .submitApply(_data)
        .then(res => {
          if (res.code === 0) {
            Util.notifySuccess("申请成功，请等待工作人员审核!");
            setTimeout(() => {
              this.$router.replace({ name: "orderList" });
            }, 1500);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally(() => {
          this.applyDisabled = !1;
        });
    },

    async getProductList() {
      const _id = this.id;
      const _product = await api
        .getProductList(_id)
        .then(res => {
          if (res.code === 0) {
            this.exampleImage = res.result.pic;
            const _list = res.result.list;

            if (_list.length > 0) {
              _list[0].checked = !0;
              this.form.productId = _list[0].productNumber;
              this.productList = _list;
            } else {
              this.productList = [];
            }
          } else {
            Util.notifyError(res.msg);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>
<style lang="less">
@import "../../style/common";
.activity-apply {
  &-product {
    margin-bottom: 10px;
    &-content {
      .van-col {
        margin-bottom: 15px;
      }
      .product-list {
        padding: 5px 4px;
        border-radius: 4px;
        border: 0.5px solid #26b9ea;
        text-align: center;
        color: #26b9ea;
        cursor: pointer;
      }
      .product-list.active {
        background: #1989fa;
        border-color: #1989fa;
        color: #fff;
      }
    }
    &-tips {
      color: #999;
      font-size: 12px;
    }
  }
  &-screenshot {
    margin-bottom: 10px;
    &-content {
      .screenshot-left {
        width: 165px;
        margin: 0 auto;
        .example-image {
          width: 100%;
          height: 93px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          text-align: center;
          overflow: hidden;
          cursor: pointer;
        }
      }
      .screenshot-right {
        width: 165px;
        margin: 0 auto;
        .upload-image {
          width: 163px;
          height: 91px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          border: 1px dashed #ebedf0;
          overflow: hidden;
        }
      }
      .example-title {
        padding: 5px;
        color: #333;
        text-align: center;
      }
    }
  }
  &-redeemcode {
    margin-bottom: 10px;
  }
  &-remark {
    margin-bottom: 65px;
  }
  .footer-container {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 15px;
    background: #fff;
  }

  .no-data {
    padding: 20px 0;
    color: #999;
    text-align: center;
    font-size: 12px;
  }
}
</style>