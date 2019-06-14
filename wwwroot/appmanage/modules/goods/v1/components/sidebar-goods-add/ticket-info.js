define([
  'api/ticket/v1/Ticket',
  'components/week-checkbox-group/index',
  'goods/components/sidebar-goods-add/game-project-list-dailog',
  'components/ticket-style-layout-manager/index',
  'fabric'
], function (
  Ticket,
  weekCheckboxGroup,
  gameProjectListDailog,
  ticketStyleLayoutManager,
  fabric
) {
    'use strict';

    var TIME_UNIT = {
      Hour: '小时',
      Day: '天',
      Month: '月',
      Year: '年'
    };

    var selectTimeUnit = {
      props: ['value'],

      data: function () {
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

    return {
      name: 'TicketInfo',

      components: {
        SelectTimeUnit: selectTimeUnit,
        WeekCheckboxGroup: weekCheckboxGroup,
        GameProjectListDailog: gameProjectListDailog,
        TicketStyleLayoutManager: ticketStyleLayoutManager
      },

      props: ['incomingData', 'data'],

      created: function () {
        this.getTicketList();
      },

      data: function () {

        var self = this;
        var now = this.$moment().format();
        // 一个月后
        var monthAfter = this.$moment().add(1, 'M').format();
        // 一天的开始
        var startOfDay = this.$moment().set({
                            hour: 0,
                            minute: 0,
                            second: 0
                          }).format();
        // 一天的结束
        var endOfDay = this.$moment().set({
                          hour: 23,
                          minute: 59,
                          second: 59
                        }).format();

        var validateShareCount = function (rule, value, callback) {
          if (self.timesCount.IsShare && self.timesCount.ShareCount <= 0) {
            return callback(new Error('请填写数字值！'));
          }

          callback();
        }

        return {
          ticketRadio:'1',
          ticketLoading: false,
          // 缓存ticket数据
          CacheTicketById: [],
          TicketListData: [],
          columnOpration: [{
            label: '移除',
            value: 'remove'
          }],

          termRuleType: {
            'Unlimited': '无限制',
            'LimitTicket': '按票限制',
            'LimitItem': '按项目限制'
          },

          timeUnit: TIME_UNIT,

          ticketTypeOfEdit: '',

          timesCount: {
            IsShare: false,
            ShareCount: 0
          },

          ticketValidPeriodData: {
            // 有效时长类型 Effective Appointed Forever
            EffectiveType: 'Effective',
            // 售卖后生效时间
            SaledPeriod: 0,
            // 售卖后生效时间单位
            SaledUnit: 'Day',
            // 有效期时间
            EffectivePeriod: 0,
            // 有效期时间单位
            EffectiveUnit: 'Day',

            // 套票有效期（开始）
            StartValidity: now,
            // 套票有效期（结束）
            EndValidity: monthAfter,

            // 套票核销期
            WriteOffPeriod: 0,
            // 套票核销期单位
            WriteOffUnit: 'Day',
            // 是否自动续期
            IsAutoRenewal: false
          },

          useTimeData: {
            UseStartTime: startOfDay,
            UseEndTime: endOfDay,
            CanUseDays: ['Tuesday', 'Monday', 'Wednsday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
          },

          termRuleData: {
            // 使用频率
            TermRuleType: 'Unlimited',
            // 限制每张票时间
            TicketLimitTime: null,
            // 限制每张票单位
            TicketLimitUnit: 'Day',
            // 限制每张票次数
            TicketLimitCount: null,
            // 限制每个项目时间
            ItemLimitTime: null,
            // 限制每个项目单位
            ItemLimitUnit: 'Day',
            // 限制每个项目次数
            ItemLimitCount: null
          },

          otherData: {
            // 是否生物识别
            IsNeedBiometric: false,
            // 语音播报文字
            VoiceText: null,
            // 允许离场时间
            PermissionLeaveTimeSpan: null,
            // 陪同票数
            MaxNumberOfAccompany: 0,
            // 打印样式ID
            PrintStyleID: null
          },

          machineItem: [],

          rules: {
            ShareCount: [
              { validator: validateShareCount, trigger: 'blur' }
            ],
          },
          // 项目选择弹窗
          gameProjectDailogVisible: false,
          pickerOptions: {
            disabledDate: function (time) {
              return time.getTime() < Date.now();
            }
          }
        };
      },

      computed: {
        id: function () {
          var data = this.incomingData || {};
          return data.id;
        },

        setting: function () {
          var data = this.incomingData || {};
          return data.setting || {};
        },

        ticketType: function () {
          var type = '';

          if (this.id) {
            type = this.ticketTypeOfEdit;
          } else {
            var kind = this.setting.Kind;
            // 后端枚举值不一致
            if (kind === 'TicketTimesCount') {
              type = 'TimesCount';
            } else if (kind === 'TicketTermRule') {
              type = 'Term';
            }
          }

          return type;
        },

        ticketValidity: {
          get: function () {
            // 处理日期组件 接收 [null, null] 数据报错的问题
            if (!this.ticketValidPeriodData.StartValidity && !this.ticketValidPeriodData.EndValidity) {
              return null;
            }

            return [this.ticketValidPeriodData.StartValidity, this.ticketValidPeriodData.EndValidity];
          },

          set: function (value) {
            value = value || [];
            var start = value[0] || null;
            var end = value[1] || null;

            this.ticketValidPeriodData.StartValidity = start;
            this.ticketValidPeriodData.EndValidity = end;
          }
        },

        useTimes: {
          get: function () {
            return [this.useTimeData.UseStartTime, this.useTimeData.UseEndTime];
          },

          set: function (value) {
            value = value || [];
            _.assign(this.useTimeData, {
              UseStartTime: value[0] || null,
              UseEndTime: value[1] || null
            });
          }
        },

        selectedMachineIds: function () {
          return _.map(this.machineItem, function (item) {
            return item.MachineID;
          });
        },

        validPeriodTips: function () {
          var data = this.ticketValidPeriodData || {};

          return `售卖后 ${data.SaledPeriod} ${this.timeUnit[data.SaledUnit]}后生效，有效时长 ${data.EffectivePeriod} ${this.timeUnit[data.EffectiveUnit]}，其中核销时长为 ${data.WriteOffPeriod} ${this.timeUnit[data.WriteOffUnit]}`;
        },

        effectiveType: function () {
          var type = {};

          if (this.ticketType === 'TimesCount') {
            type = { 'Forever': '永久有效' };
          }

          _.assign(type, {
            'Effective': '有效时长',
            'Appointed': '指定日期'
          });

          return type;
        },
      },

      watch: {
        'data': {
          immediate: true,
          handler: function (val) {
            this.id && this.watchTicketInfo(val)
          }
        }
      },

      methods: {
        getTicketList: function () {
          var that = this;
          Ticket.GetPrintStyleList()
            .then(function (res) {
              that.TicketListData = res.Data;
              // var lists = res.Data;
              // _.forEach(lists, function (val) {
              //   that.TicketListData.push(val);
              // });
            });
        },

        showCanvas: function (Tid) {
          var that = this,
            mm_px = 3.95;
         
          this.ticketLoading = true;

          console.log(that.CacheTicketById,'缓存到的数据');
          // 创建canvas画布
          function ticketCanvas(id, obj) {
            // obj.PrintStyleJSON = textJson;
            var canvasContent = new fabric.StaticCanvas(id);
            canvasContent.setWidth(obj.CanvasParams.Width * mm_px);
            canvasContent.setHeight(obj.CanvasParams.Height * mm_px);
            canvasContent.loadFromJSON(obj.PrintStyleJSON, function () {
                that.ticketLoading = false;
            });
          }
          // 判断是否已经请求过的ticket样式数据
          if (this.CacheTicketById.length > 0) {
            var findItem = _.find(this.CacheTicketById, function (item) {
              return item.ID == Tid;
            });
            // 判断是否已经存在打印样式，则不往下处理
            if (findItem) {
              ticketCanvas(Tid, findItem);
              return;
            }
          }

          Ticket.GetPrintStlyeByID({ ID: Tid })
            .then(function (res) {
              that.CacheTicketById.push(res);

              ticketCanvas(Tid, res);
            });
        },

        validate: function () {
          if (this.machineItem.length <= 0) {
            this.$message.error('套票至少存在一个可玩项目');
            this.$emit('tab-need-change', 'ticket');
            return false;
          }

          return this.$refs.form.validate();
        },

        getData: function () {
          return _.assign(
            {
              TicketType: this.ticketType,
              UseTime: this.useTimeData,
              MachineItem: this.machineItem,
              TimesCount: this.ticketType === 'TimesCount' ? this.timesCount : null
            },
            this.otherData,
            this.handleTicketValidPeriodData(),
            this.handleTermRuleData(),
          )
        },

        watchTicketInfo: function (val) {
          var self = this;
          if (!val) {
            return;
          }
          self.ticketTypeOfEdit = val.TicketType;

          _.assign(self.timesCount, val.TimesCount);
          
          this.handleTicketInfoOfEffectiveType(val.TicketValidPeriod);

          _.assign(self.useTimeData, val.UseTime);
          _.assign(self.termRuleData, val.TermRule);

          self.machineItem = val.MachineItem || [];

          _.assign(
            self.otherData,
            _.pick(val,
              ['IsNeedBiometric', 'VoiceText', 'PermissionLeaveTimeSpan', 'MaxNumberOfAccompany', 'PrintStyleID']
            )
          );
        },

        handleTicketInfoOfEffectiveType: function (info) {
          // 根据不同的“有效期类型”，获取对应的字段赋值
          var needField = ['EffectiveType', 'WriteOffPeriod', 'WriteOffUnit'];
          var needOtherField;
          switch (info.EffectiveType) {
            case 'Effective': 
              needOtherField = ['SaledPeriod', 'SaledUnit', 'IsAutoRenewal'];
              break;
            
            case 'Appointed':
              needOtherField = ['StartValidity', 'EndValidity', 'IsAutoRenewal'];
              break;
          };
          var needFieldObj = _.pick(
            info,
            _.concat(needField, needOtherField)
          );

          _.assign(this.ticketValidPeriodData, needFieldObj);
        },

        // 处理提交的可用项目数据
        handleMachineItem: function () {
          var self = this;
          return _.map(
            this.machineItem,
            function (item) {
              // 如果次数共享 并 计次票，则将每个项目的可使用次数设为统一
              if (self.timesCount.IsShare && self.ticketType === 'TimesCount') {
                item.CanUseTimes = self.timesCount.ShareCount;
              }
              return item;
            }
          );
        },

        // 处有效期数据
        handleTicketValidPeriodData: function () {
          var data;

          var type = this.ticketValidPeriodData.EffectiveType;

          if (type === 'Effective') {
            data = _.pick(this.ticketValidPeriodData, [
              'SaledPeriod', 'SaledUnit', 'EffectivePeriod', 'EffectiveUnit', 'IsAutoRenewal'
            ])
          } else if (type === 'Appointed') {
            data = _.pick(this.ticketValidPeriodData, [
              'StartValidity', 'EndValidity', 'IsAutoRenewal'
            ])
          }

          return {
            TicketValidPeriod: _.assign(
              {},
              data,
              _.pick(this.ticketValidPeriodData, [
                'EffectiveType',
                'WriteOffPeriod',
                'WriteOffUnit'
              ])
            )
          }
        },

        handleTermRuleData: function () {
          // Unlimited LimitTicket LimitItem
          var type = this.termRuleData.TermRuleType;
          var data;

          if (type === 'LimitTicket') {
            data = _.pick(this.termRuleData, [
              'TicketLimitTime', 'TicketLimitUnit', 'TicketLimitCount'
            ]);
          } else if (type === 'LimitItem') {
            data = _.pick(this.termRuleData, [
              'ItemLimitTime', 'ItemLimitUnit', 'ItemLimitCount'
            ]);
          }

          return {
            TermRule: _.assign({ TermRuleType: type }, data)
          };
        },

        handleOperationColumn: function (operation, row) {
          var index = _.findIndex(
            this.machineItem,
            function (item) {
              return item === row;
            }
          );

          this.machineItem.splice(index, 1);
        },

        handleGameProjectSelected: function (rows) {
          this.machineItem = _.concat(
            this.machineItem,
            _.map(rows, function (item) {
              return {
                MachineID: item.ID,
                MachineName: item.Name,
                MachineType: item.ProjectTypeName,
                CanUseTimes: 0
              }
            })
          );
        }
      },

      template: `
        <div class="sidebar-goods-add__ticket-info">
            <game-project-list-dailog 
              @submit="handleGameProjectSelected"
              :selected="selectedMachineIds"
              :visible.sync="gameProjectDailogVisible">
            </game-project-list-dailog>

            <side-bar-form 
                ref="form"
                :model="ticketValidPeriodData"
                :rules="rules">
              <ych-sidebar-layout title="有效期">
                <el-row>
                  <el-form-item 
                    prop="EffectiveType" 
                    label="有效期类型">

                    <el-select v-model="ticketValidPeriodData.EffectiveType">
                      <el-option
                        v-for="(label, key) in effectiveType"
                        :key="key"
                        :value="key"
                        :label="label">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-row>
                
                <template v-if="ticketValidPeriodData.EffectiveType === 'Effective'">
                  <el-form-item 
                    prop="SaledPeriod" 
                    label="生效时间">

                    <ych-input-number v-model="ticketValidPeriodData.SaledPeriod">
                      <select-time-unit 
                        slot="append" 
                        v-model="ticketValidPeriodData.SaledUnit">
                      </select-time-unit>
                    </ych-input-number>

                  </el-form-item>
                  <el-form-item 
                    prop="EffectivePeriod" 
                    label="有效时间">

                    <ych-input-number v-model="ticketValidPeriodData.EffectivePeriod">
                      <select-time-unit 
                        slot="append" 
                        v-model="ticketValidPeriodData.EffectiveUnit">
                      </select-time-unit>
                    </ych-input-number>

                  </el-form-item>
                </template>

                <template v-if="ticketValidPeriodData.EffectiveType === 'Appointed'">

                  <el-form-item 
                    prop="StartValidity" 
                    label="有效期">

                    <el-date-picker
                      v-model="ticketValidity"
                      :picker-options="pickerOptions"
                      type="daterange"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>

                  </el-form-item>

                </template>
                <el-row>
                  <el-form-item 
                    prop="WriteOffPeriod" 
                    label="核销期">

                    <ych-input-number v-model="ticketValidPeriodData.WriteOffPeriod">
                      <select-time-unit 
                        slot="append" 
                        v-model="ticketValidPeriodData.WriteOffUnit">
                      </select-time-unit>
                    </ych-input-number>

                  </el-form-item>

                  <ych-form-item 
                    v-show="ticketValidPeriodData.EffectiveType !== 'Forever'"
                    prop="IsAutoRenewal" 
                    label="自动续期"
                    tips="<center>会员再次购买该套票将会更新之前未使用完的套票有效期为</br>新购买套票的有效期</center>">

                    <el-radio-group v-model="ticketValidPeriodData.IsAutoRenewal">
                      <el-radio :label="true" border>是</el-radio>
                      <el-radio :label="false" border>否</el-radio>
                    </el-radio-group>
                    
                  </ych-form-item>
                </el-row>
                  
                <span 
                  v-if="ticketValidPeriodData.EffectiveType === 'Effective'"
                  style="color: red;">
                  {{ validPeriodTips }}
                </span>
              </ych-sidebar-layout>

              <ych-sidebar-layout title="可使用日期">
                <el-form-item 
                  prop="CanUseDays" 
                  label="可用时间"
                  double>
                  <el-time-picker
                    is-range
                    v-model="useTimes"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间">
                  </el-time-picker>
                </el-form-item>

                <ych-form-item 
                  prop="CanUseDays" 
                  label="可用日"
                  double>
                  <week-checkbox-group
                    v-model="useTimeData.CanUseDays"
                    :allow-switch="false">
                  </week-checkbox-group>
                </ych-form-item>
                  
                <div 
                  v-if="ticketType === 'Term'">

                  <el-form-item 
                    prop="TermRuleType" 
                    label="使用频率">
                    
                    <el-select v-model="termRuleData.TermRuleType">
                      <el-option
                        v-for="(label, key) in termRuleType"
                        :key="key"
                        :value="key"
                        :label="label">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-row v-show="termRuleData.TermRuleType === 'LimitTicket'">
                    <el-form-item 
                      prop="TicketLimitTime" 
                      label="每张票,每"
                      double>
                      
                      <ych-input-number 
                        :min="1"
                        :max="99999"
                        v-model="termRuleData.TicketLimitTime">
                        <select-time-unit 
                          slot="append" 
                          v-model="termRuleData.TicketLimitUnit">
                        </select-time-unit>
                      </ych-input-number>

                    </el-form-item>

                    <el-form-item 
                      prop="TicketLimitCount" 
                      label="只能使用"
                      double>
                      
                      <ych-input-number v-model="termRuleData.TicketLimitCount">
                        <span slot="append">次</span>
                      </ych-input-number>

                    </el-form-item>
                  </el-row>

                  <el-row v-show="termRuleData.TermRuleType === 'LimitItem'">
                    <el-form-item 
                      prop="ItemLimitTime" 
                      label="每个项目,每"
                      double>
                      
                      <ych-input-number v-model="termRuleData.ItemLimitTime">
                        <select-time-unit 
                          slot="append" 
                          v-model="termRuleData.ItemLimitUnit">
                        </select-time-unit>
                      </ych-input-number>

                    </el-form-item>

                    <el-form-item 
                      prop="ItemLimitCount" 
                      label="只能使用"
                      double>
                      
                      <ych-input-number v-model="termRuleData.ItemLimitCount">
                        <span slot="append">次</span>
                      </ych-input-number>

                    </el-form-item>
                  </el-row>
                  
                </div>
              </ych-sidebar-layout>

              <ych-sidebar-layout title="可用项目">
                <el-button
                  slot="footer"
                  @click="gameProjectDailogVisible = true"
                  size="mini"
                  type="text">
                  <i class="el-icon-plus"></i>
                  添加项目
                </el-button>

                <div v-if="ticketType === 'TimesCount'">

                  <el-form-item 
                    prop="IsShare" 
                    label="是否共享次数">

                    <el-radio-group v-model="timesCount.IsShare">
                      <el-radio :label="true" border>是</el-radio>
                      <el-radio :label="false" border>否</el-radio>
                    </el-radio-group>
                    
                  </el-form-item>

                  <el-form-item 
                    v-show="timesCount.IsShare"
                    prop="ShareCount" 
                    label="可用次数">

                    <ych-input-number 
                      :min="1"
                      :max="999999"
                      v-model="timesCount.ShareCount">
                      <span slot="append">次</span>
                    </ych-input-number>
                    
                  </el-form-item>
                </div>

                <ych-table
                  :max-height="145"
                  :data="machineItem"
                  :column-controller="false">

                  <el-table-column
                      prop="MachineName"
                      label="项目名称">
                  </el-table-column>

                  <el-table-column
                      prop="MachineType"
                      label="项目类型"
                      width="150">
                  </el-table-column>

                  <el-table-column
                    v-if="ticketType === 'TimesCount'"
                    prop="MachineName"
                    label="可玩次数">

                    <template slot-scope="scope">
                      <el-input-number
                        v-if="!timesCount.IsShare"
                        size="mini" 
                        :min="1"
                        :max="999999"
                        controls-position="right"
                        v-model="scope.row.CanUseTimes">
                      </el-input-number>

                      <span v-else>共享 {{ timesCount.ShareCount }} 次</span>
                    </template>

                  </el-table-column>

                  <ych-table-column-operation
                    @operation-click="handleOperationColumn"
                    :operation="columnOpration">
                  </ych-table-column-operation>

                </ych-table>

              </ych-sidebar-layout>

              <ych-sidebar-layout title="其它设置">
                <ych-form-item 
                  prop="IsNeedBiometric" 
                  label="生物识别"
                  tips="验证过闸时，是否验证指纹、人脸等会员信息">

                  <el-radio-group v-model="otherData.IsNeedBiometric">
                    <el-radio :label="true" border>是</el-radio>
                    <el-radio :label="false" border>否</el-radio>
                  </el-radio-group>
                  
                </ych-form-item>

                <ych-form-item 
                  prop="VoiceText" 
                  label="语音播报"
                  tips="刷卡过闸时，播放的语音信息，为空时不播报">

                  <el-input :maxlength="20" v-model="otherData.VoiceText"></el-input>
                  
                </ych-form-item>

                <!--ych-form-item 
                  prop="PermissionLeaveTimeSpan" 
                  label="离场时间"
                  tips="允许游客中途离场的时间，在允许时间内重新入闸不会重新计费">

                  <ych-input-number v-model="otherData.PermissionLeaveTimeSpan">
                    <span slot="append">分钟</span>
                  </ych-input-number>
                  
                </ych-form-item-->

                <ych-form-item 
                  prop="MaxNumberOfAccompany" 
                  label="陪同票数"
                  tips="通常大人陪同小孩入园游玩，陪同票不产生扣费">

                  <el-select 
                    v-model="otherData.MaxNumberOfAccompany">
                    <el-option 
                      v-for="n in 3"
                      :key="n - 1"
                      :value="n - 1"
                      :label="n - 1">
                    </el-option>
                  </el-select>
                </ych-form-item>

                <ych-form-item
                  double
                  prop="" 
                  label="打印样式"
                  style="display:block;">

                  <el-radio-group v-model="otherData.PrintStyleID">
                  
                    <el-popover
                        v-for="item in TicketListData"
                        :key="item.ID"
                        placement="top"
                        @show="showCanvas(item.ID)"
                        trigger="hover">
                        <div
                          style="width:250px;height:300px;overflow:auto;"
                          v-loading="ticketLoading"
                          element-loading-text="拼命加载中"
                          element-loading-spinner="el-icon-loading">
                          <canvas
                            :id="item.ID">
                          </canvas>
                        </div>
                          <el-radio-button 
                            :label="item.ID" 
                            slot="reference"
                            border 
                            style="margin-right:10px;"
                            >{{item.Name}}</el-radio-button>
                    </el-popover>
                  </el-radio-group>

                </ych-form-item>

                <el-button 
                  slot="footer" 
                  icon="el-icon-plus"
                  @click="$router.push('/goods/ticket-layout')"
                  type="text">
                  添加打印样式
                </el-button>

              </ych-sidebar-layout>

          </side-bar-form>
        </div>
    `
    }
  });