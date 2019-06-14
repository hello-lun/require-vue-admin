define([
    'pos/views/goods/index',
    'pos/views/leaguer/index',
    'pos/views/order/index',
    'pos/views/index/add-leaguer'
], function (
    goods,
    leaguer,
    order,
    addLeaguer
) {
    'use strict';
    
    return {
        name: 'PagePOS',

        components: {
            goods: goods,
            leaguer: leaguer,
            order: order,

            AddLeaguer: addLeaguer
        },
        
        data: function () {
            return {
                moduleActive: 'goods'
            };
        },

        template: `
            <el-card class="pos">
                <el-container>
                    <el-header>
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-button 
                                    @click="moduleActive = 'goods'"
                                    :type="moduleActive === 'goods' ? 'primary' : 'info'" 
                                    round>
                                    商品
                                </el-button>
                            </el-col>
                            <el-col :span="6">
                                <el-button 
                                    @click="moduleActive = 'leaguer'"
                                    :type="moduleActive === 'leaguer' ? 'primary' : 'info'" 
                                    round>
                                    会员
                                </el-button>
                            </el-col>
                            <el-col :span="6">
                                <el-button 
                                    @click="moduleActive = 'order'"
                                    :type="moduleActive === 'order' ? 'primary' : 'info'" 
                                    round>
                                    订单
                                </el-button>
                            </el-col>
                        </el-row>
                  
                    </el-header>
                    <el-main>
                        <component :is="moduleActive">
                        </component>
                    </el-main>
                </el-container>

                <add-leaguer>
                </add-leaguer>
            </el-card>
        `
    }
});