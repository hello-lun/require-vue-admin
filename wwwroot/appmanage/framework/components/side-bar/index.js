define([
  'vue',
  'framework/core/router',
  'incss!framework/components/side-bar/index.css'
], function(Vue, router) {
  'use strict';
 
  var _sideBarComponent = {
    name: "sideBar",
    
    data: function () {
      return {
        toggle: false,
        loading: false,
        options: {
          title: '',
          size: 0,
          comps: [],
          compsData: {},
          successFn: null,
          cancelFn: null,
          hiddenFn: null,
          operation: []
        },

        compoenntsShow: false
      };
    },

    watch: {
      'toggle': function (val) {
        val || (this.options.hiddenFn && this.options.hiddenFn());
      }
    },

    beforeDestroy: function () {
      this.$el.parentNode.removeChild(this.$el);
    },

    methods: {
      init: function (options) {
        options = options || {};

        // var sizeMap = {
        //   small: '600px',
        //   medium: '900px',
        //   large: '1200px'
        // };

        this.options = {
          title: options.title || '',
          // size: sizeMap[options.size] || '640px',
          size: '640px',
          comps: options.modules || [],
          compsData: options.datas || {},
          successFn: options.success || null,
          cancelFn: options.cancel || null,
          hiddenFn: options.hidden || null,
          operation: options.operation || [],
        }

        return this;
      },

      afterLeave: function () {
        this.$destroy();
      },

      afterEnter: function () {
        this.compoenntsShow = true;
      },

      show: function () {
        this.toggle && this.close();

        var that = this;
        this.$nextTick(function () {
          that.toggle = true;
        });
      },

      close: function () {
        this.toggle = false;
        var self = this;
      },

      cancel: function () {
        this.close();
        this.options.cancelFn && this.options.cancelFn();
      },

      handleOperationClickEvent: function (operation) {
        
        var that = this,
            res = {},
            comps = _.keys(this.options.comps) || [],
            len = comps.length;
        this.loading = true;
        for (var i = 0; i < comps.length; i++) {
          // var item = comps[i];
          // var validFn = this.$refs[item][0].validForm;
          // validFn && validFn(operation, function (itemName, data) {
          //   if (itemName === false) {
          //     that.loading = false;
          //     return false;
          //   }
          //   res[itemName] = data;
          //   (--len === 0) && that.complete(res);
          // });
          var item = comps[i],
              componentFn = this.$refs[item][0].$_sidebarForm_valid;
              
          componentFn && componentFn(operation).then(function (itemName, data) {
            res[itemName] = data;
            (--len === 0) && that.complete(res);
          }, function () {
            that.loading = false;
          });

        }
      },

      complete: function (res) {
        this.loading = false;
        this.close();
        this.options.successFn && this.options.successFn(res); 
      }
    },

    template: `
      <transition 
        name="bounce"
        @after-enter="afterEnter"
        @after-leave="afterLeave">
        <div 
          v-show="toggle" 
          class="ych-side-bar"
          v-loading="loading"
          element-loading-text="处理中..."
          element-loading-spinner="el-icon-loading">
          <div class="side-bar-header">
            <h4 v-text="options.title"></h4>
            <div class="side-form-btn">
              <el-button 
                v-for="item in options.operation"
                @click="handleOperationClickEvent(item.value)"
                :key="item.value"
                :type="item.type || 'primary'"
                v-text="item.label"
                size="small" plain>
              </el-button>
              <el-button size="small" @click="cancel" plain>关闭</el-button>
            </div>
          </div>
          
          <div class="side-modules-form" :style="{width: options.size}">
            <template v-for="(val, key) in options.comps">
              <div class="side-module" :key="key">
                <div 
                  v-if="val.title" 
                  class="form-line" 
                  v-text="val.title">
                </div>
                <transition name="el-fade-in">
                  <component
                    v-if="compoenntsShow"
                    :is="key" 
                    :ref="key" 
                    :incoming-data="options.compsData || {}">
                  </component>
                </transition>
              </div>
            </template>
          </div>
          
        </div>
      </transition>`
  };

  var optionsHandler = function (options) {
    var registerComponents = {},
        resetOptModules = {},
        optModules = options.modules || [];

    _.each(optModules, function (item, index) {
      var optComponent = item.component || {};
      if (!optComponent.name) {
        console.warn(`侧栏的配置组件"${item.title}"对象, 未定义必要属性name`);
      }
      
      registerComponents[optComponent.name] = optComponent;
      // 格式化，有助于sideBar组件的处理
      resetOptModules[optComponent.name] = item;
    });

    return [registerComponents, resetOptModules];
  }

  var extendsSidebar = function (registerComponents) {
    var SideBarConstructor = Vue.extend({
      router: router,
      extends: _sideBarComponent,
      components: registerComponents
    });
    return new SideBarConstructor({
      el: document.createElement('div')
    });
  }

  var init = function (options) {
    var arr = optionsHandler(options);
    options.modules = arr[1];
    
    var sideBarInstance = extendsSidebar(arr[0]);
    // 初始化侧栏配置
    sideBarInstance.init(options);

    var el = document.getElementsByClassName('ych-page-container')[0].childNodes[0],
        // 移除上一个SideBar
        preSideBar = el.querySelector('.ych-side-bar');
    
    if (preSideBar) {
      el.replaceChild(sideBarInstance.$el, preSideBar);
    } else {
      el.appendChild(sideBarInstance.$el);
    }
    
    return sideBarInstance;
  }

  return init;
});