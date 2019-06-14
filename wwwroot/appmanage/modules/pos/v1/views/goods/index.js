define([
    'api/pos/v1/Goods',
    'pos/views/goods/goods-cart',
    'incss!pos/styles/index.css'
], function(
    goods,
    goodsCart
) {
    'use strict';
    
    return {
        name: 'Goods',

        components: {
            GoodsCart: goodsCart
        },

        created: function () {
            this.asyncGetGoodsGroup();
        },
        
        data: function () {
            return {
                goodsData: [],
                goodsGroupActive: 'all',

                goodsMoreField: {
                    GoodsNumber: '商品编号',
                    GoodsClass: '商品分类',
                    GoodsName: '商品名称',
                    AdvisePrice: '建议零售价',
                    PromotionInfo: '促销规则'
                }
            };
        },

        computed: {
            allGoodsList: function () {
                return _.reduce(this.goodsData, function (result, item) {
                    return _.concat(result, item.Goods);
                }, []);
            }
        },

        methods: {
            asyncGetGoodsGroup: function () {
                var self = this;

                goods
                    .GetSaleGoods()
                    .then(function (res) {
                        res = res || {};
                        if (res.Data.length > 0) {
                            self.goodsData = res.Data;
                            // self.goodsGroupActive = res.Data[0].ID;
                        }
                    });
            },

            addGoodsToCart: function (goods) {
                this.$refs.goodsCart.add(goods);
            }
        },

        template: `
            <el-container class="goods-list">
                <el-main>
                    <el-tabs v-model="goodsGroupActive">
                        <el-tab-pane 
                            key="all"
                            label="全部" 
                            name="all">

                            <el-popover
                                v-for="item in allGoodsList"
                                :key="item.GoodsID"
                                class="goods-list__item-popover"
                                trigger="hover"
                                :width="250"
                                :open-delay="2000">

                                <el-row class="goods-list__item-row">
                                    <el-col
                                        v-for="(value, key) in goodsMoreField"
                                        :key="key"
                                        :span="24">
                                        <label class="goods-list__item-label">{{ value }}:</label>
                                        <span>{{ item[key] }}</span>
                                    </el-col>
                                </el-row>

                                <el-card 
                                    slot="reference"
                                    @click.native="addGoodsToCart(item)"
                                    class="goods-list__item"
                                    :body-style="{ padding: '0px', height: '100%' }">
                                    <div class="goods-list__item-content">
                                        <span 
                                            v-text="item.GoodsName"
                                            class="goods-list__item-name">
                                        </span>
                                        <span 
                                            class="goods-list__item-price">
                                            ¥ {{ item.Price | number('0,0.00') }}
                                        </span>

                                        <span class="goods-list__item-stock">
                                            库存: {{ item.Stock | number }}
                                        </span>

                                        <i  v-if="item.IsHot"
                                            class="el-icon-star-on goods-list__item-hot">
                                        </i>

                                        <i v-if="item.IsSale"
                                            class="el-icon-info goods-list__item-discount">
                                        </i>

                                        <span 
                                            v-if="item.IsNew"
                                            class="goods-list__item-new">
                                            new
                                        </span>
                                    </div>
                                </el-card>
                            </el-popover>

                        </el-tab-pane>

                        <el-tab-pane 
                            v-for="group in goodsData"
                            :key="group.ID"
                            :label="group.Name" 
                            :name="group.ID">

                            <el-popover
                                v-for="item in group.Goods"
                                :key="item.GoodsID"
                                class="goods-list__item-popover"
                                trigger="hover"
                                :width="250"
                                :open-delay="2000">

                                <el-row class="goods-list__item-row">
                                    <el-col
                                        v-for="(value, key) in goodsMoreField"
                                        :key="key"
                                        :span="24">
                                        <label class="goods-list__item-label">{{ value }}:</label>
                                        <span>{{ item[key] }}</span>
                                    </el-col>
                                </el-row>

                                <el-card 
                                    slot="reference"
                                    @click.native="addGoodsToCart(item)"
                                    class="goods-list__item"
                                    :body-style="{ padding: '0px', height: '100%' }">
                                    <div class="goods-list__item-content">
                                        <span 
                                            v-text="item.GoodsName"
                                            class="goods-list__item-name">
                                        </span>
                                        <span 
                                            class="goods-list__item-price">
                                            ¥ {{ item.Price | number('0,0.00') }}
                                        </span>

                                        <span class="goods-list__item-stock">
                                            库存: {{ item.Stock | number }}
                                        </span>

                                        <i  v-if="item.IsHot"
                                            class="el-icon-star-on goods-list__item-hot">
                                        </i>

                                        <i v-if="item.IsSale"
                                            class="el-icon-info goods-list__item-discount">
                                        </i>

                                        <span 
                                            v-if="item.IsNew"
                                            class="goods-list__item-new">
                                            new
                                        </span>
                                    </div>
                                </el-card>
                            </el-popover>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
                
                <el-aside 
                    width="400px" 
                    style="overflow: hidden;">
                    <goods-cart
                        ref="goodsCart">
                    </goods-cart>
                </el-aside>
            </el-container>
        `
    }
});