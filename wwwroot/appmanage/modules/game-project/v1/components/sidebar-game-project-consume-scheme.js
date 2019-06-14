define([
    'framework/mixins/sidebar-form',
    'api/virtual-currency/v1/VirtualCurrency',

], function (
    sideBarForm,
    virtualCurrency,

    ) {
        'use strict';
        return {
            name: 'SidebarGameProjectConsumeScheme',
            props: ['formDataBase', 'enumConsumeModes', 'enumCardConsumeModes', 'enumChargeModels'],
            mixins: [sideBarForm],
            components: {

            },
            created: function () {
                this.asyncGetVirtualCurrencyDetail();
            },
            data: function () {
                var self = this;
                var validateValueInPerTime1 = function (rule, value, callback) {
                    if (self.ValueInPerTime1.UseValue != "") {
                        if (self.ValueInPerTime1.UseValue == self.ValueInPerTime2.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime1.UseValue == self.ValueInPerTime3.UseValue) {
                            return callback('储值类型重复');
                        }
                    }
                    callback();
                };

                var validateValueInPerTime2 = function (rule, value, callback) {
                    if (self.ValueInPerTime2.UseValue != "") {
                        if (self.ValueInPerTime2.UseValue == self.ValueInPerTime1.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime3.UseValu != ""
                            && self.ValueInPerTime2.UseValue == self.ValueInPerTime3.UseValue) {
                            return callback('储值类型重复');
                        }

                    }
                    callback();
                };

                var validateValueInPerTime3 = function (rule, value, callback) {
                    if (self.ValueInPerTime3.UseValue != "") {
                        if (self.ValueInPerTime3.UseValue == self.ValueInPerTime1.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime3.UseValue == self.ValueInPerTime2.UseValue) {
                            return callback('储值类型重复');
                        }
                    }

                    callback();
                };


                return {
                    showAdvancedSetting: false,
                    TimeModeValueTypeName: '元',
                    TimeModeValueTypeList: [{
                        ID: '',
                        Name: '',
                        Decimal: 0
                    }],
                    TimeModeValueTypeDecimal: 0,
                    ValueInPerTime1: {
                        Amount: 1,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },
                    ValueInPerTime2: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },
                    ValueInPerTime3: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    ValueInPerTime21: {
                        Amount: 0,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },

                    ValueInPerTime211: {
                        Amount: 0,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },

                    ValueInPerTime22: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },

                    ValueInPerTime222: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },

                    ValueInPerTime23: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    ValueInPerTime233: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    rules: {
                        ValueInPerTime1: [
                            { validator: validateValueInPerTime1, trigger: 'blur' }
                        ],
                        ValueInPerTime2: [
                            { validator: validateValueInPerTime2, trigger: 'blur' }
                        ],
                        ValueInPerTime3: [
                            { validator: validateValueInPerTime3, trigger: 'blur' }
                        ],
                    },
                };

                var validateValueInPerTime21 = function (rule, value, callback) {
                    if (self.ValueInPerTime21.UseValue != "") {
                        if (self.ValueInPerTime21.UseValue == self.ValueInPerTime22.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime21.UseValue == self.ValueInPerTime23.UseValue) {
                            return callback('储值类型重复');
                        }
                    }
                    callback();
                };

                var validateValueInPerTime22 = function (rule, value, callback) {
                    if (self.ValueInPerTime22.UseValue != "") {
                        if (self.ValueInPerTime22.UseValue == self.ValueInPerTime21.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime23.UseValu != ""
                            && self.ValueInPerTime22.UseValue == self.ValueInPerTime23.UseValue) {
                            return callback('储值类型重复');
                        }

                    }
                    callback();
                };

                var validateValueInPerTime23 = function (rule, value, callback) {
                    if (self.ValueInPerTime23.UseValue != "") {
                        if (self.ValueInPerTime23.UseValue == self.ValueInPerTime21.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime23.UseValue == self.ValueInPerTime22.UseValue) {
                            return callback('储值类型重复');
                        }
                    }

                    callback();
                };


                return {
                    showAdvancedSetting: false,
                    TimeModeValueTypeName: '元',
                    TimeModeValueTypeList: [{
                        ID: '',
                        Name: '',
                        Decimal: 0
                    }],
                    TimeModeValueTypeDecimal: 0,
                    ValueInPerTime1: {
                        Amount: 0,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },
                    ValueInPerTime2: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },
                    ValueInPerTime3: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    ValueInPerTime21: {
                        Amount: 0,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },

                    ValueInPerTime211: {
                        Amount: 0,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },

                    ValueInPerTime22: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },

                    ValueInPerTime222: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },

                    ValueInPerTime23: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    ValueInPerTime233: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    rules: {
                        ValueInPerTime1: [
                            { validator: validateValueInPerTime1, trigger: 'blur' }
                        ],
                        ValueInPerTime2: [
                            { validator: validateValueInPerTime2, trigger: 'blur' }
                        ],
                        ValueInPerTime3: [
                            { validator: validateValueInPerTime3, trigger: 'blur' }
                        ],
                    },
                };


                var validateValueInPerTime211 = function (rule, value, callback) {
                    if (self.ValueInPerTime211.UseValue != "") {
                        if (self.ValueInPerTime211.UseValue == self.ValueInPerTime222.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime211.UseValue == self.ValueInPerTime233.UseValue) {
                            return callback('储值类型重复');
                        }
                    }
                    callback();
                };

                var validateValueInPerTime222 = function (rule, value, callback) {
                    if (self.ValueInPerTime222.UseValue != "") {
                        if (self.ValueInPerTime222.UseValue == self.ValueInPerTime211.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime223.UseValu != ""
                            && self.ValueInPerTime222.UseValue == self.ValueInPerTime233.UseValue) {
                            return callback('储值类型重复');
                        }

                    }
                    callback();
                };

                var validateValueInPerTime233 = function (rule, value, callback) {
                    if (self.ValueInPerTime233.UseValue != "") {
                        if (self.ValueInPerTime233.UseValue == self.ValueInPerTime211.UseValue) {
                            return callback('储值类型重复');
                        }
                        if (self.ValueInPerTime233.UseValue == self.ValueInPerTime222.UseValue) {
                            return callback('储值类型重复');
                        }
                    }

                    callback();
                };


                return {
                    showAdvancedSetting: false,
                    TimeModeValueTypeName: '元',
                    TimeModeValueTypeList: [{
                        ID: '',
                        Name: '',
                        Decimal: 0
                    }],
                    TimeModeValueTypeDecimal: 0,
                    ValueInPerTime1: {
                        Amount: 1,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },
                    ValueInPerTime2: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },
                    ValueInPerTime3: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    ValueInPerTime21: {
                        Amount: 0,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },

                    ValueInPerTime211: {
                        Amount: 0,
                        UseValue: '',
                        Index: 0,
                        IsShow: true
                    },

                    ValueInPerTime22: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },

                    ValueInPerTime222: {
                        Amount: 0,
                        UseValue: '',
                        Index: 1,
                        IsShow: false
                    },

                    ValueInPerTime23: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    ValueInPerTime233: {
                        Amount: 0,
                        UseValue: '',
                        Index: 2,
                        IsShow: false
                    },

                    rules: {
                        ValueInPerTime1: [
                            { validator: validateValueInPerTime1, trigger: 'blur' }
                        ],
                        ValueInPerTime2: [
                            { validator: validateValueInPerTime2, trigger: 'blur' }
                        ],
                        ValueInPerTime3: [
                            { validator: validateValueInPerTime3, trigger: 'blur' }
                        ],
                        ValueInPerTime21: [
                            { validator: validateValueInPerTime21, trigger: 'blur' }
                        ],
                        ValueInPerTime22: [
                            { validator: validateValueInPerTime22, trigger: 'blur' }
                        ],
                        ValueInPerTime23: [
                            { validator: validateValueInPerTime23, trigger: 'blur' }
                        ],
                        ValueInPerTime211: [
                            { validator: validateValueInPerTime211, trigger: 'blur' }
                        ],
                        ValueInPerTime222: [
                            { validator: validateValueInPerTime222, trigger: 'blur' }
                        ],
                        ValueInPerTime233: [
                            { validator: validateValueInPerTime233, trigger: 'blur' }
                        ],
                    },
                };

            },
            computed: {

            },
            mounted: function () {

            },
            watch: {
                formDataBase: {
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        if (newval) {
                            var self = this;

                            self.formDataBase.UseValues[0] = self.ValueInPerTime1;
                            self.formDataBase.UseValues[1] = self.ValueInPerTime2;
                            self.formDataBase.UseValues[2] = self.ValueInPerTime3;

                            self.formDataBase.UseValues2[0] = self.ValueInPerTime21;
                            self.formDataBase.UseValues2[1] = self.ValueInPerTime22;
                            self.formDataBase.UseValues2[2] = self.ValueInPerTime23;

                            self.formDataBase.UseValues22[0] = self.ValueInPerTime211;
                            self.formDataBase.UseValues22[1] = self.ValueInPerTime222;
                            self.formDataBase.UseValues22[2] = self.ValueInPerTime233;
                        } else {
                        }
                    }
                },
                enumConsumeModes: {
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        if (newval) {
                            this.enumConsumeModes = newval;

                        } else {
                        }

                    }
                },
                enumCardConsumeModes: {
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        if (newval) {
                            this.enumCardConsumeModes = newval;

                        } else {
                        }

                    }
                },
                enumChargeModels: {
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        if (newval) {
                            this.enumChargeModels = newval;

                        } else {
                        }

                    }
                },

            },
            methods: {
                validate: function () {
                    return this.$refs.form.validate();
                },
                //获取储值类型 
                asyncGetVirtualCurrencyDetail: function () {
                    var self = this;
                    virtualCurrency.GetRefCard()
                        .then(function (res) {
                            self.TimeModeValueTypeList = res.Data;
                        });
                    var arrAll = {
                        ID: null,
                        Name: '',
                        Decimal: 0
                    };
                    self.TimeModeValueTypeList.unshift(arrAll);
                },
                //打开高级设置
                openAdvancedSetting: function () {
                    var self = this;
                    if (self.showAdvancedSetting == false) {
                        self.showAdvancedSetting = true;
                    } else {
                        self.showAdvancedSetting = false;
                    }
                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //处理刷卡间隔
                handleCardConsumeDelayChange: function (value) {
                    var self = this;
                    self.$nextTick(function () {
                        if (value == null || value == "" || value == undefined) value = 0;
                        self.formDataBase.CardConsumeDelay = Math.round(Number(value));
                    });
                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //扣储值类型事件
                handleSelectTimeModeValueType: function () {
                    var self = this;
                    self.TimeModeValueTypeList.forEach(item => {
                        if (item.ID == self.formDataBase.TimeModeValueType) {
                            self.TimeModeValueTypeDecimal = item.Decimal;
                            self.TimeModeValueTypeName = item.Name;
                        }
                    });
                    self.handleBasePriceChange();
                    self.handleOverPriceChange();
                    self.handleMaxPriceChange();
                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //基础分钟数
                handleBaseMinutesChange: function (value) {
                    var self = this;

                    if (value == null || value == "" || value == undefined) {
                        value = 0;
                    }
                    self.formDataBase.BaseMinutes = Math.round(Number(value));
                    self.$emit('consume-scheme-edit', self.formDataBase);
                    return self.formDataBase.BaseMinutes;
                },
                //基础价格
                handleBasePriceChange: function () {
                    var self = this;
                    var value = self.formDataBase.BasePrice;
                    if (value == null || value == "" || value == undefined) {
                        value = 0;
                    }
                    value = Math.round(Number(value), self.TimeModeValueTypeDecimal);
                    self.formDataBase.BasePrice = value;
                    self.$emit('consume-scheme-edit', self.formDataBase);
                    return value;
                },
                //超时分钟数
                handleOverMinutesChange: function (value) {
                    var self = this;

                    if (value == null || value == "" || value == undefined) {
                        value = 0;
                    }
                    self.formDataBase.OverMinutes = Math.round(Number(value));
                    self.$emit('consume-scheme-edit', self.formDataBase);
                    return self.formDataBase.OverMinutes;
                },
                //超时价格
                handleOverPriceChange: function () {
                    var self = this;
                    var value = self.formDataBase.OverPrice;
                    if (value == null || value == "" || value == undefined) {
                        value = 0;
                    }
                    self.formDataBase.OverPrice = Math.round(Number(value), self.TimeModeValueTypeDecimal);
                    self.$emit('consume-scheme-edit', self.formDataBase);
                    return self.formDataBase.OverPrice;
                },
                //封顶金额
                handleMaxPriceChange: function () {
                    var self = this;
                    var value = self.formDataBase.MaxPrice;
                    if (value == null || value == "" || value == undefined) {
                        value = 0;
                    }
                    self.formDataBase.MaxPrice = Math.round(Number(value), self.TimeModeValueTypeDecimal);
                    self.$emit('consume-scheme-edit', self.formDataBase);
                    return self.formDataBase.MaxPrice;
                },
                //新增每局消耗
                handleValueInPerTime1: function () {
                    var self = this;
                    if (self.ValueInPerTime2.IsShow == false && self.ValueInPerTime3.IsShow == false) {
                        self.ValueInPerTime2.IsShow = true;
                    }
                    else if (self.ValueInPerTime2.IsShow == true && self.ValueInPerTime3.IsShow == false) {
                        self.ValueInPerTime3.IsShow = true;
                    }
                    else if (self.ValueInPerTime2.IsShow == false && self.ValueInPerTime3.IsShow == true) {
                        self.ValueInPerTime3.IsShow = false;
                    }
                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //删除每局消耗
                handleDelValueInPerTime1: function () {
                    var self = this;
                    var Amount = self.ValueInPerTime3.Amount;
                    var UseValue = self.ValueInPerTime3.UseValue;
                    self.ValueInPerTime2.Amount = Amount;
                    self.ValueInPerTime2.UseValue = UseValue;

                    if (self.ValueInPerTime3.IsShow == true) {
                        self.ValueInPerTime2.IsShow == true;
                    } else {
                        self.ValueInPerTime2.IsShow = false;
                    }

                    self.ValueInPerTime3.IsShow = false;
                    self.ValueInPerTime3.Amount = 0;
                    self.ValueInPerTime3.UseValue = '';
                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //删除每局消耗
                handleDelValueInPerTime2: function () {
                    var self = this;
                    self.ValueInPerTime3.Amount = 0;
                    self.ValueInPerTime3.UseValue = '',
                        self.ValueInPerTime3.Index = 2;
                    self.ValueInPerTime3.IsShow = false;
                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //按键消耗
                handleValueInPerTime2: function () {
                    var self = this;
                    if (self.ValueInPerTime222.IsShow == false && self.ValueInPerTime233.IsShow == false) {
                        self.ValueInPerTime222.IsShow = true;
                    }
                    else if (self.ValueInPerTime222.IsShow == true && self.ValueInPerTime233.IsShow == false) {
                        self.ValueInPerTime233.IsShow = true;
                    }
                    else if (self.ValueInPerTime222.IsShow == false && self.ValueInPerTime233.IsShow == true) {
                        self.ValueInPerTime233.IsShow = false;
                    }
                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //删除按键消耗
                handleDelValueInPerTime11: function () {
                    var self = this;
                    var Amount = self.ValueInPerTime23.Amount;
                    var UseValue = self.ValueInPerTime23.UseValue;
                    self.ValueInPerTime22.Amount = Amount;
                    self.ValueInPerTime22.UseValue = UseValue;

                    var Amount2 = self.ValueInPerTime233.Amount;
                    var UseValue2 = self.ValueInPerTime233.UseValue;
                    self.ValueInPerTime222.Amount = Amount2;
                    self.ValueInPerTime222.UseValue = UseValue2;

                    if (self.ValueInPerTime233.IsShow == true) {
                        self.ValueInPerTime222.IsShow == true;
                    } else {
                        self.ValueInPerTime222.IsShow = false;
                    }

                    self.ValueInPerTime23.IsShow = false;
                    self.ValueInPerTime23.Amount = 0;
                    self.ValueInPerTime23.UseValue = '';


                    self.ValueInPerTime233.IsShow = false;
                    self.ValueInPerTime233.Amount = 0;
                    self.ValueInPerTime233.UseValue = '';

                    self.$emit('consume-scheme-edit', self.formDataBase);

                },
                //删除按键消耗
                handleDelValueInPerTime22: function () {
                    var self = this;
                    self.ValueInPerTime23.Amount = 0;
                    self.ValueInPerTime23.UseValue = '',
                        self.ValueInPerTime23.Index = 2;
                    self.ValueInPerTime23.IsShow = false;

                    self.ValueInPerTime233.Amount = 0;
                    self.ValueInPerTime233.UseValue = '',
                        self.ValueInPerTime233.Index = 2;
                    self.ValueInPerTime233.IsShow = false;

                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //刷卡模式变化
                handleCheckedCardConsumeModeChange: function () {
                    var self = this;

                    if (self.formDataBase.CardConsumeMode == "None") {
                    }
                    else if (self.formDataBase.CardConsumeMode == "Now" || self.formDataBase.CardConsumeMode == "Delay") {
                        self.formDataBase.UseValues[0] = self.ValueInPerTime1;

                        self.formDataBase.UseValues[1] = self.ValueInPerTime2;

                        self.formDataBase.UseValues[2] = self.ValueInPerTime3;

                    }
                    else if (self.formDataBase.CardConsumeMode == "Button") {

                        self.formDataBase.UseValues2[0] = self.ValueInPerTime21;

                        self.formDataBase.UseValues2[1] = self.ValueInPerTime22;

                        self.formDataBase.UseValues2[2] = self.ValueInPerTime23;

                        self.formDataBase.UseValues22[0] = self.ValueInPerTime211;

                        self.formDataBase.UseValues22[1] = self.ValueInPerTime222;

                        self.formDataBase.UseValues22[2] = self.ValueInPerTime233;

                    }

                    self.$emit('consume-scheme-edit', self.formDataBase);
                },
                //值改变
                handleEmitChange: function () {

                    var self = this;
                    self.TimeModeValueTypeList.forEach(item => {
                        if (self.ValueInPerTime1.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime1.Amount), item.Decimal);
                            self.ValueInPerTime1.Amount = Amount;
                        }
                        if (self.ValueInPerTime2.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime2.Amount), item.Decimal);
                            self.ValueInPerTime2.Amount = Amount;
                        }
                        if (self.ValueInPerTime3.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime3.Amount), item.Decimal);
                            self.ValueInPerTime3.Amount = Amount;
                        }

                        if (self.ValueInPerTime21.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime21.Amount), item.Decimal);
                            self.ValueInPerTime21.Amount = Amount;
                        }
                        if (self.ValueInPerTime22.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime22.Amount), item.Decimal);
                            self.ValueInPerTime22.Amount = Amount;
                        }
                        if (self.ValueInPerTime23.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime23.Amount), item.Decimal);
                            self.ValueInPerTime23.Amount = Amount;
                        }

                        if (self.ValueInPerTime211.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime211.Amount), item.Decimal);
                            self.ValueInPerTime211.Amount = Amount;
                        }
                        if (self.ValueInPerTime222.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime222.Amount), item.Decimal);
                            self.ValueInPerTime222.Amount = Amount;
                        }
                        if (self.ValueInPerTime233.UseValue == item.ID) {
                            var Amount = Math.round(Number(self.ValueInPerTime233.Amount), item.Decimal);
                            self.ValueInPerTime233.Amount = Amount;
                        }

                    });

                    self.handleCheckedCardConsumeModeChange();
                },


            },

            template: `
            <div style="width: 100%;height: 370px;display: block;">
  
                <side-bar-form
                     ref="form"
                    :model="formDataBase"
                    :rules="rules">
                
                    <el-form-item  
                        label="消费模式" 
                        key="ConsumeMode"
                        prop="ConsumeMode">                       
                        <el-radio-group v-model="formDataBase.ConsumeMode" size="mini">
                            <el-radio-button                         
                            border
                            v-for="item in enumConsumeModes"
                            :key="item.value"
                            :label="item.value"
                            >{{item.label}}
                            </el-radio-button>                        
                        </el-radio-group>   
                                        
                    </el-form-item >

                    <el-form-item  
                        label=" " 
                        key="AdvancedSetting"
                        prop="AdvancedSetting">  
                        <el-button type="text" @click="openAdvancedSetting">
                            高级设置
                        </el-button>
                    </el-form-item >  
                
                    <!-------高级设置开始---------->
                    <div v-show="showAdvancedSetting==true"> 

                        <ych-form-item                   
                            label="刷卡模式" 
                            key="CardConsumeMode"
                            prop="CardConsumeMode" double>                       
                            <el-radio-group v-model="formDataBase.CardConsumeMode" size="mini"
                                @change="handleCheckedCardConsumeModeChange">
                                <el-radio-button                         
                                    border
                                    v-for="item in enumCardConsumeModes"
                                    :key="item.value"
                                    :label="item.value">
                                    {{item.label}}
                                </el-radio-button>                        
                            </el-radio-group>                        
                        </ych-form-item >

                        <el-form-item  
                            label="刷卡间隔" 
                            key="CardConsumeDelay"
                            prop="CardConsumeDelay">
                            <ych-input-number 
                                size="mini"
                                :controls="false"
                                :min="0" 
                                :max="999999999"                            
                                onkeypress="return event.keyCode>=48&&event.keyCode<=57"   
                                v-model="formDataBase.CardConsumeDelay"
                                @blur="handleCardConsumeDelayChange(formDataBase.CardConsumeDelay)">
                                <template slot="append">秒,可以刷第二次</template>
                            </ych-input-number>                      
                        </el-form-item >

                    </div>
                    <!-----高级设置结束----->

                    <!---------计时开始--------------->            
                    <div v-show="formDataBase.ConsumeMode=='Time'"> 

                        <el-form-item                   
                            label="进闸扣费方式" 
                            key="ChargeModel"
                            prop="ChargeModel">                                 
                            <el-select 
                                v-model="formDataBase.ChargeModel" 
                                placeholder="请选择">
                                <el-option
                                    v-for="item in enumChargeModels"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>                     
                        </el-form-item >
                            
                        <el-form-item                   
                            label="扣储值类型" 
                            key="TimeModeValueType"
                            prop="TimeModeValueType">                                 
                            <el-select 
                                v-model="formDataBase.TimeModeValueType" 
                                @change="handleSelectTimeModeValueType"
                                placeholder="请选择">
                                <el-option
                                    v-for="item in TimeModeValueTypeList"
                                    :key="item.ID"
                                    :label="item.Name"
                                    :value="item.ID">
                                </el-option>
                            </el-select>                     
                        </el-form-item >
                            
                        <el-form-item  
                            label="基础分钟数" 
                            key="BaseMinutes"
                            prop="BaseMinutes">
                            <ych-input-number 
                                size="mini"
                                :controls="false"
                                :min="0" 
                                :max="999999999"                            
                                onkeypress="return event.keyCode>=48&&event.keyCode<=57"   
                                v-model="formDataBase.BaseMinutes"
                                @blur="handleBaseMinutesChange(formDataBase.BaseMinutes)">
                                <template slot="append">分钟</template>
                            </ych-input-number>                      
                        </el-form-item >

                        <el-form-item  
                            label="基础价格" 
                            key="BasePrice"
                            prop="BasePrice">
                            <ych-input-number
                                size="mini"
                                :controls="false"
                                :min="0" 
                                :max="999999999"              
                                v-model="formDataBase.BasePrice"
                                @change="handleBasePriceChange">
                                <template slot="append" >
                                    {{TimeModeValueTypeName}}
                                </template>
                            </ych-input-number>                      
                        </el-form-item >

                        <el-form-item  
                            label="超时分钟数" 
                            key="OverMinutes"
                            prop="OverMinutes">
                            <ych-input-number
                                size="mini"
                                :controls="false"
                                :min="0" 
                                :max="999999999"
                                onkeypress="return event.keyCode>=48&&event.keyCode<=57"   
                                v-model="formDataBase.OverMinutes"
                                @blur="handleOverMinutesChange(formDataBase.OverMinutes)">
                                <template slot="append">分钟</template>
                            </ych-input-number>                      
                        </el-form-item >

                        <el-form-item  
                            label="超时价格" 
                            key="OverPrice"
                            prop="OverPrice">
                            <ych-input-number                          
                                size="mini"
                                :controls="false"
                                :min="0" 
                                :max="999999999"    
                                v-model="formDataBase.OverPrice"
                                @change="handleOverPriceChange">
                                <template slot="append" >
                                    {{TimeModeValueTypeName}}
                                </template>
                            </ych-input-number>                      
                        </el-form-item >

                        <el-form-item  
                            label="封顶金额" 
                            key="MaxPrice"
                            prop="MaxPrice">
                            <ych-input-number                          
                                size="mini"
                                :controls="false"
                                :min="0" 
                                :max="999999999"    
                                v-model="formDataBase.MaxPrice"
                                @change="handleMaxPriceChange">
                                <template slot="append" >
                                    {{TimeModeValueTypeName}}
                                </template>
                            </ych-input-number>                      
                        </el-form-item >
                        
                        <div style="color:#F56C6C;width:100%;">
                            前{{formDataBase.BaseMinutes}}分钟收费
                            {{formDataBase.BasePrice}}{{TimeModeValueTypeName}}，
                            之后每{{formDataBase.OverMinutes}}分钟收费
                            {{formDataBase.OverPrice}}{{TimeModeValueTypeName}}，
                            {{formDataBase.MaxPrice}}{{TimeModeValueTypeName}}封顶！
                        </div>
                            
                    </div>
                    <!----------------------------------计时结束----------------------------------->

                    <!----------------------------------扣值开始----------------------------------->
                    <div v-show="formDataBase.ConsumeMode=='Value'">

                        <div v-show="formDataBase.CardConsumeMode=='Delay'||formDataBase.CardConsumeMode=='Now'">
                            
                            <el-row>   
                                <el-col :span="12"> 
                                    <el-row>
                                        <el-col :span="23">
                                            <el-form-item
                                            style="padding-right:0px;"                     
                                            label="每局消费" 
                                            key="ValueInPerTime1"
                                            prop="ValueInPerTime1">        
                                                <ych-input-number
                                                    size="mini"
                                                    :controls="false"
                                                    :min="0" 
                                                    :max="999999999"
                                                    v-model="ValueInPerTime1.Amount"               
                                                    @blur="handleEmitChange">          
                                                        <el-select 
                                                            style="width:82px;"
                                                            v-model="ValueInPerTime1.UseValue" 
                                                            slot="append" 
                                                            placeholder="请选择"
                                                            @change="handleEmitChange">
                                                                <el-option
                                                                v-for="item in TimeModeValueTypeList"
                                                                :key="item.ID"
                                                                :label="item.Name"
                                                                :value="item.ID">
                                                                </el-option> 
                                                        </el-select>
                                                </ych-input-number>  
                                            </el-form-item >
                                        </el-col>
                                        <el-col :span="1" >
                                            <el-button  
                                            type="text"
                                            size="mini"
                                            :disabled="ValueInPerTime2.IsShow==true && ValueInPerTime3.IsShow==true" 
                                            @click="handleValueInPerTime1()">
                                            添加
                                            </el-button>    
                                            
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row>
                                        <el-col :span="23">                              
                                            
                                        </el-col>
                                        <el-col :span="1">

                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            
                            <el-row v-show="ValueInPerTime2.IsShow==true">   
                                <el-col :span="12"> 
                                    <el-row>
                                        <el-col :span="23">
                                            <el-form-item  
                                            style="padding-right:0px;"                   
                                            label="每局消费" 
                                            key="ValueInPerTime2"
                                            prop="ValueInPerTime2">        
                                                <ych-input-number                                                                                                                size="mini"
                                                    :controls="false"
                                                    :min="0" 
                                                    :max="999999999"  
                                                    placeholder="" 
                                                    v-model="ValueInPerTime2.Amount"                                             
                                                    @blur="handleEmitChange">                                         
                                                        <el-select 
                                                        style="width:82px;"
                                                        v-model="ValueInPerTime2.UseValue" 
                                                        slot="append" 
                                                        placeholder="请选择"
                                                        @change="handleEmitChange">
                                                            <el-option
                                                            v-for="item in TimeModeValueTypeList"
                                                            :key="item.ID"
                                                            :label="item.Name"
                                                            :value="item.ID">
                                                            </el-option>                                                                             
                                                        </el-select>
                                                </ych-input-number>  
                                            </el-form-item >
                                        </el-col>
                                        <el-col :span="1" >
                                            <el-button  
                                            type="text"
                                            size="mini"                                      
                                            @click="handleDelValueInPerTime1()">
                                            删除
                                            </el-button>    
                                            
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row>
                                        <el-col :span="23">                              
                                            
                                        </el-col>
                                        <el-col :span="1">

                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>  

                            <el-row v-show="ValueInPerTime3.IsShow==true">   
                                <el-col :span="12"> 
                                    <el-row>
                                        <el-col :span="23">
                                            <el-form-item    
                                            style="padding-right:0px;"                  
                                            label="每局消费" 
                                            key="ValueInPerTime3"
                                            prop="ValueInPerTime3">        
                                                <ych-input-number                                                      
                                                    size="mini"
                                                    :controls="false"
                                                    :min="0" 
                                                    :max="999999999"
                                                    placeholder="" 
                                                    v-model="ValueInPerTime3.Amount"                 
                                                    @blur="handleEmitChange">                                         
                                                        <el-select 
                                                        style="width:82px;"
                                                        v-model="ValueInPerTime3.UseValue" 
                                                        slot="append" 
                                                        placeholder="请选择"
                                                        @change="handleEmitChange">
                                                            <el-option
                                                            v-for="item in TimeModeValueTypeList"
                                                            :key="item.ID"
                                                            :label="item.Name"
                                                            :value="item.ID">
                                                            </el-option>                                                                             
                                                        </el-select>
                                                </ych-input-number>  
                                            </el-form-item >
                                        </el-col>
                                        <el-col :span="1" >
                                            <el-button  
                                            type="text"
                                            size="mini"                                      
                                            @click="handleDelValueInPerTime2()">
                                            删除
                                            </el-button>    
                                            
                                        </el-col>
                                    </el-row>
                                </el-col>
                                <el-col :span="12">
                                    <el-row>
                                        <el-col :span="23">                              
                                            
                                        </el-col>
                                        <el-col :span="1">

                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>  
        
                        </div>

                        
                        <div v-show="formDataBase.CardConsumeMode=='Button'">

                            <el-row>   
                                <el-col :span="11">                      
                                    <el-form-item  
                                    style="padding-right:0px;"                     
                                    label="按键①消费" 
                                    key="ValueInPerTime21"
                                    prop="ValueInPerTime21">        
                                        <ych-input-number
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"  
                                            placeholder="" 
                                            v-model="ValueInPerTime21.Amount"  
                                            @blur="handleEmitChange">                                         
                                                <el-select 
                                                    style="width:82px;"
                                                    v-model="ValueInPerTime21.UseValue" 
                                                    slot="append" 
                                                    placeholder="请选择"
                                                    @change="handleEmitChange">
                                                        <el-option
                                                        v-for="item in TimeModeValueTypeList"
                                                        :key="item.ID"
                                                        :label="item.Name"
                                                        :value="item.ID">
                                                        </el-option>                                                                             
                                                </el-select>
                                        </ych-input-number>  
                                    </el-form-item >                         
                                </el-col>
                                <el-col :span="12">
                                    <el-row>
                                        <el-col :span="23">                              
                                            <el-form-item   
                                            style="padding-right:0px;"                    
                                            label="按键②消费" 
                                            key="ValueInPerTime211"
                                            prop="ValueInPerTime211">
                                                <ych-input-number
                                                    size="mini"
                                                    :controls="false"
                                                    :min="0" 
                                                    :max="999999999"    
                                                    placeholder="" 
                                                    v-model="ValueInPerTime211.Amount"                                                
                                                    @blur="handleEmitChange">                               
                                                        <el-select 
                                                            style="width:82px;"
                                                            v-model="ValueInPerTime211.UseValue" 
                                                            slot="append" 
                                                            placeholder="请选择"
                                                            @change="handleEmitChange">
                                                                <el-option
                                                                v-for="item in TimeModeValueTypeList"
                                                                :key="item.ID"
                                                                :label="item.Name"
                                                                :value="item.ID">
                                                                </el-option>                                                                             
                                                        </el-select>
                                                </ych-input-number >                            
                                            </el-form-item >
                                        </el-col>
                                        <el-col :span="1">
                                            <el-button  
                                            type="text"
                                            size="mini"
                                            :disabled="ValueInPerTime222.IsShow==true && ValueInPerTime233.IsShow==true" 
                                            @click="handleValueInPerTime2()">添加</el-button>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>  

                            <el-row v-show="ValueInPerTime222.IsShow==true">   
                                <el-col :span="11">                      
                                    <el-form-item 
                                    style="padding-right:0px;"                      
                                    label="按键①消费" 
                                    key="ValueInPerTime22"
                                    prop="ValueInPerTime22">        
                                        <ych-input-number 
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"    
                                            placeholder="" 
                                            v-model="ValueInPerTime22.Amount"                                                                               
                                            @blur="handleEmitChange">                                         
                                                <el-select 
                                                    style="width:82px;"
                                                    v-model="ValueInPerTime22.UseValue" 
                                                    slot="append" 
                                                    placeholder="请选择"
                                                    @change="handleEmitChange">
                                                        <el-option
                                                        v-for="item in TimeModeValueTypeList"
                                                        :key="item.ID"
                                                        :label="item.Name"
                                                        :value="item.ID">
                                                        </el-option>                                                                             
                                                </el-select>
                                        </ych-input-number>  
                                    </el-form-item >                         
                                </el-col>
                                <el-col :span="12">
                                    <el-row>
                                        <el-col :span="23">                              
                                            <el-form-item   
                                            style="padding-right:0px;"                    
                                            label="按键②消费" 
                                            key="ValueInPerTime222"
                                            prop="ValueInPerTime222">
                                                <ych-input-number  
                                                    size="mini"
                                                    :controls="false"
                                                    :min="0" 
                                                    :max="999999999"  
                                                    placeholder="" 
                                                    v-model="ValueInPerTime222.Amount" 
                                                    @blur="handleEmitChange">                               
                                                        <el-select 
                                                            style="width:82px;"
                                                            v-model="ValueInPerTime222.UseValue" 
                                                            slot="append" 
                                                            placeholder="请选择"
                                                            @change="handleEmitChange">
                                                                <el-option
                                                                v-for="item in TimeModeValueTypeList"
                                                                :key="item.ID"
                                                                :label="item.Name"
                                                                :value="item.ID">
                                                                </el-option>                                                                             
                                                        </el-select>
                                                </ych-input-number >                            
                                            </el-form-item >
                                        </el-col>
                                        <el-col :span="1">
                                            <el-button  
                                            type="text"
                                            size="mini"
                                            @click="handleDelValueInPerTime11()">删除</el-button>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            
                            <el-row v-show="ValueInPerTime233.IsShow==true">   
                                <el-col :span="11">                      
                                    <el-form-item 
                                    style="padding-right:0px;"                      
                                    label="按键①消费" 
                                    key="ValueInPerTime23"
                                    prop="ValueInPerTime23">        
                                        <ych-input-number  
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"  
                                            placeholder="" 
                                            v-model="ValueInPerTime23.Amount"                                       
                                            @blur="handleEmitChange">                                         
                                                <el-select 
                                                    style="width:82px;"
                                                    v-model="ValueInPerTime23.UseValue" 
                                                    slot="append" 
                                                    placeholder="请选择"
                                                    @change="handleEmitChange">
                                                        <el-option
                                                        v-for="item in TimeModeValueTypeList"
                                                        :key="item.ID"
                                                        :label="item.Name"
                                                        :value="item.ID">
                                                        </el-option>                                                                             
                                                </el-select>
                                        </ych-input-number>  
                                    </el-form-item >                         
                                </el-col>
                                <el-col :span="12">
                                    <el-row>
                                        <el-col :span="23">                              
                                            <el-form-item  
                                            style="padding-right:0px;"                     
                                            label="按键②消费" 
                                            key="ValueInPerTime233"
                                            prop="ValueInPerTime233">
                                                <ych-input-number
                                                    size="mini"
                                                    :controls="false"
                                                    :min="0" 
                                                    :max="999999999"    
                                                    placeholder="" 
                                                    v-model="ValueInPerTime233.Amount" 
                                                    @blur="handleEmitChange">                               
                                                        <el-select 
                                                            style="width:82px;"
                                                            v-model="ValueInPerTime233.UseValue" 
                                                            slot="append" 
                                                            placeholder="请选择"
                                                            @change="handleEmitChange">
                                                                <el-option
                                                                v-for="item in TimeModeValueTypeList"
                                                                :key="item.ID"
                                                                :label="item.Name"
                                                                :value="item.ID">
                                                                </el-option>                                                                             
                                                        </el-select>
                                                </ych-input-number>                            
                                            </el-form-item >
                                        </el-col>
                                        <el-col :span="1">
                                            <el-button  
                                            type="text"
                                            size="mini"
                                            @click="handleDelValueInPerTime22()">删除</el-button>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>  

                        </div>

                    </div>
                    <!----------------------------------扣值结束----------------------------------->
           
                </side-bar-form>

            </div>
        `
        }
    });