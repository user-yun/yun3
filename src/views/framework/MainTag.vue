<template>
  <nobr align="left" style="overflow-x:auto">
    <el-tag
      v-for="(tag,key) in otherInfo.routerHistory"
      v-if="tag.meta.icon"
      :key="key"
      closable
      disable-transitions
      :color=" tag.path == $route.path ? otherInfo.themeBackgroundColor : '#C0C4CC' "
      @click="TagClick(key)"
      @close="TagClose(tag)"
      style="cursor:pointer;"
      class="normal"
      :size=" otherInfo.menuCollapse ? 'mini' : 'medium' "
    >
      <i :class="tag.meta.icon"></i>
      {{language[key]}}
    </el-tag>
  </nobr>
</template>

<script>
import mymixins from "@/mymixins";
export default {
  mixins: [mymixins],
  name: "mainTag",
  data() {
    return {};
  },
  methods: {
    TagClose(t) {
      this.$delete(this.otherInfo.routerHistory, t.name);
      if (t.path == this.$route.path) this.$router.go(-1);
    },
    TagClick(r) {
      this.$router.push({ name: r });
    }
  }
};
</script>

