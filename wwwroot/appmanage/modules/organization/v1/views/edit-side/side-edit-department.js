define([
    'framework/api/organization/v1/Department',
    'framework/api/organization/v1/Position',
    'framework/api/organization/v1/Employee',
    
    'framework/mixins/sidebar-form',
    
], function(
    Department,
    Position,
    Employee,
    sideBarForm
) {
    'use strict';

    return {
        name:'sideAddPost',
        mixins: [sideBarForm],
        data:function(){
            return {
                departDefaultNode:[],
                addPostFormData:{
                    IsAllAuthority:false,
                    Name:'',
                    ParentID:'',
                    ParentType:'',
                    IsEnable:true,
                    ParentName:''
                },
                rules:{
                    Name:[
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                    ParentID:[
                        { required: true, message: '请选择活动资源', trigger: 'change' }
                    ]
                },
                tabActive:'moreMessage',
                dialogVisible:false,
                addStaffDialogVisible:false,
                selectPostName: [],
                allStaffData:[],
                // 选择到的树形岗位数据
                selectTreeData:{},
                multipleSelection: [],
                addPostSearch:'',
                postTreeData:[],
                treeProps: {
                    label: 'Name',
                    children: 'Childs'
                },
                temporaryTreeData:'',
                ListPositionList:[]
            }
        },
        props:{
        },
        computed:{
           
        },
        components: {
           
        },
        methods:{
            addDepartmentSave:function(){
                var self = this;
                //压入人员id到表单的人员id字段
                _.forEach(this.ListPositionList,function(item){
                    self.addPostFormData.ListEmployeeID.push(item.ID);
                });
                // 删除无用的表单字段
                delete this.addPostFormData.ParentName;

                if(this.incomingData.isBackfill){
                    // 编辑部门
                    // 新增一个ID字段到编辑岗位的表单数据中
                    this.addPostFormData.ID = this.incomingData.data.data.ID;
                    delete this.addPostFormData.ParentType;

                    return new Promise(function (resolve, reject) {
                        Department.EditDepartment(self.addPostFormData)
                            .then(function () {
                                resolve();
                                self.$message({
                                    message: '编辑部门成功！',
                                    type: 'success'
                                });
                            }, function () {
                                reject();
                            });
                    }).catch(function(e) {
                        return Promise.reject();
                    }); 

                }else{
                     // 增加部门
                    return new Promise(function (resolve, reject) {
                        Department.AddDepartment(self.addPostFormData)
                            .then(function () {
                                resolve();
                                self.$message({
                                    message: '新增部门成功！',
                                    type: 'success'
                                });
                            }, function () {
                                reject();
                            });
                    }).catch(function(e) {
                        return Promise.reject();
                    }); 
                }
            },
           
            OpenPost:function(){
                var that = this;
                this.dialogVisible = true;
                Department.GetDepartmentTree()
                    .then(function(res){
                        // 删除无用的mock数据的影响，上线后需要移除此代码
                        // _.forEach(res.Data,function(item){
                        //     delete item.Childs
                        // });
                        that.departDefaultNode.push(res.Data[0].ID);
                        that.postTreeData = res.Data;
                    });
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
            },
            handleTreeNodeClick:function(itemData){
                // 临时保存选中的上级组织
                this.temporaryTreeData = itemData;
            },
            savePostSelect:function(){

                //将临时保存的上级组织赋值给selectTreeData，然后填充到表单数据中
                this.selectTreeData = this.temporaryTreeData;
                this.addPostFormData.ParentID = this.selectTreeData.ID;
                this.addPostFormData.ParentType = this.selectTreeData.NodeType;

                this.addPostFormData.ParentName = this.selectTreeData.ParentName;
                
                this.dialogVisible = false;
            },
            closePostSelect:function(){
                this.dialogVisible = false;
            },
            OpenStaff:function(){
                var that = this;
                this.addStaffDialogVisible = true;
                Employee.GetAllEmployee()
                .then(function(data){
                    that.allStaffData = data.Data;
                });
            },
            selectPostChange:function(val){
                var that = this;
                _.forEach(this.allStaffData,function(item,index){
                    _.forEach(val,function(a,b){
                        if(a == item.ID){
                            that.$refs.selectBox.toggleRowSelection(item);
                        }
                    });
                });
            },
            handleSelectionChange:function(val){
                this.selectPostName = val;

            },
            saveStaffSelect:function(){
                var that = this;
                this.ListPositionList = this.selectPostName;
                this.addStaffDialogVisible = false;
            },
            delectStaff:function(positionIndex){
                var that = this;
                this.$confirm('此操作将删除员工信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(function(){
                        that.ListPositionList.splice(positionIndex,1);
                        that.selectPostName = that.ListPositionList;
                        that.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }).catch(function(){});
                
            },
            closeStaffSelect:function(){
                this.addStaffDialogVisible = false;
            },

            getDepartmentById:function(val){
                if(val.isBackfill){
                    var uid = val.data.data.ID,
                    that = this;
                    Department.GetDepartmentByID({ID:uid}).then(function(res){
                        that.addPostFormData.Name = res.Name;

                        that.addPostFormData.ParentName = res.ParentName;
                        that.addPostFormData.IsEnable = res.IsEnable;
                        that.addPostFormData.ParentID = res.ParentID;
                    });
                }else{
                    this.addPostFormData.ParentName = val.data.data.ParentName;
                    this.addPostFormData.ParentID = val.data.data.ID;
                    this.addPostFormData.ParentType = val.data.data.NodeType;
                    return;
                }
            }
        },
        created :function(){
            if(!this.incomingData.nativeEdit){
                //编辑部门的操作，用于回填部门的信息
                this.getDepartmentById(this.incomingData);
            }
        },

        template:`
            <side-bar-form
                :model="addPostFormData"
                :rules="rules">

                <ych-sidebar-layout>
                    <el-form-item 
                        prop="Name" 
                        label="部门名称">
                        <el-input 
                            v-model="addPostFormData.Name">
                        </el-input>
                    </el-form-item>

                    <el-form-item 
                        prop="ParentID" 
                        label="上级组织">
                        <el-input
                            @focus="OpenPost"
                            placeholder="请选择"
                            v-model="addPostFormData.ParentName">
                            <i slot="suffix" class="el-input__icon el-icon-caret-right"></i>
                        </el-input>
                    </el-form-item>

                    <el-form-item
                        prop="State" 
                        label="状态">
                        <el-radio v-model="addPostFormData.IsEnable" :label="true" border size="small">启用</el-radio>
                        <el-radio v-model="addPostFormData.IsEnable" :label="false" border size="small">禁用</el-radio>
                    </el-form-item>

                    <el-dialog title="选择上级组织" 
                        :visible.sync="dialogVisible"
                        :modal-append-to-body="false" 
                        width="50%"
                        style="height:800px;">
                    
                        <ych-tree
                            ref="postListTree"
                            :data="postTreeData"
                            :data-props="treeProps"
                            :custom-icon="iconshow"
                            node-key="ID"
                            :default-expanded-keys="departDefaultNode"
                            @node-click="handleTreeNodeClick">
                        </ych-tree>  

                        <el-row>
                            <el-col :span="24" style="text-align:right;margin:40px 0 20px 0;">
                                <el-button type="primary" @click.native="savePostSelect">确定</el-button>
                                <el-button @click.native="closePostSelect">取消</el-button>
                            </el-col>
                        </el-row>    
                    </el-dialog>

            </ych-sidebar-layout>

        </side-bar-form>
        `

    }
});