<template>
  <el-menu
    :default-active="$route.path"
    :collapse="otherInfo.menuCollapse"
    :background-color="otherInfo.themeBackgroundColor"
    :text-color="otherInfo.themeTextColor"
    router
    class="h997"
     style="overflow-x:hidden;"
  >
    <!-- :style="{height:otherInfo.asideVisible ? '':'98vh'}" -->
    <transition v-for="(menuListItem,indexList) in menuList" :key="indexList">
      <el-submenu v-if="menuListItem.children.length>1" :index="menuListItem.path">
        <template slot="title">
          <i :class="menuListItem.meta.icon"></i>
          <span slot="title" class="normal" :text-color="otherInfo.themeTextColor">{{language[menuListItem.name]}}</span>
        </template>
        <transition
          v-for="(menuChildrenItem,indexChildren) in menuListItem.children"
          :key="indexChildren"
        >
          <el-menu-item :index="menuChildrenItem.path">
            <i :class="menuChildrenItem.meta.icon"></i>
            <span slot="title" class="normal" :text-color="otherInfo.themeTextColor">{{language[menuChildrenItem.name]}}</span>
          </el-menu-item>
        </transition>
      </el-submenu>
      <el-menu-item v-else :index="menuListItem.children[0].path">
        <i :class="menuListItem.children[0].meta.icon"></i>
        <span slot="title" class="normal" :text-color="otherInfo.themeTextColor">{{language[menuListItem.children[0].name]}}</span>
      </el-menu-item>
    </transition>
  </el-menu>
  <!-- <keep-alive> </keep-alive> <component></component> -->
</template>

<script>
import menuroule from "@/menuroule";
import mymixins from "@/mymixins";
export default {
  mixins: [mymixins],
  name: "mainMenu",
  data() {
    return {};
  },
  computed: {
    menuList() {
      let that = this;
      let allMenuList = menuroule;
      let userRole = this.userInfo.userRole;
      let menuList = [];
      allMenuList.forEach((allValue, index) => {
        if (allValue.meta.role.includes(userRole)) {
          if (allValue.children) {
            let childMenuList = [];
            allValue.children.forEach((childValue, index) => {
              if (childValue.meta.role.includes(userRole)) {
                childMenuList.push(childValue);
              }
            });
            that.$set(allValue, "children", childMenuList);
          }
          menuList.push(allValue);
        }
      });
      return menuList;
    }
  }
};
</script>