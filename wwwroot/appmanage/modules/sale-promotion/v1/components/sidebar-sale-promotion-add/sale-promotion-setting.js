define(['modules/member/v1/components/member-select-dialog'], 
function (memberSelectDialog) {
    'use strict';

    return {
        name: 'SalePromotionSetting',

        components: {
            MemberSelectDialog: memberSelectDialog
        },
        props : {
            data : Object
        },

        data: function () {
            var self = this;

            return {
                formData: {
                    Crowd : 'UnLimit',
                    CrowdData:[],
                    IsUseCountUnlimited : 'true',
                    UseCount : 0,
                    IsFrequencyUnlimited : 'true',
                    FrequencyCycle : '',
                    FrequencyUseCount : 0
                },
                CrowdDataIDs : [],
                FrequencyCycleUnit : [{
                    label : '小时',
                    value : 'Hour'
                },{
                    label : '每天',
                    value : 'Day'
                },{
                    label : '每周',
                    value : 'Week'
                },{
                    label : '每月',
                    value : 'Month'
                },{
                    label : '每年',
                    value : 'Year'
                },{
                    label : '会员生日',
                    value : 'Birthday'
                }], 

                showSetting: {

                },

                memberSelectDialogVisible : false,

                rules: {}
            };
        },

        watch :{
            'data' : function(val){
                this.formData = _.extend({}, val);
                this.formData.IsFrequencyUnlimited += ''
                this.formData.IsUseCountUnlimited += ''
            }
        },

        methods: {
            handleSetMemberLevel : function(){
                var self = this;
                this.memberSelectDialogVisible = true;
                this.CrowdDataIDs = [];
                this.formData.Crowd = 'SpecifyLevel';

                _.forEach(this.formData.CrowdData,function(item){
                    self.CrowdDataIDs.push(item.ID);
                });

            },

            addMemberLevel : function(val){
                var self = this;

                self.CrowdDataIDs = val;
                self.formData.CrowdData = [];

                _.forEach(val,function(element){
                    self.formData.CrowdData.push({ ID : element });
                });
            },

            validate: function () {
                return this.$refs.form.validate();
            },

            getData: function () {
                // 修改字符串类型的 true 为 Boolean 类型
                let resultData = _.assign({}, this.formData);
                resultData.IsFrequencyUnlimited = JSON.parse(resultData.IsFrequencyUnlimited)
                resultData.IsUseCountUnlimited = JSON.parse(resultData.IsUseCountUnlimited)
                return _.extend({}, resultData);
            }
        },

        template: `
            <div>
                <member-select-dialog 
                    ref="memberSelect"
                    :visible.sync="memberSelectDialogVisible"
                    v-model='CrowdDataIDs'
                    @submit="addMemberLevel">
                </member-select-dialog>

                <side-bar-form 
                    ref="form"
                    :model="formData"
                    :rules="rules"
                    :inline="false">
                    <ych-sidebar-layout title="适用人群">
                        <ych-form-item label="" prop="Crowd" double>
                            <el-row>
                                <el-radio label='UnLimit' v-model='formData.Crowd'>无限制（非会员也可参与）</el-radio>
                            </el-row>
                            <el-row >
                                <el-col :span='10'>
                                    <el-radio label='SpecifyLevel'  v-model='formData.Crowd'>只允许特定会员级别参与促销</el-radio>
                                </el-col>
                                <el-col :span='8'>
                                    已选择{{formData.CrowdData.length}}个会员级别
                                </el-col>
                                <el-col :span='3'>
                                    <el-button @click='handleSetMemberLevel()'>设置</el-button>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-radio label='LevelTag'  v-model='formData.Crowd'>只允许特定标签的会员参与促销</el-radio>
                            </el-row>
                        </ych-form-item>
                    </ych-sidebar-layout>

                    <ych-sidebar-layout title="使用次数">
                        <ych-form-item label="" prop="IsUseCountUnlimited" double>
                            <el-row>
                                <el-radio label='true' v-model='formData.IsUseCountUnlimited'>无限制</el-radio>
                            </el-row>
                            <el-row>
                                <el-radio  label='false' v-model='formData.IsUseCountUnlimited'>限制使用次数 最多可使用<span style='width:60px;display:inline-block;'><el-input v-model='formData.UseCount'></el-input></span> 次（针对单个会员）</el-radio>
                            </el-row>
                        </ych-form-item>
                    </ych-sidebar-layout>

                    <ych-sidebar-layout title="使用频率">
                        <ych-form-item label="" prop="IsFrequencyUnlimited" double>
                            <el-row>
                                <el-radio label='true' v-model='formData.IsFrequencyUnlimited'>无限制</el-radio>
                            </el-row>
                            <el-row>
                                <el-radio label='false' v-model='formData.IsFrequencyUnlimited'>限制使用频率,每
                                <span style='width:100px;display:inline-block;'>
                                <el-select v-model='formData.FrequencyCycle'>
                                    <el-option
                                        v-for="item in FrequencyCycleUnit"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>

                                </el-select>
                                </span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;限定使用<span style='width:60px;display:inline-block;'><el-input v-model='formData.FrequencyUseCount'></el-input></span> 次</el-radio>
                            </el-row>
                        </ych-form-item>
                    </ych-sidebar-layout>
                </side-bar-form>
            </div>
        `
    }
});