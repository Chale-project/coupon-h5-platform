<template>
  <div class="activity">
    <!-- banner -->
    <div class="activity-banner">
      <van-swipe :autoplay="3000" :height="205">
        <van-swipe-item v-for="(v, i) in bannerList" :key="i">
          <a :href="v.outerLink?v.outerLink:'javacript:void(0);'">
            <img class="activity-banner-image" :src="v.picPath" :onerror="error1point5X1Img" />
          </a>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 机构列表 -->
    <panel title="选择机构" link="我的兑换" :id="agentId">
      <van-swipe class="institution" v-if="totalPage>0">
        <van-swipe-item class="institution-item" v-for="(v,i) in totalPage" :key="i">
          <van-row gutter="10">
            <van-col span="6" class="institution-list" v-for="(k,j) in institutionList[i]" :key="j">
              <div :class="k.checked?'institution-infos active':'institution-infos'" @click="checkInstitution(i,j)">
                <div class="institution-logo">
                  <img :src="k.organizationLogo?k.organizationLogo:default1X1Image" :onerror="error1X1Img">
                </div>
                <div class="institution-name ellipsis">{{k.organizationName}}</div>
                <div class="checked" v-if="k.checked"></div>
              </div>

            </van-col>
          </van-row>
        </van-swipe-item>
      </van-swipe>
      <div class="no-data" v-else>暂无数据</div>
    </panel>

    <!-- 机构介绍 -->
    <div class="institution-info">
      <div class="institution-logo">
        <img :src="curInstitutionInfo.organizationLogo?curInstitutionInfo.organizationLogo:default1X1Image" :onerror="error1X1Img">
      </div>
      <div class="institution-others">
        <div class="institution-name ellipsis">{{curInstitutionInfo.organizationName}}</div>
        <div class="institution-desc ellipsis-2" v-html="curInstitutionInfo.querySpecification"></div>
        <div class="institution-intr" v-html="curInstitutionInfo.exchangeIntroduction"></div>
      </div>
    </div>

    <!-- 产品 -->
    <panel title="支持兑换产品列表" class="product-panel" color="#f44">
      <div class="product">
        <div class="product-header">
          <div class="header-item ellipsis" style="width:25%;">积分数</div>
          <div class="header-item ellipsis" style="width:30%;">兑换商品</div>
          <div class="header-item ellipsis" style="width:22%;">兑换次数</div>
          <div class="header-item ellipsis" style="width:23%;">兑换价</div>
        </div>
        <div class="product-body">
          <template v-if="productList.length>0">
            <ul class="product-list" v-for="(v,i) in productList" :key="i">
              <li class="grain product-integral" style="width:25%;">{{v.creditsExchangeNum}}</li>
              <li class="grain product-name" style="width:30%;">{{v.productName}}</li>
              <li class="grain product-times" style="width:22%;">{{v.allowExchangeNum>=0?v.allowExchangeNum:'不限'}}</li>
              <li class="grain product-price" style="width:23%;">{{v.exchangePrice/100}}</li>
            </ul>
          </template>
          <div class="no-data" v-else>暂无数据</div>
        </div>
      </div>
    </panel>

    <!-- 兑换流程 -->
    <panel title="兑换流程" class="exchange-step" color="yellow">
      <ul class="step-image">
        <li class="step-img"><img src="../../assets/images/step_a.png" alt=""></li>
        <li class="step-img"><img src="../../assets/images/step_b.png" alt=""></li>
        <li class="step-img"><img src="../../assets/images/step_c.png" alt=""></li>
      </ul>
      <ul class="step-text">
        <li class="step-desc"><span>选择银行</span><br><span>点击立即兑换</span></li>
        <li class="step-desc"><span>按照步骤完成兑换</span><br><span>并将兑换信息报单</span></li>
        <li class="step-desc"><span>核销完成</span><br><span>我的账户中提现</span></li>
      </ul>
    </panel>

    <div class="footer-container">
      <van-button block type="info" @click="navigateTo">立即兑换</van-button>
    </div>

  </div>
