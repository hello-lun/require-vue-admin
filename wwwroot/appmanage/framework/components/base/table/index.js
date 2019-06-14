define([
    'ELEMENT'
], function(ELEMENT) {
    'use strict';

    var settingComponent = {
        name: 'TableSetting',

        data: function () {
            return {
                table: null,
                columns: [],
                columnsProp: [],
                showColumns: []
            }
        },

        created: function () {
            var self = this;

            var unwatch = this.$watch('table', function (val) {
                var columns = _.filter(val.columns, function (item) {
                    if (item.label === '操作' || item.type !== 'default') {
                        return false;
                    } else {
                        self.showColumns.push(item.property)
                        self.columnsProp.push(item.property)
                        return true;
                    }
                });

                self.columns = columns;

                // 移除监听
                unwatch();
            });
        },

        methods: {
            handleSettingCommand: function (command) {
                var self = this;
                this.handleShowData(command);
                this.$nextTick(function () {
                    self.table.$emit(
                        'hide-columns', 
                        _.difference(self.columnsProp, self.showColumns));
                });
            },

            handleShowData: function (prop) {
                // 恢复默认设置
                if (prop === 'ych-restore-defaults') {
                    this.showColumns = _.concat([], this.columnsProp);
                } else {
                    var index = this.showColumns.indexOf(prop);
                    index < 0 
                        ? this.showColumns.push(prop) 
                        : this.showColumns.splice(index, 1);
                }
            },
        },

        template: `
            <el-dropdown 
                size="mini"
                :hide-on-click="false"
                @command="handleSettingCommand"
                trigger="click"
                style="position: absolute; top: 0; right: 5px; z-index: 10;">

                <el-button 
                    style="padding: 10px 0;"
                    icon="ych-icon-shezhi color-primary" 
                    type="text">
                </el-button>
                
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled>
                        请选择表头展示字段
                    </el-dropdown-item>
                    <el-dropdown-item
                        v-for="(column, index) in columns"
                        :key="column.property"
                        :command="column.property"
                        :divided="index === 0">
                        <i  style="width: 13px; display: inline-block"
                            class="color-primary" 
                            :class="{'el-icon-check': showColumns.indexOf(column.property) > -1}"></i>
                            {{ column.label }}
                    </el-dropdown-item>
                    <el-dropdown-item
                        command="ych-restore-defaults"
                        divided>
                        <center>还原默认设置</center>
                    </el-dropdown-item>
                        
                </el-dropdown-menu>
            </el-dropdown>
        `
    }
    
    var Table = {
        name: 'YchTable',

        mixins: [ELEMENT.Table],
        
        props: {
            height: {
                type: '',
                default: 600
            },

            border: {
                type: Boolean,
                default: true,
            },
            columnController: {
                type: Boolean,
                default: false
            },

            sortable: {
                type: [Boolean, String],
                default: 'custom'
            },

            rowKey: {
                type: String,
                defualt: 'ID'
            }
        },

        mounted: function () {
            this.createColumnController();
        },

        methods: {
            // 创建表列控制器
            createColumnController: function () {
                if (this.columnController) {
                    var Setting = Vue.extend(settingComponent),
                    settingInstance = new Setting({el: document.createElement('div')});
    
                    settingInstance.table = this;
    
                    this.$el.appendChild(settingInstance.$el);
                }
            }
        }
    }

    Table.install = function (Vue) {
        Vue.component(Table.name, Table);
    };

    return Table;
});