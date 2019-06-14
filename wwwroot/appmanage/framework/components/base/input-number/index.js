define([
  'incss!components/base/input-number/styles/index.css'
], function() {
  'use strict';
  
  var InputNumber = {
    name: 'YchInputNumber',

    props: {
      value: '',
      min: {
        type: Number
      },

      max: {
        type: Number
      },

      step: {
        type: Number,
        default: 1
      },

      size: {
        type: String,
        default: 'mini'
      },

      label: {
        type: String
      },

      disabled: {
        type: Boolean,
        default: false
      },

      percentage: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      localValue: {
        get: function () {
          return this.value;
        },

        set: function (val) {
          this.$emit('input', val);
        }
      },

      localMax: function () {
        var val = this.max;

        if (this.percentage) {
          val = 1;
        }

        return val;
      },

      localMin: function () {
        var val = this.min;

        if (this.percentage) {
          val = 0;
        }

        return val;
      },

      localStep: function () {
        var val = this.step;

        if (this.percentage) {
          val = 0.1;
        }

        return val;
      }
    },

    methods: {
      handelChangeEvent: function (val) {
        this.$emit('change', val);
      },

      handleBlurEvent: function (event) {
        this.$emit('blur', event);
      },

      handleFocusEvent: function (event) {
        this.$emit('focus', event);
      },

      focus: function () {
        this.$refs.input.foucus();
      }
    },

    template: `
      <div 
        class="ych-input-number"
        :class="{
          'ych-input-number--group': $slots.append
        }">
        <el-input-number 
          ref="input"
          v-model="localValue"
          @change="handelChangeEvent"
          @blur="handleBlurEvent"
          @focus="handleBlurEvent"
          class="ych-input-number__input"
          :controls="false"
          :min="localMin"
          :max="localMax"
          :step="localStep"
          :size="size"
          :label="label"
          :disabled="disabled">
        </el-input-number>
        <span class="ych-input-number__append" v-if="$slots.append">
          <slot name="append">
          </slot>
        </span>
      </div>
    `
  }

  InputNumber.install = function (Vue) {
    Vue.component(InputNumber.name, InputNumber);
  }

  return InputNumber;

});