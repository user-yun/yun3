<template>
  <div>
    <el-image v-if="otherInfo.bgImg" :src="otherInfo.bgImg" class="w100 h997" fit="cover"></el-image>
    <el-dialog :visible="true" :show-close="false" top="30vh" :width="dialogWidth">
      <el-row slot="title">
        <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="18">
          <h2 align="left">{{language.tile}}</h2>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="6" align="right">
          <SelectLanguage></SelectLanguage>
        </el-col>
      </el-row>
      <el-form
        :model="ruleForm"
        ref="ruleForm"
        status-icon
        :rules="rules"
        @keyup.enter.native="submitForm('ruleForm')"
      >
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            :maxlength="18"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            :maxlength="20"
            show-password
            prefix-icon="el-icon-tickets"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">{{language.signIn}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import md5 from "js-md5";
import { setLocal, getLocal } from "@/function";
import mymixins from "@/mymixins";
export default {
  mixins: [mymixins],
  name: "login",
  data() {
    return {
      ruleForm: {
        username: null,
        password: null
      }
    };
  },
  components: {
    SelectLanguage: () => import("@/assets/SelectLanguage")
  },
  props: {},
  computed: {
    rules() {
      let rules = {
        username: [{ required: true, message: "username", trigger: "blur" }],
        password: [{ required: true, message: "password", trigger: "blur" }]
      };
      return rules;
    },
    dialogWidth() {
      return this.otherInfo.menuCollapse ? "60%" : "30%";
    }
  },
  watch: {},
  methods: {
    resizeHandler() {
      let currentWidth = document.body.clientWidth;
      let clientHeight = document.body.clientHeight;
      if (currentWidth <= 992 || clientHeight <= 558) {
        this.setOtherInfo({ menuCollapse: true });
      } else {
        this.setOtherInfo({ menuCollapse: false });
      }
    },
    async setWebConfig() {
      let config = await this.$Get("/web-config/config.json");
      this.setOtherInfo(config);
      this.resizeHandler();
    },
    submitForm(formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          that.login();
        }
      });
    },
    login() {
      let that = this;
      this.post("/auth/login", {
        Username: this.ruleForm.username,
        Password: md5(this.ruleForm.password)
      }).then(res => {
        let data = res.Data;
        that.setUserInfo({
          userName: data.Username,
          headerTitle: data.Nickname,
          userId: data.Id,
          userToken: data.Token,
          userRole: data.Role,
          userProject: data.Project,
          projectId: that.isFalse(res.Expand) ? null : res.Expand.Id
        });
        setLocal("userMemory", {
          userInfo: that.userInfo,
          otherInfo: that.otherInfo,
          language: that.language
        });
        that.$router.push({ name: "home" });
      });
    }
  },
  created() {
    let userMemory = getLocal("userMemory");
    if (this.isFalse(userMemory)) {
      this.setWebConfig();
    } else {
      this.setOtherInfo(userMemory.otherInfo);
    }
  },
  mounted() {
    window.addEventListener("resize", this.resizeHandler);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizeHandler);
  }
};
</script>
<style scoped>
</style>
