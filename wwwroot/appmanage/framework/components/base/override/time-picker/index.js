define([
  'ELEMENT'
], function(ELEMENT) {
  'use strict';

  var TimePicker = {
    name: 'ElTimePicker',

    extends: ELEMENT.TimePicker,

    props: {
      valueFormat: {
        type: String,
        default: 'timestamp'
      }
    }
  }

  TimePicker.install = function (Vue) {
    Vue.component(TimePicker.name, TimePicker);
  };

  return TimePicker;
});