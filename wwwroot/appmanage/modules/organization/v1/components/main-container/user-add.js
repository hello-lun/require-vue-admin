﻿define([
    'framework/mixins/sidebar-form',
    'organization/components/organization-tree/user-position-list-tree'
], function (sideForm,userPositionTree) {
    'use strict';
    //var sideForm = require('mixins/sidebar-form');

    return {
        name: 'userAdd',
        props: ['selectbtn'],
        mixins: [sideForm],
        //注册组件
        components: {
            'userPositionlist-tree': userPositionTree
        },   
        mounted: function () {
            var me = this;
            if (me.incomingData.nodeData == null) {
                me.formData.ParentID = "";
                me.formData.ParentName = "";
            } else {
                me.formData.ParentID = me.incomingData.nodeData.id;
                me.formData.ParentName = me.incomingData.nodeData.name;
            }
            me.formData.IsEnable = true;
        },
        methods: {

            //添加员工
            handlOpenDialogUser: function () {
                this.userPositionlist = this.tableData;
                this.dialogUserFormVisible = true;
            },
            //确认选择的员工事件
            handlAddUserClick: function () {
                var nodeData = this.$refs.resetuserPositionlist.getCheckedNodes();
                var nodeKey = this.$refs.resetuserPositionlist.getCheckedKeys();
                this.dialogUserFormVisible = false;
                this.tableData = nodeData;
            },
            //清空事件
            resetChecked: function () {
                console.log("清空员工!");
                this.$refs.resetuserPositionlist.resetChecked();
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
                this.userPositionlist = this.tableData;
                this.$refs.resetuserPositionlist.setCheckedNodes(this.userPositionlist);
            },



            submit: function (close) {
                var me = this;
                me.Type = 4;
                me.formData.IsEnable = me.value;
               //  var postList = new Array();
               // postList.push(me.formData.ParentID);
               // me.formData.PostList = JSON.stringify(postList);

                var row = me.tableData;
                var users = new Array();
                if (row != null && row != undefined) {
                    for (var i = 0; i < row.length; i++) {
                        users.push(row[i].id);
                    }
                }
                if (users.length != 0) {
                    me.formData.PostList = JSON.stringify(users);
                }
                global.getParentAuthUser(function (user) {
                    var accessToken = user.access_token;
                    $.ajax({
                        headers: {
                            Authorization: "Bearer " + accessToken
                        },
                        type: 'POST',
                        contentType: "application/json",
                        dataType: 'json',
                        url: "organization/api/User/Create",
                        data: JSON.stringify(me.formData),
                        success: function (d) {
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
                        }
                    });
                });
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            }
        
        },
        data: function () {
            var me = this;
            return {
                options: [{
                    value: true,
                    label: '正常'
                }, {
                    value: false,
                    label: '禁用'
                    }],
                formData: {
                    Account: null,
                    Name: null,
                    PassWord: null,
                    RsPassWord:'',
                    ParentID: null,
                    ParentName: null,
                    Type: 4,
                    IsEnable: true,
                    TelePhone: null,
                    Email: null,
                    EmployeeCardNum: null,
                    EmployeeCard: null,
                    ImageUrl: null
                },

                value: true,
                ListUser: null,
                dialogUserFormVisible: false,
                tableData: null,
                userPositionlist: null,
                rules: {
                    Account: [
                        { required: true, message: '用户名', trigger: 'blur' }
                    ]
                    ,
                    Name: [
                        { required: true, message: '姓名', trigger: 'blur' }
                    ]
                }
            }
        },

        template: `
      <el-form
        :ref="formName"
        :size="size"
        :model="formData"
        :rules="rules"
        :label-width="labelWidth" >

        <el-form-item label="用户名:" prop="name" >
          <el-input v-model="formData.Account"></el-input>
        </el-form-item>

        <el-form-item label="姓名:" prop="name" >
          <el-input v-model="formData.Name"></el-input>
        </el-form-item>

        <el-form-item label="密码:" prop="name" >
          <el-input v-model="formData.PassWord" type="password"></el-input>
        </el-form-item>

        <el-form-item label="确认密码:" prop="name" >
          <el-input v-model="formData.RsPassWord" type="password"></el-input>
        </el-form-item>


         <el-form-item label="状态:" prop="name" >
          <el-select v-model="value" >
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

         <el-form-item label="用户头像:" prop="name" >
            <el-upload  class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
             :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="formData.imageUrl" :src="formData.ImageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
        </el-form-item>

        <el-form-item label="手机号:" prop="name" >
          <el-input v-model="formData.TelePhone"></el-input>
        </el-form-item>

        <el-form-item label="电子邮箱:" prop="name" >
          <el-input v-model="formData.Email"></el-input>
        </el-form-item>

      <el-form-item label="员工卡:" prop="name" >
          <el-input v-model="formData.EmployeeCardNum"></el-input>
          <el-input v-model="formData.EmployeeCard" type="hidden"></el-input>
        </el-form-item>

    <el-form-item label="增加岗位:" prop="name">
         <el-button size="mini"  type="primary"  @click="handlOpenDialogUser"  >添加岗位</el-button>
          <el-dialog title="添加岗位" :visible.sync="dialogUserFormVisible" :append-to-body="true" :fullscreen="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-aside class="dialogtree" width="580px">
           <userPositionlist-tree   ref="resetuserPositionlist" :selectUserPosition="userPositionlist"> </userPositionlist-tree>
            </el-aside>
         <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="resetChecked">清空</el-button>
          <el-button type="primary" @click=" handlAddUserClick">确 定</el-button>
           <el-button @click="dialogUserFormVisible = false ">取 消</el-button>
          </div>
          </el-dialog>

<el-table ref="multipleTable"
    :data="tableData"
    tooltip-effect="dark"
    style="width: 100%">
    <el-table-column
      prop="name"
      label="岗位名称"
      width="100" height="28">
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
      





      </el-form>
      `
    }
});