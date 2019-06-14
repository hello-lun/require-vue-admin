define([
    'framework/api/organization/v1/Position',
    'framework/api/organization/v1/Employee',
    'framework/mixins/sidebar-form',
], function(
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
                addPostFormData:{
                    IsAllAuthority:false,
                    Name:'',
                    ParentID:'',
                    ParentType:'',
                    ListEmployeeID:[],
                    IsEnable:true
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
                postTreeData:[],
                treeProps: {
                    label: 'Name',
                    children: 'Childs'
                },
                temporaryTreeData:{},
                ListPositionList:[],
                selectStaffData:[],
                postDefaultNode:[]
            }
        },
        computed:{
        },
        
        methods:{
            addPostSave:function(){
                var self = this;
                //保存数据的时候，将人员id压入到表单的人员id字段
                _.forEach(this.ListPositionList,function(item){
                    self.addPostFormData.ListEmployeeID.push(item.ID);
                });

                if(this.incomingData.isBackfill){
                    // 编辑岗位
                    // 新增一个ID字段到编辑岗位的表单数据中
                    this.addPostFormData.ID = this.incomingData.data.data.ID;
                    delete this.addPostFormData.ParentType;

                    return new Promise(function (resolve, reject) {
                        Position.EditPosition(self.addPostFormData)
                            .then(function () {
                                resolve();
                                self.$message({
                                    message: '编辑岗位成功！',
                                    type: 'success'
                                });
                            }, function () {
                                reject();
                            });
                    }).catch(function(e) {
                        return Promise.reject();
                    });

                }else{
                    // 增加岗位
                    return new Promise(function (resolve, reject) {
                        Position.AddPosition(self.addPostFormData)
                            .then(function () {
                                resolve();
                                self.$message({
                                    message: '新增岗位成功！',
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
                Position.GetPositionTree()
                    .then(function(res){
                        // 删除无用的mock数据的影响，上线后需要移除此代码
                        // _.forEach(res.Data,function(item){
                        //     delete item.Childs;
                        // });
                        that.postDefaultNode.push(res.Data[0].ID);
                        that.postTreeData = res.Data;
                    });
            },
            GetPostById:function(val){
                
                if(val.isBackfill){
                    var uid = val.data.data.ID,
                    that = this;
                    Position.GetPositionByID({ID:uid}).then(function(res){
                        that.addPostFormData.Name = res.Name;

                        that.selectTreeData.ParentName = res.ParentName;
                        
                        that.addPostFormData.IsEnable = res.IsEnable;
                        that.addPostFormData.ParentID = res.ParentID;
                        
                        _.forEach(res.ListEmployee,function(item){
                            that.ListPositionList.push(item);
                        });
                    });
                }else{
                    this.selectTreeData.ParentName = val.data.data.ParentName;
                    this.addPostFormData.ParentID = val.data.data.ID;
                    this.addPostFormData.ParentType = val.data.data.NodeType;
                    return;
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
                this.selectTreeData.ParentName = this.selectTreeData.ParentName;
                
                this.dialogVisible = false;
                
            },
            closePostSelect:function(){
                this.dialogVisible = false;
            },
            OpenStaff:function(){
                this.selectPostName = [];
                
                var that = this;
                this.addStaffDialogVisible = true;
                Employee.GetAllEmployee()
                .then(function(data){
                    that.allStaffData = data.Data;
                });
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
            selectPostChange:function(val){
            },
            removeTagMethod:function(item){
                this.selectStaffData =[];
                var that = this;
                that.$refs.selectBox.clearSelection();
                _.forEach(this.allStaffData ,function(item){
                    if (that.selectPostName.indexOf(item.ID) > -1) {
                        that.selectStaffData.push(item);
                        that.$refs.selectBox.toggleRowSelection(item,true);
                    }
                });
            },
            // 改变人员表格选择的时候触发的事件
            handleSelectionChange:function(val){
                var that = this;
                this.selectStaffData = val;
                this.selectPostName = [];
                _.forEach(val,function(item){
                    that.selectPostName.push(item.ID);
                });
            },
            selectAllbox:function(val){
                var that = this;
                this.selectStaffData = val;
                this.selectPostName = [];
                _.forEach(val,function(item){
                    that.selectPostName.push(item.ID);
                });
            },
            saveStaffSelect:function(){
                var that = this;
                _.forEach(this.selectStaffData,function(item){
                    that.ListPositionList.push(item);
                });

                // 根据ID将选择到的人员去重
                this.ListPositionList = _.uniqBy(this.ListPositionList,'ID');
                this.addStaffDialogVisible = false;

            }
        },
        created :function(){
            if(!this.incomingData.nativeEdit){
                //编辑岗位的操作，用于回填岗位的信息
                this.GetPostById(this.incomingData);
            }
        },

        template:`
            <side-bar-form
                :model="addPostFormData"
                :rules="rules">    
                    
                <ych-sidebar-layout>
                    <el-form-item 
                        prop="Name" 
                        label="岗位名称">
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
                            v-model="selectTreeData.ParentName">
                            <i slot="suffix" class="el-input__icon el-icon-caret-right"></i>
                        </el-input>
                    </el-form-item>
                   

                    <el-form-item
                        prop="State" 
                        label="状态">
                        <el-radio v-model="addPostFormData.IsEnable" :label="true" border size="small">启用</el-radio>
                        <el-radio v-model="addPostFormData.IsEnable" :label="false" border size="small">禁用</el-radio>
                    </el-form-item>
                
        </ych-sidebar-layout>

        <el-tabs v-model="tabActive">
            <el-tab-pane 
                label="更多信息"
                name="moreMessage">

                <ych-sidebar-layout title="包含员工">
                    <ych-card
                        @click.native="OpenStaff"
                        type="add"
                        width="130px"
                        height="150px">
                    </ych-card>


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
                            :default-expanded-keys="postDefaultNode"
                            @node-click="handleTreeNodeClick">
                        </ych-tree>  

                        <el-row>
                            <el-col :span="24" style="text-align:right;margin:40px 0 20px 0;">
                                <el-button type="primary" @click.native="savePostSelect">确定</el-button>
                                <el-button @click.native="closePostSelect">取消</el-button>
                            </el-col>
                        </el-row>    

                    </el-dialog>


                    <el-dialog title="添加员工" 
                        :visible.sync="addStaffDialogVisible" 
                        width="50%"
                        :modal-append-to-body="false">

                        <el-row>
                        <el-col>
                            <el-select 
                                v-model="selectPostName" 
                                multiple 
                                size="mini"
                                style="margin-bottom: 20px;width: 100%;"
                                @change="selectPostChange"
                                @remove-tag="removeTagMethod"
                                placeholder="请选择">

                                <el-option
                                    v-for="item in allStaffData"
                                    :key="item.ID"
                                    :label="item.Name"
                                    :disabled="true"
                                    :value="item.ID">
                                </el-option>

                            </el-select>

                            <el-table
                                ref="selectBox"
                                :data="allStaffData"
                                tooltip-effect="dark"
                                style="width: 100%;"
                                @select-all="selectAllbox"
                                @select="handleSelectionChange">
                            
                                <el-table-column
                                    prop="Name"
                                    label="人员名称"
                                    show-overflow-tooltip>
                                </el-table-column>

                                <el-table-column
                                    type="selection"
                                    width="55">
                                </el-table-column>
                            </el-table>
                        </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="24" style="text-align:right;margin:20px 0 20px 0;">
                                <el-button type="primary" @click.native="saveStaffSelect">确定</el-button>
                                <el-button @click.native="closeStaffSelect">取消</el-button>
                            </el-col>
                        </el-row>
                    </el-dialog>

                    <ych-card 
                        v-for="(item,index) in ListPositionList"
                        :key="item.ID"
                        :mask="true"
                        width="130px"
                        height="150px">

                        <el-row slot="header">
                            <el-col>
                                <ych-state-tag
                                    :text=' item.IsEnable ? "正常" : "禁用" '
                                    :state=' item.IsEnable ? "success" : "warning" '>
                                </ych-state-tag>     
                            </el-col>   
                        </el-row>
                        <el-row slot="default">
                            <el-col :span="24">
                                <el-row>
                                    <el-col :span="24"  style="text-align:center;">
                                        <h1>{{item.Name}}</h1>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="24" style="text-align:center;">
                                        <span>{{item.Account}}</span>
                                    </el-col>
                                </el-row>
                            
                            </el-col>
                        </el-row>

                       
                        <template slot="mask">
                            <el-button
                                @click="delectStaff(index)"
                                size="mini">
                                移出
                            </el-button>
                            <el-button 
                                @click=""
                                type="primary" 
                                size="mini">
                                权限设置
                            </el-button>
                        </template>
                    </ych-card>

                </ych-sidebar-layout>

            </el-tab-pane>    
            <el-tab-pane 
                label="修改记录"
                name="logs">
            </el-tab-pane>  

            </el-tabs>
        </side-bar-form>

        `

    }
});