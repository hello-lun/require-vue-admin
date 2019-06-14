define([
], function() {
  'use strict';

  return  {
    name: 'SelectTimeUnit',

    props: {
      value: {
        required: true,
        type: String
      },
    },

    data: function () {
      var TIME_UNIT = {
        Hour: '小时',
        Day: '天',
        Month: '月',
        Year: '年'
      };

      return {
        timeUnit: TIME_UNIT
      };
    },

    computed: {
      localValue: {
        get: function () {
          return this.value;
        },

        set: function (value) {
          this.$emit('input', value);
        }
      }
    },

    template: `
      <el-select style="width: 50px;" v-model="localValue">
        <el-option
          v-for="(label, key) in timeUnit"
          :key="key"
          :value="key"
          :label="label">
        </el-option>
      </el-select>
    `
  }
});