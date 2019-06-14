define([
    'framework/api/organization/v1/Employee',
    'organization/views/edit-side/side-edit-department',
    'organization/views/edit-side/side-edit-employee',
    'organization/views/edit-side/side-add-post',
    'organization/views/operating-page/staff-page/add-staff',
    
    'mixins/pagination',
], function(
    employee,
    sideEditDepartment,
    sideAddEmployee,
    sideAddPost,
    addStaff,
    pagination
) {
    'use strict';

    var operationGroup = [
        {
            label: '编辑',
            value: 'edit'
        },
        {
            label: '权限',
            value: 'jurisdiction'
        }
        ,
        {
            label: '删除',
            value: 'delete'
        }
        // ,
        // {
        //     label: '售卖记录',
        //     value: 'saleLog'
        // },
        // {
        //     label: '交账记录',
        //     value: 'transaction'
        // },
        // {
        //     label: '操作日志',
        //     value: 'operate'
        // }
    ]
    
    return {
        name: 'staffManagement',

        mixins: [pagination],

        created: function () {
            this.paginationUpdateFn = this.geteMployeeData;
            this.geteMployeeData();
        },

        data: function () {
            return {
                allDataList:{},
                operation:operationGroup,
                PositionName:' ',
                Name:'',
                Account:'',
                formData: {
                    Name: '',
                    Account: '',
                    PositionName: ''
                },
                order: {
                    Order: '',
                    OderAsc: false
                },
                tableHideColumn:[]
            };
        },

        methods: {
            // 获取人员列表
            geteMployeeData:function(searchData){
                var  searchFormData = _.extend({},this.paginationInfo,this.formData,searchData,this.order);
                var that = this;

                console.log(searchFormData,'查询人员表单数据');

                employee.SeachEmployeeList(searchFormData)
                    .then(function(data){
                        that.allDataList = data;
                        that.paginationTotal = data.Total;
                    });
            },
            handleOperationColumn:function(name,data){
                var that = this;
                // 编辑操作
                if(name == 'edit'){
                    this.edit(data);
                }else if(name == 'jurisdiction'){
                    this.$emit("changeTabPane",'organizationPage');
                    
                }else if(name == 'delete'){
                    this.delectStaffItem(data);
                }

            },
            delectStaffItem:function(data){
                var delectStaffId = data.ID,
                    that = this;

                this.$confirm('此操作将删除人员信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(function(){
                    //根据ID 异步 删除人员表格某一行数据
                    employee.DeleteEmployee({ID:delectStaffId})
                    .then(function(){
                        //异步删除成功后，将页面上的人员数据剔除掉
                         _.forEach(that.allDataList.Data,function(item,index){
                            if(item.ID == delectStaffId){
                                that.$nextTick(function(){
                                    that.allDataList.Data.splice(index,1);
                                });
                            }
                        });
                        that.$emit('refleshTreeData');
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    },function(err){
                        that.$message({
                            type: 'warning',
                            message: '删除人员信息失败！！！'
                        });
                    });
                    
                  }).catch(function(){});
            },

            handleSortChange: function (data) {
                this.order.Order = data.prop;
                this.order.OderAsc = data.order === 'ascending';
                this.geteMployeeData();
            },

            edit:function(data){
                var that = this;
                this.sideBar({
                    title: '人员修改',
                    datas: {
                        ID : data.ID
                    },
                    modules: [{
                        component: sideAddEmployee
                    }],
                    operation: [{
                        label: '保存',
                        value: 'save'
                    }],
                    success: function (res) {
                        that.geteMployeeData();
                        that.$emit('refleshTreeData');
                        that.$message({
                            message: '编辑员工成功！！！',
                            type: 'success'
                        });
                    }
                }).show();
            },
            //根据条件查询员工列表
            handleConditionHided: function (prop) {
                this.formData[prop] = null;
            },
            addStaffMethods:function(operationData){
                var that = this;
                 //判断是树形结构的添加人员操作，还是员工管理表格下面的新增人员操作
                 var nativeEdit = false;

                 if(operationData.name == 'addEmployee'){
                    nativeEdit = true;
                }
                
                this.sideBar({
                    title: '新增员工',
                    datas: {
                        operationData:operationData,
                        nativeEdit:nativeEdit
                    },
                    modules: [{
                        component: addStaff
                    }],
                    operation: [{
                        label: '保存',
                        value: 'addStaffSave'
                    }],
                    success: function (data) {
                        that.geteMployeeData();
                        that.$emit('refleshTreeData');
                        that.$message({
                            message: '新增员工成功！！！',
                            type: 'success'
                        });
                    }
                }).show();
            },
            addPost:function(operationData){
                //判断是否需要回填信息
                var isBackfill = false,
                //判断是树形结构的添加岗位操作，还是员工管理表格下面的新增岗位操作
                    nativeEdit = true,
                    title = '新增岗位',
                    that = this;

                if(operationData.name == 'editPost'){
                    isBackfill = true;
                    nativeEdit = false;
                    title = '编辑岗位';
                }else if(operationData.name == 'addPost'){
                    isBackfill = false;
                    nativeEdit = false;
                }

                this.sideBar({
                    title: title,
                    datas: {
                        isBackfill:isBackfill,
                        nativeEdit:nativeEdit,
                        data:operationData
                    },
                    modules: [{
                        component: sideAddPost
                    }],
                    operation: [{
                        label: '保存',
                        value: 'addPostSave'
                    }],
                    success: function (data) {
                        that.$emit('refleshTreeData');
                        that.$message({
                            message: '新增岗位成功！！！',
                            type: 'success'
                        });
                    }
                }).show();
            },
            addDepartment:function(operationData){
                //是否需要回填信息，编辑部门
                var isBackfill = false,
                //判断是树形结构的添加部门操作，还是员工管理表格下面的新增部门操作
                    nativeEdit = true,
                    title = '新增部门',
                    that = this;

                if(operationData.name == 'editDepartment'){
                    isBackfill = true;
                    nativeEdit = false;
                    title = '编辑部门';
                }else if(operationData.name == 'addDepartment'){
                    isBackfill = false;
                    nativeEdit = false;
                }

                this.sideBar({
                    title: title,
                    datas: {
                        isBackfill:isBackfill,
                        nativeEdit:nativeEdit,
                        data:operationData
                    },
                    modules: [{
                        component: sideEditDepartment
                    }],
                    operation: [{
                        label: '保存',
                        value: 'addDepartmentSave'
                    }],
                    success: function (data) {
                        that.$emit('refleshTreeData');
                        that.$message({
                            message: '新增部门成功！！！',
                            type: 'success'
                        });
                    }
                }).show();
            }
        },

        template: `
        <ych-report-container>
            <ych-report-header 
                slot="header"
                @hide-condition="handleConditionHided"
                @query-click="geteMployeeData">

                <ych-form-item
                    label="用户名"
                    key="Account"
                    prop="Account">
                    <el-input 
                    v-model="formData.Account"></el-input>
                </ych-form-item>

                <ych-form-item
                    label="姓名"
                    key="Name"
                    prop="Name">
                    <el-input 
                    v-model="formData.Name"></el-input>
                </ych-form-item>

                <ych-form-item
                    label="岗位名称"
                    key="PositionName"
                    prop="PositionName">
                    <el-input 
                    v-model="formData.PositionName"></el-input>
                </ych-form-item>

            </ych-report-header >

            <ych-table
                slot="main"
                :data="allDataList.Data"
                row-key="ID"
                @sort-change="handleSortChange"
                @hide-columns="tableHideColumn = arguments[0]"
                :height="300">
                    
                    <ych-table-column-format
                        v-if="tableHideColumn.indexOf('Account') < 0"
                        prop="Account"
                        key="Account"
                        label="用户名 "
                        min-width="150" 
                        format-type="link"
                        :link-click="edit"
                        sortable>
                    </ych-table-column-format>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('Name') < 0"
                        key="Name"
                        prop="Name"
                        label="姓名 "
                        min-width="150" 
                        sortable>
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('Position') < 0"
                        key="Position"
                        prop="Position"
                        label="所属岗位 "
                        min-width="150" 
                        sortable>
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('Phone') < 0"
                        key="Phone"
                        prop="Phone"
                        label="手机号 "
                        min-width="150" 
                        sortable>
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('Email') < 0"
                        key="Email"
                        prop="Email"
                        label="邮箱 "
                        min-width="150" 
                        sortable>
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('EmployeeState') < 0"
                        key="EmployeeState"
                        prop="EmployeeState"
                        label="状态 "
                        min-width="150" 
                        sortable>

                        <template slot-scope="scope">
                            <ych-state-tag
                                :text="(scope.row.EmployeeState == 'Disable') ? '禁用' : '正常' "
                                :state="(scope.row.EmployeeState == 'Disable') ? 'warning' : 'success'">
                            </ych-state-tag>
                        </template>

                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('Position') < 0"
                        key="CardCode"
                        prop="CardCode"
                        label="员工卡编号 "
                        min-width="150" 
                        sortable>
                    </el-table-column>

                    <el-table-column
                        v-if="tableHideColumn.indexOf('CreateName') < 0"
                        key="CreateName"
                        prop="CreateName"
                        label="创建人 "
                        min-width="150" 
                        sortable>
                    </el-table-column>

                    <ych-table-column-format
                        v-if="tableHideColumn.indexOf('CreateTime') < 0"
                        min-width="150" 
                        key="CreateTime"
                        prop="CreateTime"
                        label="创建时间"x
                        format-type="date" sortable>
                    </ych-table-column-format>

                    <ych-table-column-operation
                        @operation-click="handleOperationColumn"
                        :operation="operation">
                    </ych-table-column-operation>

            </ych-table>

            <template slot="footerLeft">
                <ych-button 
                    @click="addStaffMethods" 
                    type="primary">
                    新增员工
                </ych-button>

                <ych-button 
                    @click="addPost">
                    新增岗位
                </ych-button>

                <ych-button 
                    @click="addDepartment">
                    新增部门
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