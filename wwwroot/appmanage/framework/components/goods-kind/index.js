define([
    'api/product/v1/Product',
], function(
    product
) {
    'use strict';
    
    return {
        name: 'GoodsKind',

        props: {
            value: String,
        },

        created: function () {
            this.asyncGetGoodsClass();
        },

        data: function () {
            return {
                kindData: []
            };
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

        methods: {
            asyncGetGoodsClass: function () {
                var self = this;
                product
                    .GetGoodsKind()
                    .then(function(data) {
                        self.kindData = data.Data;
                    });
            }
        },

        template: `
            <el-select v-model="localValue">
                <el-option
                    v-for="item in kindData"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID">
                </el-option>
            </el-select>
        `
    }
});