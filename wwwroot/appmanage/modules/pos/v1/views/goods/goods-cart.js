define([
    'api/pos/v1/ShoppingCart',
    'api/pos/v1/Leaguer'
], function(
    shoppingCart,
    leaguer
) {
    'use strict';
    
    return {
        name: 'GoodsCart',

        data: function () {
            return {
                keyword: '',

                goodsListOfCart: [],
                
                calculatePrices: {
                    preferential: 0,
                    payable: 0
                },

                payBtnStatus: false,
                // 调用计价接口标记
                calculateFlag: '',

                leaguerInfo: {}
            };
        },

        watch: {
            'goodsListOfCart': {
                handler: function (val) {
                    if ((val || []).length <= 0) {
                        return;
                    }
                    this.calculateTotalPrice();
                },

                deep: true
            }
        },

        computed: {
            totalData: function () {
                return _.reduce(this.goodsListOfCart, function (sum, item) {
                            var total = sum[0] + item.Amount,
                                totalPrice = sum[1] + (item.Amount * item.Price);
                            return [total, totalPrice];
                        }, [0, 0]);
            }
        },

        methods: {
            isInCart: function (id) {
                return _.findIndex(
                            this.goodsListOfCart, 
                            function (item) {
                                return item.GoodsID === id;
                            }
                        )
            },

            removeGoodsFormCart: function (id) {
                if (typeof id === 'string') {
                    var goodsIndex = this.isInCart(id);
                    goodsIndex > -1 && this.goodsListOfCart.splice(goodsIndex, 1);
                } else {    //清空购物车
                    this.goodsListOfCart.splice(0, this.goodsListOfCart.length);
                }
                // 重新计价
                this.calculateTotalPrice();
            },

            add: function (goods) {
                this.addGoodsToCart(goods);
            },

            addGoodsToCart: function (goods) {
                var goodsIndex = this.isInCart(goods.GoodsID);

                if (goodsIndex < 0) {
                    goods = _.extend({Amount: 1}, goods);
                    this.goodsListOfCart.push(goods);
                } else {
                    this.goodsListOfCart[goodsIndex].Amount++;
                }
            },

            renderColumnHeaher: function (h, colSetting) {
                return h('el-button', {
                    props: {
                        type: 'text'
                    },

                    on: {
                        click: this.removeGoodsFormCart
                    },

                    domProps: {
                        textContent: '清空'
                    }
                })
            },

            calculateTotalPrice: function () {
                var flag,
                    self = this;

                this.calculateFlag = flag = _.uniqueId('calculate_');

                this.payBtnStatus = true;

                shoppingCart
                    .CalculationInfo(_.extend(
                        this.assemblyCalculateData(), 
                        { Flag: flag }
                    ))
                    .then(function (res) {
                        // 如果返回数据中的标记，不等于最后记录的flag，不做任何处理
                        if (res.Flag !== self.calculateFlag) {
                            return;
                        }

                        self.payBtnStatus = false;

                        _.extend(self.calculatePrices, {
                            preferential: res.DiscountMoney,
                            payable: res.PromotionTotalMoney
                        });
                    }, function () {
                        self.payBtnStatus = false;
                    })
                    .catch(function () {
                        self.payBtnStatus = false;
                    });
                
            },
            // 组装计价接口提交数据
            assemblyCalculateData: function () {
                var goodsList = _.map(
                        this.goodsListOfCart, 
                        function (item) {
                            return {
                                GoodsID: item.GoodsID,
                                Amount: item.Amount
                            };
                        }
                    );
                
                return {
                    GoodsList: goodsList,
                    CouponIDs: [],
                    LeaguerID: this.leaguerInfo.ID
                }
            },

            submitOrder: function () {
                return shoppingCart
                        .SaveOrder(
                            _.extend(
                                {
                                    TotalOrigionPrice: this.totalData[1] || 0,
                                    TotalPrice: this.calculatePrices.payable
                                },
                                this.assemblyCalculateData()
                            )
                        )
                        .then(function(res) {
                            return res.OrderID;
                        });
            },

            pay: function () {
                var self = this;

                this.payBtnStatus = true;

                this.submitOrder()
                    .then(function (orderId) {
                        return shoppingCart
                                .Pay({ 
                                    PayMethodID: null,
                                    OrderID: orderId,
                                    Money: self.calculatePrices.payable,
                                    SendParam: ''
                                });
                    })
                    .then(function (res) {
                        self.$alert('订单支付成功！', '提示', {
                            type: 'success'
                        });
                        self.payBtnStatus = false;
                        self.clearCart();
                    }, function () {
                        self.payBtnStatus = false;
                    })
                    .catch(function () {
                        self.payBtnStatus = false;
                    })
            },
            // 清空购物车
            clearCart: function () {
                this.memberKey = '';

                this.goodsListOfCart.splice(0, this.goodsListOfCart.length);
                
                _.extend(this.calculatePrices, {
                    preferential: 0,
                    payable: 0
                });
            },

            searchKeyword: function () {
                var self = this;

                leaguer
                    .GetLeaguer({ Number: this.keyword })
                    .then(function (res) {
                        var leaguerList = res.Data || [];

                        self.keyword = null;
                        self.leaguerInfo = leaguerList[0] || {};

                        self.calculateTotalPrice();
                    });
            },

            removeCurrentLeaguer: function () {
                this.leaguerInfo = {};
                // 重新计价
                this.calculateTotalPrice();
            }
        },

        template: `
            <div class="goods-shopping-cart">

                <el-input 
                    placeholder="可搜索商品/手机号/会员号" 
                    v-model="keyword">
                    <el-button 
                        @click="searchKeyword"
                        slot="append">
                        搜索
                    </el-button>
                </el-input>

                <el-row v-show="leaguerInfo.Number" class="pos-leaguer-info">
                    <i @click="removeCurrentLeaguer" class="el-icon-error"></i>
                    <el-col :span="12">会员号：{{ leaguerInfo.Number }}</el-col>
                    <el-col :span="12">姓名：{{ leaguerInfo.Name }}</el-col>

                    <el-col :span="6">预存款：</el-col>
                    <el-col :span="6">代币：</el-col>
                    <el-col :span="6">积分：</el-col>
                    <el-col :span="6">彩票：</el-col>
                </el-row>

                <el-table
                    :data="goodsListOfCart"
                    height="400">

                    <el-table-column
                        prop="GoodsName"
                        label="商品名称"
                        show-overflow-tooltip>
                    </el-table-column>

                    <el-table-column
                        prop="Amount"
                        label="数量">

                        <template slot-scope="scope">
                            <el-input-number 
                                size="mini"
                                style="width: 100%;"
                                :controls="false"
                                :min="0"
                                v-model="scope.row.Amount">
                            </el-input-number>
                        </template>

                    </el-table-column>

                    <el-table-column
                        label="小计"
                        align="right">

                        <template slot-scope="scope">
                            <span>
                                {{ (scope.row.Amount * scope.row.Price) | number('0,0.00') }}
                            </span>
                        </template>

                    </el-table-column>

                    <el-table-column
                        :render-header="renderColumnHeaher">

                        <template slot-scope="scope">
                            <el-button 
                                @click="removeGoodsFormCart(scope.row.GoodsID)" 
                                type="text">
                                删除
                            </el-button>
                        </template>

                    </el-table-column>
                </el-table>
                <el-row :gutter="20">
                    <el-col :span="8">
                        总数：{{ totalData[0] }}
                    </el-col>
                    <el-col :span="8">
                        合计：¥{{ totalData[1] | number('0,0.00') }}
                    </el-col>
                    <el-col :span="8">
                        优惠：
                        <span>
                            {{ calculatePrices.preferential | number('0,0.00') }}
                        </span>
                    </el-col>
                </el-row>

                <el-button 
                    style="width: 100%;" 
                    @click="pay"
                    type="danger" 
                    :loading="payBtnStatus">
                    
                    <span>
                        <span v-show="!payBtnStatus">
                            ¥{{ calculatePrices.payable }}
                        </span>
                        </br>
                        结算
                    </span>
                    
                </el-button>
            </div>
        `
    }
});