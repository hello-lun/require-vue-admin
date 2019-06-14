define([
    'framework/mixins/sidebar-form',
    'organization/components/organization-tree/index',
    'framework/api/organization/Department'
], function (sideForm, orgTree, Department) {
    'use strict';
    return {
        name: 'departmentAdd',
        props: ['selectbtn'],
        mixins: [sideForm],
        components: {
            'organization-tree': orgTree
        },

        data: function () {
            var me = this;
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
                },
                //选择上级组织
                dialogFormVisible: false,
                selectnodeData: null
            }
        },

        mounted: function () {
            console.log(this.incomingData);
            if (this.incomingData.nodeData == null) {
                this.formData.ParentID = "";
                this.formData.ParentName = "商户节点";
            } else {
                this.formData.ParentID = this.incomingData.nodeData.id;
                this.formData.ParentName = this.incomingData.nodeData.name;
            }
        },
        methods: {

            //添加部门、岗位、员工事件
            handleOrgTreeCommand: function (operation, id) {
               
            },
            //选中节点
            handleOrgTreeNodeClick: function (data, node, instance) {
                // data: 菜单项数据
                this.selectnodeData = data;
            },
            //选择上级组织确认校验
            handleselectNodeClick: function () {
                var nodeData = this.selectnodeData;
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
            },

            //请求提交
            submit: function (close) {
                this.Type = 2;
                Department.create(this.formData)
                    .then(_.bind(function (data) {
                        var message = '新增失败',
                            type = 'error';
                        if (data != null) {
                            message = data.message || '';
                            data.isSuccess && (type = 'success');
                        }
                        this.$message({
                            showClose: true,
                            message: message,
                            type: type
                        });
                        close();
                    }, this)).catch(function () {
                        close();
                    });
            },
        },

        template: `
            <div>
                <side-bar-form
                    :model="formData"
                    :rules="rules">
                    <el-form-item label="部门名称" prop="name" >
                        <el-input v-model="formData.Name"></el-input>
                    </el-form-item>
                    <el-form-item label="所有权限" prop="name">
                        <el-checkbox 
                            style="padding: 5px 60px;"
                            v-model="formData.IsAllAuthority"
                            label="是"
                            border>
                        </el-checkbox>
                    </el-form-item>

                    <el-form-item 
                        prop="name"
                        label="上级组织"
                        style="width:100%">
                        <el-input
                            style="width:440px"
                            v-model="formData.ParentName"
                            suffix-icon="ych-icon-youjiantou"
                            @focus="dialogFormVisible = true">

                        </el-input>
                        <el-input v-model="formData.ParentID" type="hidden"></el-input>
                    </el-form-item>
                </side-bar-form>
                <el-dialog
                    width="33%"
                    title="选择上级组织" 
                    :visible.sync="dialogFormVisible" 
                    :append-to-body="true" 
                    :fullscreen="false" 
                    :close-on-click-modal="false" 
                    :close-on-press-escape="false">
                    <el-aside width="100%">
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
                        <el-button 
                            @click="dialogFormVisible = false ">
                            取 消
                        </el-button>
                    </div>
                </el-dialog>
            </div>
      `
    }
});