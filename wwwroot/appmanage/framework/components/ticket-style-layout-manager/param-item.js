define([
], function() {
  'use strict';
  
  return {
    name: 'ParamItem',

    props: {
      label: String,
      double: {
        type: Boolean,
        default: false
      }
    },

    template: `
      <div 
        class="ticket-layout-manager__param-item"
        :class="{
          'ticket-layout-manager__param-item--double': double
        }">
        <span 
          v-if="label" 
          class="ticket-layout-manager__param-item-label single-ellipsis">
          {{ label }}
        </span>
        <div 
          class="ticket-layout-manager__param-item-contianer"
          :class="{
            'ticket-layout-manager__param-item--not-label': !label
          }">
          <slot name="default"></slot>
        </div>
      </div>
    `
  }
});