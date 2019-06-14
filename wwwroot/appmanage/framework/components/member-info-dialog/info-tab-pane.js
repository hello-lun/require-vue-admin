define([
    'api/member/v1/MemberInfo'
], function(
    memberInfo
) {
    'use strict';
    
    return {
        name: 'InfoTabPane',

        props: {
            id: String
        },

        data: function () {
            return {
                form: {
                    IdentityCard: null,
                    ID: null,
                    MemberCode: null,
                    LevelID: null,
                    LevelName: null,
                    Sex: null,
                    Phone: null,
                    MemberName: null,
                    Birthday: '',
                    JoinTime: null,
                    FatherName: null,
                    MotherName: null,
                    Address: null,
                    ImageUrl: null
                },

                tags: [],

                sexMap: {
                    Man: '男',
                    WoMen: '女',
                    UnKnown: '未知'
                }
            };
        },

        watch: {
            'id': {
                immediate: true,
                handler: function (val, oldVal) {
                    if (val) {
                        this.asyncGetMemberInfo();
                        this.asyncGetLeaguerTag();
                    }
                }
            }
        },

        methods: {
            // 根据ID获取会员信息
            asyncGetMemberInfo: function () {
                var self = this;
                memberInfo.GetMemberByID({ID: this.id})
                    .then(function(data) {
                        _.extend(self.form, data);
                    });
            },

            // 获取会员标签
            asyncGetLeaguerTag: function () {
                var self = this;
                memberInfo
                    .GetLeaguerLabelLogByLeaguerID({LeaguerID: this.id})
                    .then(function (data) {
                        self.tags = data.Data;
                    });
            },

            // 清空数据
            clearData: function () {
                _.extend(this.form, {
                    IdentityCard: null,
                    ID: null,
                    MemberCode: null,
                    LevelID: null,
                    LevelName: null,
                    Sex: null,
                    Phone: null,
                    MemberName: null,
                    Birthday: '',
                    JoinTime: null,
                    FatherName: null,
                    MotherName: null,
                    Address: null,
                    ImageUrl: null
                });
            },

            randomTagColor: function () {
                // _.random(0, 5)
                var type = ['', 'success', 'info', 'warning', 'danger'];

                return type[_.random(0, 4)];
            },
            
        },

        template: `
            <div>
                <el-container>
                    <el-main>
                        <ych-form>
                            <ych-form-item prop="MemberName" label="会员姓名">
                                <el-input v-model="form.MemberName" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="MemberCode" label="会员卡号">
                                <el-input v-model="form.MemberCode" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="LevelName" label="会员级别">
                                <el-input v-model="form.LevelName" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="Sex" label="性别">
                                <el-input :value="sexMap[form.Sex]" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="Phone" label="手机号码">
                                <el-input v-model="form.Phone" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="IdentityCard" label="身份证">
                                <el-input v-model="form.IdentityCard" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="Birthday" label="会员生日">
                                <el-input v-model="form.Birthday" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="JoinTime" label="入会时间">
                                <el-input v-model="form.JoinTime" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="FatherName" label="父亲姓名">
                                <el-input v-model="form.FatherName" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item prop="MotherName" label="母亲姓名">
                                <el-input v-model="form.MotherName" disabled></el-input>
                            </ych-form-item>
                            <ych-form-item 
                                label="家庭地址"
                                prop="Address" 
                                double>
                                <el-input v-model="form.Address" disabled></el-input>
                            </ych-form-item>
                        </ych-form>
                    </el-main>
                    <el-aside 
                        style="display: flex; align-items: center; justify-content: center;"
                        width="240px">
                        <img width="200px" height="200px" :src="form.ImageUrl"/>
                    </el-aside>
                </el-container>
                <el-footer>
                    <el-tag 
                        v-for="tag in tags" 
                        :key="tag"
                        style="margin-right: 10px;"
                        :type="randomTagColor()">
                        {{ tag }}
                    </el-tag>
                </el-footer>
            </div>
        `
    }
});