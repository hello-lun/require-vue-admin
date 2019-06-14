define(function(require) {
    'use strict';
    var YCH = {};

    YCH.install = function (Vue, options) {
        // 基础的http
        var BaseModule = require('framework/api/BaseModule');
        // 侧边弹出栏
        var sideBar = require('framework/components/side-bar/index');
        // 子页面可视高度， 40：容器头部，38:tag栏
        var pageContainerHeight = document.documentElement.clientHeight - 40 - 38;

        Vue.prototype.pageContainerHeight = pageContainerHeight;
        window.onresize = function () {
            Vue.prototype.pageContainerHeight = document.documentElement.clientHeight - 40 - 38;
        }
        Vue.prototype.sideBar = sideBar;
        Vue.prototype.$http = window.$http = new BaseModule();

        Vue.prototype.$number = window.$number = require('numeral');
        Vue.prototype.$moment = window.$moment = require('moment');
        // 全局Event Bus
        Vue.prototype.$eventBus = window.$eventBus = new Vue();

        // 登录弹窗
        Vue.prototype.$loginDialog = window.$loginDialog = require('components/login-dialog/index');
        
        // 注册全局组件
        var components = require('framework/components/index');
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (component.name) {
                Vue.component(component.name, component);
            }
        }

        // 注册全局自定义指令
        var directives = require('directive/index');
        for (var d = 0; d < directives.length; d++) {
            var directive = directives[d];
            if (directive.name) {
                Vue.directive(directive.name, directive.achieve);
            }
        }

        //  注册全局过滤器
        var filters = require('filter/index');
        for (var f = 0; f < filters.length; f++) {
            var filter = filters[f];
            if (filter.name) {
                Vue.filter(filter.name, filter.fn);
            }
        }
    };

    return YCH;
});