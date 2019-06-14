define([
    'framework/mixins/sidebar-form',
    'api/product/v1/Product',
    'api/price/v1/Price',
    'goods/components/sidebar-goods-add/goods-base',
    'goods/components/sidebar-goods-add/goods-sale-setting',
    'goods/components/sidebar-goods-add/goods-exchange-setting',
    'goods/components/sidebar-goods-add/goods-modify-record',
    'goods/components/sidebar-goods-add/ticket-info',
    'goods/components/sidebar-goods-add/goods-virtual-coin',
    'components/input-code/index',
    'components/cascader-goods-class/index',
    'incss!goods/components/sidebar-goods-add/styles/index.css'
], function(
    sideBarForm,
    product,
    price,
    goodsBase,
    goodsSaleSetting,
    goodsExchangeSetting,
    goodsModifyRecord,
    ticketInfo,
    goodsVirtualCoin,
    inputCode,
    cascaderGoodsClass
) {
    'use strict';

    return {
        name: 'SidebarGoodsAdd',

        mixins: [sideBarForm],

        components: {
            GoodsBase: goodsBase,
            GoodsSaleSetting: goodsSaleSetting,
            GoodsExchangeSetting: goodsExchangeSetting,
            GoodsModifyRecord: goodsModifyRecord,
            InputCode: inputCode,
            CascaderGoodsClass: cascaderGoodsClass,
            TicketInfo: ticketInfo,
            GoodsVirtualCoin: goodsVirtualCoin
        },

        mounted: function () {
            var fn = this.goodsId ? this.handleEditOperation : this.handleAddOperation;
            fn();
        },

        data: function () {
            var validateSalePrice = function (rule, value, callback) {
                if (value <= 0) {
                    return callback(new Error('必须大于0'));
                }

                callback();
            }

            return {
                // 有效期 与 是否能退货 配置
                virtualCurrencyConfig: {
                    Validity: true,
                    Refund: true
                },

                formData: {
                    Name: null,
                    Number: null,
                    BarCodes: null,
                    ClassID: [],
                    Price: null,
                    Kind: null,
                    VirtualCurrencyID: null,
                    KindName: null
                },
                rules: {
                    Name: [
                        { required: true, message: '请填写商品名称', trigger: 'blur' }
                    ],

                    Price: [
                        { type: 'number', required: true, message: '建议零售价不能为空', trigger: 'blur' },
                        { validator: validateSalePrice, trigger: 'blur' }
                    ],

                    ClassID: [
                        { required: true, message: '请选择商品分类', trigger: 'change' }
                    ]
                },
                saleSettingData: {},
                exchangeSettingData: {},
                editBaseData: {},
                ticketData: {},
                virtualCoinData: {},

                currentTab: '',
            }
        },

        computed: {
            goodsId: function () {
                return this.incomingData.id;
            },

            setting: function () {
                return this.incomingData.setting || {};
            },

            classId: function () {
                return _.last(this.formData.ClassID);
            },

            goodsKind: function () {
                var kind;
                if (this.goodsId) {
                    kind = this.formData.Kind;
                } else {
                    kind = (this.incomingData && this.incomingData.setting && this.incomingData.setting.Kind)
                }
                return kind;
            },

            isTicket: function () {
                var isTicket = ['TicketTimesCount', 'TicketTermRule'].indexOf(this.goodsKind);

                return isTicket > -1;
            },

            isVirtualCoin: function () {
                return this.goodsKind === 'VirtualCurrency';
            },

            isNormalGoods: function () {
                return this.goodsKind === 'Normal';
            },

            virtualCoinName: function () {
                var name;
                if (!this.goodsId) {
                    name = this.incomingData.setting && this.incomingData.setting.Name;
                } else {
                    name = this.formData.KindName;
                }

                return this.isVirtualCoin ? `${name}` : '';
            },

            tabModelValue: {
                get: function() {
                    var value = this.currentTab;
                    if (!value) {
                        if (this.isVirtualCoin) {
                            value = 'virtualCoin';
                        } else if (this.isTicket) {
                            value = 'ticket';
                        } else {
                            value = 'base';
                        }
                    }

                    return value;
                },

                set: function (val) {
                    this.currentTab = val;
                }
            },

            // 有效期 和 是否能退货 的配置 （只有虚拟货币需要使用，默认都未true）
            validityToggle: function () {
                var toggle = true;

                if (this.goodsId) {
                    toggle = this.virtualCurrencyConfig.Validity;
                } else {
                    toggle = this.setting.VirtualGoodsConfig.Validity;
                }
                return toggle;
            },

            refundToggle: function () {
                var toggle = true;

                if (this.goodsId) {
                    toggle = this.virtualCurrencyConfig.Refund;
                } else if (this.setting.VirtualGoodsConfig) {
                    toggle = this.setting.VirtualGoodsConfig.Refund;
                }
                return toggle;
            }
        },

        methods: {
            save: function () {
                var self = this;

                return new Promise(function (resolve, reject) {
                    var promiseFn = self.goodsId 
                                        ? self.editGoods() 
                                        : self.addGoods();
                    
                    promiseFn
                        .then(function () {
                            resolve();
                            self.$message({
                                message: '商品保存成功！',
                                type: 'success'
                            });
                        }, function () {
                            reject();
                        });
                }).catch(function(e) {
                    return Promise.reject();
                });
            },

            addGoods: function (resolve, reject) {
                var self = this,
                    data = this.handleSubmitData();
                return product.Add(data);
            },

            editGoods: function (resolve, reject) {
                var data = this.handleSubmitData();
                return product.Edit(data);
            },

            // 商品编辑操作
            handleEditOperation: function () {
                
                this.asyncGetSaleAndExchangeSetting();
            },

            handleAddOperation: function () {
                var kindSetting = this.incomingData.setting
                _.extend(this.formData, {
                    Kind: kindSetting.Kind,
                    VirtualCurrencyID: kindSetting.ID
                });
            },

            // 获取商品信息
            asyncGetGoodsInfo: function () {
                var self = this;
                product
                    .GetByID({ ID: this.goodsId })
                    .then(function (data) {
                        self.editBaseData = _.pick(
                            data, 
                            [
                                'Send', 
                                'Make', 
                                'CustomAttribute', 
                                'Image', 
                                'Describe'
                            ]
                        );

                        // 因商品分类级联组件需要层级ID
                        data.ClassID = data.ClassPath || [];

                        _.extend(self.formData, _.pick(
                            data, 
                            [
                                'Name', 
                                'Number', 
                                'ClassID', 
                                'BarCodes',
                                'Price', 
                                'Kind',
                                'VirtualCurrencyID',
                                'KindName'
                            ]
                        ));

                        if (self.isTicket) {
                            self.ticketData = data.TicketInfo.Info;
                        }
                        /* 
                        * 抽取虚拟币的 有效期 和 是否能退货设置，
                        * 当不是虚拟币时，VirtualCurrencyInfo字段会不存在
                        */
                        if (self.isVirtualCoin) {
                            _.assign(
                                self.virtualCurrencyConfig,
                                data.VirtualCurrencyInfo.VirtualGoodsConfig || {}
                            );
                            
                            self.virtualCoinData = data.VirtualCurrencyInfo;
                        }
                      
                    });
            },

            // 编辑获取售卖和兑换设置
            asyncGetSaleAndExchangeSetting: function () {
                var self = this;

                this.asyncGetGoodsInfo();

                price
                    .GetGoodsPriceInfo({ GoodsID: this.goodsId })
                    .then(function (res) {
                        self.saleSettingData = _.pick(res, [
                            'ActivityPriceList',
                            'LimitType',
                            'TimeUnit',
                            'ExChangePeriod',
                            'Period',
                            'ServiceCharge',
                            'BackgroundColor',
                            'FontColor',
                            'ShowIndex',
                        ]);

                        self.exchangeSettingData = _.pick(res, [
                            'ExChangePriceList',
                            'ExChangeCancelLimit',
                            'ExChangeTimeUnit',
                            'ExChangePeriod',
                            'ExChangeBackgroundColor',
                            'ExChangeFontColor',
                            'ExChangeShowIndex'
                        ]);
                  
                    });
            },

            handleTicketData: function () {
                return _.assign(
                    {
                        Name: this.formData.Name,
                    }, 
                    this.$refs.ticket.getData()
                );
            },

            handleBaseData: function () {
                var data = _.assign({}, this.formData);
                data.ClassID = _.last(data.ClassID);

                return data;
            },

            handleSubmitData: function () {
                var base = this.$refs.base.getData(),
                    sale = this.$refs.sale.getData(),
                    exchange = this.$refs.exchange.getData();

                var ticketInfo = {};
                var virtualCoinInfo = {};

                if (this.isTicket) {
                    ticketInfo = { TicketInfo: this.handleTicketData() };
                }

                if (this.isVirtualCoin) {
                    virtualCoinInfo = { VirtualCurrencyInfo: this.$refs.virtualCoin.getData()}
                }

                return _.extend(
                    { ID: this.goodsId },
                    base, 
                    sale, 
                    exchange,
                    ticketInfo,
                    virtualCoinInfo,
                    this.handleBaseData()
                );
            }
        },

        template: `
            <div>
                <ych-sidebar-layout>
                    <side-bar-form
                        :model="formData"
                        :rules="rules">
                        
                        <el-form-item 
                            prop="Name" 
                            :label="isTicket ? '套票名称' : '商品名称'">
                            <el-input 
                                v-model="formData.Name">
                            </el-input>
                        </el-form-item>

                        <ych-form-item 
                            prop="Deposit" 
                            label="商品编号">
                            <input-code 
                                v-model="formData.Number"
                                type="goods"
                                :disabled="Boolean(goodsId)"
                                :get-code="!Boolean(goodsId)">
                            </input-code>
                        </ych-form-item>

                        <el-form-item 
                            v-if="isNormalGoods"
                            prop="BarCodes" 
                            label="商品条码">
                            <el-input 
                                v-model="formData.BarCodes">
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="ClassID" label="商品分类">
                            <cascader-goods-class 
                                v-model="formData.ClassID">
                            </cascader-goods-class>
                        </el-form-item>

                        <el-form-item prop="Price" label="售卖售价">
                            <ych-input-number 
                                v-model="formData.Price"
                                :min="0"
                                :controls="false">
                                <span slot="append">元</span>
                            </ych-input-number>
                        </el-form-item>
                    </side-bar-form>
                </ych-sidebar-layout>
                <el-tabs v-model="tabModelValue">
                    <el-tab-pane 
                        v-if="isTicket"
                        label="套票信息"
                        name="ticket">
                        <ticket-info 
                            ref="ticket"
                            @tab-need-change="tabModelValue = arguments[0]"
                            :data="ticketData"
                            :incoming-data="incomingData">
                        </ticket-info>
                    </el-tab-pane>

                    <el-tab-pane 
                        v-if="isVirtualCoin"
                        :label="virtualCoinName"
                        name="virtualCoin">
                        <goods-virtual-coin
                            ref="virtualCoin"
                            :name="virtualCoinName"
                            :validity-toggle="validityToggle"
                            :data="virtualCoinData"
                            :incoming-data="incomingData">
                        </goods-virtual-coin>
                    </el-tab-pane>

                    <el-tab-pane 
                        :label="isNormalGoods ? '更多信息' : '商品信息'" 
                        name="base">
                        <goods-base 
                            ref="base" 
                            @tab-need-change="tabModelValue = arguments[0]"
                            :class-id="classId"
                            :goods-data="editBaseData"
                            :incoming-data="incomingData">
                        </goods-base>
                    </el-tab-pane>
                    <el-tab-pane 
                        label="售卖设置" 
                        name="sale">
                        <goods-sale-setting
                            ref="sale" 
                            :incoming-data="incomingData"
                            :data="saleSettingData"
                            :current-sale-price="formData.Price"
                            :refund-toggle="refundToggle">
                        </goods-sale-setting>
                    </el-tab-pane>
                    <el-tab-pane 
                        label="兑换设置" 
                        name="exchange">
                        <goods-exchange-setting
                            ref="exchange" 
                            :incoming-data="incomingData"
                            :data="exchangeSettingData"
                            :refund-toggle="refundToggle">
                        </goods-exchange-setting>
                    </el-tab-pane>
                    <el-tab-pane 
                        v-if="incomingData.id"
                        label="修改记录" 
                        name="modify">
                        <goods-modify-record
                            :incoming-data="incomingData">
                        </goods-modify-record>
                    </el-tab-pane>
                </el-tabs>
            </div>
        `
    }
});