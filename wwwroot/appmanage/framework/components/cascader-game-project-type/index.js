define([
    'api/game-project/v1/GameProjectType'
], function(
    GameProjectType
) {
    'use strict';

    return {
        name: 'CascaderGameProjectType',

        props: {
            value: Array,
            
            disabled: {
                type: Boolean,
                default: false
            }
        },

        created: function () {
            this.asyncGetGameProjectType();
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
            asyncGetGameProjectType: function () {
                var self = this;
                GameProjectType
                    .GetTreeData()
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
                placeholder="搜索分类"
                v-model="localValue"
                :options="list"
                :props="props"
                :disabled="disabled"
                filterable
                clearable
                change-on-select>
            </el-cascader>
        `
    }
    
});