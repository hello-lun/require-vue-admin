define([
    'incss!components/base/report-header/styles/index.css'
], function() {
    'use strict';

    var slotComponent = {
        name: 'SlotComponent',

        functional: true,

        render: function (h, context) {

            var filteredChildren = _.filter(context.children, function (slot) {
                var itemProps = slot.componentOptions ? slot.componentOptions.propsData : [];
                
                return (context.props.showCondition || []).indexOf(itemProps.prop) > -1;
            });

            var tempProps = _.assign({
                labelWidth: '85px'
            }, context.props);

            return h('ych-form', {
                props: tempProps
            }, filteredChildren)
        }
    };
    
    return {
        name: 'YchReportHeader',

        components: {
            'SlotComponent': slotComponent
        },

        props: {
            settingToggle: {
                type: Boolean,
                default: true
            }
        },

        mounted: function () {
            // 遍历slots中default获取每个插槽的属性
            this.getSlotsData();
        },

        data: function () {
            return {
                conditionsSetting: [],
                showCondition: [],
                defaultCondition: []
            };
        },

        computed: {
            // 过滤不显示的条件
            filteredSlots: function () {
                var self = this;
                return _.filter(this.$slots.default, function (slot) {
                    var itemProps = slot.componentOptions ? slot.componentOptions.propsData : [];
                    
                    return self.showCondition.indexOf(itemProps.prop) > -1;
                });
            }
        },
        
        methods: {
            getSlotsData: function () {
                var self = this,
                    defaultSlots = this.$slots.default;
                _.forEach(defaultSlots, function (item) {
                    // 不知道什么情况下会出现所有属性为undefined的元素
                    if (!item.tag) {
                        return;
                    }

                    var itemProps = item.componentOptions ? item.componentOptions.propsData : [];

                    // 拿到默认插槽中的每个组件的name、prop
                    self.conditionsSetting.push({
                        label: itemProps.label,
                        prop: itemProps.prop
                    });
                    // 将默认显示的条件字段，条件到显示数组
                    var isShow = itemProps.show === undefined ? true: itemProps.show
                    if (isShow && itemProps.prop) {
                        self.handleShowData(itemProps.prop);
                        self.defaultCondition.push(itemProps.prop);
                    }
                });
            },

            handleShowData: function (prop) {
                // 恢复默认设置
                if (prop === 'ych-restore-defaults') {
                    this.showCondition = _.concat([], this.defaultCondition);
                } else {
                    var index = this.showCondition.indexOf(prop);
                    index < 0 
                        ? this.showCondition.push(prop) 
                        : this.hideCondition(prop);
                }
            },

            hideCondition: function (prop) {
                var index = this.showCondition.indexOf(prop);
                (index > -1) && this.showCondition.splice(index, 1);
                this.$emit('hide-condition', prop);
            },

            // 处理下拉配置菜单的指令方法
            handleDropdownCommand: function (command) {
                this.handleShowData(command);
            },

            handleQuery: function () {
                this.$emit('query-click', _.difference(this.defaultCondition, this.showCondition));
            }
        },
        

        template: `
            <div class="ych-report-header">
                <el-row 
                    type="flex" 
                    justify="space-around">

                    <el-col>
                        <slot-component :show-condition="showCondition">
                            <slot name="default"></slot>
                        </slot-component>
                    </el-col>
                    <el-col :style="{'width': (settingToggle ? '105px' : '60px')}">
                        <ych-button @click="handleQuery" type="primary">查询</ych-button>
                        <el-dropdown
                            v-if="settingToggle"
                            :hide-on-click="false"
                            @command="handleDropdownCommand" 
                            size="mini">
                            <el-button class="ych-header__setting">
                                <i class="el-icon-d-arrow-right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item disabled>请选择查询条件</el-dropdown-item>
                                <el-dropdown-item
                                    class="ych-header__setting-list"
                                    v-for="(condition, index) in conditionsSetting" 
                                    :key="condition.prop"
                                    :command="condition.prop"
                                    :divided="index === 0">
                                    <i 
                                        class="color-primary"
                                        :class="{'el-icon-check': showCondition.indexOf(condition.prop) > -1}">
                                    </i>
                                    {{ condition.label }}
                                </el-dropdown-item>
                                <el-dropdown-item 
                                    command="ych-restore-defaults"
                                    divided>
                                    <center>还原默认设置</center>
                                </el-dropdown-item>
                                    
                            </el-dropdown-menu>
                        </el-dropdown>
                    </el-col>
                </el-row>
            </div>
        `
    }
});