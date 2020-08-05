<template>
  <div class="panel">
    <div class="panel-header">
      <div class="panel-header-left ellipsis"><span class="panel-header-title" :style="{borderLeft:'3px solid ' + color}" v-if="title">{{title}}</span><span class="panel-header-title-info" v-if="info">{{info}}</span></div>
      <div class="panel-header-right ellipsis">
        <router-link v-if="link" :to="{ name: 'orderList',query:{agentId:id} }">
          {{ link }}
        </router-link>
      </div>
    </div>
    <div class="panel-body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "panel",
  props: {
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#1989fa"
    },
    info: {
      type: String,
      default: ""
    },
    link: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
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
.panel {
  background: #fff;

  &-header {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-left {
      flex: 2;
      color: #333;
      .panel-header-title {
        padding: 0 5px;
      }
      .panel-header-title-info {
        font-size: 12px;
        color: #999;
      }
    }
    &-right {
      flex: 1;
      text-align: right;
      a {
        color: #1989fa;
      }
    }
  }
  &-body {
    padding: 5px 15px;
  }
}
</style>
