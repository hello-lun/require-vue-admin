
define([
    'framework/mixins/sidebar-form',
    'organization/components/organization-tree/index',
    'organization/components/organization-tree/user-list-trees',
    'framework/api/organization/Department'
], function (sideForm, orgTree, userTree, Department) {
    'use strict';

    return {
        name: 'PositionAdd',
        props: ['selectbtn'],
        mixins: [sideForm],
         //注册组件
        components: {
            'organization-tree': orgTree,
            'userlist-tree':userTree
        },   
        mounted: function () {
            var me = this;
            if (me.incomingData.nodeData == null) {
                me.formData.ParentID = "";
                me.formData.ParentName = "商户节点";
            } else {
                me.formData.ParentID = me.incomingData.nodeData.id;
                me.formData.ParentName = me.incomingData.nodeData.name;
            }
        },
        methods: {

            //添加部门、岗位、员工事件
            handleOrgTreeCommand: function (operation, id) {
                /*
                * operation 菜单操作名称
                *    'addDepartment': '添加部门',
                *    'addStation': '添加岗位',
                *    'addEmployee': '添加员工'
                *
                * 菜单ID
                */
                console.log(operation, id);

            },
            //选中节点
            handleOrgTreeNodeClick: function (data, node, instance) {
                // data: 菜单项数据
                // console.log(data, node, instance);
                console.log(data, node, instance, "节点数据");
                this.selectnodeData = data;
            },
            //选择上级组织确认校验
            handleselectNodeClick: function () {
                var nodeData = this.selectnodeData;
                console.log(nodeData, '验证选择的节点信息');
                if (nodeData != null) {
                    if (nodeData.nodeType < 3) {
                        this.dialogFormVisible = false;
                    } else {
                        var err = ",选择的(" + nodeData.name + ")";
                        if (nodeData.nodeType == 3) {
                            err = err + "是岗位    ";
                        } else if (nodeData.nodeType == 4) {
                            err = err + "是员工    ";
                        }
                        this.$message({
                            showClose: true,
                            message: "部门上级必须是总部 / 商户 / 部门" + err,
                            type: 'error'
                        });
                    }
                } else {
                    this.dialogFormVisible = false;
                }
                if (this.formData.ParentID != nodeData.id) {
                    this.formData.ParentID = nodeData.id;
                    this.formData.ParentName = nodeData.name;
                }
                console.log(this.formData.ParentID, this.formData.ParentName, "选择后的上级");
            },

            //添加员工
            handlOpenDialogUser: function () {
                this.userlist = this.tableData;
                this.dialogUserFormVisible = true;              
            },
            //确认选择的员工事件
            handlAddUserClick: function () {
              var nodeData=  this.$refs.resetuserlist.getCheckedNodes();
              var nodeKey = this.$refs.resetuserlist.getCheckedKeys();
              this.dialogUserFormVisible = false;
              this.tableData = nodeData;
            },
            //清空事件
            resetChecked: function () {
                console.log("清空员工!");
                this.$refs.resetuserlist.resetChecked();
            },
            //删除事件
            handleDelClick(row) {
                var nodeData = this.tableData;
                var newNodeData = new Array();
                for (var i = 0; i < nodeData.length; i++) {
                    if (nodeData[i].id == row.id) {
                    } else {
                        newNodeData.push(nodeData[i]);
                    }
                }
                this.tableData = newNodeData;
                this.userlist = this.tableData;
                this.$refs.resetuserlist.setCheckedNodes(this.userlist);
            },

            //请求提交
            submit: function (close) {
                var self = this;
                self.Type = 3;
                var row = self.tableData;
                var users = new Array();
                if (row != null && row != undefined) {
                    for (var i = 0; i < row.length; i++) {
                        users.push(row[i].id);
                    }
                }
                if (users.length != 0) {
                    self.formData.ListUser = JSON.stringify(users);
                }

                Department.create(self.formData)
                    .then(function (d) {
                        if (d != null) {
                            if (d.isSuccess == true) {
                                self.$message({
                                    showClose: true,
                                    message: d.message,
                                    type: 'success'
                                });
                            } else {
                                self.$message({
                                    showClose: true,
                                    message: d.message,
                                    type: 'error'
                                });
                            }
                        }
                        else {
                            self.$message({
                                showClose: true,
                                message: "新增失败",
                                type: 'error'
                            });
                        }
                        close();
                    });
            }
        },
        data: function () {
            var me = this;
            return {
                formData: {
                    Name: '',
                    IsAllAuthority: false,
                    ParentID: null,
                    ParentName: null,
                    Type: 3,
                    ListUser:null
                },
                rules: {
                    Name: [
                        { required: true, message: '岗位名称', trigger: 'blur' }
                    ]
                    //,
                    //ParentID: [
                    //    { required: true, message: '上级组织', trigger: 'blur' }
                    //]
                },
                //选择上级组织
                dialogFormVisible: false,
                selectnodeData: null,
                dialogUserFormVisible: false,
                tableData: null,
                userlist:null,
            }
        },

        template: `
            <side-bar-form
                :model="formData"
                :rules="rules">

                <el-form-item label="岗位名称:" prop="name" >
                    <el-input v-model="formData.Name"></el-input>
                </el-form-item>

                <el-form-item label="所有权限:" prop="name">
                    <el-checkbox v-model="formData.IsAllAuthority">是</el-checkbox>
                </el-form-item>

                <el-form-item label="上级组织:" prop="name">
                    <el-input v-model="formData.ParentName" >
                    <i class="el-icon-edit el-input__icon" slot="suffix" @click="dialogFormVisible = true"> </i>
                    </el-input>
                    <el-input v-model="formData.ParentID" type="hidden"></el-input>
        
                    <el-dialog 
                        title="选择上级组织" 
                        :visible.sync="dialogFormVisible" 
                        :append-to-body="true" 
                        :fullscreen="false" 
                        :close-on-click-modal="false" 
                        :close-on-press-escape="false">
                        <el-aside 
                            class="dialogtree"
                            width="580px">
                            <organization-tree 
                                ref="mainlisttree"  
                                @menu-command="handleOrgTreeCommand" 
                                @node-click="handleOrgTreeNodeClick" 
                                :selectnode="selectnodeData">
                            </organization-tree>     
                        </el-aside>
                        <div slot="footer" class="dialog-footer">
                            <el-button 
                                type="primary" 
                                @click="handleselectNodeClick">
                                确 定
                            </el-button>
                            <el-button @click="dialogFormVisible = false ">
                                取 消
                            </el-button>
                        </div>
                    </el-dialog>
                </el-form-item>
        
                <el-form-item label="包含员工:" prop="name">
                    <el-button 
                        size="mini"  
                        type="primary"  
                        @click="handlOpenDialogUser">
                        添加员工
                    </el-button>
                    <el-dialog 
                        title="添加员工" 
                        :visible.sync="dialogUserFormVisible" 
                        :append-to-body="true" :fullscreen="false" 
                        :close-on-click-modal="false" 
                        :close-on-press-escape="false">
                        <el-aside 
                            class="dialogtree" 
                            width="630px">
                            <userlist-tree 
                                ref="resetuserlist" 
                                :selectUser="userlist">
                            </userlist-tree>
                        </el-aside>
                        <div slot="footer" class="dialog-footer">
                            <el-button 
                                type="primary" 
                                @click="resetChecked">
                                清空
                            </el-button>
                            <el-button 
                                type="primary" 
                                @click="handlAddUserClick">
                                确 定
                            </el-button>
                            <el-button @click="dialogUserFormVisible = false">
                                取 消
                            </el-button>
                        </div>
                    </el-dialog>

                    <el-table 
                        ref="multipleTable"
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 100%">
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
                            label="操作"
                            width="100">
                            <template slot-scope="scope">
                                <el-button @click="handleDelClick(scope.row)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </side-bar-form>
        `
    }
});