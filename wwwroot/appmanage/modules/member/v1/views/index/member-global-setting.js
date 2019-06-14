define([
    'api/member/v1/MemberGlobalConfig'
], function (
    memberGlobalConfig
) {
    'use strict';

    return {
        name: 'MemberGlobalSetting',

        mounted: function () {
            var self = this;
            self.asyncGetMemberConfig();
            self.$eventBus.$on('member__update-level', function () {
                self.asyncGetMemberConfig();
            });
        },
        
        data: function () {
            return {
                formData: {
                    PassWord: '',
                    IsChcekPhone: false,
                    IsCheckIdentityCard: false
                },

                passwordList: [],

                levelConfig: {},

                tableData: [],

                saving: false
            };
        },

        computed: {
            uniqueness: {
                get: function () {
                    var value = [];

                    this.formData.IsChcekPhone && value.push('phone');
                    this.formData.IsCheckIdentityCard && value.push('idcard');
                    return value;
                },

                set: function (val) {
                    val = val || [];
                    this.formData.IsChcekPhone = Boolean(val.indexOf('phone') > -1)
                    this.formData.IsCheckIdentityCard = Boolean(val.indexOf('idcard') > -1)
                }
            }
        },

        methods: {
            onSubmit: function () {
                var self = this;

                this.saving = true;
                var list = _.map(this.levelConfig, function (item) {
                    return item;
                });

                var data = _.extend(
                    {
                        LevelDiscount :list
                    },
                    this.formData,
                );
                memberGlobalConfig
                    .SetMemberGlobalConfig(data)
                    .then(function () {
                        self.$message({
                            message: '全局设置保存成功！',
                            type: 'success'
                        });
                        self.saving = false;
                    }, function () { 
                        self.saving = false; 
                    }).catch(function () {
                        self.saving = false; 
                    });
            },

            handleLevelConfig: function (data) {
                var self = this;
                _.forEach(data, function (item) {
                    var item = _.extend({}, item);
                    delete item.LevelName;
                    self.$set(self.levelConfig, item.LevelID, item);
                    // self.levelConfig[item.LevelID] = item;
                })
            },

            asyncGetMemberConfig: function () {
                var self = this;
                memberGlobalConfig
                    .GetMemberGlobalConfig()
                    .then(function (data) {
                        self.tableData = data.LevelDiscount;
                        self.handleLevelConfig(data.LevelDiscount);

                        _.extend(self.formData, {
                            PassWord: data.PassWord,
                            IsChcekPhone: data.IsChcekPhone,
                            IsCheckIdentityCard: data.IsCheckIdentityCard
                        });

                        self.passwordList = data.PassWordList;
                    })
            }
        },

        template: `
            <ych-form>
                <ych-sidebar-layout title="支付密码">
                    <ych-form-item prop="PassWord" label="初始密码">
                        <el-select v-model="formData.PassWord">
                            <el-option 
                                v-for="item in passwordList" 
                                :key="item.Value"
                                :label="item.Value" 
                                :value="item.Value">
                            </el-option>
                        </el-select>
                    </ych-form-item>
                </ych-sidebar-layout>

                <ych-sidebar-layout title="会员优惠">
                    <el-table style="width:460px" :max-height="300" :data="tableData">
                        <el-table-column
                            prop="LevelName"
                            label="会员级别"
                            width="100">
                        </el-table-column>
                        
                        <el-table-column
                            prop="BuyDiscount"
                            label="购买商品折扣（%）"
                            width="180">
                            <template slot-scope="scope">
                                <div style="padding: 0 5px;">
                                    <ych-input-number 
                                        style="width: 100px;"
                                        v-model="levelConfig[scope.row.LevelID].BuyDiscount" 
                                        size="mini" percentage>
                                    </ych-input-number>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="ExchangeDiscount"
                            label="兑换商品折扣（%）"
                            width="180">
                            <template slot-scope="scope">
                                <div style="padding: 0 5px;">
                                    <ych-input-number 
                                        style="width: 100px;"
                                        v-model="levelConfig[scope.row.LevelID].ExchangeDiscount"
                                        size="mini" percentage>
                                    </ych-input-number>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </ych-sidebar-layout>

                <ych-sidebar-layout title="会员资料唯一性">
                    <el-checkbox-group v-model="uniqueness">
                        <el-checkbox label="phone">入会时，判断手机号码唯一性</el-checkbox>
                        <el-checkbox label="idcard">入会时，判断身份证号码唯一性</el-checkbox>
                    </el-checkbox-group>
                </ych-sidebar-layout>

                <ych-sidebar-layout >
                    <el-form-item >
                        <el-button 
                            :loading="saving"
                            type="primary" 
                            @click="onSubmit">保存</el-button>
                    </el-form-item>
                </ych-sidebar-layout>
            </ych-form>
        `
    }
});