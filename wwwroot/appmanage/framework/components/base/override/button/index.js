define([
  'ELEMENT'
], function(ELEMENT) {
  'use strict';
  
  var Button = {
    name: 'ElButton',

    extends: ELEMENT.Button,

    props: {
      size: {
        type: String,
        default: 'mini'
      }
    }
  }

  Button.install = function (Vue) {
    Vue.component(Button.name, Button);
  };

  return Button;
});