define([
    'api/goods/v1/GoodsClass'
], function(
    goodsClass
) {
    'use strict';

    return {
        name: 'CascaderGoodsClass',

        props: {
            value: Array,

            filterable: {
                type: Boolean,
                default: true
            },

            clearable: {
                type: Boolean,
                default: true
            },

            size: String,

            isAll: {
                type: Boolean,
                default: false
            }
        },

        created: function () {
            this.asyncGetGoodsClass();
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
            asyncGetGoodsClass: function () {
                var self = this;
                goodsClass
                    .GetTree()
                    .then(function (data) {
                        if (self.isAll) {
                            data.Data.unshift({
                                ID: '',
                                Name: '全部'
                            });
                        }

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
                placeholder="搜索商品分类"
                v-model="localValue"
                :options="list"
                :props="props"
                :filterable="filterable"
                :clearable="clearable"
                :size="size"
                change-on-select>
            </el-cascader>
        `
    }
    
});