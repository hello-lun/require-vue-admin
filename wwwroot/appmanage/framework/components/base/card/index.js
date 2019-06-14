define([
  'incss!components/base/card/styles/index.css'
], function() {
  'use strict';
  
  var Card = {
    name: 'YchCard',

    props: {
      type: {
        type: String,
        default: 'normal',
        validator: function (value) {
          return ['normal', 'add'].indexOf(value) > -1;
        }
      },

      width: {
        type: [String, Number],
        default: '150px'
      },

      height: {
        type: [String, Number],
        default: '140px'
      },

      shadow: {
        type: String,
        default: 'never',
        validator: function (value) {
          return ['always', 'hover', 'never'].indexOf(value) > -1;
        }
      },
      // 
      mask: {
        type: Boolean,
        default: false
      },

      actionBtns: {
        type: Boolean,
        default: false
      },

      actionBtnsList: {
        type: Array,
        default: function () {
          return [];
        }
      },

      headerDivider: {
        type: Boolean,
        default: false
      },

      footerDivider: {
        type: Boolean,
        default: false
      },

      headerStyle: {
        type: Object,
        default: function () {
          return {}
        }
      },

      border: {
        type: Boolean,
        default: true
      }
    },

    computed: {
      mergeHeaderStyles: function () {
        var width = this.width,
            height = this.height;

        return _.assign({}, {
          'width': typeof width === 'string' ? width : width + 'px',
          'height': typeof height === 'string' ? height : height + 'px',
          'background-color': '#fff'
        }, this.headerStyle);
      },

      actionBtnsTop2: function () {
        return _.slice(this.actionBtnsList, 0, 3);
      }
    },

    data: function () {
      return {

      };
    },
    
    methods: {
      handleActionBtnsClick: function (key) {
        this.$emit('action-btns-click', key);
      }
    },

    template: `
      <el-card 
        class="ych-card"
        :shadow="shadow"
        :class="{
          'no-header': !$slots.header,
          'no-header-divider': !headerDivider,
          'no-footer-divider': !footerDivider,
          'no-border': !border
        }"
        :style="mergeHeaderStyles">
        
        <template slot="header">
          <slot name="header"></slot>
        </template>

        <div class="ych-card__container">
          <div class="ych-card__body">
            <slot name="default">
              <template v-if="type === 'add'">
                <i class="el-icon-plus"></i>
                <span>添加</span>
              </template>
            </slot>
          </div>
          <div v-if="$slots.footer || actionBtns" class="ych-card__footer">
            <slot name="footer">
              <el-button-group 
                v-if="actionBtns" 
                class="ych-card__action-btns">
                <el-button 
                  v-for="btn in actionBtnsTop2" 
                  @click="handleActionBtnsClick(btn.key)"
                  :key="btn.key"
                  :data-value="btn.key"
                  size="mini">
                  {{ btn.label }}
                </el-button>
              </el-button-group>
            </slot>
          </div>
        </div>

        <div v-if="mask" class="ych-card__mask">
          <slot name="mask">
          </slot>
        </div>

      </el-card>
    `
  }

  Card.install = function (Vue) {
    Vue.component(Card.name, Card);
  };

  return Card;
});