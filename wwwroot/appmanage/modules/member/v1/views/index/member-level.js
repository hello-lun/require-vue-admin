define([
    'api/member/v1/MemberLevel',
    'member/components/sidebar-member-level',
    'mixins/pagination'
], function(
    memberLevel,
    SidebarMemberLevel,
    pagination
) {
    'use strict';
    
    return {
        name: 'MemberLevel',

        mixins: [pagination],

        created: function () {
            // 初始化分页混合更新方法
            this.paginationUpdateFn = this.asyncGetMemberLevel;
        },

        data: function () {
            return {
                columnOpration: [
                    {
                        label: '编辑',
                        value: 'edit'
                    },
                    {
                        label: '删除',
                        value: 'delete'
                    }
                ],

                formData: {
                    LevelName: '',
                    LevelCode: ''
                },

                dataList: [],

                order: {
                    Order: 'CreateTime',
                    OderAsc: false
                },

                multipleSelection: []
            };
        },

        methods: {
            asyncGetMemberLevel: function () {
                var self = this,
                    submitData = _.extend(
                        {},
                        this.formData,
                        this.paginationInfo,
                        this.order
                    );
                
                this.$nextTick(function () {
                    memberLevel.GetMemberLevelList(submitData)
                        .then(function (data) {
                            self.dataList = data.Data;
                            self.paginationTotal = data.Total;
                            // self.pageInfo.PageIndex = data.PageIndex;
                            // self.pageInfo.PageSize = data.PageSize;
                        })
                });
            },

            handleSortChange: function (data) {
                this.order.Order = data.prop;
                this.order.OderAsc = data.order === 'ascending';
                this.asyncGetMemberLevel();
            },

            addMemberLevel: function () {
                var self = this;
                this.sideBar({
                    title: '新增会员级别',
                    modules: [{
                      component: SidebarMemberLevel
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.asyncGetMemberLevel();
                        self.$eventBus.$emit('member__update-level');
                    }
                }).show();
            },

            editMemberLevel: function (id){
                var self = this;
                this.sideBar({
                    title: '编辑会员级别',
                    datas: {
                        id: id
                    },
                    modules: [{
                      component: SidebarMemberLevel
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (data) {
                        self.asyncGetMemberLevel();
                        self.$eventBus.$emit('member__update-level');
                    }
                }).show();
            },

            deleteMemberLevel: function (ids) {
                var self = this,
                    data = (typeof ids === 'string')
                            ? [ids] 
                            : _.map(this.multipleSelection, function (item) {
                                return item.ID;
                            });

                this.$confirm('确定删除会员等级？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    memberLevel.DeleteMemberLevel({ ID: data })
                        .then(function () {
                            self.$message({
                                message: '会员级别删除成功！',
                                type: 'success'
                            });
                            self.asyncGetMemberLevel();

                            self.$eventBus.$emit('member__update-level');
                        });
                }).catch(function () {});
            },

            handleOperationColumn: function (name, data) {
                switch (name) {
                    case 'edit':
                        this.editMemberLevel(data.ID);
                        break;

                    case 'delete':
                        this.deleteMemberLevel(data.ID)
                        break;
                }
            },

            setConditionLevelName: function (name) {
                _.extend(this.formData, {
                    LevelName: name,
                    LevelCode: ''
                });
                this.asyncGetMemberLevel();
            },

            handleSelectionChange: function (val) {
                this.multipleSelection = val;
            },

            // 处理查询条件隐藏，清楚条件
            handleConditionHided: function (prop) {
                this.formData[prop] = null;
            }
        },

        template: `
            <ych-report-container>
                <ych-report-header 
                    slot="header"
                    @hide-condition="handleConditionHided"
                    @query-click="asyncGetMemberLevel">

                    <ych-form-item 
                        label="级别名称"
                        key="LevelName"
                        prop="LevelName">
                        <el-input v-model="formData.LevelName"></el-input>
                    </ych-form-item >

                    <ych-form-item  
                        label="级别编码" 
                        key="LevelCode"
                        prop="LevelCode">
                        <el-input v-model="formData.LevelCode"></el-input>
                    </ych-form-item >

                </ych-report-header>

                <ych-table
                    slot="main"
                    :data="dataList"
                    :default-sort = "{prop: 'CreateTime', order: 'descending'}"
                    @sort-change="handleSortChange"
                    @selection-change="handleSelectionChange">

                    <el-table-column
                        type="selection"
                        width="30">
                    </el-table-column>

                    <el-table-column
                        prop="LevelName"
                        label="会员级别"
                        width="128">
                    </el-table-column>
                    
                    <el-table-column
                        prop="LevelCode"
                        label="级别编号"
                        width="100" sortable>
                    </el-table-column>
                    
                    <el-table-column
                        prop="LastEditEmp"
                        label="最后修改人"
                        width="138">
                    </el-table-column>

                    <ych-table-column-format
                        prop="CreateTime"
                        label="创建时间"
                        format-type="date" sortable>
                    </ych-table-column-format>

                    <ych-table-column-format
                        prop="LeaguerTotal"
                        label="累计会员总数"
                        format-type="number" 
                        width="120" sortable>
                    </ych-table-column-format>

                    <ych-table-column-format
                        prop="ToDayAddLgTotal"
                        label="今日新增会员"
                        format-type="number" 
                        width="120" sortable>
                    </ych-table-column-format>

                    <ych-table-column-format
                        prop="ToDayCancelLgTotal"
                        label="今日注销会员"
                        format-type="number" 
                        width="120" sortable>
                    </ych-table-column-format>
                    
                    
                    <!--el-table-column
                        prop="ToTalPurchaseAmount"
                        label="累计购买金额（元）"
                        width="160" sortable>
                    </el-table-column-->
                    
                    <ych-table-column-operation
                        @operation-click="handleOperationColumn"
                        :operation="columnOpration">
                    </ych-table-column-operation>
                </ych-table>

                <template slot="footerLeft">
                    <ych-button @click="addMemberLevel" type="primary">
                        新增级别
                    </ych-button>

                    <ych-button 
                        :disabled="multipleSelection.length <= 0" 
                        @click="deleteMemberLevel">
                        删除
                    </ych-button>
                    
                </template>

                <ych-pagination
                    slot="footerRight"
                    @size-change="$_pagination_sizeChange"
                    @current-change="$_pagination_currentChange"
                    :current-page="paginationInfo.PageIndex"
                    :total="paginationTotal">
                </ych-pagination>
            </ych-report-container>
        `
    }
});