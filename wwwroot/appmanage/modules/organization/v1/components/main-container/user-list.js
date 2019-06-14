define([
    'framework/api/organization/User'
], function (User) {
    'use strict';
    return {
        props: ['selecttable'],
        //创建组件
        created: function () {
            this.asyncGetdepartmentData();
        },
        //计算属性和观察者
        computed: {

        },
        //侦听器
        watch: {
            selecttable: {
                deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                handler: function (newval, oldval) {
                    if (newval) {
                        this.selecttable = newval;

                    } else {

                    }
                    this.asyncGetdepartmentData();
                }
            }
        },
        data: function () {

            return {
                tableData: null,
                multipleSelection: []
            }
        },
        methods: {
            // 异步获取结构数据
            asyncGetdepartmentData: function () {
                var nodeType = 1;
                var parentID = this.selecttable;
                if (parentID != null) {
                    parentID = this.selecttable.id;
                    nodeType = this.selecttable.nodeType;
                }
                if (nodeType < 4) {

                    if (nodeType == 1) {
                        // this.$http.get(
                        //     'organization/api/User/GetByMallID',
                        //     {
                        //         MallID: null
                        //     }
                        // ).then(_.bind(function (data) {
                        //     if (data != null && data != undefined) {
                        //         if (data != undefined) {
                        //             this.tableData = data;
                        //         }
                        //     }
                        // }, this));

                    } else {
                        User.getByDepartmentID({
                            DepartmentID: parentID
                        }).then(_.bind(function (data) {
                            if (data != null && data != undefined) {
                                this.tableData = data;
                            }
                        }, this));
                    }
                }
            },
            //编辑事件
            handleEditClick(row) {
                this.$emit('edit', row.id);
            },
            //删除事件
            handleDelClick(row) {
                var selfselecttable = this.selecttable;
                this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var ListID = new Array();
                    ListID.push(row.id);
                    User.delete({
                        ListID: JSON.stringify(ListID)
                    }).then(_.bind(function (result) {
                        if (result.isOk) {
                            this.$message({
                                showClose: true,
                                message: result.message,
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                showClose: true,
                                message: result.message,
                                type: 'error'
                            });
                        }
                        //删除刷新事件
                        this.selecttable = selfselecttable;
                        this.$emit('del', selfselecttable);
                    }, this));
                }).catch(() => {});

            },
            //选择事件
            handleSelectionChange(val) {
                this.multipleSelection = val;
            }
            ,
            //刷新数据
            refreshUserListData: function (e) {
                this.asyncGetdepartmentData();
            }

        },

        template: `  
        <el-table ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">

            <el-table-column
                type="selection"
                prop="id"
                width="55" 
                height="28" >
            </el-table-column>

            <el-table-column
                prop="account"
                label="用户名"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                prop="name"
                label="姓名"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                prop="positionName"
                label="所属岗位"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                prop="telePhone"
                label="手机号"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                prop="email"
                label="邮箱"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                prop="isEnableStr"
                label="状态"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                prop="employeeCardNum"
                label="员工卡编号"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                prop="createName"
                label="创建人"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                prop="createTime"
                label="创建时间"
                width="100" 
                height="28">
            </el-table-column>

            <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                    <el-button 
                        @click="handleEditClick(scope.row)" 
                        type="text" 
                        size="small">
                        编辑
                    </el-button>
                    <el-button 
                        @click="handleDelClick(scope.row)" 
                        type="text" 
                        size="small">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    `
    }
});