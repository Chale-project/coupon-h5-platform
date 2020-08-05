<template>
  <van-tabbar v-model="curNavActive" active-color="#e9ca32" :z-index="999">
    <van-tabbar-item :icon="v.icon" :dot="v.dot" :url="v.path" v-for="(v, i) of tabs" :key="i">{{v.name}}</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from "vant";

export default {
  name: "navTabBar",
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem
  },
  data() {
    return {
      curNavActive: this.curNavItem,
      tabs: [
        {
          name: "首页",
          path: "/home",
          pathName: "home",
          icon: "home-o",
          dot: false
        },
        {
          name: "分类",
          path: "/sort",
          pathName: "sort",
          icon: "bars",
          dot: false
        },
        {
          name: "购物车",
          path: "/cart",
          pathName: "cart",
          icon: "cart-o",
          dot: false
        },
        {
          name: "我的",
          path: "/user",
          pathName: "user",
          icon: "user-o",
          dot: false
        }
      ]
    };
  },

  watch: {
    $route: "changeActive"
  },

  created() {
    const toName = this.$route.name;
    this.setActive(toName);
  },

  methods: {
    changeActive({ name }) {
      this.setActive(name);
    },
    setActive(name) {
      this.tabs.forEach((tab, i) => {
        if (tab.pathName == name) {
          this.curNavActive = i;
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
</style>
