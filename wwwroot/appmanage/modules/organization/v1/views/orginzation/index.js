define([
    'framework/api/organization/v1/Organization',
    'framework/api/organization/v1/Position',
    'framework/api/organization/v1/Department',
    'framework/api/organization/v1/Employee',
    'organization/views/operating-page/staff-management',
    
], function(
    organizationTreeData,
    Position,
    Department,
    Employee,
    staffManagement,
) {
    'use strict';

    return {
        name: 'organization',
        components: {
            staffManagement:staffManagement
        },

        created: function () {
            this.asyncGetOrganizationTree();
        },

        data: function () {
            return {
                defaultTreeNode:[],
                treeLocation:{},
                organizationTree: [],
                treeProps: {
                    label: 'Name',
                    children: 'Childs'
                },
                // icons: ['ych-icon-dingzi','ych-icon-xiangmu','ych-icon-shezhi','ych-icon-shanghuleixing'],
                tabActive: 'organizationPage',
                allname:[]
            }
        },

        methods: {
            changeTabPane:function(){
                this.tabActive = 'organizationPage';
            },

            isdelete:function(data){
               
                // 根据ID删除树形结构节点
                var nodeType = data.NodeType,
                    markID = data.ID,
                    that = this;

                this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            if(nodeType == 'Department'){
                                Department.DeleteDepartmentByID({ID:markID})
                                    .then(function(res){
                                        that.asyncGetOrganizationTree();
                                        that.$message({
                                            message: '删除部门成功',
                                            type: 'success'
                                        });
                                    },function(err){
                                        that.$message.error('删除部门信息失败！！！');
                                    });
            
                            }else if(nodeType == 'Position'){
                                Position.DeletePositionByID({ID:markID})
                                    .then(function(res){
                                        that.asyncGetOrganizationTree();
                                        that.$message({
                                            message: '删除岗位成功',
                                            type: 'success'
                                        });
                                    },function(err){
                                        that.$message.error('删除岗位信息失败！！！');
                                    });
            
                            }else if(nodeType == 'Employee'){
                                Employee.DeleteEmployee({ID:markID})
                                .then(function(res){
                                    that.asyncGetOrganizationTree();
                                    that.$message({
                                        message: '删除人员成功',
                                        type: 'success'
                                    });
                                },function(err){
                                    that.$message.error('删除人员信息失败！！！');
                                });
                            }
                        }).catch(() => {});
            },
            // 获取树形结构
            asyncGetOrganizationTree: function () {
                var self = this;
                organizationTreeData.GetTree()
                    .then(function(data){
                        // 删除无用的mock数据的影响，上线后需要移除此代码
                        // _.forEach(data.Data,function(item){
                        //     delete item.Childs;
                        // });
                        self.defaultTreeNode.push(data.Data[0].ID);

                        self.organizationTree = data.Data;
                        });
            },

            handleTreeCommand: function (item) {
                var data = item.data,
                    methodName = item.type;
                    // 存放操作名称的对象，判断树形结构的munu操作是哪种操作，然后
                var operationData = {
                    name:methodName,
                    data:data
                }

                switch (methodName) {
                    case 'addDepartment':
                        this.treeAddDepartment(operationData);
                        break;

                    case 'editDepartment':
                        this.treeAddDepartment(operationData);
                        break;

                    case 'addPost':
                        this.treeAddPost(operationData);
                        break;
                    
                    case 'editPost':
                        this.treeAddPost(operationData);
                        break;
                    
                    case 'addEmployee':
                        this.treeAaddEmployee(operationData);
                        break;

                    case 'editEmployee':
                        this.treeEditEmployee(data);
                        break;

                    case 'delete':
                        this.isdelete(data);
                        break;
                }
            },
            handleTreeNodeClick: function (data) {

                // 点击树形节点,传id和type到staffManagement组件，调用它的geteMployeeData方法刷新员工管理的人员列表
                this.$refs.staffManagement.geteMployeeData({
                    NodeID:data.ID,
                    NodeType:data.NodeType
                });
            },
            treeEditEmployee:function(data){
                this.$refs.staffManagement.edit(data);
            },
            // 添加部门
            treeAddDepartment:function(operationData){
                this.$refs.staffManagement.addDepartment(operationData);
            },
            // 添加岗位
            treeAddPost:function(operationData){
                this.$refs.staffManagement.addPost(operationData);
            },
            // 添加人员
            treeAaddEmployee:function(operationData){
                this.$refs.staffManagement.addStaffMethods(operationData);
            },

            // 处理树形结构项右侧菜单render
            handleMenuRender: function (item) {
                var operate = [{
                    'addDepartment':'添加部门',
                    'addPost':'添加岗位'
                },
                {
                    'addDepartment':'添加部门',
                    'addPost':'添加岗位',
                    'editDepartment':'编辑部门',
                    'delete':'删除'
                },
                {
                    'addEmployee':'添加员工',
                    'editPost':'编辑岗位',
                    'delete':'删除'
                },
                {
                    'editEmployee':'编辑员工',
                    'delete':'删除'
                }];

                if(item.data.NodeType == 'Customer'){
                    //总部
                    return ;    
                }else if(item.data.NodeType == 'Tenant'){
                    // 商户
                    return operate[0];
                }else if(item.data.NodeType == 'Department'){
                    // 部门
                    return operate[1];
                }else if(item.data.NodeType == 'Position'){
                    // 岗位
                    return  operate[2];
                }else{
                    return  operate[3];
                }
            },
            iconshow:function(item){
                if(item.data.NodeType == 'Customer'){
                    // 总部
                    return 'ych-icon-zongbu';
                }else if(item.data.NodeType == 'Tenant'){
                    //商户
                    return 'ych-icon-shanghuleixing';
                }else if(item.data.NodeType == 'Department'){
                    // 部门
                    return 'ych-icon-bumen';
                }else if(item.data.NodeType == 'Position'){
                    // 岗位
                    return 'ych-icon-gangwei';
                }else{
                    // 员工
                    return 'ych-icon-yuangong   ';
                }
            }
        },
        
        template: `
            <el-container 
                :body-style="{'width': '220px'}" 
                style="min-height: 100%;">

                <el-card :body-style="{'height': '100%'}" >

                    <el-aside 
                        style="height: 100%"
                        width="200px">

                        <ych-tree
                            ref="mainlisttree"
                            :data="organizationTree"
                            :data-props="treeProps"
                            :custom-icon="iconshow"
                            node-key="ID"
                            :default-expanded-keys="defaultTreeNode"
                            @menu-command="handleTreeCommand"
                            :menu-render="handleMenuRender"
                            @node-click="handleTreeNodeClick">
                        </ych-tree>

                    </el-aside>

                </el-card>  

                <el-card 
                    :body-style="{'height': '100%'}" 
                    style="margin-left: 10px;flex: 1;">

                    <el-tabs v-model="tabActive">

                        <el-tab-pane 
                            label="权限管理" 
                            name="organizationPage">
                        </el-tab-pane>

                        <el-tab-pane 
                            label="员工管理" 
                            name="staffPage">
                            <staff-management
                                ref="staffManagement"
                                @refleshTreeData="asyncGetOrganizationTree"
                                @changeTabPane="changeTabPane">
                            </staff-management>
                        </el-tab-pane>

                    </el-tabs>
                </el-card>

            </el-container>
        `
    }
});