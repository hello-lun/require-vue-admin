define([
    'framework/api/terminal/v1/TerminalApp',
    'mixins/pagination',
    'terminal/components/sidebar-terminal-app',
    'terminal/components/select-terminal-app-type',
    'terminal/components/select-terminal-type'
],function(
    terminalApp,
    pagination,
    sidebarTerminalApp,
    selectTerminalAppType,
    selectTerminalType
){
    'use strict';

return{    
    name: 'TerminalAppList',

    components: {
        SelectTerminalAppType: selectTerminalAppType,
        SelectTerminalType: selectTerminalType
    },

    mixins: [pagination],

    created: function () {
        // 初始化分页混合更新方法
        this.paginationUpdateFn = this.asyncGetTerminalAppList;
        this.asyncGetTerminalAppList();
    },

    data:function(){
        return{
            // 操作列按钮
            operationColumnData:[
                {
                    label: '编辑',
                    value: 'edit'
                },
                {
                    label: '删除',
                    value: 'delete'
                }
            ],

            conditionData:{
                TerminalAppTypeID: '',
                Name: '',
                TerminalTypeID: '',
            },

            //终端应用数据列表
            terminalAppDataList:[],

        }
    },

    methods:{
        //获取终端应用类型数据列表
        asyncGetTerminalAppList:function(){
            var self = this;

            var submitData = self.handleSubmitData();
            terminalApp
                .Search(submitData)
                .then(function(data){
                    self.terminalAppDataList = data.Data;
                    self.paginationTotal = data.Total;
                });
        },

        handleOperationColumn:function(name,row){
            var fnMap = {
                'edit': this.editTerminalApp,
                'delete': this.deleteTerminalApp
            };

            var fn = fnMap[name];
            fn && fn(row);
        },

        // 处理提交数据
        handleSubmitData: function () {
            var submitData = _.extend({}, this.conditionData);
            return _.extend(
                {},
                submitData,
                this.paginationInfo,
                this.order
            );
        },

        handleSortChange: function (data) {
            this.order.Order = data.prop;
            this.order.OderAsc = data.order === 'ascending';
            this.asyncGetGoodsList();
        },

        handleConditionHided: function (prop) {
            this.conditionData[prop] = null;
        },

        addTerminalApp:function(){
            var self = this;

            self.sideBar({
                title:'新增终端应用',

                modules:[{
                    component:sidebarTerminalApp
                }],

                operation:[{
                    label:'保存',
                    value:'save'
                }],

                success:function(data){
                    self.asyncGetTerminalAppList();
                }
            }).show();
        },

        editTerminalApp:function(data){
            var self = this;

            self.sideBar({
                title:'编辑终端应用',

                datas:{
                    ID: data.ID
                },

                modules:[{
                    component: sidebarTerminalApp
                }],

                operation:[{
                    label: '保存',
                    value: 'save'
                }],

                success:function(data){
                    self.asyncGetTerminalAppList();
                }
            }).show();
        },

        deleteTerminalApp:function(data){
            var self = this;
            this.$confirm('确定删除终端应用？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    terminalApp
                        .Delete({ID: data.ID})
                        .then(function(){
                            self.asyncGetTerminalAppList();
                        });
                }).catch(function () {});
             
        }
    },

    template:`
        <div>
            <el-card 
            :body-style="{'height': '100%'}" 
            style="margin-left: 10px;flex: 1;">

            <ych-report-container>

                <ych-report-header 
                    slot="header"
                    @hide-condition="handleConditionHided"
                    @query-click="asyncGetTerminalAppList">

                    <ych-form-item 
                        label="终端应用类型"
                        key="TerminalAppTypeID"
                        prop="TerminalAppTypeID">
                            <select-terminal-app-type 
                                v-model="conditionData.TerminalAppTypeID">
                            </select-terminal-app-type>
                    </ych-form-item >

                    <ych-form-item 
                        label="终端应用名称"
                        key="Name"
                        prop="Name">
                            <el-input v-model="conditionData.Name"></el-input>
                    </ych-form-item >

                    <ych-form-item 
                        label="终端类型"
                        key="TerminalTypeID"
                        prop="TerminalTypeID">
                        <select-terminal-type 
                            :isMultiple="false"
                            v-model="conditionData.TerminalTypeID">
                        </select-terminal-type>
                    </ych-form-item >

                </ych-report-header>

                <ych-table
                    slot="main"
                    style="margin-top:5px;"
                    :data="terminalAppDataList">

                    <el-table-column
                        prop="Name"
                        label="终端应用名称">
                    </el-table-column>

                    <el-table-column
                        prop="AppTypeName"
                        label="终端应用类型名称">
                    </el-table-column>

                    <el-table-column
                        prop="AppVersion"
                        label="终端应用版本">
                    </el-table-column>

                    <el-table-column
                        prop="Summary"
                        label="概述">
                    </el-table-column>

                    <el-table-column
                        prop="Details"
                        label="详情">
                    </el-table-column>

                    <el-table-column
                        prop="ForTerminalTypes"
                        label="适用的终端类型">
                    </el-table-column>
                    
                    <ych-table-column-operation
                        :operation="operationColumnData"
                        @operation-click="handleOperationColumn">
                    </ych-table-column-operation>
                </ych-table> 
            
                <template slot="footerLeft">
                    <ych-button
                    @click="addTerminalApp"
                    type="primary">
                    新增终端应用
                    </ych-button>
                </template>

                <ych-pagination slot="footerRight"
                    @size-change="$_pagination_sizeChange"
                    @current-change="$_pagination_currentChange"
                    :current-page="paginationInfo.PageIndex"
                    :total="paginationTotal">
                </ych-pagination>

            </ych-report-container>
            </el-card>
        </div>
    `
    }
});