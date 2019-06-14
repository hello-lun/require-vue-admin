define([
    'framework/mixins/sidebar-form',
    'api/number-generate/v1/Number',
    'api/member/v1/MemberLevel',
    'components/input-code/index'
], function(
    sideBarForm,
    number,
    memberLevel,
    inputCode
) {
    'use strict';

    return {
        name: 'SidebarMemberLevel',

        mixins: [sideBarForm],

        components: {
            InputCode: inputCode
        },

        created: function () {
            this.incomingData.id
                && this.asyncGetMemberLevelInfo();
        },

        data: function () {
            
            return {
                formData: {
                    LevelName: null,
                    LevelCode: null,
                    Deposit: 0,
                    FlatCost: 0,
                    ChangeCardCost: 0,
                    FillCardCost: 0,
                    BuyDiscount: 1,
                    ExchangeDiscount: 1,
                    DiscountID: ''
                },
                rules: {
                    LevelName: [
                        { required: true, message: '请输会员级别名称', trigger: 'blur' }
                    ],
                    LevelCode: [
                        { required: true, message: '请输入会员级别编码', trigger: 'blur' }
                    ]
                }
            }
        },

        methods: {
            save: function () {
                var methodName = this.incomingData.id ? 'EditMemberLevel' : 'AddMemberLevel';
                var self = this;
                return new Promise(function (resolve, reject) {
                    memberLevel[methodName](self.formData)
                        .then(function (data) {
                            var msg = self.incomingData.id ? '修改' : '添加';
                            self.$message.success(msg + '会员级别成功！');
                            return resolve(self.formData);
                        }, function () {
                            return reject(false);
                        });
                });
                
            },

            asyncGetMemberLevelInfo: function () {
                var self = this;
                memberLevel.GetMemberLevelByID({ ID: this.incomingData.id })
                    .then(function (data) {
                        _.assign(self.formData, data);
                    });
            }
        },

        template: `
            <el-tabs value="base">
                <el-tab-pane label="基础设置" name="base">
                    <side-bar-form
                        :model="formData"
                        :rules="rules">

                        <el-form-item 
                            prop="LevelName" 
                            label="级别名称">

                            <el-input
                                v-model="formData.LevelName">
                            </el-input>

                        </el-form-item>

                        <el-form-item 
                            prop="LevelCode" 
                            label="级别编码">

                            <input-code 
                                v-model="formData.LevelCode"
                                type="member-level"
                                :get-code="!Boolean(incomingData.id)"
                                disabled>
                            </input-code>

                        </el-form-item>

                    </side-bar-form>
                </el-tab-pane>

                <el-tab-pane label="高级设置" name="senior">

                    <side-bar-form
                        ref="siderbar"
                        :model="formData"
                        :rules="rules">

                        <ych-sidebar-layout title="会员费用">

                            <el-form-item prop="Deposit" label="押金">
                                <ych-input-number 
                                    v-model="formData.Deposit">
                                    <template slot="append">元</template>
                                </ych-input-number>
                            </el-form-item>

                            <el-form-item prop="FlatCost" label="工本费">
                                <ych-input-number 
                                    v-model="formData.FlatCost">
                                    <template slot="append">元</template>
                                </ych-input-number>
                            </el-form-item>

                            <el-form-item prop="ChangeCardCost" label="换卡费用">
                                <ych-input-number 
                                    v-model="formData.ChangeCardCost">
                                    <template slot="append">元</template>
                                </ych-input-number>
                            </el-form-item>

                            <el-form-item prop="FillCardCost" label="补卡费用">
                                <ych-input-number 
                                    v-model="formData.FillCardCost">
                                    <template slot="append">元</template>
                                </ych-input-number>
                            </el-form-item>
                        </ych-sidebar-layout>

                        <ych-sidebar-layout title="会员优惠">

                            <el-form-item prop="BuyDiscount" label="购买商品折扣">
                                <ych-input-number 
                                    v-model="formData.BuyDiscount"
                                    percentage>
                                    <template slot="append">%</template>
                                </ych-input-number>
                            </el-form-item>

                            <el-form-item prop="ExchangeDiscount" label="兑换商品折扣">
                                <ych-input-number 
                                    v-model="formData.ExchangeDiscount"
                                    percentage>
                                    <template slot="append">%</template>
                                </ych-input-number>
                            </el-form-item>

                        </ych-sidebar-layout>

                    </side-bar-form>

                </el-tab-pane>
            </el-tabs>
            
        `
    }
});