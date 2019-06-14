define(function (require) {
    'use strict';
    var Department = require('framework/api/organization/Department');

    return {
        props: ['selecttable'],
        //渲染一个“元组件”为动态组件
        components: {

        },
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

                if (nodeType < 3) {
                    var self = this;
                    Department.GetChildDepartmentByParentID({
                        ParentID: parentID,
                        PositionType: 2
                    }).then(_.bind(function (data) {
                         if (data != null && data != undefined) {
                            self.tableData = data;
                         }
                     }, this));
                }

            },
            //编辑事件
            handleEditClick(row) {
                console.log(row);
                this.$emit('edit', row.id);

            },
            //删除事件
            handleDelClick(row) {
                console.log(row);
                var self = this;
                var selfselecttable = this.selecttable;

                this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var ListID = new Array();
                    ListID.push(row.id);
                    Department.delete({
                        ListID: JSON.stringify(ListID)
                    }).then(_.bind(function (result) {
                        if (result.isOk) {
                            self.$message({
                                showClose: true,
                                message: result.message,
                                type: 'success'
                            });
                        } else {
                            self.$message({
                                showClose: true,
                                message: result.message,
                                type: 'error'
                            });
                        }
                        //删除刷新事件
                        self.selecttable = selfselecttable;
                        self.$emit('del', selfselecttable);
                    }, this));
                }).catch(() => {});
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //刷新数据
            refreshDepartmentListData: function (e) {
                this.asyncGetdepartmentData();
            }

        },

        template: `  <el-table ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">

  <el-table-column
      type="selection"
      prop="id"
      width="55" height="28" >
    </el-table-column>
    <el-table-column
      prop="name"
      label="部门名称"
      width="120">
    </el-table-column>
    <el-table-column
      prop="parentName"
      label="上级"
      width="120">
    </el-table-column>
    <el-table-column
      prop="isAllAuthorityStr"
      label="所有操作权限"
      width="120">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      width="300">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleEditClick(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>


 
    `
    }
});