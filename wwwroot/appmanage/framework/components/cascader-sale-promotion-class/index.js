define([
    'api/price/v1/PricePromotionClass'
], function(
    SalePromotionClass
) {
    'use strict';

    return {
        name: 'CascaderSalePromotionClass',

        props: {
            value: Array
        },

        created: function () {
            this.asyncGetSalePromotionClass();
        },

        data: function() {
            return {
                list: [],
                props: {
                    value: 'ID',
                    label: 'Name',
                    children: 'Childs'
                }
            }
        },

        methods: {
            asyncGetSalePromotionClass: function () {
                var self = this;
                SalePromotionClass
                    .GetTree()
                    .then(function (data) {
                        self.list = data.Data;
                    });
            }
        },

        computed: {
            localValue: {
                get: function () {
                    return this.value;
                },

                set: function (val) {
                    this.$emit('input', val);
                }
            }
        },

        template: `
            <el-cascader
                placeholder="搜索活动分类"
                v-model="localValue"
                :options="list"
                :props="props"
                filterable
                clearable
                change-on-select>
            </el-cascader>
        `
    }
    
});