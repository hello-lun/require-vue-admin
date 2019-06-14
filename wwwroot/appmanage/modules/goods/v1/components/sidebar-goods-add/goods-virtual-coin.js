define([
    'components/select-time-unit/index'
], function (
    selectTimeUnit
) {
        'use strict';

        var TIME_UNIT = {
            Hour: '小时',
            Day: '天',
            Month: '月',
            Year: '年'
        };

        return {
            name: 'GoodsVirtualCoin',

            components: {
                SelectTimeUnit: selectTimeUnit,
            },

            props: {
                incomingData: '', 
                data: '',
                validityToggle: {
                    type: Boolean,
                    default: true
                },
                name: '',
            },

            data: function () {
                var now = this.$moment().format();
                // 一个月后
                var monthAfter = this.$moment().add(1, 'M').format();
                return {

                    timeUnit: TIME_UNIT,

                    effectiveType: {
                        'WhenLong': '有效时长',
                        'Date': '指定日期'
                    },

                    VirtualCurrencyData: {
                        // 虚拟币数量
                        Num: 0,
                        // 有效期
                        StartValidity: now,
                        // 有效期结束时间
                        EndValidity: monthAfter,
                        // 有效期类型
                        EffectiveType: 'WhenLong',
                        // 售卖后时间
                        SaledPeriod: 0,
                        // 售卖后时间单位
                        SaledUnit: 'Day',
                        // 有效期时间
                        EffectivePeriod: 0,
                        // 有效期单位
                        EffectiveUnit: 'Day',
                        // 虚拟币ID
                        VirtualCurrencyID: ''
                    },

                    rules: {
                        Num: [
                            { required: true, message: '请填写数量', trigger: 'blur' }
                        ]
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

                virtualCoinValidity: {
                    get: function () {
                        // 处理日期组件 接收 [null, null] 数据报错的问题
                        if (!this.VirtualCurrencyData.StartValidity  && !this.VirtualCurrencyData.EndValidity) {
                            return null;
                        }

                        return [this.VirtualCurrencyData.StartValidity, this.VirtualCurrencyData.EndValidity];
                    },

                    set: function (val) {
                        val = val || [];
                        var start = val[0] || null;
                        var end = val[1] || null;
                        this.VirtualCurrencyData.StartValidity = start;
                        this.VirtualCurrencyData.EndValidity = end;
                    }
                },

                currencyName: function () {
                    var name;

                    if (this.id) {

                    }

                    return name;
                }
            },

            watch: {
                'data': {
                    immediate: true,
                    handler: function (val) {
                        this.watchVirtualCoinInfo(val)
                    }
                }
            },

            methods: {
                getData: function () {
                    var data = {};

                    var type = this.VirtualCurrencyData.EffectiveType;

                    var pickField = ['EffectiveType', 'Num', 'VirtualCurrencyID'];
                    // 没有开启有效期，不返回有效期数据
                    if (this.validityToggle) {
                        if (type === 'WhenLong') {
                            pickField = _.concat(
                                pickField, 
                                ['SaledPeriod', 'SaledUnit', 'EffectivePeriod', 'EffectiveUnit']
                            );
                        } else if (type === 'Date') {
                            pickField = _.concat(
                                pickField, 
                                ['StartValidity', 'EndValidity']
                            );
                        }
                    }

                    _.assign(
                        data, 
                        _.pick(
                            this.VirtualCurrencyData, 
                            pickField
                        )
                    );

                    // 新增时，需要把外部类型ID
                    if (!this.id) {
                        data.VirtualCurrencyID = this.setting.ID;
                    }

                    return data;
                },

                validate: function () {
                    return this.$refs.form.validate();
                },

                watchVirtualCoinInfo: function (val) {
                    if (!val) {
                        return;
                    }
                    // 根据不同有效期类型赋值
                    var baseField = ['Num', 'VirtualCurrencyID', 'EffectiveType'];
                    var map = {
                        'WhenLong': ['SaledPeriod', 'SaledUnit', 'EffectivePeriod', 'EffectiveUnit'],
                        'Date': ['StartValidity', 'EndValidity']
                    };

                    var fields = _.concat(baseField, map[val.EffectiveType] || []);
                    _.assign(
                        this.VirtualCurrencyData, 
                        _.pick(val, fields)
                    );
                },

            },

            template: `
                <div class="sidebar-goods-add__virtual-coin">
                    <side-bar-form 
                        ref="form"
                        :model="VirtualCurrencyData"
                        :rules="rules">

                        <ych-sidebar-layout title="数量设置">
                            <el-form-item 
                                prop="Num" 
                                :label="name + '数量'">
                                <ych-input-number v-model="VirtualCurrencyData.Num">
                                </ych-input-number>
                            </el-form-item>
                        </ych-sidebar-layout>

                        <ych-sidebar-layout 
                            v-if="validityToggle" 
                            title="有效期">
                            <el-row>
                                <el-form-item 
                                    prop="EffectiveType" 
                                    label="有效期类型">
                
                                    <el-select v-model="VirtualCurrencyData.EffectiveType">
                                    <el-option
                                        v-for="(label, key) in effectiveType"
                                        :key="key"
                                        :value="key"
                                        :label="label">
                                    </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-row>
                            
                            <template v-if="VirtualCurrencyData.EffectiveType === 'WhenLong'">
                                <el-form-item 
                                    prop="SaledPeriod" 
                                    label="生效时间">
                
                                    <ych-input-number v-model="VirtualCurrencyData.SaledPeriod">
                                    <select-time-unit 
                                        slot="append" 
                                        v-model="VirtualCurrencyData.SaledUnit">
                                    </select-time-unit>
                                    </ych-input-number>
                
                                </el-form-item>
                                <el-form-item 
                                    prop="EffectivePeriod" 
                                    label="有效时间">
                
                                    <ych-input-number v-model="VirtualCurrencyData.EffectivePeriod">
                                    <select-time-unit 
                                        slot="append" 
                                        v-model="VirtualCurrencyData.EffectiveUnit">
                                    </select-time-unit>
                                    </ych-input-number>
                
                                </el-form-item>
                            </template>
            
                            <template v-if="VirtualCurrencyData.EffectiveType === 'Date'">
            
                                <el-form-item 
                                    prop="VirtualCoinValidity" 
                                    label="有效期">
                
                                    <el-date-picker
                                        v-model="virtualCoinValidity"
                                        type="daterange"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                                    </el-date-picker>
                
                                </el-form-item>
            
                            </template>
        
                        </ych-sidebar-layout>
        
                    </side-bar-form>
                </div>
            `
        }
    });