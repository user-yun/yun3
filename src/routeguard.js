import Vue from 'vue'
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import router from './router';
import store from './store';
import { getLocal, clearLocal } from "@/function";
// import log from "@/function";

function isFalse(o) {
    if (
        !o ||
        o === "null" ||
        o === "undefined" ||
        o === "false" ||
        o === "NaN"
    )
        return true;
    return false;
}

router.beforeEach((to, from, next) => {
    NProgress.start();
    let toHandler = {
        name: to.name,
        path: to.path,
        meta: to.meta,
    }
    let routerHistory = store.state.otherInfo.routerHistory
    if (isFalse(routerHistory)) {
        let rhObj = {};
        Vue.set(rhObj, to.name, toHandler);
        store.dispatch("upVuex", {
            mutations: "setOtherInfo",
            value: { routerHistory: rhObj }
        });
    } else {
        Vue.set(routerHistory, to.name, toHandler);
        store.dispatch("upVuex", {
            mutations: "setOtherInfo",
            value: { routerHistory: routerHistory }
        });
    }
    let meta = to.meta;
    if (isFalse(meta.intercept)) {//是否需要拦截 否
        next();
    } else {
        let userRole = store.state.userInfo.userRole;
        if (isFalse(userRole)) {//是否拥有角色 否
            let userMemory = getLocal("userMemory");
            if (isFalse(userMemory)) {//是否本地有记忆 否
                next({
                    name: "Login",
                    params: {
                        redirect: to.name
                    }
                });
            } else {
                let second = userMemory.userInfo.lastTime.second;
                let nowSecond = new Date().getTime();
                let obsoleteTime = 0.5 * 60 * 60 * 1000;
                if (nowSecond - second < obsoleteTime) {
                    store.dispatch("upVuex", {
                        mutations: "setUserInfo",
                        value: userMemory.userInfo
                    });
                    store.dispatch("upVuex", {
                        mutations: "setOtherInfo",
                        value: userMemory.otherInfo
                    });
                    store.dispatch("upVuex", {
                        mutations: "setLanguage",
                        value: userMemory.language
                    });
                    let userMRole = store.state.userInfo.userRole;
                    if (meta.role.includes(userMRole)) {//是否角色可以跳转路由 是
                        next();
                    } else {
                        next({
                            // name: from.name ? from.name : "404",
                            name: "404",
                            params: {
                                redirect: to.name
                            }
                        });
                    }
                } else {
                    clearLocal();
                    next({
                        name: "Login",
                        params: {
                            redirect: to.name
                        }
                    });
                }
            }
        } else {//有角色就可以跳转 等待加时间限制
            if (meta.role.includes(userRole)) {//是否角色可以跳转路由 是
                next();
            } else {
                next({
                    // name: from.name ? from.name : "404",
                    name: "404",
                    params: {
                        redirect: to.name
                    }
                });
            }
        }
    }
    NProgress.done();
});

router.afterEach(transition => {
    NProgress.done();
});