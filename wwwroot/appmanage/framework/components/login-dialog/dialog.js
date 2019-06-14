define([
  'framework/core/usermanager',
  'api/identity/v1/Account',
  'incss!components/login-dialog/styles/index.css'
], function(
    UserManager,
    Account
) {
  'use strict';
  
  return {
    name: 'LoginDialog',

    

    data: function () {
        var validateTel = function (rule, value, callback) {
            if (value.substr(0, 1) != '1') {
                callback(new Error('请输入正确的手机号码'));
            } else {
                callback();
            }
        };

        return {
            visible: false,
            activeTab: 'account',
            accountLogin: {
                Account: '',
                Password: '',
                CustomerNum: ''
            },
            employeeLogin: {
                EmployeeNum: '',
                Password: ''
            },
            securityLogin: {
                TelNum: '',
                SecurityCode: ''
            },
            accountRules: {
                CustomerNum: [
                    { required: true, message: '请输入商户号', trigger: 'blur' }
                ],
                Account: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                Password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            employeeRules: {
                EmployeeNum: [
                    { required: true, message: '请输入员工卡号', trigger: 'blur' },
                ],
                Password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },
            securityRules: {
                TelNum: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 11, max: 11, message: '请输入正确的手机号码', trigger: 'blur' },
                    { validator: validateTel, trigger: 'blur' }
                ],
                SecurityCode: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    { min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur' }
                ]
            },
        }
    },

    watch: {
        visible: function (is) {
            if (!is) {
                this.$destroy();
            }
        }
    },

    methods: {

        handleSubmit: function () {
            var map = {
                'account': this.accountLoginSubmit,
                'employee': this.employeeLoginSubmit,
                'security': this.securityLoginSubmit,
            }

            map[this.activeTab]();
        },
        accountLoginSubmit: function () {
            var accountForm = this.$refs.account;
            var self = this;
            accountForm.validate(function (valid) {
                if (valid) {
                    Account
                        .Login(self.accountLogin)
                        .then(function (res) {
                            UserManager.login(res);
                            // self.$root.$forceUpdate();
                            self.visible = false;

                        });
                } else {
                    return false;
                }
            });
        },
        employeeLoginSubmit: function () {
            var employeeForm = this.$refs.employee;
            employeeForm.validate(function (valid) {
                if (valid) {
                    // employeeForm.$el.submit();
                } else {
                    return false;
                }
            });
        },
        securityLoginSubmit: function () {
            var securityForm = this.$refs.security;
            this.$refs.security.validate(function (valid) {
                if (valid) {
                    // securityForm.$el.submit();
                } else {
                    return false;
                }
            });
        }
    },

    template: `
      <el-dialog
        ref="loginDialog"
        custom-class="login-dialog"
        :visible.sync="visible"
        :append-to-body="true"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="false"
        width="390px">
        <div class="login-container">
          <el-tabs v-model="activeTab" type="card">
              <el-tab-pane label="账号密码登录" name="account">
                  <el-form 
                    size="small"
                    @submit.native.prevent
                    ref="account"
                    :rules="accountRules"
                    :model="accountLogin"
                    label-width="0">
                      <el-form-item prop="CustomerNum">
                          <el-input name="CustomerNum"
                                    placeholder="商户号"
                                    v-model="accountLogin.CustomerNum">
                          </el-input>
                      </el-form-item>
                      <el-form-item prop="Account">
                          <el-input name="Account"
                                    placeholder="用户名"
                                    v-model="accountLogin.Account">
                          </el-input>
                      </el-form-item>
                      <el-form-item prop="Password">
                          <el-input name="Password"
                                    type="password"
                                    placeholder="密码"
                                    v-model="accountLogin.Password"></el-input>
                      </el-form-item>
                  </el-form>
              </el-tab-pane>
              <el-tab-pane label="员工卡登录" name="employee">
                  <el-form 
                    size="small"
                    @submit.native.prevent     
                    ref="employee"
                    :rules="employeeRules"
                    :model="employeeLogin"
                    label-width="0">
                      <el-form-item class="special-item" prop="EmployeeNum">
                          <el-input name="EmployeeNum" placeholder="读取员工卡" v-model="employeeLogin.EmployeeNum"></el-input>
                      </el-form-item>
                      <el-form-item class="special-item" prop="Password">
                          <el-input name="Password" type="password" placeholder="密码" v-model="employeeLogin.Password"></el-input>
                      </el-form-item>
                  </el-form>
              </el-tab-pane>
              <el-tab-pane label="验证码登录" name="security">
                  <el-form 
                    @submit.native.prevent
                    size="small"
                    ref="security"
                    :rules="securityRules"
                    :model="securityLogin"
                    label-width="0">
                      <el-form-item class="special-item" prop="TelNum">
                          <el-input name="TelNum" :maxlength="11" placeholder="手机号码" v-model="securityLogin.TelNum"></el-input>
                      </el-form-item>
                      <el-form-item class="special-item" prop="SecurityCode">
                          <el-input name="SecurityCode" :maxlength="6" class="security-code" placeholder="点击获取验证码" v-model="securityLogin.SecurityCode"></el-input>
                          <el-button size="small" class="security-code-btn" type="text">获取验证码</el-button>
                      </el-form-item>
                  </el-form>
              </el-tab-pane>
          </el-tabs>

          <div class="login-footer">
              <el-button @click="handleSubmit" class="login-btn" type="primary">登录</el-button>
          </div>
      </div>
      </el-dialog>
    `
  }
});