define([
    'api/pos/v1/LeaguerLevel',
    'api/pos/v1/Leaguer'
], function (
    leaguerLevel,
    leaguer,
    ) {
        'use strict';

        return {
            name: 'AddLeaguer',

            data: function () {
                var self = this;

                var validatePass = function (rule, value, callback) {
                    if (value === '') {
                        callback(new Error('请输入密码'));
                    } else {
                        if (self.formData.ConfirmPassWord !== '') {
                            self.$refs.form.validateField('ConfirmPassWord');
                        }
                        callback();
                    }
                };
                var validatePass2 = function (rule, value, callback) {
                    if (value === '') {
                        callback(new Error('请再次输入密码'));
                    } else if (value !== self.formData.PassWord) {
                        callback(new Error('两次输入密码不一致!'));
                    } else {
                        callback();
                    }
                };

                return {
                    dialogVisible: false,

                    formData: {
                        LeaguerLevelID: null,
                        Number: null,
                        PassWord: null,
                        ConfirmPassWord: null,
                        RealName: null,
                        Sex: null,
                        ChipID: null,
                        Birthday: null,
                        TelePhone: null,
                        IdentityCard: null,
                        Address: null,
                        ImageUrl: null,
                    },

                    rules: {
                        LeaguerLevelID: [
                            { required: true, message: '请选择会员级别', trigger: 'blur' }
                        ],
                        RealName: [
                            { required: true, message: '请填写会员姓名', trigger: 'blur' }
                        ],
                        Number: [
                            { required: true, message: '请读取会员卡', trigger: 'blur' }
                        ],
                        TelePhone: [
                            { required: true, type: 'string', message: '请填写会员手机号码', trigger: 'blur' },
                            { len: 11, message: '请填写正确的手机号码', trigger: 'blur' }
                        ],
                        IdentityCard: [
                            { required: true, type: 'string', message: '请填写会员身份证号', trigger: 'blur' },
                            { len: 18, message: '请填写正确的身份证号', trigger: 'blur' }
                        ],

                        PassWord: [
                            { validator: validatePass, trigger: 'blur' }
                        ],

                        ConfirmPassWord: [
                            { validator: validatePass2, trigger: 'blur' }
                        ]
                    },

                    leaguerLevelList: []
                };
            },

            computed: {
                currentLevel: function () {
                    var levelId = this.formData.LeaguerLevelID;
                    var levelInfo = _.find(
                        this.leaguerLevelList,
                        function (item) {
                            return item.ID === levelId;
                        }
                    ) || {};

                    return levelInfo;
                }
            },

            methods: {
                handleOpenEvent: function () {
                    this.asyncGetAllLeaguerLevel();
                },

                handleCloseEvent: function () {
                    this.$refs.form.resetFields();
                },

                asyncGetAllLeaguerLevel: function () {
                    var self = this;

                    leaguerLevel
                        .GetAllLevel()
                        .then(function (res) {
                            self.leaguerLevelList = res.Data;
                        });
                },

                addLeaguer: function () {
                    var self = this;

                    leaguer
                        .LeaguerJoin(this.formData)
                        .then(function () {
                            self.dialogVisible = false;
                            self.$alert('会员入会成功！', '提示', {
                                type: 'success'
                            });
                        });
                },

                submitForm: function () {
                    var self = this;
                    this.$refs.form.validate(function (valid) {
                        if (!valid) {
                            return false;
                        }
                        self.addLeaguer();
                    });
                }
            },

            template: `
            <div class="pos-leaguer-add">

                <div 
                    @click="dialogVisible = true" 
                    class="pos-leaguer-add__btn">
                    新增会员
                </div>

                <el-dialog
                    title="新增会员"
                    :visible.sync="dialogVisible"
                    width="825px"
                    @open="handleOpenEvent"
                    @close="handleCloseEvent">
                    
                    <el-container>
                        <el-main style="padding: 0;">
                            <ych-form 
                                ref="form"
                                :model="formData"
                                :rules="rules">

                                <el-form-item prop="Number" label="会员号">
                                    <el-input 
                                        v-model="formData.Number">
                                        <el-button 
                                            slot="append">
                                            读卡
                                        </el-button>
                                    </el-input>
                                </el-form-item>

                                <el-form-item prop="RealName" label="姓名">
                                    <el-input 
                                        v-model="formData.RealName">
                                    </el-input>
                                </el-form-item>

                                <el-form-item prop="Sex" label="性别">
                                    <el-select 
                                        v-model="formData.Sex">
                                        <el-option
                                            label="男"
                                            value="Man">
                                        </el-option>
                                        <el-option
                                            label="女"
                                            value="WoMen">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item 
                                    prop="LeaguerLevelID" 
                                    label="会员级别">
                                    <el-select 
                                        v-model="formData.LeaguerLevelID">
                                        <el-option
                                            v-for="level in leaguerLevelList"
                                            :key="level.ID"
                                            :label="level.Name"
                                            :value="level.ID">
                                        </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item 
                                    prop="Birthday" 
                                    label="生日">

                                    <el-date-picker
                                        v-model="formData.Birthday"
                                        type="date">
                                    </el-date-picker>
                                </el-form-item>

                                <el-form-item 
                                    prop="TelePhone" 
                                    label="手机号码">

                                    <el-input
                                        v-model="formData.TelePhone">
                                    </el-input>
                                </el-form-item>

                                <el-form-item 
                                    prop="PassWord" 
                                    label="密码">

                                    <el-input
                                        type="password"
                                        v-model="formData.PassWord">
                                    </el-input>
                                </el-form-item>

                                <el-form-item 
                                    prop="IdentityCard" 
                                    label="身份证">

                                    <el-input
                                        v-model="formData.IdentityCard">
                                    </el-input>
                                </el-form-item>

                                <el-form-item 
                                    prop="ConfirmPassWord" 
                                    label="确认密码">

                                    <el-input
                                        type="password"
                                        v-model="formData.ConfirmPassWord">
                                    </el-input>
                                </el-form-item>

                                <el-form-item 
                                    prop="Address" 
                                    label="住址">

                                    <el-input
                                        v-model="formData.Address">
                                    </el-input>
                                </el-form-item>

                            </ych-form>
                        </el-main>
                        <el-aside width="230px">

                            <span>
                                押金：{{ currentLevel.Deposit | number('0,0.00') }}
                            </span>
                            </br>
                            <span>
                                工本费：{{ currentLevel.FlatPrice | number('0,0.00')  }}
                            </span>

                        </el-aside>
                    </el-container>

                    <span slot="footer">
                        <el-button 
                            type="warning" 
                            @click="dialogVisible = false">
                            取 消
                        </el-button>
                        <el-button 
                            type="primary" 
                            @click="submitForm">
                            确 定
                        </el-button>
                    </span>
                </el-dialog>

            </div>
        `
        }
    });