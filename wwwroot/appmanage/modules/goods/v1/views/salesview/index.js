define([
    'goods/components/goods-sale-view/index'
], function(
    goodsSaleViwe
) {
    'use strict';
   
    return {
        name: 'PageGoodsGroup',

        components: {
            GoodsSaleViwe: goodsSaleViwe
        },

        created: function () {
        },

        data: function () {
            return {
            };
        },

        methods: {
            
        },

        template: `
            <el-container 
                style="min-height: 100%;">

                <el-card 
                    style="width: 100%; min-height: 100%;" 
                    :body-style="{
                        'height': '100%',
                        'display': 'flex',
                        'justify-content': 'center',
                        'align-items': 'center'
                    }" >

                    <div slot="header">
                        <h4>收银台分组设置</h4>
                        <p style="text-indent: 1.5em">
                            <small>
                                可根据需求，进行收银台商品分组自定义设置，包括卡片样式等
                            </small>
                        </p>
                    </div>

                    <goods-sale-viwe>
                    </goods-sale-viwe>

                </el-card>

            </el-container>
        `
    }
});