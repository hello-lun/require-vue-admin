define([
], function() {
  'use strict';
  
  return {
    name: 'ParamPanel',

    props: {
      title: String
    },

    data: function () {
      return {

      }
    },

    template: `
      <div class="ticket-layout-manager__param-panel">
        <div class="ticket-layout-manager__param-panel-title"> {{ title }}</div>
        <slot name="default"/>
      </div>
    `
  }
});