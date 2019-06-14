define([
    'framework/api/member/v1/MemberLevel',
    'member/views/index/member-level',
    'member/views/index/member-data',
    'member/views/index/member-global-setting'
], function(
    memberLevelApi,
    memberLevel,
    memberData,
    memberGlobalSetting
) {
    'use strict';
   
    return {
        name: 'PageMember',

        components: {
            MemberLevel: memberLevel,
            MemberData: memberData,
            MemberGlobalSetting: memberGlobalSetting
        },

        created: function () {
            this.asyncGetMemberLevel();
            var self = this;
            this.$eventBus.$on('member__update-level', function () {
                self.asyncGetMemberLevel();
            });
        },

        data: function () {
            return {
                memberLevelData: [],
                treeProps: {
                    label: 'Name',
                    children: 'Childs',
                    id: 'ID'
                },
                tabActive: 'memberLevel'
            }
        },

        methods: {
            // 获取商品分类
            asyncGetMemberLevel: function () {
                var self = this;

                memberLevelApi.GetMemberLevelTree()
                    .then(function (data) {
                        self.memberLevelData = [{
                            Childs: data.Data,
                            Name: '全部',
                            ID: 'all'
                        }];
                    });
            },

            handleTreeCommand: function (item) {
                switch (item.type) {
                    case 'edit': 
                        this.$refs.memberLevel.editMemberLevel(item.data.ID);
                        break;
                    
                    case 'add':
                        this.$refs.memberLevel.addMemberLevel();
                        break;

                    case 'delete':
                        this.$refs.memberLevel.deleteMemberLevel(item.data.ID)
                        break;
                }
            },

            handleTreeNodeClick: function (data) {
                if (['memberLevel', 'memberData'].indexOf(this.tabActive) < 0) return;
                this.$refs[this.tabActive].setConditionLevelName(
                    data.ID === 'all' 
                        ? null 
                        : data.Name
                );
            },

            // 处理树形结构项右侧菜单render
            handleMenuRender: function (item) {
                var data = item.data,
                    node = item.node;
                return (node.level === 1) 
                        ? { 'add': '新增级别' }
                        : {
                            'edit': '编辑',
                            'delete': '删除'
                        };
            }
        },

        template: `
            <el-container 
                :body-style="{'width': '220px'}" 
                style="height: 100%;">

                <el-card :body-style="{'height': '100%'}" >

                    <el-aside 
                        style="height: 100%"
                        width="200px">

                        <ych-tree
                            ref="mainlisttree"
                            :data="memberLevelData"
                            :data-props="treeProps"
                            node-key="ID"
                            :default-expanded-keys="['all']"
                            @menu-command="handleTreeCommand"
                            :menu-render="handleMenuRender"
                            @node-click="handleTreeNodeClick">
                        </ych-tree>

                    </el-aside>

                </el-card>

                <el-card 
                    :body-style="{'height': '100%'}" 
                    style="margin-left: 10px;flex: 1;">

                    <el-tabs v-model="tabActive">

                        <el-tab-pane 
                            label="会员级别" 
                            name="memberLevel">

                            <member-level 
                                ref="memberLevel">
                            </member-level>
                        </el-tab-pane>

                        <el-tab-pane 
                            label="会员资料" 
                            name="memberData">

                            <member-data ref="memberData">
                            </member-data>
                        </el-tab-pane>

                        <el-tab-pane 
                            label="全局设置" 
                            name="globalSetting">
                            
                            <member-global-setting>
                            </member-global-setting>
                        </el-tab-pane>
                    </el-tabs>
                </el-card>

            </el-container>
        `
    }
});