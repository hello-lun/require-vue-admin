define([
  'ELEMENT'
], function(ELEMENT) {
  'use strict';
  
  var DatePicker = {
    name: 'ElDatePicker',

    extends: ELEMENT.DatePicker,

    props: {
      valueFormat: {
        type: String,
        default: 'timestamp'
      }
    }
  }

  DatePicker.install = function (Vue) {
    Vue.component(DatePicker.name, DatePicker);
  };

  return DatePicker;
});