define([
    'framework/mixins/sidebar-form',
    'organization/components/organization-tree/index',
    'framework/api/organization/Department'
], function (sideForm, orgTree, Department) {
    'use strict';
    return {
        name: 'customeredit',
        mixins: [sideForm],
        //注册组件
        components: {
            'organization-tree': orgTree
        },
        mounted: function () {
            var me = this;
            Department.getByID({ 
                ID: me.incomingData.id 
            }).then(function (data) {
                me.formData.Name = data.name;
                me.formData.IsAllAuthority = data.isAllAuthority;
                me.formData.ParentName = data.parentName;
                if (data.parentName == null) {
                    me.formData.ParentName = "商户节点";
                }
                me.formData.ParentID = data.parentID;
                me.formData.ID = me.incomingData.id;
                me.formData.Type = 2;
            });
        },

        data: function () {
            return {

                formData: {
                    Name: '',
                    IsAllAuthority: false,
                    ParentID: null,
                    ParentName: null,
                    Type: 2
                },
                rules: {
                    Name: [
                        { required: true, message: '部门名称', trigger: 'blur' }
                    ]
                    //,
                    //ParentID: [
                    //    { required: true, message: '上级组织', trigger: 'blur' }
                    //]
                },
                //选择上级组织
                dialogFormVisible: false,
                selectnodeData: null
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


            //请求提交
            submit: function (close) {
                var self = this;
                Department.update(is.formData)
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
                                message: "编辑失败",
                                type: 'error'
                            });
                        }
                        close();
                    });
            }
        },

        template: `
            <side-bar-form
                :model="formData"
                :rules="rules">

                <el-form-item label="部门名称:" prop="name" >
                    <el-input v-model="formData.Name"></el-input>
                </el-form-item>
                <el-form-item label="所有权限:" prop="name">
                    <el-checkbox 
                        label="是" 
                        v-model="formData.IsAllAuthority">
                    </el-checkbox>
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
                            width="630px">
                            <organization-tree  
                                ref="mainlisttree"  
                                @menu-command="handleOrgTreeCommand"
                                @node-click="handleOrgTreeNodeClick" 
                                :selectnode="selectnodeData" >
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
            </side-bar-form>
      `
    }
});