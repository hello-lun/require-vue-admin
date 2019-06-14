define([
    'framework/api/organization/v1/Employee',
    'framework/api/organization/v1/Position',
    
    'framework/mixins/sidebar-form',
    'incss!organization/views/operating-page/staff-page/add-staff.css'
    
], function(
    Employee,
    Position,
    sideBarForm
) {
    'use strict';

    return {
        name:'jurisdiction',
        mixins: [sideBarForm],
        data:function(){
            var validatePass = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请输入密码'));
                } else {
                  if (this.addStaffFormData.rePassWord !== '') {
                    this.$refs.forms.validateField('rePassWord');
                  }
                  callback();
                }
              };
              
              var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                  callback(new Error('请再次输入密码'));
                } else if (value !== this.addStaffFormData.PassWord) {
                  callback(new Error('两次输入密码不一致!'));
                } else {
                  callback();
                }
              };

            return {
                Name:'',
                tabActive:'moreMessage',
                addStaffFormData:{
                    ID:'',
                    EmployeeState:'',
                    Account:'',
                    Name:'',
                    PassWord:'',
                    rePassword:'',
                    Phone:'',
                    Email:'',
                    CardID:'',
                    CardCode:'',
                    UserImageUrl:'',
                    ListPositionID:[],
                  },
                //   岗位集合
                  ListPositionList:[],
                //表单验证
                  rules:{
                    Account:[
                        {required: true, message: '请填写用户名', trigger: 'blur'}
                    ],
                    Name:[
                        {required: true, message: '请填写名称', trigger: 'blur'}
                    ],
                    // PassWord:[
                    //     { validator: validatePass, required: true,trigger: 'blur' }
                    // ],
                    // rePassword:[
                    //     { validator: validatePass2, required: true,trigger: 'blur' }
                    // ]
                    // ,
                    Phone:[
                        {required: true, message: '请填写正确的手机号码', trigger: 'blur',pattern:/^1[34578]\d{9}$/}
                    ],
                    Email:[
                        {required: true, message: '请填写正确的邮箱', trigger: 'blur',pattern:/^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/}
                    ]
                  },
                  dialogVisible:false,
                  //搜索框 已经选择的岗位的集合
                  selectPostName: [],
                  //所有的岗位数据的集合
                  allPostData:[],
                
            }
        },
      
        methods:{
            //    重置表单
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 过滤岗位id,在选择多个岗位的时候，会出现id为undefined的值，还有重复的id，这些都要过滤掉
            filterListPositionID:function(){
                var that = this;
                _.forEach( this.ListPositionList, function(item, index){
                    if(item.PostionID !== undefined){
                        that.addStaffFormData.ListPositionID.push(item.PostionID);
                    }
                });
                // 对id去重
                this.addStaffFormData.ListPositionID = _.uniq(this.addStaffFormData.ListPositionID);
                delete this.addStaffFormData.rePassword;
            },

            save:function(){
                var self = this;
                this.filterListPositionID();

                return new Promise(function (resolve, reject) {
                    Employee.EditEmployee(self.addStaffFormData)
                        .then(function () {
                            resolve();
                            self.$message({
                                message: '员工编辑成功！',
                                type: 'success'
                            });
                        }, function () {
                            reject();
                        });
                }).catch(function(e) {
                    return Promise.reject();
                }); 
            },

            getAllEmployee:function(userId){
                var that = this;
                Employee.GetEmployeeByID({ID:userId}).then(function(res){
                    that.addStaffFormData.EmployeeState=res.EmployeeState;
                    that.addStaffFormData.Account=res.Account;
                    that.addStaffFormData.CardCode=res.CardCode;
                    that.addStaffFormData.CardID=res.CardID;
                    that.addStaffFormData.ID=res.ID;
                    
                    that.addStaffFormData.Name=res.Name;
                    that.addStaffFormData.Phone=res.Phone;
                    that.addStaffFormData.Email=res.Email;
                    that.addStaffFormData.PassWord=res.PassWord;
                    // that.addStaffFormData.rePassWord=res.PassWord;
                    
                    //获取到某位人员所有的岗位,然后回填显示
                    that.ListPositionList=res.ListPositionID;
                    that.addStaffFormData.UserImageUrl=res.UserImageUrl;
                    that.addStaffFormData.UserImageUrl.Key = res.Key;
                },function(err){
                    that.$message.error('网络错误，请重新获取人员编辑信息！！！');
                });
                
            },
        //   用户头像上传
            handleFileSuccess: function (res,file, fileList) {
                console.log(res,'人员头像');
                this.addStaffFormData.Key = res.Key;
                this.addStaffFormData.UserImageUrl = res.URL;
            },
            removeImage:function(file, fileList){
                this.addStaffFormData.UserImageUrl = '';
            },

            OpenPost:function(){
                var that = this;
                this.dialogVisible = true;
                // 每次打开时清空el-select的tag标签
                this.selectPostName =[];
                
                // 获取所有岗位
                Position.GetALLPosition().then(function(res){
                    that.allPostData = res.Data;
                });
            },
            // 删除员工岗位
            delectPost:function(positionIndex){
                var that = this;
                this.$confirm('此操作将删除员工岗位信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(function(){
                        that.ListPositionList.splice(positionIndex,1);
                    }).catch(function(){});
            },
            //选择表格按钮时触发的方法
            handleSelectionChange:function(val){
                var that = this;
                this.selectPostName = [];
                _.forEach(val,function(item){
                    that.selectPostName.push(item.ID);
                });
            },

            //选择el-select时触发的方法
            selectPostChange:function(val){
                var that = this;
                // val是 el-select 选中的ID集合，this.allPostData是全部的列表数据，
                
                // 目的是：让上面的el-select和下面的表格列表关联起来，下面的选中，上面的el-select也选中。上面的选中，下面同样选中
                // _.forEach(this.allPostData ,function(item){
                //     if (val.indexOf(item.ID) > -1) {
                //         that.$refs.selectBox.toggleRowSelection(item);
                //     }
                // });
            },

            // 保存选择岗位的时候处理数据，并且进行数据去重
            savePostSelect:function(){
                var that = this;

                _.forEach(this.selectPostName,function(item){
                    _.forEach(that.allPostData,function(a){
                        if(a.ID == item){
                            a.PostionID = a.ID ;
                            a.PostionName = a.Name ;
                            delete a.ID;
                            delete a.Name;
                            //将选择的岗位和刚开始回填的岗位合并起来，可能存在重复的岗位，需要去重
                            that.ListPositionList.push(a);
                        }           
                    });
                });
                // 数据去重
                
                this.ListPositionList = _.uniqBy(this.ListPositionList, 'PostionID');
                this.dialogVisible = false;

            },
            closePostSelect:function(){
                this.dialogVisible = false;
            },
            removeTagMethod:function(item){
                var that = this;
                that.$refs.selectBox.clearSelection();
                _.forEach(this.allPostData ,function(item){
                    if (that.selectPostName.indexOf(item.ID) > -1) {
                        that.$refs.selectBox.toggleRowSelection(item,true);
                    }
                });
                
            },
            selectAllbox:function(val){
                var that = this;
                this.selectPostName = [];
                _.forEach(val,function(item){
                    that.selectPostName.push(item.ID);
                });
            }
        },
        beforeMount :function(){
            this.getAllEmployee(this.incomingData.ID);
        },

        template:`
            <side-bar-form
            ref="forms"
            :model="addStaffFormData"
            :rules="rules">

                <ych-sidebar-layout>
                    
                    <el-form-item 
                        prop="Account" 
                        label="用户名">
                        <el-input 
                            v-model="addStaffFormData.Account">
                        </el-input>
                    </el-form-item>

                    <el-form-item 
                        prop="Name" 
                        label="姓名">
                        <el-input 
                            v-model="addStaffFormData.Name">
                        </el-input>
                    </el-form-item>

                    <el-form-item 
                        prop="Password" 
                        label="密码">
                        <el-input 
                            type = "password"
                            auto-complete="off"
                            v-model="addStaffFormData.PassWord">
                        </el-input>
                    </el-form-item> 

                    <el-form-item 
                        prop="rePassword" 
                        label="确认密码">
                        <el-input 
                            auto-complete="off"
                            type = "password"
                            v-model="addStaffFormData.rePassword">
                        </el-input>
                    </el-form-item>

                    <el-form-item 
                        prop="Phone" 
                        label="手机号">
                        <el-input 
                            v-model="addStaffFormData.Phone">
                        </el-input>
                    </el-form-item>

                    <el-form-item 
                        prop="Email" 
                        label="邮箱">
                        <el-input 
                            v-model="addStaffFormData.Email">
                        </el-input>
                    </el-form-item>
                  
                    <el-form-item
                        prop="State" 
                        label="状态">
                        <el-radio v-model="addStaffFormData.EmployeeState" label="Normal" border size="small">启用</el-radio>
                        <el-radio v-model="addStaffFormData.EmployeeState" label="Disable" border size="small">禁用</el-radio>
                    </el-form-item>
                
                </ych-sidebar-layout>

            <el-tabs v-model="tabActive">
                <el-tab-pane 
                    label="更多信息"
                    name="moreMessage">

                <ych-sidebar-layout title="员工头像">
                    <ych-upload
                        list-type="picture-card"
                        :max-size="2480"
                        :limit = "1"
                        :on-remove = "removeImage"
                        :on-success="handleFileSuccess">
                        <img v-if="addStaffFormData.UserImageUrl" :src="addStaffFormData.UserImageUrl" class="userImageWrap">
                        <i v-else class="el-icon-plus"></i>
                    </ych-upload>

                </ych-sidebar-layout>

                <ych-sidebar-layout title="员工卡">
                    <el-form-item>
                        <el-input placeholder="请输入内容" v-model="addStaffFormData.CardCode">
                            <template slot="append">读</template>
                        </el-input>
                    </el-form-item>
                </ych-sidebar-layout>

                <ych-sidebar-layout title="所属岗位">
                    <ych-card
                        @click.native="OpenPost"
                        type="add"
                        width="130px"
                        height="150px">
                    </ych-card>

                    <el-dialog title="增加岗位" 
                        :visible.sync="dialogVisible" 
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
                                    v-for="item in allPostData"
                                    :key="item.ID"
                                    :label="item.Name"
                                    :disabled="true"
                                    :value="item.ID">
                                </el-option>

                            </el-select>

                            <el-table
                                ref="selectBox"
                                :data="allPostData"
                                tooltip-effect="dark"
                                style="width: 100%;"
                                @select-all="selectAllbox"
                                @select="handleSelectionChange">
                            
                                <el-table-column
                                    prop="Name"
                                    label="岗位名称"
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
                                <el-button type="primary" @click.native="savePostSelect">确定</el-button>
                                <el-button @click.native="closePostSelect">取消</el-button>
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
                            <el-col>
                                <h1>{{item.PostionName}}</h1>
                            </el-col>
                        </el-row>

                        <el-row slot="footer">
                            <el-col>
                               <p><span>岗位人员：</span><span>{{item.Number}}</span></p>
                            </el-col>   
                        </el-row>

                        <template slot="mask">
                            <el-button
                                @click="delectPost(index)"
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