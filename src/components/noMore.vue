<template>
  <li class="no-more" v-show="noMore">
    <span><em>{{noMoreText}}</em></span>
  </li>
</template>

<script>
export default {
  name: "noMore",
  props: {
    noMore: {
      type: Boolean,
      default: !1
    },
    noMoreText: {
      type: String,
      default: "我是有底线的！"
    }
  },
  data() {
    return {};
  },

  methods: {}
};
</script>

<style lang="less">
@import "../style/common";

.no-more {
  position: relative;
  padding: 10px 15px;
  text-align: center;
  span {
    position: relative;
    display: inline-block;
    padding: 5px 30px;
    em {
      display: inline-block;
      padding: 0 10px;
      z-index: 10;
      font-style: normal;
      .fontSize(12px);
      .textColor(#999);
      .backgroundColor(#fff);
    }
  }
  span::after {
    content: "";
    width: 100%;
    height: 0.5px;
    .ct();
    left: 0;
    right: 0;
    z-index: -1;
    .backgroundColor();
  }
}
</style>
