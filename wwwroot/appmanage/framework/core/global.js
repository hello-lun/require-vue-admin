define(function(require) {
  'use strict';
  require('es6-promise');
  var Vue = window.Vue = require('vue');
  window._ = require('_');

  var ELEMENT = require('ELEMENT');
  window.$message = ELEMENT.Message;
  window.$notify = ELEMENT.Notify;
  window.$msgbox = ELEMENT.MessageBox;
  window.$alert = ELEMENT.MessageBox.alert;
  window.$confirm = ELEMENT.MessageBox.confirm;
  window.$loading = ELEMENT.Loading.service;

  var YCH = require('framework/core/plugin');
  
  Vue.use(ELEMENT);
  Vue.use(YCH);

  require('incss!framework/lib/element-ui/css/index.css');
  require('incss!framework/css/init.css');
  require('incss!framework/css/icon/iconfont.css');
  require('incss!framework/css/common.css');
});