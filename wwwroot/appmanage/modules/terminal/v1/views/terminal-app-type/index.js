define([
    'framework/api/terminal/v1/TerminalAPPType',
    'mixins/pagination',
    'terminal/components/sidebar-terminal-app-type'
],function(
    terminalAppType,
    pagination,
    sidebarTerminalAppType
){
    'use strict';

return{    
    name: 'TerminalAppTypeList',

    components: {},

    mixins: [pagination],

    created: function () {
        // 初始化分页混合更新方法
        this.paginationUpdateFn = this.asyncGetTerminalAppTypeList;
        this.asyncGetTerminalAppTypeList();
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

            //终端应用类型数据列表
            terminalAppTypeDataList:[],

            //终端应用类型数据
            formData:{
                TypeNum:'',
                TypeName:''
            },

        }
    },

    methods:{
        //获取终端应用类型数据列表
        asyncGetTerminalAppTypeList:function(){
            var self = this;

            terminalAppType
                .Search()
                .then(function(data){
                    self.terminalAppTypeDataList = data.Data;
                    self.paginationTotal = data.Total;
                });
        },

        handleOperationColumn:function(name,row){
            var fnMap = {
                'edit': this.editTerminalAppType,
                'delete': this.deleteTerminalAppType
            };

            var fn = fnMap[name];
            fn && fn(row);
        },

        addTerminalAppType:function(){
            var self = this;

            self.sideBar({
                title:'新增终端应用类型',

                modules:[{
                    component:sidebarTerminalAppType
                }],

                operation:[{
                    label:'保存',
                    value:'save'
                }],

                success:function(data){
                    self.asyncGetTerminalAppTypeList();
                }
            }).show();
        },

        editTerminalAppType:function(data){
            var self = this;

            self.sideBar({
                title:'编辑终端应用类型',

                datas:{
                    ID: data.ID
                },

                modules:[{
                    component: sidebarTerminalAppType
                }],

                operation:[{
                    label: '保存',
                    value: 'save'
                }],

                success:function(data){
                    self.asyncGetTerminalAppTypeList();
                }
            }).show();
        },

        deleteTerminalAppType:function(data){
            var self = this;
            this.$confirm('确定删除终端应用类型？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    terminalAppType
                        .Delete({ID: data.ID})
                        .then(function(){
                            self.asyncGetTerminalAppTypeList();
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
                    @query-click="asyncGetTerminalAppTypeList">
                </ych-report-header>

                <ych-table
                    slot="main"
                    style="margin-top:5px;"
                    :data="terminalAppTypeDataList">

                    <el-table-column
                        prop="TypeNum"
                        label="终端应用类型编号">
                    </el-table-column>

                    <el-table-column
                        prop="TypeName"
                        label="终端应用类型名称">
                    </el-table-column>

                    <ych-table-column-operation
                        :operation="operationColumnData"
                        @operation-click="handleOperationColumn">
                    </ych-table-column-operation>
                </ych-table> 
            
                <template slot="footerLeft">
                    <ych-button
                    @click="addTerminalAppType"
                    type="primary">
                    新增终端应用类型
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