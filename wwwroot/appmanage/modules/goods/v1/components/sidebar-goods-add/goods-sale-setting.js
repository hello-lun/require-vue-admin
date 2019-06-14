define([
], function() {
    'use strict';

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
    }
    
    return {
        name: 'GoodsSaleSetting',

        components: {
            StatePrice: statePrice
        },

        props: {
            incomingData: '',
            data: Object,
            currentSalePrice: {
                type: Number,
                default: 1
            },
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
                    return callback(new Error('请填写数字值！'));
                }

                callback();
            }

            var validateTime = function (rule, value, callback) {
                if (!_.isArray(value)) {
                    return callback(new Error('请选择生效日期'));
                }
                var startTime = Date.parse(value[0] || null);
                var endTime = Date.parse(value[1] || null);

                var now = Date.parse(self.$moment().format('YYYY-MM-DD'));

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

                return findedItemIndex > -1 ? callback(new Error('日期段已存在该商品价格策略列表')) : callback();
            }

            return {
                dataList: [],
                editRowIndex: [],
                tempRow: {},

                formData: {
                    ReturnFee: 0,
                    ReturnType: 'No',
                    AfterSaleTimer: 0,
                    AfterSaleUnit: 'Hour'
                },

                addFormData: {
                    ID: '',
                    Time: [],
                    SalePrice: null,
                    New: true
                },

                addFormRules: {
                    Time: [
                        {required: true, validator: validateTime, trigger: 'blur' }
                    ]
                },

                rules: {
                    // ReturnFee: [
                    //     { required: true, message: '请填写退货手续费', trigger: 'blur' }
                    // ],

                    ReturnType: [
                        { validator: validateReturn, trigger: 'blur' }
                    ],

                    AfterSaleTimer: [
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
                    data = { PricePolicyReturnSet: this.formData };
                }

                return _.extend(
                    data, 
                    {
                        PricePolicy: _.map(this.dataList, function (item) {
                            // 移除临时ID
                            if (item.New) {
                                item.ID = null;
                            }
                            return item;
                        })
                    }
                );
            },

            handleFieldMap: function () {
                var self = this;

                var unwatch = this.$watch('data', function (val) {
                    if (val.ServiceCharge === undefined) return;
                    self.handleDataMap(val);
                    // 清除监听
                    unwatch();
                }, {
                    deep: true,
                    immediate: true
                });

            },

            handleDataMap: function (val) {
                var activityPriceList = val.ActivityPriceList;

                this.dataList = _.map(
                    activityPriceList, 
                    function (item) {
                        var temp = _.extend({}, item);
                        temp.SalePrice = temp.Price;
                        delete temp.Price;
                        return temp;
                    }
                );

                _.extend(this.formData, {
                    ReturnFee: val.ServiceCharge,
                    ReturnType: val.LimitType,
                    AfterSaleTimer: val.Period,
                    AfterSaleUnit: val.TimeUnit
                });
            },
            // 保存价格策略
            savePricePolicy: function () {
                var self = this;
                this.$refs.addForm.validate(function (valid) {
                    if (!valid) {
                        return;
                    }

                    self.addFormData.ID ? self.modifyPricePolicy() : self.addPricePolicy();

                    self.dialogVisible = false;
                });
            },
            // 修改已存在库中的策略
            modifyPricePolicy: function () {
                var self = this;
                var pricePolicyInfo = _.find(
                    this.dataList, 
                    function (item) {
                        return item.ID === self.addFormData.ID;
                    }
                );
                _.assign(pricePolicyInfo, {
                    ID: self.addFormData.ID,
                    StartTime: self.addFormData.Time[0],
                    EndTime: self.addFormData.Time[1],
                    SalePrice: self.addFormData.SalePrice,
                });
            },

            editPricePolicy: function (item) {
                this.dialogVisible = true;
                
                _.assign(this.addFormData, {
                    ID: item.ID,
                    Time: [item.StartTime, item.EndTime],
                    SalePrice: item.SalePrice,
                    New: item.New === undefined ? false : item.New
                });
            },
            
            removePricePolicy: function (index) {
                var self = this;
                this.$confirm('此操作为移除该价格政策，移除后需要保存才生效，是否继续?', '提示', {
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

            addPricePolicy: function () {
                var self = this;
                var times = self.addFormData.Time || [];
                self.dataList.unshift({
                    // 新增临时ID，用于再次编辑时使用，接口提交时会移除
                    ID: _.uniqueId('tempSalePricePoicy_'),
                    StartTime: times[0],
                    EndTime: times[1],
                    SalePrice: self.addFormData.SalePrice,
                    // 新增标记
                    New: true
                });
                self.$refs.addForm.resetFields();
                self.dialogVisible = false;
            },

            handleSaveBtnStatus: function (row) {
                var disabled = true;
                if (
                    row.StartTime 
                    && row.EndTime 
                    && (row.SalePrice 
                        || row.SalePrice === 0)
                ) {
                    disabled = false;
                }

                return disabled;
            },

            handleDailogClose: function () {
                _.assign(this.addFormData, {
                    ID: '',
                    Time: [],
                    SalePrice: null,
                    New: true
                });

                this.$refs.addForm.clearValidate();
            },

            OpenDailogOfAdd: function () {
                this.dialogVisible = true;
                this.addFormData.SalePrice = this.currentSalePrice;
            }
        },

        template: `
            <div class="sidebar-goods-add__sale-setting">
                <el-dialog
                    title="添加价格策略"
                    :visible.sync="dialogVisible"
                    :append-to-body="true"
                    @close="handleDailogClose"
                    width="350px">

                    <ych-form
                        ref="addForm"
                        :model="addFormData"
                        :rules="addFormRules">

                        <ych-form-item prop="SalePrice" label="售卖价格">
                            <ych-input-number 
                                :min="1"
                                v-model="addFormData.SalePrice">
                                <span slot="append">元</span>
                            </ych-input-number>
                        </ych-form-item>

                        <ych-form-item prop="Time" label="生效日期">
                            <el-date-picker
                                v-model="addFormData.Time"
                                value-format="yyyy-MM-dd"
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
                            @click="savePricePolicy">
                            确 定
                        </el-button>
                    </span>
                </el-dialog>

                <ych-sidebar-layout title="价格政策">
                    <ych-card
                        @click.native="OpenDailogOfAdd"
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
                            :start="item.StartTime"
                            :end="item.EndTime">
                        </state-price>

                        <span class="font-size-18">
                            {{ item.SalePrice | number('0,0.00') }}
                        </span>

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
                                @click="removePricePolicy(index)"
                                size="mini">
                                删除
                            </el-button>
                            <el-button 
                                @click="editPricePolicy(item)"
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
                            prop="ReturnFee" 
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