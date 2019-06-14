define([
    'api/product/v1/Product'
], function(
    product
) {
    'use strict';

    return {
        name: 'SelectGoodsKind',

        props: {
            value: String
        },

        created: function () {
            this.asyncGetGoodsKind();
        },

        data: function() {
            return {
                list: []
            }
        },

        methods: {
            asyncGetGoodsKind: function () {
                var self = this;
                product
                    .GetGoodsKind()
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
            <el-select v-model="localValue" placeholder="请选择">
                <el-option
                    v-for="item in list"
                    :key="item.Value"
                    :label="item.Key"
                    :value="item.Value">
                </el-option>
            </el-select>
        `
    }
    
});