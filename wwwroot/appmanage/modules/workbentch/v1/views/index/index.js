define([
    'workbentch/views/index/table-container',
    'framework/api/workbentch/v1/Task'
], function(TableContainer, Task) {
    'use strict';
    // tabs上的标记组件
    var badge = {

        functional: true,

        render: function (h, context) {
            return h('el-badge', {
                style: {
                    height: '20px',
                    lineHeight: '20px'
                },
                props: {
                    max: 10,
                    value: context.props.value
                }
            }, [
                h('span', {
                    domProps: {
                        textContent: context.props.text
                    }
                })
            ])
        }

    }
    
    return {
        name: 'PageWorkBentch',

        components: {
            badge: badge,
            TableContainer: TableContainer
        },

        mounted: function () {
            this.unreadPolling();
        },

        data: function () {
            return {
                tabActive: 'todo',
                badgeMax: 10,
                unread: [0]
            }
        },

        methods: {
            // 轮询未读数量
            unreadPolling: function () {
                var self = this;

                var fn = function () {
                    Task.UnRead()
                        .then(function (res) {
                            self.unread = res.Data;
                            // 接口有数据返回，再隔30s访问一次
                            res && setTimeout(fn, 30000);
                        });
                }

                fn();
            }
        },

        template: `
            <el-card>
                <el-tabs v-model="tabActive" @tab-click="">
                    <el-tab-pane name="todo">
                        <badge 
                            slot="label"
                            :value="unread[0]"
                            text="待办">
                        </badge>
                        <table-container status="Wait"></table-container>
                    </el-tab-pane>
                    <el-tab-pane name="processing">
                        <badge 
                            slot="label"
                            :value="0"
                            text="审批中">
                        </badge>
                        <table-container status="Process"></table-container>
                    </el-tab-pane>
                    <el-tab-pane name="completed">
                        <badge 
                            slot="label"
                            :value="0"
                            text="已完成">
                        </badge>
                        <table-container status="Complete"></table-container>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        `
    }
});