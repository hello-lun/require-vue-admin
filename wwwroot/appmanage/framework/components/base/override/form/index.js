define([
  'ELEMENT'
], function(ELEMENT) {
  'use strict';
  
  var Form = {
    name: 'ElForm',

    extends: ELEMENT.Form,

    props: {
      size: {
        type: String,
        default: 'mini'
      }
    }
  }

  Form.install = function (Vue) {
    Vue.component(Form.name, Form);
  };

  return Form;

});