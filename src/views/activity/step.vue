<template>
  <div class="activity-step">
    <!-- 兑换流程说明 -->
    <panel title="兑换流程" class="activity-step-info" color="yellow">
      <div class="activity-step-info-content" v-html="stepInfo.exchangePath"></div>
    </panel>

    <div class="footer-container">
      <van-button block type="info" @click="navigateTo">立即报单</van-button>
    </div>
  </div>

</template>
<script>
import panel from "@/components/panel";

import api from "@/util/api";
import Util from "@/util/utils";

export default {
  name: "step",
  components: {
    panel
  },
  data() {
    return {
      id: null,
      stepInfo: {}
    };
  },
  created() {
    this.id = this.$route.query.id;
  },
  async mounted() {
    await this.getExchangeStepInfo();
  },
  methods: {
    navigateTo() {
      const _id = this.stepInfo.organizationBelongId;
      this.$router.push({ name: "apply", query: { id: _id } });
    },

    async getExchangeStepInfo() {
      const _id = this.id;
      const _step = await api
        .getExchangeStep(_id)
        .then(res => {
          if (res.code === 0) {
            const info = res.result;
            this.stepInfo = info;
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
.activity-step {
  &-info {
    margin-bottom: 65px;
    &-content {
      min-height: 250px;
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
}
</style>