define([
  'incss!components/week-checkbox-group/styles/index.css'
], function() {
  'use strict';
  
  return {
    name: 'WeekCheckboxGroup',

    props: {
      value: {
        type: Array,
        default: function () {
          return [];
        }
      },

      mode: {
        // required: true,
        type: String,
        default: 'week',
        validate: function (value) {
          return ['week', 'holiday'].indexOf(value) > -1;
        }
      },

      allowSwitch: {
        type: Boolean,
        default: true
      }
    },

    data: function () {
      return {
        // localMode: this.mode,
        weekOption: [
          {
            label: '周一',
            value: 'Monday'
          }, 
          {
            label: '周二',
            value: 'Tuesday'
          }, 
          {
            label: '周三',
            value: 'Wednsday'
          }, 
          {
            label: '周四',
            value: 'Thursday'
          }, 
          {
            label: '周五',
            value: 'Friday'
          }, 
          {
            label: '周六',
            value: 'Saturday'
          }, 
          {
            label: '周日',
            value: 'Sunday'
          }
        ],

        holidayOption: [
          {
            label: '平日',
            value: 'FlatDay'
          }, 
          {
            label: '周末',
            value: 'Weekend'
          },
          {
            label: '节日',
            value: 'Holiday'
          },
        ]
      };
    },

    watch: {
      mode: function (val) {
        this.localMode = val;
      }
    },

    computed: {
      optionOfGroup: function () {
        return this.localMode === 'week' ? this.weekOption : this.holidayOption;
      },

      localValue: {
        get: function () {
          return this.value;
        },

        set: function (val) {
          this.$emit('input', val);
        }
      },

      localMode: {
        get: function () {
          return this.mode;
        },

        set: function (val) {
          this.$emit('update:mode', val);
        }
      }
    },

    methods: {
      handleModeChange: function () {
        this.localMode = this.localMode === 'week' ? 'holiday' : 'week';
        this.localValue = [];
      }
    },

    template: `
      <ych-card
        class="week-checkbox-group"
        width="95%"
        height="30px">
        <div class="week-checkbox-group__container">
          <el-checkbox-group 
            class="week-checkbox-group__list" 
            v-model="localValue">
            <el-checkbox 
              v-for="option in optionOfGroup"
              :key="option.value"
              :label="option.value">
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>

          <el-button 
            v-if="allowSwitch"
            class="week-checkbox-group__change-btn"
            @click="handleModeChange"
            size="mini" 
            type="text">
            <i class="el-icon-sort"></i>
            {{ localMode === 'week' ? '节假日' : '星期' }}
          </el-button>
        </div>
      </ych-card>
    `
  }
});