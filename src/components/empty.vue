<template>
  <div class="empty-data" v-show="empty">
    <img src="@/assets/images/empty.png" />
    <p class="empty-text">{{emptyText}}</p>
  </div>
</template>

<script>
export default {
  name: "empty",
  props: {
    empty: {
      type: Boolean,
      default: !1
    },
    emptyText: {
      type: String,
      default: "没有数据了！"
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
.empty-data {
  padding: 50px 15px;
  text-align: center;
  .textColor(#999);
  img {
    width: 80px;
  }
}
</style>
