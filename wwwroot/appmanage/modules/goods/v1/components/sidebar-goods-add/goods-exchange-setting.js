define([
], function() {
    'use strict';

    var STORED_VALUE_TYPE = {
        'Coin': '代币',
        'Lottery': '彩票',
        'Integral': '积分'
    };

    var statePrice = {
        functional: true,
        // props: ['start', 'end']
        render: function (h, context) {
            var startTime = Date.parse(context.props.start);
            var endTime = Date.parse(context.props.end);
            var now = new Date();

            var state = 'info',
                txt = '未知状态';

            if (now < startTime) {
                state = 'warning';
                txt = '未生效';
            } else if (now > startTime && now < endTime) {
                state = 'success';
                txt = '生效中';
            } else if (now > endTime) {
                txt = '失效';
            }
        
            return h('ych-state-tag', {
                slot: 'header',
                props: {
                    state: state,
                    text: txt
                }
            })
        }
    };

    var storedValueContent = {
        functional: true,

        render: function (h, context) {
            var data = context.props.data;

            var valuesField = [];
            data.Coin && valuesField.push('Coin');
            data.Integral && valuesField.push('Integral');
            data.Lottery && valuesField.push('Lottery');

            var handleTextContent = function (field) {
                var storedValueName = STORED_VALUE_TYPE[field] || '未知储值';
                return `${storedValueName}: ${$number(data[field]).format('0,0')}`
            };

            var valuesChild = _.map(
                valuesField, 
                function (field) {
                    return h('el-row', {
                        style: {
                            textAlign: 'left'
                        },
                        domProps: {
                            textContent: handleTextContent(field)
                        }
                    })
                }
            );

            return h('el-row', {
                // style: {
                //     width: '100%'
                // }
            }, [
                h('el-col', {
                    class: ['font-size-16', 'color-info'],
                    props: {
                        span: 24
                    }
                }, valuesChild)
            ])
        }
    }
    
    return {
        name: 'GoodsExchangeSetting',

        components: {
            StatePrice: statePrice,
            StoredValueContent: storedValueContent
        },

        props: {
            incomingData: '',
            data: Object,
            refundToggle: {
                type: Boolean,
                default: true
            },
        },

        created: function () {
            this.id && this.handleFieldMap();
        },

        computed: {
            id: function () {
                return this.incomingData.id;
            }
        },

        data: function () {
            var self = this;

            var validateReturn = function (rule, value, callback) {
                if (value === 'Limit' && !_.isNumber(self.formData.AfterSaleTimer)) {
                    return callback('请填写数字值！');
                }

                callback();
            };

            var validateTime = function (rule, value, callback) {
                if (!_.isArray(value)) {
                    return callback(new Error('请选择生效日期'));
                }
                var startTime = Date.parse(value[0] || null);
                var endTime = Date.parse(value[1] || null);

                var now = new Date();

                if(endTime < now && self.addFormData.New) {
                    return callback(new Error('失效时间必须大于当前时间!'));
                }
               
                var findedItemIndex = _.findIndex(
                    self.dataList, 
                    function (item) {
                        // 如果遍历到当前策略，直接跳过
                        if (self.addFormData.ID === item.ID) {
                            return false;
                        }

                        var itemStartTime = Date.parse(item.StartTime);
                        var itemEndTime = Date.parse(item.EndTime);
                        return !(startTime > itemEndTime || endTime < itemStartTime);
                    }
                );

                return findedItemIndex > -1 ? callback(new Error('日期段已存在该商品的价格策略列表')) : callback();
            };

            return {
                dataList: [],

                formData: {
                    ReturnFee: 0,
                    ReturnType: 'No',
                    AfterSaleTimer: 0,
                    AfterSaleUnit: 'Hour'
                },

                addFormData: {
                    ID: '',
                    Time: [],
                    Coin: null,
                    Integral: null,
                    Lottery: null,
                    AllowType: [],
                    New: true
                },

                addFormRules: {
                    Time: [
                        { required: true, message: '请选择生效日期', trigger: 'change' },
                        { validator: validateTime, trigger: 'blur' }
                    ],

                    AllowType: [
                        { required: true, message: '至少选择一种可兑换储值', trigger: 'blur' }
                    ]
                },

                rules: {
                    ReturnType: [
                        { validator: validateReturn, trigger: 'blur' }
                    ]
                },

                unit: [{
                    label: '小时',
                    value: 'Hour'
                }, {
                    label: '天',
                    value: 'Day'
                }, {
                    label: '周',
                    value: 'Week'
                }, {
                    label: '月',
                    value: 'Month'
                }],

                stroedValueType: STORED_VALUE_TYPE,

                dialogVisible: false
            };
        },

        methods: {
            validate: function () {
                return this.$refs.form.validate();
            },

            getData: function () {
                var data = {};

                if (this.refundToggle) {
                    data = {
                        ExchPricePolicyReturnSet: this.formData
                    };
                }

                return _.extend(
                    data,
                    {
                        ExchPricePolicyShowSet: this.showSetting,
                        ExchPricePolicy: _.filter(this.dataList, function (item) {
                            // 过滤未点保存的数据
                            return item.New !== true
                        })
                    }
                );
            },

            handleFieldMap: function () {
                var self = this;

                var unwatch = this.$watch('data', function (val) {
                    if (val.ExChangePeriod === undefined) return;
                    self.handleDataMap(val);
                    // 清除监听
                    unwatch();
                });
            },

            handleDataMap: function (val) {
                // 因获取 与 提交的字段不一致
                this.dataList = _.map(
                    val.ExChangePriceList, 
                    function (item) {
                        return {
                            ID: item.ID || '',
                            StartTime: item.StartTime,
                            EndTime: item.EndTime,
                            Coin: item.CoinPrice,
                            Integral: item.ScorePrice,
                            Lottery: item.LotteryPrice,
                        };
                    }
                );

                // this.dataList = val.ExChangePriceList;

                _.extend(this.formData, {
                    ReturnType: val.ExChangeCancelLimit,
                    AfterSaleTimer: val.ExChangePeriod,
                    AfterSaleUnit: val.ExChangeTimeUnit
                });
            },

            saveExchangePolicy: function (index, row) {
                var self = this;
                this.$refs.addForm.validate(function (valid) {
                    if (!valid) {
                        return;
                    }

                    self.addFormData.ID ? self.modifyExchangePolicy() : self.addExchangePolicy();

                    self.dialogVisible = false;
                });
            },

            modifyExchangePolicy: function () {
                var self = this;
                var PolicyInfo = _.find(
                    this.dataList, 
                    function (item) {
                        return item.ID === self.addFormData.ID;
                    }
                );
                _.assign(PolicyInfo, {
                    ID: self.addFormData.ID,
                    StartTime: self.addFormData.Time[0],
                    EndTime: self.addFormData.Time[1],
                }, this.handleStoredValueData());

                self.dialogVisible = false;
            },
            
            removeExchangePolicy: function (index) {
                var self = this;
                this.$confirm('此操作为移除该兑换政策，移除后需要保存才生效，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    self.dataList.splice(index, 1);
                    self.$message({
                        type: 'success',
                        message: '移除成功!'
                    });
                }).catch();
            },

            editExchangePolicy: function (item) {
                this.dialogVisible = true;

                var allowType = [];

                item.Coin && allowType.push('Coin');
                item.Integral && allowType.push('Integral');
                item.Lottery && allowType.push('Lottery');
                
                _.assign(this.addFormData, {
                    Time: [item.StartTime, item.EndTime],
                    AllowType: allowType,
                    New: item.New === undefined ? false : item.New
                }, _.pick(item, 
                    ['ID', 'Coin', 'Integral', 'Lottery']
                ));
            },

            handleStoredValueData: function () {
                var coin = this.addFormData.AllowType.indexOf('Coin') > -1 ? this.addFormData.Coin : null;
                var integral = this.addFormData.AllowType.indexOf('Integral') > -1 ? this.addFormData.Integral : null;
                var lottery = this.addFormData.AllowType.indexOf('Lottery') > -1 ? this.addFormData.Lottery : null;
                return {
                    Coin: coin,
                    Integral: integral,
                    Lottery: lottery,
                };
            },

            addExchangePolicy: function () {
                var self = this;
                
                self.dataList.unshift(
                    _.assign({
                        // 新增临时ID，用于再次编辑时使用，接口提交时会移除
                        ID: _.uniqueId('tempExchangePoicy_'),
                        StartTime: self.addFormData.Time[0],
                        EndTime: self.addFormData.Time[1],
                        New: true
                    }, this.handleStoredValueData())
                );

                self.dialogVisible = false;
            },

            initDailog: function () {
                _.assign(this.addFormData, {
                    ID: '',
                    Time: [],
                    Coin: null,
                    Integral: null,
                    Lottery: null,
                    AllowType: []
                });
            }
        },

        template: `
            <div class="sidebar-goods-add__sale-setting">
                <el-dialog
                    class="sidebar-goods-add__sale-setting-dialog"
                    title="添加兑换策略"
                    :visible.sync="dialogVisible"
                    @close="initDailog"
                    :append-to-body="true"
                    width="350px">

                    <ych-form
                        ref="addForm"
                        :model="addFormData"
                        :rules="addFormRules">

                        <ych-form-item prop="AllowType" label="可兑换储值">
                            <el-checkbox-group v-model="addFormData.AllowType">
                                <el-row
                                    v-for="(name, key) in stroedValueType"
                                    :key="key">
                                    <el-checkbox 
                                        :label="key">
                                        {{ name }}
                                        <ych-input-number 
                                            :min="1"
                                            v-model="addFormData[key]"
                                            :disabled="addFormData.AllowType.indexOf(key) === -1">
                                        </ych-input-number>
                                    </el-checkbox>
                                </el-row>
                            </el-checkbox-group>
                        </ych-form-item>

                        <ych-form-item prop="Time" label="生效日期">
                            <el-date-picker
                                v-model="addFormData.Time"
                                type="daterange"
                                start-placeholder="生效日期"
                                end-placeholder="失效日期">
                            </el-date-picker>
                        </ych-form-item>

                    </ych-form>

                    <span slot="footer">
                        <el-button 
                            size="mini" 
                            @click="dialogVisible = false">
                            取 消
                        </el-button>
                        <el-button 
                            size="mini" 
                            type="primary" 
                            @click="saveExchangePolicy">
                            确 定
                        </el-button>
                    </span>
                </el-dialog>

                <ych-sidebar-layout title="兑换政策">
                    <ych-card
                        @click.native="dialogVisible = true"
                        type="add"
                        width="130px"
                        height="150px">
                    </ych-card>
                    <ych-card 
                        v-for="(item, index) in dataList"
                        :key="item.ID"
                        :mask="true"
                        width="130px"
                        height="150px">
                        <state-price 
                            slot="header"
                            :start="item.StartTime"
                            :end="item.EndTime">
                        </state-price>

                        <stored-value-content :data="item"></stored-value-content>

                        <el-row slot="footer">
                            <el-col>
                                <el-row>
                                    <small>
                                        生效：
                                        {{ item.StartTime | timeFormate('YYYY-MM-DD') }}
                                    </small>
                                </el-row>
                                <el-row>
                                    <small>
                                        失效：
                                        {{ item.EndTime | timeFormate('YYYY-MM-DD') }}
                                    </small>
                                </el-row>
                            </el-col>
                        </el-row>

                        <template slot="mask">
                            <el-button 
                                @click="removeExchangePolicy(index)"
                                size="mini">
                                删除
                            </el-button>
                            <el-button 
                                @click="editExchangePolicy(item)"
                                type="primary" 
                                size="mini">
                                编辑
                            </el-button>
                        </template>
                    </ych-card>
                </ych-sidebar-layout>

                <side-bar-form 
                    ref="form"
                    :model="formData"
                    :rules="rules">
                    <ych-sidebar-layout
                        v-if="refundToggle" 
                        title="退货设置">
                        <el-row>
                            <el-form-item prop="ReturnType" label="退货限制">
                                <el-select
                                    v-model="formData.ReturnType">
                                    <el-option 
                                        label="不可退" 
                                        value="No">
                                    </el-option>
                                    <el-option 
                                        value="AnyTime"
                                        label="随时退">
                                    </el-option>
                                    <el-option 
                                        label="限制可退餐时长" 
                                        value="Limit">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-row>

                        <el-form-item 
                            v-show="['AnyTime', 'Limit'].indexOf(formData.ReturnType) > -1"
                            prop="ReturnFeeAfterSaleTimer" 
                            label="退餐手续费">
                            <ych-input-number 
                                v-model="formData.ReturnFee"
                                :min="0">
                                <span slot="append">元</span>
                            </ych-input-number>
                        </el-form-item>

                        <ych-form-item 
                            v-show="formData.ReturnType === 'Limit'"
                            prop="AfterSaleTimer" 
                            label="可退餐时长"
                            tips="商品售卖后在“可退餐时长”时间范围内可以退">
                            <ych-input-number 
                                v-model="formData.AfterSaleTimer"
                                :min="0">
                                
                                <el-select 
                                    style="width: 50px;"
                                    v-model="formData.AfterSaleUnit" 
                                    slot="append">
                                    <el-option 
                                        v-for="item in unit"
                                        :key="item.value" 
                                        :label="item.label" 
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </ych-input-number>
                        </ych-form-item>
                    </ych-sidebar-layout>

                </side-bar-form>
            </div>
        `
    }
});