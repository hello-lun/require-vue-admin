;(function () {
  'use strict';
  // if ('undefined' == typeof jQuery) {
  //   throw new Error("请引入jQuery,因自定义报表依赖jQuery的ajax!");
  // }

  var _customApi = '/customquery/query';
  var _globalConf = typeof REPORT_GLOBAL_CONFIG === 'undefined' ? {} : REPORT_GLOBAL_CONFIG;

  Array.prototype.unique = function () {
    var res = [];
    var json = {};
    for (var i = 0; i < this.length; i++) {
      if (!json[this[i]]) {
        res.push(this[i]);
        json[this[i]] = 1;
      }
    }
    return res;
  };

  Date.prototype.formatToDate = function () {
    var date = this;
    this.setHours(0);
    this.setMinutes(0);
    this.setSeconds(0);
    this.setMilliseconds(0);
    return this;
  }

  Number.prototype.formatMoney = function (places, symbol, thousand, decimal) {
    places = isNaN(places = Math.abs(places)) ? 2 : places;
    symbol = symbol || "";
    thousand = thousand || ",";
    decimal = decimal || ".";
    var number = this,
      negative = number < 0 ? "-" : "",
      i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
      j = 0;
    j = (j = i.length) > 3 ? j % 3 : 0;
    return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
  };


  // 监听事件绑定
  var on = function (element, event, handler) {
    if (element && event && handler) {
      element.addEventListener(event, handler, false);
    }
  }

  /**
   * v-clickoutside
   * @desc 点击元素外面才会触发的事件
   * @example
   * ```vue
   * <div v-clickoutside="handleClose">
   * ```
   */
  var _clickoutside = function () {
    var nodeList = [];
    var ctx = '@@clickoutsideContext';
    // 记录当前点击的事件返回值
    var startClick;

    // 监听document 的鼠标点击事件
    on(document, 'mousedown', function (e) {
      startClick = e;
    });

    // 监听document 的鼠标点击事件
    on(document, 'mouseup', function (e) {
      for (var i = 0; i < nodeList.length; i++) {
        var node = nodeList[i];
        node[ctx].documentHandler(e, startClick);
      }
    });

    return {
      bind: function (el, binding, vnode) {
        var id = nodeList.push(el) - 1;
        var documentHandler = function (mouseup, mousedown) {
          mouseup = mouseup || {};
          mousedown = mousedown || {};

          // var monthdayDom = el.parentNode;

          if (!vnode.context ||
            !mouseup.target ||
            !mousedown.target ||
            el.contains(mouseup.target) ||
            el.contains(mousedown.target) ||
            // monthdayDom.contains(mouseup.target) ||
            el === mouseup.target ||
            (vnode.context.popperElm &&
              (vnode.context.popperElm.contains(mouseup.target) ||
                vnode.context.popperElm.contains(mousedown.target)))) return;

          if (binding.expression &&
            el[ctx].methodName &&
            vnode.context[el[ctx].methodName]) {
            vnode.context[el[ctx].methodName]();
          } else {
            el[ctx].bindingFn && el[ctx].bindingFn();
          }
        };
        el[ctx] = {
          id: id,
          documentHandler: documentHandler,
          methodName: binding.expression,
          bindingFn: binding.value
        };
      },

      update: function (el, binding) {
        el[ctx].methodName = binding.expression;
        el[ctx].bindingFn = binding.value;
      },

      unbind: function (el) {
        var len = nodeList.length;

        for (var i = 0; i < len; i++) {
          if (nodeList[i][ctx].id === el[ctx].id) {
            nodeList.splice(i, 1);
            break;
          }
        }
      }
    }
  };


  /**
   * 查询条件组件mixin
   *
   * @prop label:String   名称
   * @prop defaultValue:any   默认值
   * @prop placeholder:String   说明
   */
  var _conditionMixin = {
    created: function () {
      // 默认值， 需要等待数据更新完后再设置默认值
      var self = this;
      // 处理默认查询，没有默认值的问题
      self.$root.asyncLoading++;
      Vue.nextTick(function () {
        // 默认值为数组时
        self.localValue = Array.isArray(self.value) ? (self.value.length > 0 ? self.value : self.defaultValue) : (self.value || self.defaultValue);

        self.$root.asyncLoading--;
      });
    },
    props: {
      value: '',
      defaultValue: '',
      label: String,
      placeholder: String
    },
    computed: {
      localValue: {
        get: function () {
          return this.value;
        },
        set: function (val) {
          this.$emit('input', val);
        }
      }
    },
    methods: {
      conditionAjax: function (postData, success, error) {
        var self = this;
        this.$root.asyncLoading++;
        _ajaxCustom(postData, function (res) {
          success && success(res);
          self.$root.asyncLoading--;
        }, function () {
          error && error();
          self.$root.asyncLoading--;
        });
      }
    }
  };

  /**
   * 符号选择mixin
   */
  var _symbolMixin = {
    data: function () {
      return {
        symbolsMap: {
          'eq': {
            value: '=',
            name: '等于'
          },
          'neq': {
            value: '≠',
            name: '不等于'
          },
          'ge': {
            value: '≥',
            name: '大于等于'
          },
          'le': {
            value: '≤',
            name: '小于等于'
          },
          'like': {
            value: '≈',
            name: '类似'
          },
          'rg': {
            value: '[ ]',
            name: '区间'
          },
          'nulls': {
            value: '空',
            name: '空值'
          },
          'all': {
            value: '全',
            name: '全部'
          }
        }
      };
    },
    props: {
      symbols: {
        type: Array,
        default: function () {
          return [];
        }
      },
      symbol: String
    },
    computed: {
      localValue: {
        get: function () {
          // 初始化将默认的符号值传到父组件
          this.symbol || this.$emit('update:symbol', this.firstSymbolValue);
          return this.value;
        },
        set: function (val) {
          this.$emit('input', val);
        }
      },
      // 符号数组中的第一个的值
      firstSymbolValue: function () {
        return Object.keys(this.showSymbols)[0];
      },
      // 符号数组中的第一个对象
      firstSymbol: function () {
        return this.showSymbols[Object.keys(this.showSymbols)[0]];
      },
      selectedSymbol: function () {
        return this.symbolsMap[this.symbol] || this.firstSymbol;
      },
      // 最终要显示的符号组
      finalSymbols: function () {
        var arr = ['eq', 'neq', 'ge', 'le'];
        return this.symbols.length > 0 ? this.symbols : arr;
      },
      // 显示的符号对象
      showSymbols: function () {
        var map = {};
        var symbols = this.finalSymbols;
        // 将符号标记数组 转为 完整符号对象
        for (var i = 0; i < symbols.length; i++) {
          for (var key in this.symbolsMap) {
            if (symbols[i] === key) {
              map[key] = this.symbolsMap[key];
              break;
            }
          }
        }
        return map;
      }
    },
    methods: {
      symbolMenuClick: function (val) {
        this.$emit('update:symbol', val);
      }
    }
  }

  /**
   * 普通输入框
   *
   * @mixins  [conditionMixin]
   */
  var _inputNormal = {
    template: `<el-form-item :label="label">
                <el-input 
                  v-model="localValue" 
                  :placeholder="placeholder">
                </el-input>
              </el-form-item>`,
    mixins: [_conditionMixin]
  };

  /**
   * 读取会员卡号
   */
  var _leaguerCard = {
    template: `<el-form-item class="ych-leaguer-card" :label="label">
                  <el-input v-model="localValue" :placeholder="placeholder">
                    <el-tooltip 
                        slot="append" 
                        :manual="true"
                        :value="tooltipShow"
                        :content="errMsg" 
                        placement="right">
                      <el-button size="mini" @click="getLeaguerCardNo" >
                          <img src="../img/iccard.png">
                      </el-button>
                    </el-tooltip>
                    <el-dropdown 
                        slot="prepend"
                        menu-align="start"
                        trigger="hover"
                        @command="symbolMenuClick">
                      <span class="input-than-symbol">
                        <i v-text="selectedSymbol['value']"></i>
                      </span>
                      <el-dropdown-menu 
                        class="input-than-symbol-menu" 
                        slot="dropdown">
                        <el-dropdown-item 
                            v-for="(item, key) in showSymbols" 
                            :key="key"
                            :command="key">
                          <span v-text="item.value"></span>
                          {{ item.name }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </el-input>
                </el-form-item>`,
    mixins: [_conditionMixin, _symbolMixin],
    data: function () {
      return {
        errMsg: '',
        tooltipShow: false
      };
    },
    computed: {
      finalSymbols: function () {
        return ['like', 'eq'];
      }
    },
    methods: {
      getLeaguerCardNo: function () {
        this.$el.querySelector('input').focus();

        // 判断存在读卡方法
        if (!window.external['card_GetPrintNumber']) return;

        window.external.card_Beep();
        var id = window.external.card_GetLgCardID();//获取会员卡芯片ID

        if (id) {
          var code = window.external.card_GetPrintNumber();//获取会员卡号
          // 如果没有获取到卡号，再次读卡，降低失败率
          this.localValue = code || window.external.card_GetPrintNumber();
          this.selected = 'eq';
          this.$emit('update:symbol', 'eq');
        } else {
          this.errMsg = window.external.card_GetLastErr();//获取错误信息
          this.tooltipShow = true;
          var self = this;
          setTimeout(function () {
            self.tooltipShow = false;
          }, 2000);
        }
      }
    }
  };

  /**
   * 支持比较符输入框
   *
   * @mixins  [conditionMixin]
   *
   * @prop valueType:String   值类型主要用作显示不同的比较符号，可选参数'string', 'number'
   * @prop symbol.sync:String    比较符号值，可选参数'eq', 'neq', 'ge', 'le', 'like'
   *
   * @event menuClick 比较符号菜单项点击事件
   * -return 点击项的符号值
   */
  var _inputCompare = {
    template: `<el-form-item :label="label">
              <el-input 
                v-model="localValue"
                @change="handleChange"
                class="input-compare" 
                :placeholder="placeholder">
                <el-dropdown 
                    slot="prepend"
                    menu-align="start"
                    trigger="hover"
                    @command="symbolMenuClick">
                  <span class="input-than-symbol">
                    <i v-text="selectedSymbol['value']"></i>
                  </span>
                  <el-dropdown-menu 
                    class="input-than-symbol-menu" 
                    slot="dropdown">
                    <el-dropdown-item 
                        v-for="(item, key) in showSymbols" 
                        :key="key"
                        :command="key">
                      <span v-text="item.value"></span>
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </el-input>
            </el-form-item>`,
    mixins: [_conditionMixin, _symbolMixin],
    props: {
      dataType: String
    },
    computed: {
      finalSymbols: function () {
        var arr = ['Int32', 'Decimal'].indexOf(this.dataType) > -1 ? ['eq', 'neq', 'ge', 'le'] : ['like', 'eq', 'neq'];

        return this.symbols.length > 0 ? this.symbols : arr;
      }
    },

    watch: {
      'localValue': function (val, oldVal) {
        if (val === '' ||
          val === null ||
          this.finalSymbols.indexOf('nulls') < 0) return;

        this.$emit('update:symbol', this.finalSymbols[0]);
      }
    },

    methods: {
      symbolMenuClick: function (val) {
        ('nulls' === val) && (this.localValue = '');
        this.$emit('update:symbol', val);
      },

      handleChange: function (val) {
        var self = this;
        if (['Decimal', 'Int32'].indexOf(self.dataType) > -1) {
          this.$nextTick(function () {
            var newVal = Number(val);
            isNaN(newVal) && self.$emit('input', '');
          });
        }
      }
    }
  };


  /**
   * 普通下拉单选框
   *
   * @mixins  [conditionMixin]
   *
   * @prop source:[Array,String]    下拉数据源对象 或 请求地址
   * 接口返回数据格式（直接传入数据对象只需要Data部分）：
   */
  var _selectNormal = {
    template: `<el-form-item class="ych-select" :label="label">
                <el-dropdown
                  v-if="!multiple"
                  menu-align="start"
                  trigger="hover"
                  @command="symbolMenuClick">
                  <span class="input-than-symbol" >
                    <i v-text="selectedSymbol['value']"></i>
                  </span>
                  <el-dropdown-menu 
                    class="input-than-symbol-menu" 
                    slot="dropdown">
                    <el-dropdown-item
                      v-for="(item, key) in showSymbols"
                      :key="key"
                      :command="key">
                      <span v-text="item.value"></span>
                      {{ item.name }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-select 
                  v-model="localValue"
                  :style="{'width': multiple ? '100%' : false}"
                  :placeholder="placeholder"
                  :allow-create="allowCreate"
                  :multiple="multiple"
                  clearable filterable>
                      
                  <template v-if="isGroups">
                    <el-option-group
                      v-for="group in optionsData"
                      :key="group.ID"
                      :label="group.Name">
                      <el-option
                        v-for="item in group.subClass"
                        :key="item.ID"
                        :label="item.Name"
                        :value="item.ID">
                      </el-option>
                    </el-option-group>
                  </template>

                  <template v-else>
                    <el-option
                      v-for="item in optionsData"
                      :key="item.ID"
                      :label="item.Name"
                      :value="item.ID">
                    </el-option>
                  </template>
                </el-select>
            </el-form-item>`,
    mixins: [_conditionMixin, _symbolMixin],
    created: function () {
      // 数据源类型为自定查询
      if (this.custom) {
        this.customSelect();
      } else if (typeof this.source === 'string') {
        this.useEnum();
      } else {
        this.optionsData = this.source;
      }
    },
    data: function () {
      return {
        optionsData: [],
        isFirstLoad: true,
        isGroups: false
      };
    },
    props: {
      source: [Array, String],
      custom: {
        type: Boolean,
        default: false
      },
      allowCreate: Boolean,
      multiple: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      finalSymbols: function () {
        return ['eq', 'all'];
      },

      localValue: {
        get: function () {
          return (this.value === '' || this.value === null) ? (this.multiple ? [] : '') : this.value;
        },
        set: function (val) {
          var changedSymobol = this.multiple ? 'isIn' : val !== '' ? 'eq' : 'all';
          if (this.symbol !== changedSymobol && !this.isFirstLoad) {
            this.$emit('update:symbol', changedSymobol);
          };

          this.isFirstLoad && (this.isFirstLoad = false);

          this.$emit('input', val);
        }
      }
    },
    methods: {
      customSelect: function () {
        var self = this;
        var obj = this.$root.customParam.dropdown[this.source];
        if (typeof obj === 'undefined') {
          return console.error('"' + this.source + '":找不到该下拉预设查询，请确认');
        }

        // 提交到后端的数据格式
        var customSelectObj = this.formatterCustomPostData(obj);

        // 发送请求
        this.conditionAjax(customSelectObj, function (res) {
          if (Number(res.ResponseStatus.ErrorCode) !== 0) return;
          var isGroup = typeof obj.fieldSuper !== 'undefined';

          var options = self.formatterOptionsData(res.List, isGroup);
          // dropdown插值
          (typeof obj.afterAchieve === 'function') && (options = obj.afterAchieve(options));

          self.optionsData = options;
          self.$nextTick(function () {
            (typeof obj.fieldSuper !== 'undefined') && (self.isGroups = true);
          })
        });
      },

      formatterCustomPostData: function (obj) {
        // dropdown 查询列表where条件
        var wheres = [];
        if (obj['wheres']) {
          for (var i = 0; i < obj.wheres.length; i++) {
            var where = obj.wheres[i];
            var item = {
              Compare: where.compare,
              Field: where.field,
              Value: where.value,
              ValueBet: where['valueBet'] || ''
            };
            wheres.push(item);
          }
        }

        // 提交到后端的数据格式
        var customSelectObj = {
          ModelType: obj.table,
          QueryCode: obj.queryCode,
          Select: [{
            Alias: 'ID',
            Field: obj.fieldId,
            StatisticsType: 'none'
          }, {
            Alias: 'Name',
            Field: obj.fieldName,
            StatisticsType: 'none'
          }],
          Wheres: wheres
        };

        // 下拉分组关联字段
        if (typeof obj.fieldSuper !== 'undefined') {
          customSelectObj.Select.push({
            Alias: 'Super',
            Field: obj.fieldSuper,
            StatisticsType: 'none'
          });
        }

        return customSelectObj;
      },

      formatterOptionsData: function (data, isGroups) {
        if (!isGroups) return data;
        var map = {};
        data.forEach(function (item) {
          map[item.ID] = item;
        });

        var top = [];
        data.forEach(function (item) {
          var superClass = map[item.Super];

          superClass ? (superClass.subClass || (superClass.subClass = [])).push(item) : top.push(item);
        });

        return top;
      },

      useEnum: function () {
        var arr = this.source.split('.'),
            str = arr[1], // 使用枚举
            obj = this.$root.customParam.enums[str];

        if (typeof obj === 'undefined') {
          return console.error('"enums.' + this.source + '":找不到该枚举值，请确认');
        } else if (typeof obj !== 'object') {
          return console.error('"' + this.source + '"不是正确的枚举值');
        }
        var optionsArr = [];
        // 因Object 会把key 自动转成String
        // 导致在处理默认值为数字时不能默认选中，
        // 所以先要做一下处理
        for (var key in obj) {
          var num = Number(key);
          key = isNaN(num) ? key : num;

          optionsArr.push({
            ID: key,
            Name: obj[key]
          });
        }

        this.optionsData = optionsArr;
      },

      handleOptionChange: function (val) {
        if (this.symbol === 'nulls' && val === '') return;

        this.$emit('update:symbol', val ? 'eq' : 'all');
      },

      symbolMenuClick: function (val) {
        (val === 'nulls' || val === 'all') && (this.localValue = '');
        this.$emit('update:symbol', val);
      }
    }
  };

  /**
   * 级联组件
   */
  var _cascader = {
    template: `
      <el-form-item class="ych-cascader" :label="label">
        <el-cascader
          v-model="localValue"
          :placeholder="placeholder"
          :props="propsMap"
          :options="opstions"
          filterable clearable
        ></el-cascader>
      </el-form-item>
    `,

    mixins: [_conditionMixin],

    mounted: function () {
      // 因级联组件与日期组件 的值 有冲突，所以级联组件要做特殊标记处理
      this.$emit('update:symbol', 'cascader');
      this.asyncGetOptions();
    },

    data: function () {
      return {
        opstions: [],
        propsMap: {
          value: 'ID',
          label: 'Name',
          children: 'children'
        }
      };
    },

    props: {
      source: String
    },

    computed: {
      localValue: {
        get: function () {
          // 初始化将默认的符号值传到父组件
          return this.value;
        },
        set: function (val) {
          this.$emit('input', val);
        }
      }
    },

    methods: {
      asyncGetOptions: function () {
        var self = this;
        var obj = this.$root.customParam.cascader[this.source];
        if (typeof obj === 'undefined') {
          throw new Error('"' + this.source + '":找不到该级联预设查询，请确认');
        }

        // 提交到后端的数据格式
        var postData = this.formatterCustomPostData(obj);

        // 发送请求
        this.conditionAjax(postData, function (res) {
          if (Number(res.ResponseStatus.ErrorCode) !== 0) return;

          var resData = res.List;
          // 插值
          (typeof obj.afterAchieve === 'function') && (self.options = obj.afterAchieve(resData));

          self.opstions = self.cascaderTree(resData);
        });
      },

      cascaderTree: function (data) {
        // 将数据存储为 以 ID 为 KEY 的 map 索引数据列
        var map = {};
        // 删除 所有 children,以防止多次调用
        data.forEach(function (item) {
          delete item.children;
          map[item.ID] = item;
        });

        var val = [];
        data.forEach(function (item) {
          // 以当前遍历项，的pid,去map对象中找到索引的id
          var parent = map[item.Super];

          // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
          // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
          parent ? (parent.children || (parent.children = [])).push(item) : val.push(item);
        });

        return val;
      },

      formatterCustomPostData: function (obj) {
        // dropdown 查询列表where条件
        var wheres = [];
        if (obj['wheres']) {
          for (var i = 0; i < obj.wheres.length; i++) {
            var where = obj.wheres[i];
            var item = {
              Compare: where.compare,
              Field: where.field,
              Value: where.value,
              ValueBet: where['valueBet'] || ''
            };
            wheres.push(item);
          }
        }

        // 提交到后端的数据格式
        var customSelectObj = {
          ModelType: obj.table,
          QueryCode: obj.queryCode,
          Select: [{
            Alias: 'ID',
            Field: obj.fieldId,
            StatisticsType: 'none'
          }, {
            Alias: 'Name',
            Field: obj.fieldName,
            StatisticsType: 'none'
          }],
          Wheres: wheres
        };

        // 下拉分组关联字段
        if (typeof obj.fieldSuper !== 'undefined') {
          customSelectObj.Select.push({
            Alias: 'Super',
            Field: obj.fieldSuper,
            StatisticsType: 'none'
          });
        }

        return customSelectObj;
      },
    }
  }

  /**
   * 日期组件
   *
   * @mixins  [conditionMixin]
   *
   * @prop symbol.sync:String   必须， 符号
   * @prop type:String    类型，可选参数year/month/date/week/ datetime/datetimerange/daterange
   * @prop pickerOptions:Object   配置参数，参考http://element.eleme.io/#/zh-CN/component/date-picker
   *
   */
  var _datePicker = {
    template: `<el-form-item :label="labelStr">
                <div class="ych-date-picker">
                  <el-dropdown 
                    menu-align="start"
                    trigger="hover"
                    @command="symbolMenuClick">
                    <span class="input-than-symbol" >
                      <i v-text="selectedSymbol['value']"></i>
                    </span>
                    <el-dropdown-menu 
                        class="input-than-symbol-menu" 
                        slot="dropdown">
                      <el-dropdown-item
                        v-for="(item, key) in showSymbols"
                        :key="key"
                        :command="key">
                        <span v-text="item.value"></span>
                        {{ item.name }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                    <el-date-picker
                       v-show="symbol === 'rg'"
                       v-model="localValue"
                       class="ych-date-picker-input"
                       :format="type === 'datetimerange' ? 'yyyy/MM/dd HH:mm:ss' : 'yyyy/MM/dd'"
                       :type="type === 'datetimerange' ? 'datetimerange' : 'daterange'"
                       align="right"
                       :placeholder="placeholder || '选择日期范围'"
                       :picker-options="options" clearable>
                    </el-date-picker>
                    <el-date-picker
                       v-show="symbol !== 'rg'"
                       v-model="localValue"
                       class="ych-date-picker-input"
                       :format="['datetime', 'datetimerange'].indexOf(type) > -1 ? 'yyyy/MM/dd HH:mm:ss' : 'yyyy/MM/dd'"
                       :type="['datetime', 'datetimerange'].indexOf(type) > -1  ? 'datetime' : 'date'"
                       align="right"
                       :placeholder="placeholder || '选择日期范围'"
                       :picker-options="options" clearable>
                    </el-date-picker>
                </div>
             </el-form-item>`,
    mixins: [_conditionMixin, _symbolMixin],
    created: function () {
      // 如果type 是账期，需要获取当前账期
      if (this.type === 'period') {
        var postData = {
          ModelType: 'Mall_Period',
          QueryCode: 'publicperiod',
          Select: [{
            Alias: 'name',
            Field: 'ClassName',
            StatisticsType: 'none'
          }],
          Sort: 'ClassTime',
          Order: 'desc',
          Page: 1,
          Rows: 1
        };
        var self = this;
        this.conditionAjax(postData, function (res) {
          if (res.ResponseStatus.ErrorCode != 0) return;
          var currentPeriod = res.List[0];
          var periodName = currentPeriod['name'];
          // 用作左侧快捷按钮
          self.periodDefault = periodName;
          self.$emit('update:symbol', 'eq');
          self.localValue = periodName || null;
        });
      }
    },
    data: function () {
      return {
        periodDefault: null,
        localType: this.$options.propsData.type
      };
    },
    props: {
      type: {
        type: String,
        default: 'date'
      }
    },
    computed: {
      labelStr: function () {
        return this.type === 'period' && !this.label ? '账期' : this.label;
      },
      localValue: {
        get: function () {
          // 初始化将默认的符号值传到父组件
          var currentSymbol = this.symbol || this.firstSymbolValue;
          var val;
          // 切换符号（组件类型）,改变值
          if (currentSymbol === 'rg') {
            val = Array.isArray(this.value) ? this.value : null;
          } else {
            val = Array.isArray(this.value) ? this.value[0] : this.value || null;
          }
          this.$emit('update:symbol', currentSymbol);
          this.$emit('input', val);
          return val;
        },
        set: function (val) {
          this.$emit('input', val || '');
        }
      },

      // daterange 时间组件的左侧栏快捷按钮
      rangeShortcuts: function () {
        var self = this;
        return [
          {
            text: '今天',
            onClick: function (picker) {
              var date = new Date();
              var dateStr = date.formatToDate();
              picker.$emit('pick', [dateStr, dateStr]);
              self.$emit('update:symbol', 'eq');
            }
          }, {
            text: '本周',
            onClick: function (picker) {
              var end = new Date();
              var start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * start.getUTCDay());
              picker.$emit('pick', [start.formatToDate(), end.formatToDate()]);
            }
          }, {
            text: '本月',
            onClick: function (picker) {
              var end = new Date();
              var start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getUTCDate() - 1));
              picker.$emit('pick', [start.formatToDate(), end.formatToDate()]);
            }
          }, {
            text: '本年',
            onClick: function (picker) {
              var end = new Date();
              var start = new Date(end.getFullYear() + '/01/01');
              picker.$emit('pick', [start.formatToDate(), end.formatToDate()]);
            }
          }
        ];
      },

      // date 时间组件的左侧栏快捷按钮
      singleShortcuts: function () {
        var self = this;
        return [
          {
            text: '今天',
            onClick: function (picker) {
              var date = new Date();
              var dateStr = date.formatToDate();
              picker.$emit('pick', dateStr);
            }
          }, {
            text: '昨天',
            onClick: function (picker) {
              var date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              var dateStr = date.formatToDate();
              picker.$emit('pick', dateStr);
            }
          }, {
            text: '一周前',
            onClick: function (picker) {
              var date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              var dateStr = date.formatToDate();
              picker.$emit('pick', dateStr);
            }
          }
        ];
      },

      periodShortcuts: function () {
        var self = this;
        return [
          {
            text: '本天',
            onClick: function (picker) {
              picker.$emit('pick', [self.periodDefault, self.periodDefault]);
              self.$emit('update:symbol', 'eq');
            }
          }, {
            text: '本周',
            onClick: function (picker) {
              var end = new Date();
              var start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * start.getUTCDay());
              self.$emit('update:symbol', 'rg');
              picker.$emit('pick', [start.formatToDate(), end.formatToDate()]);
            }
          }, {
            text: '本月',
            onClick: function (picker) {
              var end = new Date();
              var start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * (start.getUTCDate() - 1));
              self.$emit('update:symbol', 'rg');
              picker.$emit('pick', [start.formatToDate(), end.formatToDate()]);
            }
          }, {
            text: '本年',
            onClick: function (picker) {
              var end = new Date();
              var start = new Date(end.getFullYear() + '/01/01');
              self.$emit('update:symbol', 'rg');
              picker.$emit('pick', [start.formatToDate(), end.formatToDate()]);
            }
          }, {
            text: '开店至今',
            onClick: function (picker) {
              picker.$emit('pick', null);
              self.$emit('update:symbol', 'rg');
            }
          }
        ];
      },

      // 左侧栏快捷按钮配置
      options: function () {
        var self = this;
        var shortcuts = '';

        if (this.type === 'period') {
          shortcuts = this.periodShortcuts;
        } else if (['date', 'datetime'].indexOf(this.type) > -1 || this.symbol !== 'rg') {
          shortcuts = this.singleShortcuts;
        } else if (['daterange', 'datetimerange'].indexOf(this.type) > -1) {
          shortcuts = this.rangeShortcuts;
        }

        return { shortcuts: shortcuts };
      },
      finalSymbols: function () {
        var arr = ['eq', 'ge', 'le'];
        // 'rg'区间符号，只有在'daterange'才会出现
        ['daterange', 'datetimerange'].indexOf(this.elType) > -1 && arr.unshift('rg');

        return this.symbols.length > 0 ? this.symbols : arr;
      },
      elType: function () {
        return this.type === 'period' ? 'daterange' : this.type;
      }
    }
  };


  var _mAdPanel = {
    template: `
      <transition name="el-zoom-in-top">
        <div
          v-show="currentVisible"
          class="el-time-panel ych-month-day">
          <div class="el-time-panel__content">
            <el-scrollbar 
              tag="ul"
              ref="month"
              wrapClass="ych-md-wrap" 
              viewClass="el-time-spinner__list">
              <li 
                v-for="n in 12"
                @click="handleMonthClick(n)"
                :class="{'selected': currentM === n}"
                class="el-time-spinner__item">
                {{ n }}
              </li>
            </el-scrollbar>
            <el-scrollbar 
              tag="ul"
              ref="day"
              wrapClass="ych-md-wrap" 
              viewClass="el-time-spinner__list">
              <li 
                @click="handleDayClick(0)"
                :class="{'selected': currentD === 0}"
                class="el-time-spinner__item">
                0
              </li>
              <li 
                v-for="n in 31"
                @click="handleDayClick(n)"
                :class="{'selected': currentD === n}"
                class="el-time-spinner__item">
                {{ n }}
              </li>
            </el-scrollbar>
          </div>
          <div class="el-time-panel__footer">
            <button
              type="button"
              class="el-time-panel__btn cancel"
              @click="handleCancel">取消</button>
            <button
              type="button"
              class="el-time-panel__btn confirm"
              @click="handleConfirm">确定</button>
          </div>
        </div>
      </transition>`,
    mounted: function () {
    },
    data: function () {
      return {
        privateM: '',
        privateD: ''
      };
    },
    props: {
      value: {
        type: String,
        defalut: ''
      },
      visible: Boolean
    },
    computed: {
      currentVisible: {
        get: function () {
          if (this.visible) {
            var month = this.value ? this.value.substr(0, 2) : '';
            var day = this.value ? this.value.substr(2, 2) : 0;

            var self = this;
            this.$nextTick(function () {
              self.$refs.month.wrap.scrollTop = Math.max(0, (Number(month) - 3) * 32 + 64);
              self.$refs.day.wrap.scrollTop = Math.max(0, (Number(day) - 2) * 32 + 64);
            });
          }

          return this.visible;
        },

        set: function (val) {
          this.$emit('update:visible', val);
        }
      },
      currentM: {
        get: function () {
          var month = this.value ? this.value.substr(0, 2) : 0;
          return Number(this.privateM || month || 1);
        },

        set: function (val) {
          this.privateM = this.pad(val, 2);
          this.$refs.month.wrap.scrollTop = Math.max(0, (val - 3) * 32 + 64);
        }
      },

      currentD: {
        get: function () {
          var day = this.value ? this.value.substr(2, 2) : 0;
          return Number(this.privateD || day || 0);
        },

        set: function (val) {
          this.privateD = this.pad(val, 2);
          this.$refs.day.wrap.scrollTop = Math.max(0, (val - 2) * 32 + 64);
        }
      }
    },

    watch: {
      visible: function (val) {
        if (val === false) {
          this.privateM = null;
          this.privateD = null;
        }
      }
    },

    methods: {
      handleMonthClick: function (val) {
        this.currentM = val;
      },

      handleDayClick: function (val) {
        this.currentD = val;
      },

      handleCancel: function () {
        this.currentVisible = false;
      },

      handleConfirm: function () {
        var day = Number(this.currentD) !== 0 ? this.pad(this.currentD, 2) : ''
        var month = this.pad(this.currentM, 2);
        this.$emit('input', String(month) + String(day));
        this.currentVisible = false;
      },
      pad: function (num, n) {
        var len = num.toString().length;
        while (len < n) {
          num = "0" + num;
          len++;
        }
        return num;
      }
    }
  }

  var _mAdPicker = {
    template: `
      <div v-clickoutside="handleClickOutside" class="ych-mAd-picker">
        <el-input
          placeholder="请选择日期"
          v-model="localValue"
          @focus="panelVisible = true">
          <i slot="suffix" @click="onIconClick" class="el-input__icon" :class="[inputIcon]"></i>
        </el-input>
        <mad-panel v-model="localValue" :visible.sync="panelVisible"></mad-panel>
      </div>
    `,

    mounted: function () {
      this.handleInputIconEvent();
    },

    data: function () {
      return {
        panelVisible: false,
        inputIcon: 'el-icon-date'
      };
    },

    directives: {
      Clickoutside: _clickoutside()
    },

    props: ['value'],
    computed: {
      localValue: {
        get: function () {
          return this.value;
        },
        set: function (val) {
          this.$emit('input', val);
        }
      }
    },
    methods: {
      handleClickOutside: function () {
        this.panelVisible = false;
      },

      onIconClick: function () {
        if (this.localValue) {
          this.localValue = '';
          this.panelVisible = false;
        } else {
          this.panelVisible = !this.panelVisible;
        }
      },

      handleInputIconEvent: function () {
        var self = this;
        // var iconEl = this.$el.querySelector('.el-input__icon');
        var iconEl = this.$el;

        on(iconEl, 'mouseover', function () {
          if (self.localValue) {
            self.inputIcon = 'el-icon-circle-close';
          }
        });

        on(iconEl, 'mouseout', function () {
          self.inputIcon = 'el-icon-date';
        });
      }
    },
    components: {
      'mad-panel': _mAdPanel
    }
  };

  var _selectMD = {
    template: `<el-form-item :label="label">
                <mAdPicker 
                    v-model="localValue" 
                    :placeholder="placeholder">
                </mAdPicker>
            </el-form-item>`,
    mixins: [_conditionMixin],
    computed: {
      localValue: {
        get: function () {
          return this.value;
        },
        set: function (val) {
          var symbol = val && val.length < 4 ? 'rightlike' : 'eq';
          this.$emit('update:symbol', symbol);
          this.$emit('input', val);
        }
      }
    },
    components: {
      'mAdPicker': _mAdPicker
    }
  }

  /**
   * 自定义报表的表格部分
   *
   */
  var _reportsTable = {
    template: `<div class="ych-reports-table">
              <div class="ych-reports-table-tab">
                <el-tabs
                  v-loading="tableLoading"
                  :value="currentTab"
                  @tab-click="tabClick">
                  <el-tab-pane
                    v-for="(group, $index) in groups"
                    :label="group.name"
                    :id="group.tableName + '*' + $index"
                    :key="group.tableName + '*' + $index"
                    :name="group.tableName + '*' + $index">
                    <el-table
                      style="width: 100%"
                      header-cell-class-name="ych-table-header"
                      cell-class-name="ych-table-cell"
                      :height="maxHeight"
                      :data="tableData[currentTab] ? tableData[currentTab].List : []"
                      :sum-text="group['statText'] || '合计'"
                      :show-summary="Boolean(group['showStat'])"
                      :summary-method="group['showStat'] && (group.tableName + '*' + $index) === currentTab ? getStatData : null"
                      :span-method="(currentTab === group.tableName + '*' + $index) ? handleCellSpan : null"
                      :default-sort = "group['defaultSort'] ? {prop: group.defaultSort.prop, order: group.defaultSort.order === 'asc' ? 'ascending' : 'descending' }  : {}"
                      @sort-change="handleSortChange"
                      @selection-change="handleSelectionChange" fit border>
                      <el-table-column
                        v-if="typeof group['selection'] === 'undefined' ? true : group['selection']"
                        type="selection"
                        :fixed="typeof group.selectionFixed === 'undefined' ? true : group.selectionFixed"
                        align="center"
                        width="45">
                      </el-table-column>
                      <el-table-column
                        v-for="(column, index) in group.columns"
                        v-if="typeof column['show'] === 'undefined' ? true : column['show']"
                        :key="column.prop"
                        :prop="column.prop"
                        :align="handleColumnAlign(column)"
                        :fixed="column['fixed']"
                        :label="column.name"
                        :sortable="handleColumnSort(column['sort'], group['sortType'])"
                        :show-overflow-tooltip="true"
                        :min-width="column['width'] || ''"
                        :render-header="columnRenderHeader">
                        <template slot-scope="scope">
                          <el-button 
                            v-if="typeof column['link'] !== 'undefined'" 
                            @click="column.link(scope.row[column.prop], scope.row)" 
                            type="text">
                            {{ scope.row[column.prop]}}
                          </el-button>

                          <template v-else-if="typeof column.formatter !== 'undefined'">
                            <div v-html="scope.row[column.prop + '-format']">
                            </div>
                          </template>
                            
                          <template v-else-if="column.enums">
                          <span v-text="typeof $root.customParam.enums[column.enums][scope.row[column.prop]] === 'undefined' ? scope.row[column.prop] : $root.customParam.enums[column.enums][scope.row[column.prop]]">
                            </span>
                          </template>

                          <template v-else>
                            <div v-html="scope.row[column.prop]">
                            </div>
                          </template>
                            
                          
                        </template>
                      </el-table-column>
                      <div class="table-empty" slot="empty">
                        <div>暂无数据</div>
                      </div>
                    </el-table>
                    <div
                      :ref="group.tableName + '*' + $index + '_footer'"
                      class="ych-reports-footer">
                      <div class="ych-reports-btn-group">
                        <template v-if="group['btnArray']">
                          <el-button
                            v-for="(btn, $index) in group.btnArray"
                            size="mini"
                            :key="btn.name"
                            @click="handleBtnClickEvents(btn.clickFunc, $index)"
                            :loading="loadingBtn.indexOf($index) > -1"
                            type="primary">
                            {{ btn.name }}
                          </el-button>
                        </template>
                      </div>
                      
                      <el-pagination
                        class="ych-reports-pagination"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPages[currentTab]"
                        :page-sizes="pageSizes"
                        :page-size="group['pageSize'] || 20"
                        layout="slot, total, sizes, prev, pager, next"
                        :total="tableData[currentTab] ? tableData[currentTab].PageInfo.TotalCount : 0" small>
                        
                        <el-popover
                          v-if="typeof group.export === 'undefined' ? true : group.export"
                          :ref="group.tableName + '*' + $index + '_popover'"
                          placement="top"
                          width="160">
                          <div>
                            <p>确定导出？</p>
                            <div style="text-align: right; margin: 0">
                              <el-button type="primary" size="mini" @click="exportReport">确定</el-button>
                            </div>
                          </div>
                          <el-button
                            :disabled="!Boolean(tableData[currentTab] && tableData[currentTab].List.length > 0)"
                            slot="reference"
                            class="export-btn"
                            icon="el-icon-download"
                            v-if="!groupsQueryUrl[currentTab]"
                            type="text">
                               导出
                           </el-button>
                        </el-popover>
                      </el-pagination>
                        
                    </div>
                  </el-tab-pane>
                </el-tabs>
              </div>
            </div>`,
    mounted: function () {
      var self = this;
      // 窗口缩放重算表格高度
      window.onresize = function () {
        self.calculateHeight();
      }
      // 计算表格可视区域的高度
      setTimeout(function () {
        self.calculateHeight()
      });
    },

    data: function () {
      return {
        currentPages: {},
        pageSizes: [20, 40, 80, 100],
        maxHeight: 400,
        tableData: {},
        multipleSelection: [],
        loadingBtn: [],
        tabValue: '',
        sorts: {},
        pageSize: {},
        tableLoading: false,
        wheres: [],
        formatColumns: {},
        cellSpanColumns: {},
        groupsCellSpan: {},
        groupsColumnMap: {},
        groupsQueryUrl:{}
      };
    },

    computed: {
      // 当前组名（tableName + tab的索引值，为了处理多个tab查同一个表的问题)
      currentTab: function () {
        return this.tabValue || (this.groups.length > 0 && this.groups[0]['tableName'] + '*0');
      },

      // 当前组
      currentGroup: function () {
        var currentTab = this.currentTab;
        // 获取当前tab的table列配置数据
        var groupIndex = currentTab.split('*')[1];
        var group = this.groups[groupIndex];

        return group;
      },

      // 当前Tab 需要格式化的列
      currentGroupFormatCol: function () {
        return this.formatColumns[this.currentTab];
      },

      // 当前tab 需要单元格合并的列
      currentGroupSpanCol: function () {
        return this.cellSpanColumns[this.currentTab];
      }
    },

    props: {
      groups: Array,
      btnArray: Array,
      exportName: String,
      overallHeight: Number
    },

    watch: {
      'groups': function (val) {
        var self = this;
        // 预处理全部组
        val.forEach(function (group, index) {
          var groupName = group.tableName + '*' + index;
          self.groupsQueryUrl[groupName] = group.queryUrl;

          var groupColumns = group.columns;
          // 需要格式化的列
          var needToFormatColumns = [];
          // 需要单元格合并的列
          var needToSpanColumns = [];
          var columnMap = {};

          groupColumns.forEach(function (column) {
            columnMap[column.prop] = column;
            typeof column.formatter !== 'undefined' && needToFormatColumns.push(column);
            column.cellSpan === true && needToSpanColumns.push(column.prop);
          });

          self.formatColumns[groupName] = needToFormatColumns;
          self.cellSpanColumns[groupName] = needToSpanColumns;
          self.groupsColumnMap[groupName] = columnMap;
        });
      }
    },

    methods: {
      // 自定义列头渲染
      columnRenderHeader: function (h, data) {
        var column = data.column;
        var index = data.$index;
        var columnSetting = this.groupsColumnMap[this.currentTab][column.property];
        if (!columnSetting) return;
        var childrenNode = [
          h(
            'div',
            {
              domProps: {
                innerHTML: column.label
              },

              style: {
                display: 'inline-block'
              }
            }
          )
        ]

        // 判断是否有提示框
        if (typeof columnSetting.tips !== 'undefined') {
          childrenNode.push(
            h(
              'el-tooltip',

              {
                attrs: {
                  placement: 'top'
                }
              },

              [
                h(
                  'div',

                  {
                    domProps: {
                      innerHTML: columnSetting.tips
                    },

                    slot: 'content'
                  }
                ),

                h(
                  'i',
                  {
                    'class': {
                      'el-icon-question': true
                    },

                    style: {
                      color: '#20a0ff',
                      marginLeft: '5px'
                    }
                  }
                )
              ]
            )
          );
        }

        return h(
          'span',

          childrenNode
        );
      },

      // 计算window的可视区域可放table的最大高度
      calculateHeight: function () {
        var self = this;
        this.$nextTick(function () {
          // 35: tab头高度，10：tab容器padding-top
          // 窗口可视高度
          var rootElHeight = this.overallHeight || (document.documentElement.clientHeight - 78 - 10 - 5);
          // 查询条件容器高度
          var conditionsElHeight = self.$el.previousElementSibling.clientHeight;
          // 分页容器高度
          var paginationElHeight = self.$refs[self.currentTab + '_footer'][0].clientHeight;
          var height = (rootElHeight - self.$el.previousElementSibling.clientHeight - paginationElHeight - 35 - 10);
          self.maxHeight = height;
          // 数据更新完后处理element table 组件样式bug （Element2.x 已修复)
          // self.handelTableQuestion();
        });
      },
      // 处理需要合并单元格的列
      handleCellSpan: function (data) {
        // 如果已配置spanMethod, 直接调用
        // 覆盖列的cellSpan属性
        if (typeof this.currentGroup.spanMethod === 'function') {
          return this.currentGroup.spanMethod(data);
        }
        // 没有需要合并单元格的列，直接返回正常状态
        if (this.currentGroupSpanCol.length < 0) return [1, 1];
        // Element->table组件的span-method传入的属性
        var columnIndex = data.columnIndex,
            rowIndex = data.rowIndex,
            row = data.row,
            column = data.column;

        var currentGroupCellSpan = this.groupsCellSpan[this.currentTab] || {};

        var spanColumns = Object.keys(currentGroupCellSpan);
        var cellSpan = currentGroupCellSpan[column.property];

        if (spanColumns.indexOf(column.property) > -1) {
          return cellSpan[rowIndex];
        }
      },

      // 处理异步返回，并需要合并单元的列数据
      handleDataCellSpan: function (data) {
        // 如果当前表格排序类型为local时,不能使用快捷的列单元格合并
        if (this.currentGroup.sortType === 'local') {
          if (this.currentGroupSpanCol &&
            this.currentGroupSpanCol.length > 0) {
            console.warn('当使用本地排序时，列的cellSpan（单元格合并）属性无效, 如果需要单元格合并请使用自定义合并方法（"spanMethod"）');
          }
          return;
        }
        // 当前group没有需要做单元格合并
        if (this.currentGroupSpanCol.length < 1) return;

        if (typeof this.currentGroup.spanMethod === 'function') {
          return console.warn('使用自定义合并方法(spanMethod),列的cellSpan属性无效');
        }

        // 保存当前group的行合并的最终结果集
        this.groupsCellSpan[this.currentTab] = this.eachCellData(data);
      },

      eachCellData: function (data) {
        var self = this,
            // 记录需要合并单元格列的最后被“覆盖”的索引值
            skipIndexCol = {},
            // 单元格合并处理的最终结果集
            cellSpan = {};

        for (var i = 0; i < data.length; i++) {
          var row = data[i],
              nextRow = data[i + 1] || {};

          this.currentGroupSpanCol.forEach(function (item) {
            cellSpan[item] || (cellSpan[item] = {});
            // 判断当前循环的 行索引 是否大于 上次被合并的行索引
            // 若是，就进入单元格是否该合并的逻辑处理
            // 否则，就是已被合并的单元格，标记为[0,0](具体原因看Element->table组件)
            if (i <= (skipIndexCol[item] || -1)) {
              return cellSpan[item][i] = [0, 0];
            }

            // 当前单元格值 与 下个单元格值 不相等
            // 就是正常情况，标记为[1, 1]
            if (row[item] !== nextRow[item]) {
              return cellSpan[item][i] = [1, 1];
            }
            // 以下是单元格合并处理
            // 处理合并行数
            var result = self.handleColSpan(data, i, item);
            // 根据结果记录最后被合并的行索引
            skipIndexCol[item] = result.endRowIndex;
            // 保存当前单元格合并结果
            return cellSpan[item][result.startRowIndex] = result.cellSpan;
          });
        }

        return cellSpan;
      },

      // 处理要往下合并的单元格
      handleColSpan: function (data, index, column) {
        var rowSpan = 1,
          colSpan = 1,
          endIndex = 0;
        // 往下递归处理，找出最终需要合并个数，并记录最后被合并的行索引
        var fn = function (current, next) {
          var currentRow = data[current],
            nextRow = data[next];
          if (nextRow && currentRow[column] === nextRow[column]) {
            rowSpan++;
            fn(next, next + 1);
          } else {
            endIndex = current;
          }
        }

        fn(index, index + 1);
        return {
          startRowIndex: index,
          endRowIndex: endIndex,
          cellSpan: [rowSpan, colSpan]
        };
      },
      // 已废弃，Element2.x 已修复
      handelTableQuestion: function () {
        // // 因表格固定高度后， 固定列高度不够导致纵向会出现滚动条问题
        // var fixedEl = this.$el.querySelector('.el-table__fixed');
        // if (fixedEl) {
        //   fixedEl.style.height = this.maxHeight + 1;
        // }
        // // 合计列不对齐
        // var fixedFooterEl = this.$el.querySelector('.el-table__fixed-footer-wrapper');
        // if (fixedFooterEl) {
        //   fixedFooterEl.style.bottom = 2;
        // }
      },

      tabClick: function (val) {
        this.tabValue = val.name;
        // 传到查询条件组件
        this.$emit('changeTab', Number(val.index));
      },

      handleSelectionChange: function (val) {
        this.multipleSelection = val;
      },

      handleCurrentChange: function (val) {

        if (this.currentPages[this.currentTab] === val) return;
        this.currentPages[this.currentTab] = val;
        this.select(this.wheres);
      },

      handleSortChange: function (data) {

        if (!this.tableData[this.currentTab]) return;
        this.sorts[this.currentTab] = data;
        // 如果是本地排序，不用调用服务器查询
        if (this.currentGroup['sortType'] !== 'local') {
          this.select(this.wheres);
        }
      },

      handleSizeChange: function (val) {
        this.pageSize[this.currentTab] = val;
        this.tableData[this.currentTab] && this.select(this.wheres);
      },

      // 处理组的右下角自定义按钮点击事件
      handleBtnClickEvents: function (clickFunc, index) {
        var self = this;
        self.loadingBtn.push(index);
        clickFunc(self.multipleSelection, function (is) {
          // 默认值
          is = typeof is === 'undefined' ? true : is;
          var loadIndex = self.loadingBtn.indexOf(index);
          loadIndex > -1 && self.loadingBtn.splice(loadIndex, 1);
          // 清空选中行;
          self.multipleSelection.splice(0, self.multipleSelection.length);
          // 判断是否需要重新查询报表
          // 延迟500ms, 为了解决 外部弹出层 与 报表的loading层 冲突
          is && setTimeout(function () {
            self.select(self.wheres)
          }, 500);
        });
      },

      // 导出报表数据
      exportReport: function () {
        // 关闭确认窗
        this.$refs[this.currentTab + '_popover'][0].showPopper = false;

        var commitData = {};
        var data = this.formatterSelectConditions('export');

        var dataFields = data.Select;
        var selectFields = [];
        // 导出排序字段
        var exportSort = '';
        for (var i = 0; i < dataFields.length; i++) {
          var item = dataFields[i];
          // 因table排序用的是列名（英文别名）,导出用的是中文别名,两者有冲突
          if (data.Sort === item.Alias) {
            exportSort = item['Field'];
          }

          // 列使用的枚举
          item['FieldEnum'] = this.$root.customParam.enums[item['Enum']] || null;
          item['Alias'] = item['Name'];
          selectFields.push(item);
        }

        commitData['ModelType'] = data.ModelType;
        commitData['QueryCode'] = data.QueryCode;
        commitData['Sort'] = exportSort;
        commitData['Order'] = data.Order;
        commitData['Select'] = selectFields;
        commitData['Wheres'] = this.wheres;
        commitData['FileName'] = this.exportName + '_' + this.currentGroup.name;
        commitData['StatisticsName'] = this.currentGroup.statText || '合计';
        _ajaxCustom(commitData, function (res) {
          if (res.ResponseStatus.ErrorCode != 0) return;
          // 调用./ych-export-notification.js，的刷新导出列表的方法
          top && top.window && top.window.$ExportRefresh && top.window.$ExportRefresh();
          top && top.window && top.window.SaveSuccessOpen && top.window.SaveSuccessOpen('提示', '成功添加到导出列表');
        }, null, '/customquery/exportdata');
      },

      // 根据条件查询当前组的数据
      select: function (wheres) {
        var self = this;
        var commitData = self.formatterSelectConditions();
        this.wheres = wheres;
        commitData['Wheres'] = wheres;

        // 暂存当前查询的Tab，防止在查询中切换tab导致数据渲染问题
        var requestTab = self.currentTab;
        this.tableLoading = true;
        // 延迟关闭loading，为了提升用户操作体验
        var delayCloseLoading = function () {
          setTimeout(function () {
            self.tableLoading = false;
          }, 200);
        }

        _ajaxCustom(commitData, function (res) {
          delayCloseLoading();
          if (Number(res.ResponseStatus.ErrorCode) !== 0) {
            // 报异常时，将原数据清空
            delete self.tableData[self.currentTab];
            return;
          }
          self.handleDataCellSpan(res.List);
          // 处理单元格自定义格式化
            res.List && (res.List = self.formatterTableData(res));
          self.tableData[requestTab] = res;
        }, function () {
          delayCloseLoading();
        },self.groupsQueryUrl[self.currentTab]);
      },

      // 格式化查询的列参数
      formatterSelectColumns: function (type, currentGroup) {
        var type = type || 'select';
        var selectFields = [];
        var currentGroupColumns = currentGroup.columns;
        // 组件要查询的字段数据格式
        for (var columnIndex = 0; columnIndex < currentGroupColumns.length; columnIndex++) {
          var column = currentGroupColumns[columnIndex];
          // 跳过合并列（格式化生成列，不需要查询后端）
          if (!column['field']) continue;

          var commonParam = {
            Alias: column.prop,
            Field: column.field,
            StatisticsType: column['groupBy'] || 'none',
            ShowTotal: Boolean(column['stat']),
            ShowTotalType: column['stat'] || 'none',
            Format: column['backendFormat'] || ''
          }
          var specialProp = this.specialFormatterColumn(column, type);

          selectFields.push(_.extend({}, commonParam, specialProp));
        }

        return selectFields;
      },

      specialFormatterColumn: function (column, type) {
        var commonParam = {};
        if (type === 'export') {
          commonParam['IsShow'] = typeof column['show'] === 'undefined' ? true : column['show'];
          commonParam['Name'] = column.name;
          commonParam['Enum'] = column['enums'] || null;
          // 处理格式化问题，
          if (typeof column.formatter === 'string') {
            var formatterMap = {
              'Int': 1,
              'Decimal': 2,
              'Currency': 4
            };

            commonParam['CellStyle'] = formatterMap[column.formatter];
          }
        }

        return commonParam;
      },

      // 格式化当前表格提交后端的数据
      formatterSelectConditions: function (type) {
        var currentGroup = this.currentGroup;

        // 组装查询字段数据
        var selectFields = this.formatterSelectColumns(type, currentGroup);

        var currentTab = this.currentTab;

        var order = '';
        // 判断表的排序列是否有选择排序，否则用默认排序；
        if (this.sorts[currentTab] && this.sorts[currentTab]['order']) {
          order = this.sorts[currentTab].order.substr(0, 3);
        } else {
          order = currentGroup['defaultSort'] ? currentGroup.defaultSort.order.substr(0, 3) : '';
        }

        // 提交到后端的数据格式
        var customSelectObj = {
          ModelType: currentGroup.tableName,
          QueryCode: currentGroup['queryCode'] || '',
          Select: selectFields,
          Page: this.currentPages[currentTab] || 1,
          Rows: this.pageSize[currentTab] || currentGroup['pageSize'] || 20,
          Sort: this.sorts[currentTab] ? this.sorts[currentTab].prop : currentGroup['defaultSort'] && currentGroup.defaultSort.prop,
          Order: order
        };

        return customSelectObj;
      },
      // 处理统计行
      getStatData: function (param) {
        var self = this,
            columns = param.columns,
            statRows = ['合计'],
            statData = this.tableData[this.currentTab] && this.tableData[this.currentTab]['StatisticsTotal'];

        // 判断接口返回的统计数据对象是否为{}
        if (_.isEmpty(statData)) {
          return statRows;
        }
        // 当前组的列配置信息
        var columnSettingMap = this.groupsColumnMap[this.currentTab];

        columns.forEach(function (column, index) {
          // 统计行的第一列必须用作放 统计行文字
          if (index === 0) {
            statRows[index] = self.currentGroup['statText'] || '合计';
            // 第一列跳过
            return;
          }
          var statValue = String(statData[column.property] || '')
          var clumnSetting = columnSettingMap[column.property];
          if (statValue
            && clumnSetting
            && clumnSetting['formatter']
            && typeof clumnSetting.formatter === 'string') {

            statValue = self.handlePreinstallType(clumnSetting.formatter, statValue);
          }

          statRows[index] = statValue;
        });
        return statRows;
      },

      // 处理支持导出的预设格式类型
      handlePreinstallType: function (type, value) {
        var num = Number(value);
        var map = {
          'Currency': num.formatMoney(),
          'Int': Math.round(value),
          'Decimal': num.formatMoney(2, "", "")
        }

        return isNaN(num) ? value : map[type];
      },

      // 格式化表格列的展示数据
      formatterTableData: function (resData) {
        var data = resData.List || [];
        if (this.currentGroupFormatCol.length === 0) return data;
        var self = this;
        var typeMap = {
          'function': function (row, column) {
            var statDatas = resData.StatisticsTotal;
            return column.formatter(row[column.prop], row, statDatas);
          },
          'string': function (row, column) {
            return self.handlePreinstallType(column.formatter, row[column.prop]);
          }
        };

        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < this.currentGroupFormatCol.length; j++) {
            var row = data[i],
                column = this.currentGroupFormatCol[j];

            var formatedData = typeMap[typeof column.formatter](row, column);

            (formatedData !== undefined) && (row[column.prop + '-format'] = formatedData);
          }
        }

        typeMap = null;
        return data;
      },

      // 处理列排序
      handleColumnSort: function (sort, type) {
        var finalType = type === 'local' ? true : 'custom';

        return sort === false ? false : finalType;
      },

      // 处理列对齐方式
      handleColumnAlign: function (column) {
        return column.align
          ? column.align
          : (typeof column.formatter === 'string'
          ? 'right'
          : 'left');
      }
    }
  };

  /**
   * 自定义报表头部条件部分
   *
   * @prop conditions:Array  查询条件对象
   *
   * @event select 查询事件
   * -return (selectConditions) 条件查询字段与其值
   */
  var _reportsCondition = {
    template: `<el-form 
                :inline="true" 
                :model="formData"
                :label-width="maxLabelLength + 1 + 'em'"
                class="ych-condition-from">
              <div class="condition-from-left">
                <template v-for="item in showMenu">
                  <template v-if="item.type === 'input'">
                    <ych-input-compare
                      v-if="item['symbols'] || typeof item['symbols'] === 'undefined'"
                      v-model="formData[item.field]"
                      :id="item.field"
                      :label="item.label"
                      :key="item.field"
                      :data-type="item.dataType"
                      :default-value="typeof item.defaultValue === 'undefined' ? null : item.defaultValue"
                      :placeholder="item.placeholder || '请输入值'"
                      :symbols="item['symbols'] || []"
                      :symbol.sync="formSelectSymbols[item.field]">
                    </ych-input-compare>
                    
                    <ych-input-normal
                      v-else
                      v-model="formData[item.field]"
                      :id="item.field"
                      :key="item.field"
                      :label="item.label"
                      :placeholder="item.placeholder || '请输入值'"
                      :default-value="typeof item.defaultValue === 'undefined' ? null : item.defaultValue">
                    </ych-input-normal>
                  </template>
                  
                  <template v-else-if="item.type === 'leaguer'">
                    <ych-leaguer-card
                      v-model="formData[item.field]"
                      :key="item.field"
                      :id="item.field"
                      :label="item['label'] || '会员卡号'"
                      :placeholder="item.placeholder || '请输入值'"
                      :default-value="typeof item.defaultValue === 'undefined' ? null : item.defaultValue"
                      :symbol.sync="formSelectSymbols[item.field]">
                    </ych-leaguer-card>
                  </template>

                  <template v-else-if="item.type === 'monthday'">
                    <ych-mad-picker 
                      v-model="formData[item.field]"
                      :key="item.field"
                      class="ych-mad-picker"
                      :id="item.field"
                      :label="item['label']"
                      :placeholder="item.placeholder || '请输入值'"
                      :symbol.sync="formSelectSymbols[item.field]"
                      :default-value="typeof item.defaultValue === 'undefined' ? null : item.defaultValue">
                    </ych-mad-picker>
                  </template>
                  
                  <template v-else-if="item.type === 'select'"> 
                    <ych-select-normal
                      v-model="formData[item.field]"
                      :key="item.field"
                      :id="item.field"
                      :label="item.label"
                      :placeholder="item.placeholder || '请选择'"
                      :symbol.sync="formSelectSymbols[item.field]"
                      :default-value="typeof item.defaultValue === 'undefined' ? null : item.defaultValue"
                      :allow-create="typeof item.allowCreate === 'undefined' ? false : item.allowCreate"
                      :multiple="typeof item.multiple === 'undefined' ? false : item.multiple"
                      :source="item.source || []">
                    </ych-select-normal>
                  </template>
                  
                  <template v-else-if="['year', 'month', 'date', 'week',  'datetime', 'datetimerange', 'daterange', 'period'].indexOf(item.type) > -1">
                    <ych-date-picker 
                      v-model="formData[item.field]"
                      :key="item.field"
                      :id="item.field"
                      :label="item.label"
                      :placeholder="item.placeholder || '请选择'"
                      :default-value="typeof item.defaultValue === 'undefined' ? null : item.defaultValue"
                      :type="item.type"
                      :symbol.sync="formSelectSymbols[item.field]"
                      :symbols="item['symbols']">
                    </ych-date-picker>
                  </template>
                  
                  <template v-else-if="item.type.split('.')[0] === 'custom'">
                    
                    <ych-select-normal
                      v-if="item.type.split('.')[1] === 'dropdown'"
                      v-model="formData[item.field]"
                      :symbol.sync="formSelectSymbols[item.field]"
                      :key="item.field"
                      :id="item.field"
                      :label="item.label"
                      :placeholder="item.placeholder || '请选择'"
                      :custom="true"
                      :allow-create="typeof item.allowCreate === 'undefined' ? false : item.allowCreate"
                      :multiple="typeof item.multiple === 'undefined' ? false : item.multiple"
                      :default-value="typeof item.defaultValue === 'undefined' ? null : item.defaultValue"
                      :source="item.source || []">
                    </ych-select-normal>

                    <ych-cascader
                      v-if="item.type.split('.')[1] === 'cascader'"
                      v-model="formData[item.field]"
                      :key="item.field"
                      :id="item.field"
                      :label="item.label"
                      :symbol.sync="formSelectSymbols[item.field]"
                      :placeholder="item.placeholder || '请选择'"
                      :source="item.source || []"
                      filterable>
                    </ych-cascader>
                  </template>
                </template>
                
              </div>
              <div class="condition-from-right">
                <el-form-item style="float:right; border: none;">
                  <el-dropdown
                      class="menu-btn"
                      trigger="click" 
                      @command="menuClick"
                      @visible-change="menuVisibleChange"
                      :hide-on-click="false">
                    <el-button 
                        class="condition-btn"
                         :class="{'condition-btn-active': conditionBtnState}"
                        icon="el-icon-d-arrow-left">
                    </el-button>
                    <el-dropdown-menu 
                      class="condition-menu" 
                      slot="dropdown">
                      <el-dropdown-item :disabled="true">请选择条件</el-dropdown-item>
                      <el-dropdown-item 
                          v-for="(item, index) in filteredConditions"
                          :key="item.field"
                          :command="item"
                           :divided="index === 0">
                          <i class="condition-menu-selected" :class="{'el-icon-check': isShow(item.label) > -1}"></i>
                          {{ item.label }}
                      </el-dropdown-item>
                      <el-dropdown-item 
                          class="condition-menu-reset"
                          command="menu-rest"
                          :divided="true">还原默认设置</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
                <el-form-item style="float:right; border: none;">
                  <el-button class="select-btn" type="primary" @click="onSubmit">查询</el-button>
                </el-form-item>
              </div>
              
            </el-form>`,

    data: function () {
      return {
        formData: {},
        formSelectSymbols: {},
        conditionBtnState: false,
        menuSelected: [],
        compareType: ['year', 'month', 'date', 'week', 'datetime', 'datetimerange', 'daterange', 'input-compare'],
        maxLabelLength: 4
      };
    },
    props: {
      conditions: Array,
      groupsConditions: Array,
      currentTab: Number
    },
    computed: {
      filteredConditions: function () {
        var conditionArr = [];
        var self = this;

        if (this.groupsConditions.length > 0) {
          var currentTabObj = this.groupsConditions[this.currentTab];
          var conMap = {
            'merge': (this.conditions || []).concat(currentTabObj.fields || []),
            'private': currentTabObj.fields
          };

          conditionArr = conMap[currentTabObj.type];
        }

        for (var i = 0; i < conditionArr.length; i++) {
          var item = conditionArr[i];
          conditionArr[i]['label'] = this.specialCondLabel(item);
        }

        return conditionArr;
      },

      showMenu: function () {
        var fields = [];
        if (this.menuSelected.length > 0) {
          for (var i = 0; i < this.filteredConditions.length; i++) {
            var item = this.filteredConditions[i];

            var show = this.menuSelected.indexOf(item.label);
            show > -1 && fields.push(item);
          }
        }

        return fields;
      },
      showDefault: function () {
        var fields = [];
        var labelLength = 0;
        for (var i = 0; i < this.filteredConditions.length; i++) {
          var item = this.filteredConditions[i],
              show = typeof item.show === 'undefined' ? true : item.show,
              itemLabelLength = item.label.length;

          (labelLength < itemLabelLength) && (labelLength = itemLabelLength);

          show && fields.push(item.label);
        }

        this.maxLabelLength = labelLength < 4 ? 4 : labelLength;
        return fields;
      }
    },
    watch: {
      filteredConditions: function (newVal, oldVal) {
        // 当前已选择 与 tab的查询条件需要默认显示 的合并
        // 并去重，因每个Tab的查询条件会有重复
        var fields = this.showDefault.concat(this.menuSelected).unique();
        if (fields.length > 0) {
          this.menuSelected = fields;
        }

        // 遍历表单数据
        for (var key in this.formData) {
          var fieldVal = this.formData[key];
          // 过滤值为空的
          if (fieldVal === '' ||
            fieldVal === null ||
            (Array.isArray(fieldVal) &&
              !fieldVal[0])) continue;

          for (var i = 0; i < oldVal.length; i++) {
            var oldField = oldVal[i];
            if (key !== oldField.field) continue;
            for (var newIndex = 0; newIndex < newVal.length; newIndex++) {
              var newFiled = newVal[newIndex];
              if (oldField.label === newFiled.label &&
                oldField.type === newFiled.type &&
                oldField.field !== newFiled.field) {
                var self = this;
                this.$nextTick(function () {
                  self.formData[newFiled.field] = fieldVal;
                });
                // delete this.formData[key];
                break;
              }
            }
            break;
          }
        }
      }
    },
    methods: {
      updateData: function (field, val) {
        this.formData[field] = val;
      },
      onSubmit: function () {
        var formatedData = this.formatFormData();
        // 如果格式化后返回的是false, 终止查询
        formatedData && this.$emit('select', formatedData);
      },
      // 格式化查询条件提交数据
      formatFormData: function () {
        var data = this.formData;
        var wheres = [];
        // console.log(data)
        for (var key in data) {
          var conValue = data[key];
          // 过滤不是选中的查询条件
          // 过滤查询条件值为非法值
          // 过滤掉 时间区间组件清空值后存在的空数组
          if ((this.formSelectSymbols[key] !== 'nulls'
            && conValue === '')
            || conValue === undefined
            || conValue === null
            || (Array.isArray(conValue)
            && (conValue[0] === null
              || conValue.length === 0))) continue;

          // 将符号为'null'的字段值设为null
          (this.formSelectSymbols[key] === 'nulls') && (data[key] = null);

          var where = this.formatterConditionData(key, data);

          where && wheres.push(where);
        }

        return this.$root.customParam.beforeQuery ? this.$root.customParam.beforeQuery(wheres, this.currentTab) : wheres;
      },

      formatterConditionData: function (field, data) {
        // 查找当前查询条件配置
        var condition = this.findFilteredConditions(field);

        // 判断当前查询条件是否为选中 和
        // 值字段名 与 当前查询条件查询字段名是否一致，
        // 因为不同的tab会出现label相同field不同的情况
        if (!condition
          || this.menuSelected.indexOf(condition.label) < 0
          || field !== condition.field) return false;

        // 判断是否自定义查询
        var types = condition.type.split('.');
        if (!condition.dataType && types[0] === 'custom') {
          var globalDd = this.$root.customParam[types[1]];

          condition.dataType = globalDd
            ? globalDd[condition.source].dataType
            : 'String';
        }
        var coditionValue = data[field],
            compare = this.formSelectSymbols[field] || '';

        // 特殊处理级联组件
        // 因级联组件返回的值是层级数组值，但后端只需要最后一级的值
        if (this.formSelectSymbols[field] === 'cascader') {
          var cascaderValue = [].concat((data[field] || []));
          coditionValue = cascaderValue.pop();
          compare = 'eq';
        }
        // 是否使用 in 查询操作
        var isIn = this.formSelectSymbols[field] === 'isIn';
        // 判断值是否为数组
        // 因日期区间组件值是数组，但后端接收的是两个值
        var isValueArray = Array.isArray(coditionValue);

        return {
          Field: field,
          Value: isValueArray ? (isIn ? coditionValue : coditionValue[0]) : coditionValue === 'null' ? null : coditionValue,
          ValueBet: isValueArray && !isIn ? coditionValue[1] : '',
          Compare: compare
        }
      },

      findFilteredConditions: function (field) {
        var condition;
        for (var conIndex = 0; conIndex < this.filteredConditions.length; conIndex++) {
          if (field === this.filteredConditions[conIndex].field) {
            condition = this.filteredConditions[conIndex];
          };
        }
        return condition;
      },

      menuClick: function (item) {
        var field = item.label;
        // 判断点击的是否为"还原设置"项
        if ('menu-rest' === item) {
          this.menuSelected = this.showDefault.concat();
        } else {
          var exist = this.isShow(field);
          if (exist > -1) {
            this.menuSelected.splice(exist, 1);
            // 移除勾选后，删除表单属性，防止再次勾选出现之前的值
            if (this.formData[field]) {
              this.formData[field] = '';
              this.formSelectSymbols[field] = '';
            }
          } else {
            this.menuSelected.push(field);
          }
        }
        var self = this;
        // 每次选择显示条件都触发事件，重新计算表格高度
        Vue.nextTick(function () {
          self.$emit('update-conditions');
        });
      },
      menuVisibleChange: function (is) {
        this.conditionBtnState = is;
      },
      // 判断字段是否显示
      isShow: function (field) {
        return this.menuSelected.indexOf(field);
      },

      specialCondLabel: function (item) {
        if (item['label']) return item.label;
        var self = this;

        var typeMap = {
          'leaguer': function () {
            return '会员卡号';
          },
          'period': function () {
            return '账期';
          },
          'custom.dropdown': function (item) {
            return self.$root.customParam.dropdown[item.source] 
            && self.$root.customParam.dropdown[item.source].label;
          },
          'custom.cascader': function (item) {
            return self.$root.customParam.cascader[item.source] 
            && self.$root.customParam.cascader[item.source].label;
          }
        };
        var fn = typeMap[item.type];
        return fn ? fn(item) : '';
      },
    },
    components: {
      'ych-date-picker': _datePicker,
      'ych-select-normal': _selectNormal,
      'ych-input-compare': _inputCompare,
      'ych-input-normal': _inputNormal,
      'ych-leaguer-card': _leaguerCard,
      'ych-mad-picker': _selectMD,
      'ych-cascader': _cascader
    }
  };

  /**
   * 自定义报表 —— 整体
   */
  var _customReports = {
    template: `<div class="ych-custom-reports">
                <ych-reports-condition 
                    ref="conditions"
                    @update-conditions="updateConditions"
                    @select="onSelect"
                    :current-tab="currentTab"
                    :groups-conditions="groupsFileds"
                    :conditions="fields">
                </ych-reports-condition>
                <ych-reports-table 
                    ref="tables"
                    @changeTab="currentTab = arguments[0]"
                    :overall-height="height"
                    :export-name="name"
                    :groups="groups">
                </ych-reports-table>
             </div>`,
    mounted: function () {
      this.asyncLoadData();
    },
    data: function () {
      return {
        name: '',
        fields: [],
        groups: [],
        height: 0,
        isDefaultLoading: true,
        currentTab: 0,
        asyncLoading: 0,
        tabLoadRecord: [0],
        customParam: null
      };
    },

    watch: {
      currentTab: function (val) {
        // 切换tab时获取数据
        if (this.tabLoadRecord.indexOf(val) < 0) {
          this.asyncLoadData();
          this.tabLoadRecord.push(val);
        }
      }
    },

    computed: {
      groupsFileds: function () {
        var groupsFileds = [];

        for (var i = 0; i < this.groups.length; i++) {
          var group = this.groups[i];
          groupsFileds.push({
            type: typeof group.fieldsType === 'undefined' ? 'merge' : group.fieldsType,
            fields: group['fields'] || []
          });
        }

        return groupsFileds;
      }
    },

    methods: {
      onSelect: function (data) {
        this.$refs.tables.select(data);
      },

      updateConditions: function () {
        this.$refs.tables.calculateHeight();
      },

      asyncLoadData: function () {
        var self = this;
        this.$nextTick(function () {
          if (!self.isDefaultLoading) return;
          // 判断内置组件是否有异步默认值
          // 如果有，需要等待计数器为0时再加载数据
          if (self.asyncLoading <= 0) {
            return self.$refs.conditions.onSubmit();
          }

          // 监控内置组件异步加载默认值的计数，
          var unwatch = self.$watch('asyncLoading', function (val) {
            if (val !== 0) return;
            self.$refs.conditions.onSubmit();
            unwatch();
          });

        });
      }
    },
    components: {
      'ych-reports-condition': _reportsCondition,
      'ych-reports-table': _reportsTable
    }
  };

  var _ajaxCustom = function (postData, success, error, url) {
    $http.post(url || _customApi, postData)
      .then(
        function (res) {
          success && success(res);
        },
        function (res) {
          error && error(res);
        }
      ).catch(function (e) {
        error && error(res);
      });
    // $.ajax({
    //   type: 'POST',
    //   async: true,
    //   url: url || _customApi,
    //   contentType: 'application/json; charset=utf-8',
    //   data: JSON.stringify(postData),
    //   dataType: "json",
    //   success: success,
    //   error: error
    // });
  };

  var _reportInit = function (options, globalParam) {
    var el = options.el;
    if (!el) {
      return console.error('容器"' + el + '"不存在,  请确认！');
    }

    var ReportConstructor = Vue.extend(_customReports);

    var instance = new ReportConstructor({
      el: document.createElement('div')
    });

    instance.fields = options.fields;
    instance.groups = options.groups;
    instance.name   = options['name'] || '自定义报表';
    instance.height = options.height || 0;
    instance.isDefaultLoading = typeof options.isDefaultLoading === 'undefined' ? true : options.isDefaultLoading;

    instance.customParam = globalParam;

    el.appendChild(instance.$el)

    return instance;
  };

  var _setVueGlobalParam = function (options) {
    var global = {
      dropdown: _.extend(_globalConf.dropdown, options.dropdown),
      cascader: _.extend(_globalConf.cascader, options.cascader),
      enums: _.extend(_globalConf.enums, options.enums),
      table: _.extend(_globalConf.table, options.table),
      beforeQuery: options['beforeQuery'] || null
    };
   
    return global;
  }

  var YchCustomReport = function (options) {
    var globalParam = _setVueGlobalParam(options);
    var instance = _reportInit(options, globalParam);

    return {
      updateData: function (field, val) {
        instance.$refs.conditions.updateData(field, val);
      },
      conditions: instance.$refs.conditions.formData
    };
  }

  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = YchCustomReport;
  } else {
    window.$YchCustomReport = YchCustomReport;
    if ( typeof define === "function" && define.amd ) {
      var Vue;
      define(['vue'], function (vue) { 
        Vue = vue;
        return YchCustomReport; 
      });
    }
  }
})(window);
