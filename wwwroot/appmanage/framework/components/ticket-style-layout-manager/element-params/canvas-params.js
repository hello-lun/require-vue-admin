define([
  'components/ticket-style-layout-manager/param-panel',
  'components/ticket-style-layout-manager/param-item'
], function(
  ParamPanel,
  ParamItem
) {
  'use strict';
  
  return {
    name: 'CanvasParams',

    components: {
      ParamPanel: ParamPanel,
      ParamItem: ParamItem
    },

    props: {
      // canvas宽度
      width: {
        type: Number,
        default: 58
      },
      // canvas高度
      height: {
        type: Number,
        default: 300
      },
      // 内容旋转角度
      rotating: {
        type: Number,
        default: 0
      }
    },

    data: function () {
      return {
        // 尺寸类型
        sizeTypes: [
          {
            name: '58mm卷纸',
            value: 58,
            width: 58,
            height: 300
          }, {
            name: '80mm卷纸',
            value: 80,
            width: 80,
            height: 400
          }, {
            name: '24mm腕带',
            value: 24,
            width: 250,
            height: 24
          }, {
            name: '25mm腕带',
            value: 25,
            width: 291,
            height: 25
          }, {
            name: '30mm腕带',
            value: 30,
            width: 200,
            height: 30
          }
        ],
        
        angles: [
          {
            label: '0°',
            value: 0,
          }, {
            label: '90°',
            value: 90,
          }, {
            label: '180°',
            value: 180
          }
        ]
      };
    },

    computed: {
      type: {
        get: function () {
          var self = this;
          var sizeInfo = _.find(self.sizeTypes, function (item) {
            return (
              self.localWidth === item.width 
              && self.localHeight === item.height
            );
          });

          return sizeInfo ? sizeInfo.value : 'custom';
        },
        
        set: function (val) {
          var self = this;
          var sizeInfo = _.find(self.sizeTypes, function (item) {
            return val === item.value;
          });

          if (sizeInfo) {
            self.localWidth = sizeInfo.width;
            self.localHeight = sizeInfo.height;
          }
        }
      },

      localWidth: {
        get: function () {
          return this.width || 58;
        },

        set: function (val) {
          this.$emit('update:width', val);
        }
      },

      localHeight: {
        get: function () {
          return this.height || 300;
        },

        set: function (val) {
          this.$emit('update:height', val);
        }
      },

      localRotating: {
        get: function () {
          return this.rotating;
        },

        set: function (val) {
          this.$emit('update:rotating', val);
        }
      }
    },

    template: `
      <param-panel title="纸张">
        <param-item label="宽度(mm)">
          <ych-input-number v-model="localWidth">
          </ych-input-number>
        </param-item>

        <param-item label="高度(mm)">
          <ych-input-number v-model="localHeight">
          </ych-input-number>
        </param-item>

        <param-item label="尺寸" double>
          <el-select 
            v-model="type"
            size="mini">
            <el-option
              label="自定义"
              value="custom">
            </el-option>

            <el-option
              v-for="item in sizeTypes"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </param-item>

        <param-item label="旋转">
          <el-select 
            v-model="localRotating"
            size="mini">
            <el-option
              v-for="item in angles"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </param-item>
      </param-panel>
    `
  }
});