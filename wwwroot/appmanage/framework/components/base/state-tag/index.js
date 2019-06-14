define([
  'incss!components/base/state-tag/styles/index.css'
], function () {
  'use strict';

  var StateTag = {
    name: 'YchStateTag',

    props: {
      text: {
        type: String
      },

      bigger: {
        type: Boolean,
        default: false
      },

      state: {
        type: String,
        default: 'primary',
        validator: function (value) {
          return ['primary', 'success', 'info', 'warning', 'danger'].indexOf(value) > -1;
        }
      }
    },

    template: `
      <div class="ych-state-tag">
        <span 
          class="ych-state-tag__circular"
          :class="[
            state,
            bigger ? 'is-bigger' : ''
          ]">
        </span>
        {{ text }}
      </div>
    `
  }

  StateTag.install = function (Vue) {
    Vue.component(StateTag.name, StateTag);
  };

  return StateTag;
});