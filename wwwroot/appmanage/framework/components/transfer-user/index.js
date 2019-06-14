define([
    'api/organization/User'
], function(user) {
    'use strict';
    
    return {
        name: 'TransferUser',

        props: {
            value: {
                type: Array,
                required: true
            }
        },

        created: function () {
            // this.asyncGetUserData();
        },

        data: function () {
            return {
                data: []
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
            asyncGetUserData: function () {
                var self = this;
                user.search().then(function (data) {
                    self.data = data;
                });
            },

            // 组装穿梭框的显示名称
            transferRenderFunc: function (h, option) {
                return h('span', {
                    domProps: {
                        textContent: option.Name + ' - ' + option.Position
                    }
                });
            }
        },

        template: `
            <el-select
                v-model="localValue"
                multiple
                collapse-tags
                style="width: 100%;"
                placeholder="请选择">
                <el-option
                    v-for="item in data"
                    :key="item.ID"
                    :label="item.Name"
                    :value="item.ID">
                </el-option>
            </el-select>
        `
    }
});