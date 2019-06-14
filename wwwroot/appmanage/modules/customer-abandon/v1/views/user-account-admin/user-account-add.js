define([
    'framework/mixins/sidebar-form',
    'components/input-code/index',
    'api/customer/v1/User'
], function (
    sideBarFromMixins,
    InputCode,
    User
) {
    'use strict';

    return {
        name: 'UserAccountAdd',
        mixins: [sideBarFromMixins],
        components: {InputCode: InputCode},

        data: function () {
            return {
                userFormData: {
                    Number: '',
                    Account: '',
                    Password: '',
                    Name: '',
                    Tel: '',
                    Department: '',
                    Post: '',
                    AccountLevel: '',
                    EntryTime: ''
                },
                rules: {
                    Number: [{required: true, trigger: 'blur', message: '请输入用户编码'}],
                    Account: [{required: true, trigger: 'blur', message: '请输入用户账户'}],
                    Password: [{required: true, trigger: 'blur', message: '请输入初始密码'}],
                    Name: [{required: true, trigger: 'blur', message: '请输入用户姓名'}],
                    Tel: [{required: true, trigger: 'blur', message: '请输入联系电话'}],
                    Department: [{required: true, trigger: 'blur', message: '请输入所属单位'}],
                    AccountLevel: [{required: true, trigger: 'blur', message: '请选择账户级别'}]
                },

                isEdit: false,
                isEditing: false,
                userDataId: ''
            }
        },

        created: function () {
            this.isEdit = this.incomingData.isEdit
            if (this.isEdit) {
                this.rules.Password = []
                this.userDataId = this.incomingData.ID
                this.asyncGetUserData()
            }
        },

        methods: {
            edit: function () {
                this.isEditing = true
                return Promise.reject()
            },
            save: function () {
                if (this.isEdit) {
                    return new Promise((resolve, reject) => {
                        this.doEdit(resolve, reject)
                    })
                } else {
                    return new Promise((resolve, reject) => {
                        User.Create(this.userFormData).then(res => {
                            if (res) {
                                this.$message({
                                    message: '添加成功',
                                    type:'success'
                                })
    
                                resolve()
                            } else {
                                reject()
                            }
                        })
                    })
                }
            },

            doEdit: function (resolve, reject) {
                if (this.isEditing) {
                    User.Edit(this.userFormData).then(res => {
                        if (res) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })

                            resolve()
                        } else {
                            reject()
                        }
                    })
                } else {
                    reject()
                }
            },

            asyncGetUserData: function () {
                User.GetID({ID: this.userDataId}).then(res => {
                    if (res) {
                        this.userFormData = res
                    }
                })
            }
        },

        template: `
            <div>
                <ych-sidebar-layout
                    title="基础信息">

                    <side-bar-form
                        :model="userFormData"
                        :rules="rules">

                        <ych-form-item 
                            label="用户编码"
                            key="Number"
                            prop="Number">

                            <input-code 
                                v-model="userFormData.Number"
                                type="user-account-admin"
                                :getCode="true"
                                disabled />

                        </ych-form-item>
                        
                        <ych-form-item 
                            label="用户账户"
                            key="Account"
                            prop="Account">
                            <el-input placeholder="请输入用户账户" v-model="userFormData.Account" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="初始密码"
                            key="Password"
                            prop="Password">
                            <el-input placeholder="请输入初始密码" type="password" v-model="userFormData.Password" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="用户姓名"
                            key="Name"
                            prop="Name">
                            <el-input placeholder="请输入用户姓名" v-model="userFormData.Name" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="联系电话"
                            key="Tel"
                            prop="Tel">
                            <el-input placeholder="请输入联系电话" v-model="userFormData.Tel" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="所属单位"
                            key="Department"
                            prop="Department">
                            <el-input placeholder="请输入所属单位" v-model="userFormData.Department" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="岗位"
                            key="Post"
                            prop="Post">
                            <el-input placeholder="请输入岗位名称" v-model="userFormData.Post" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="账户级别"
                            key="AccountLevel"
                            prop="AccountLevel">
                            <el-select placeholder="请选择账户级别" v-model="userFormData.AccountLevel" :disabled="isEdit && !isEditing">
                                <el-option value="Administrators" label="管理员"/>
                                <el-option value="User" label="用户"/>
                            </el-select>
                        </ych-form-item>

                        <ych-form-item 
                            label="员工入职时间"
                            key="EntryTime"
                            prop="EntryTime">
                            <el-date-picker
                                v-model="userFormData.EntryTime"
                                type="date"
                                :disabled="isEdit && !isEditing"
                                placeholder="请选择入职时间">
                            </el-date-picker>
                        </ych-form-item>

                    </side-bar-form>
                </ych-sidebar-layout>
            </div>
        `
    }
})