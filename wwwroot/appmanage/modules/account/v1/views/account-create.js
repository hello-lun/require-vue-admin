define([
    'framework/mixins/sidebar-form',
    'api/account/v1/Account'
], function (
    sideBarFromMixins,
    Account
) {
    'use strict';

    return {
        name: 'AccountCreate',
        mixins: [sideBarFromMixins],

        data: function () {
            var validateConfirmPass = (rule, value, callback) => {
                if (this.accountInfo.Password !== this.accountInfo.ConfirmPassword) {
                    callback(new Error('两次密码输入不一致'))
                } else {
                    callback()
                }
            };

            return {
                accountInfo: {
                    Account: '',
                    Name: '',
                    Password: '',
                    ConfirmPassword: ''
                },
                isEdit: false,
                rules: {
                    Account: [
                        {required: true, trigger: 'blur', message: '请输入账号'},
                        { min: 11, message: '请填写11位的正确手机号码', trigger: 'blur' },
                        { max: 11, message: '请填写11位的正确手机号码', trigger: 'blur' }
                    ],
                    Name: [{required: true, trigger: 'blur', message: '请输入姓名'}],
                    Password: [
                        { min: 6, message: '请填写至少6位密码', trigger: 'blur' },
                        { max: 16, message: '请填写至多16位密码', trigger: 'blur' }
                    ],
                    ConfirmPassword: [
                        { validator: validateConfirmPass, trigger: 'blur' },
                    ]
                }
            }
        },

        created: function () {
            let accountInfo = this.incomingData.accountInfo
            if (accountInfo && accountInfo.ID) {
                this.isEdit = true
                this.accountInfo = accountInfo
            }
        },

        methods: {
            save: function () {
                if (this.isEdit) {
                    return new Promise((resolve, reject) => {
                        this.doEdit(resolve, reject)
                    })
                } else {
                    return new Promise((resolve, reject) => {
                        Account.AccountCreate(this.accountInfo).then(res => {
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
                Account.AccountEdit(
                    this.accountInfo
                ).then(res => {
                    this.$message({
                        message: '修改成功',
                        type:'success'
                    })

                    resolve()
                })
            },

        },

        template: `
            <div>
                <ych-sidebar-layout
                    title="基础信息">

                    <side-bar-form
                        :model="accountInfo"
                        :rules="rules">

                        <ych-form-item 
                            label="账号"
                            placeholder="手机号码"
                            key="Account"
                            prop="Account">
                            <el-input 
                                v-model="accountInfo.Account" 
                                :maxlength="11"
                                :disabled="isEdit"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="姓名"
                            key="Name"
                            prop="Name">
                            <el-input v-model="accountInfo.Name"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="密码"
                            key="Password"
                            prop="Password">
                            <el-input v-model="accountInfo.Password" type="password"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="确认密码"
                            key="ConfirmPassword"
                            prop="ConfirmPassword">
                            <el-input v-model="accountInfo.ConfirmPassword" type="password"></el-input>
                        </ych-form-item>
                        
                    </side-bar-form>
                </ych-sidebar-layout>
            </div>
        `
    }
})