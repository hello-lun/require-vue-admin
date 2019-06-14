define([
  'ELEMENT'
], function(ELEMENT) {
  'use strict';
  
  var DateTimePicker = {
    name: 'ElDateTimePicker',

    extends: ELEMENT.DateTimePicker,

    props: {
      valueFormat: {
        type: String,
        default: 'timestamp'
      }
    }
  }

  DateTimePicker.install = function (Vue) {
    Vue.component(DateTimePicker.name, DateTimePicker);
  };

  return DateTimePicker;
});