</template>
<script>
import { Swipe, SwipeItem, Row, Col, Icon } from "vant";
import panel from "@/components/panel";
import api from "@/util/api";
import Util from "@/util/utils";
import default1X1Image from "@/assets/images/default_logo_1x1.jpg";
import default1point5X1Image from "@/assets/images/default_logo_1.5x1.jpg";
import { mapActions } from "vuex";

export default {
  name: "activity",
  components: {
    [Icon.name]: Icon,
    [Row.name]: Row,
    [Col.name]: Col,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    panel
  },
  data() {
    return {
      agentId: null,
      loginKey: null,

      default1X1Image,
      error1X1Img: `this.src="${default1X1Image}"`,
      error1point5X1Img: `this.src="${default1point5X1Image}"`,
      bannerList: [],

      currentPage: 1,
      pageSize: 8,
      totalPage: 0,
      totalCount: 0,

      institutionList: [],
      curInstitutionInfo: {},

      productList: []
    };
  },
  async created() {
    const _agentId = this.$route.query.agentId;
    const _loginKey = this.$route.query.login_key;
    if (_agentId) this.agentId = _agentId;
    if (_loginKey) {
      const param = {
        mobileCode: _loginKey
      };
      this.setVisitorAuth(param);
    }
    await Promise.all([this.getHomeBanner(), this.getHomeInstitution()]).then(
      () => {
        this.getHomeProductList();
      }
    );
  },

  methods: {
    ...mapActions(["setVisitorAuth"]),

    //跳转兑换流程
    navigateTo() {
      const _id = this.curInstitutionInfo.pathId;
      const _agentId = this.agentId;
      this.$router.push({
        name: "step",
        query: { id: _id, agentId: _agentId }
      });
    },

    //切换选择机构
    checkInstitution(i, j) {
      const _listA = this.institutionList;
      _listA.map((v, m) => {
        if (m === i) {
          const _listC = v;
          _listC.map((k, n) => {
            if (n === j) {
              k.checked = !0;
              this.curInstitutionInfo = k;
              this.getHomeProductList();
            } else {
              k.checked = !1;
            }
          });
        } else {
          const _listB = v;
          _listB.map((p, q) => {
            p.checked = !1;
          });
        }
      });
    },

    //首页轮播
    async getHomeBanner() {
      const ad = await api
        .getHomeAdBanner()
        .then(res => {
          if (res.code === 0) {
            const _image = res.result;
            if (_image.length > 0) {
              this.bannerList = _image;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //首页机构列表
    async getHomeInstitution() {
      const _data = {
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        where: {}
      };
      const _activity = await api
        .getHomeInstitution(_data)
        .then(res => {
          if (res.code === 0) {
            this.currentPage++;
            this.pageSize = res.result.pageSize;
            this.totalPage = res.result.totalPage;
            this.totalCount = res.result.totalCount;

            let list = this.institutionList;
            let _list = res.result.list;
            if (_list.length > 0) {
              list[this.currentPage - 1] = _list;
              if (this.currentPage <= this.totalPage) {
                this.getHomeInstitution();
              }
              const _listArr = list.filter(item => {
                return item;
              });
              _listArr[0][0].checked = !0;
              this.curInstitutionInfo = _listArr[0][0];
              this.institutionList = _listArr;
            } else {
              this.institutionList = [];
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },

    //获取当前机构的产品列表
    async getHomeProductList() {
      const _number = this.curInstitutionInfo.organizationNumber;
      const _product = await api
        .getProductList(_number)
        .then(res => {
          if (res.code === 0) {
            const _list = res.result.list;
            if (_list.length > 0) {
              this.productList = _list;
            } else {
              this.productList = [];
            }
          }
        })
        .catch(err => {});
    }
  }
};
</script>
<style lang="less">
@import "../../style/common";
.activity {
  &-banner {
    &-image {
      width: 100%;
    }
  }
  .institution {
    padding-bottom: 16px;
    &-item {
      .institution-list {
        padding-bottom: 10px;
        text-align: center;

        .institution-infos {
          position: relative;
          border: 0.5px solid #fff;
          overflow: hidden;
          .institution-logo {
            width: 57.75px;
            height: 57.75px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            img {
              padding: 5px;
              border-radius: 50%;
              width: 47.75px;
              height: 47.75px;
            }
          }
          .institution-name {
            width: 100%;
            padding: 5px 0;
            color: #333;
          }
        }
        .institution-infos.active {
          border: 0.5px solid #1989fa;
        }
        .institution-infos .checked {
          position: absolute;
          width: 30px;
          height: 30px;
          right: 0;
          top: 0;
          background: #1989fa;
          transform: rotate(45deg) translate(0px, -22px);
          z-index: 99;
        }
        .institution-infos .checked::after {
          width: 10px;
          height: 10px;
          position: absolute;
          content: "\F0C1";
          font: normal normal normal 10px/1 "vant-icon";
          color: #fff;
          transform: rotate(-45deg) translate(-17px, 10px);
        }
      }
    }
  }

  .institution-info {
    margin-bottom: 10px;
    padding: 10px 15px;
    background: #fff;
    display: flex;
    .institution-logo {
      width: 50px;
      height: 50px;
      text-align: center;
      margin-right: 10px;
      border-radius: 50%;
      overflow: hidden;
    }
    .institution-others {
      width: calc(100% - 60px);
      .institution-name {
        color: #333;
        font-size: 16px;
      }
      .institution-desc {
        color: #666;
        line-height: 1.78;
        padding: 5px 0 8px;
      }
      .institution-intr {
        height: 50px;
        padding: 10px;
        border: 0.5px solid #ebedf0;
        color: #999;
        overflow-y: auto;
      }
    }
  }

  .product-panel {
    margin-bottom: 10px;
    .product {
      border-top: 0.5px solid #ebedf0;
      border-left: 0.5px solid #ebedf0;
      border-radius: 4px;
      margin-bottom: 10px;
      text-align: center;
      overflow: hidden;
      &-header {
        display: flex;
        align-content: center;
        justify-content: space-between;
        background: #f8f8f8;
        .header-item {
          border-bottom: 0.5px solid #ebedf0;
          border-right: 0.5px solid #ebedf0;
          padding: 10px 5px;
        }
      }
      &-body {
        .product-list {
          display: flex;
          align-content: center;
          justify-content: space-between;
          color: #333;
          .grain {
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 0.5px solid #ebedf0;
            border-right: 0.5px solid #ebedf0;
            padding: 10px 5px;
          }
          .product-price {
            color: #f44;
          }
        }
      }
    }
  }

  .exchange-step {
    margin-bottom: 65px;
    .step-image,
    .step-text {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      li {
        flex: 1;
        position: relative;
        text-align: center;
        span {
          font-size: 10px;
          color: #999;
        }
      }
      img {
        width: 40px;
        height: 40px;
      }
    }
    .step-image {
      li::after {
        content: "";
        position: absolute;
        top: 50%;
        right: -10px;
        width: 20px;
        height: 8.4px;
        transform: translateY(-50%);
        background: url(../../assets/images/step_bg.png) no-repeat center;
        background-size: cover;
      }
      li:last-child::after {
        width: 0;
        height: 0;
      }
    }
  }
  .footer-container {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 10px 15px;
    background: #fff;
  }

  .van-swipe__indicator {
    background-color: #999;
  }

  .van-swipe__indicator--active {
    background-color: #1989fa;
  }

  .no-data {
    padding: 20px 0;
    color: #999;
    text-align: center;
    font-size: 12px;
  }
}
</style>