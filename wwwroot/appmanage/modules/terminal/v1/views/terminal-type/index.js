define([
    'framework/api/terminal/v1/TerminalType',
    'mixins/pagination',
    'terminal/components/sidebar-terminal-type'
],function(
    terminalType,
    pagination,
    sidebarTerminalType
){
    'use strict';

return{    
    name: 'TerminalTypeList',

    components: {},

    mixins: [pagination],

    created: function () {
        // 初始化分页混合更新方法
        this.paginationUpdateFn = this.asyncGetTerminalTypeList;
        this.asyncGetTerminalTypeList();
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

            //终端类型数据列表
            terminalTypeDataList:[],

            //终端类型数据
            formData:{
                TypeNum:'',
                TypeName:''
            },

            // 新增弹窗控制
            //dialogVisible: false,
        }
    },

    methods:{
        //获取终端类型数据列表
        asyncGetTerminalTypeList:function(){
            var self = this;

            terminalType
                .GetTerminalTypes()
                .then(function(data){
                    self.terminalTypeDataList = data.TerminalTypes;
                    self.paginationTotal = data.Total;
                });
        },

        handleOperationColumn:function(name,row){
            var fnMap = {
                'edit': this.editTerminalType,
                'delete': this.deleteTerminalType
            };

            var fn = fnMap[name];
            fn && fn(row);
        },

        addTerminalType:function(){
            var self = this;

            self.sideBar({
                title:'新增终端类型',

                modules:[{
                    component:sidebarTerminalType
                }],

                operation:[{
                    label:'保存',
                    value:'save'
                }],

                success:function(data){
                    self.asyncGetTerminalTypeList();
                }
            }).show();
        },

        editTerminalType:function(data){
            var self = this;

            self.sideBar({
                title:'编辑终端类型',

                datas:{
                    ID: data.ID
                },

                modules:[{
                    component: sidebarTerminalType
                }],

                operation:[{
                    label: '保存',
                    value: 'save'
                }],

                success:function(data){
                    self.asyncGetTerminalTypeList();
                }
            }).show();
        },

        deleteTerminalType:function(data){
            var self = this;
            this.$confirm('确定删除终端类型？', '提示', {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    terminalType
                        .DeleteTerminalType({ID: data.ID})
                        .then(function(){
                            self.asyncGetTerminalTypeList();
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
                    @query-click="asyncGetTerminalTypeList">
                </ych-report-header>

                <ych-table
                    slot="main"
                    style="margin-top:5px;"
                    :data="terminalTypeDataList">

                    <el-table-column
                        prop="TypeNum"
                        label="终端类型编号">
                    </el-table-column>

                    <el-table-column
                        prop="TypeName"
                        label="终端类型名称">
                    </el-table-column>

                    <ych-table-column-operation
                        :operation="operationColumnData"
                        @operation-click="handleOperationColumn">
                    </ych-table-column-operation>
                </ych-table> 
            
                <template slot="footerLeft">
                    <ych-button
                    @click="addTerminalType"
                    type="primary">
                    新增终端类型
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