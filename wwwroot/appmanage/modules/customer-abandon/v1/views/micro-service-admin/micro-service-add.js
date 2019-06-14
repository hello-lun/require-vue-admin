define([
    'framework/mixins/sidebar-form',
    'customer/components/Enum',
    'api/customer/v1/Module',
    'components/input-code/index'
], function (
    sideBarFromMixins,
    Enum,
    MicroService,
    InputCode
) {
    'use strict';

    return {
        name: 'MicroServiceAdd',
        mixins: [sideBarFromMixins],
        components: {InputCode: InputCode},

        data: function () {
            return {
                microServiceFormData: {
                    Name: '',
                    Number: '',
                    ModuleType: '',
                    ChargeType: '',
                    ChargeCycle: '',
                    Price: '',
                    ModuleDescribe: ''
                },
                rules: {
                    Name: [{required: true, trigger: 'blur', message: '请输入模块名称'}],
                    Number: [{required: true, trigger: 'blur', message: '请输入模块编码'}],
                    ModuleType: [{required: true, trigger: 'blur', message: '请选择模块类型'}],
                    ChargeType: [{required: true, trigger: 'blur', message: '请选择计费类型'}],
                    ChargeCycle: [{required: true, trigger: 'blur', message: '请选择计费周期'}],
                    Price: [
                        {required: true, trigger: 'blur', message: '请输入售价'}
                    ],
                    ModuleDescribe: [{required: true, trigger: 'blur', message: '请输入功能说明'}],
                },

                isEdit: false,
                isEditing: false,
                microServiceId: ''
            }
        },

        created: function () {
            this.Enum = Enum
            this.isEdit = this.incomingData.isEdit
            if (this.isEdit) {
                this.microServiceId = this.incomingData.ID
                this.asyncGetMicroServiceData()
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
                        MicroService.Create(this.microServiceFormData).then(res => {
                            if (res) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                })
    
                                resolve()
                            } else {
                                reject()
                            }
                        })
                    })
                }
            },

            edit: function () {
                this.isEditing = true
                return Promise.reject()
            },

            doEdit: function (resolve, reject) {
                if (this.isEditing) {
                    MicroService.Edit(this.microServiceFormData).then(res => {
                        if (res) {  
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            })

                            resolve()
                        } else {
                            reject()
                        }
                    })
                } else {
                    this.$message({
                        message: '请在点击编辑按钮之后点击保存',
                        type: 'warning'
                    })
                    reject()
                }
            },

            asyncGetMicroServiceData: function () {
                MicroService.GetByID({
                    ID: this.microServiceId
                }).then(res => {
                    if (res) {
                        this.microServiceFormData = res
                    }
                })
            }
        },

        template: `
            <ych-sidebar-layout
                title="基础信息">

                <side-bar-form
                    :model="microServiceFormData"
                    :rules="rules">

                    <ych-form-item 
                        label="模块名称"
                        key="Name"
                        prop="Name">
                        <el-input :disabled="isEdit" placeholder="请输入模块名称" v-model="microServiceFormData.Name"></el-input>
                    </ych-form-item>

                    <ych-form-item 
                        label="模块编码"
                        key="Number"
                        prop="Number">
                        
                        <input-code 
                            v-model="microServiceFormData.Number"
                            type="micro-service-admin"
                            :getCode="true"
                            disabled />

                    </ych-form-item>

                    <ych-form-item 
                        label="模块类型"
                        key="ModuleType"
                        prop="ModuleType">
                        <el-select :disabled="isEdit" placeholder="请选择模块类型" v-model="microServiceFormData.ModuleType">
                            <el-option 
                                v-for="(val, key) in Enum.moduleType"
                                :key="key"
                                :value="key"
                                :label="val"/>
                        </el-select>
                    </ych-form-item>

                    <ych-form-item 
                        label="计费类型"
                        key="ChargeType"
                        prop="ChargeType">
                        <el-select :disabled="isEdit && !isEditing" placeholder="请选择计费类型" v-model="microServiceFormData.ChargeType">
                            <el-option 
                                v-for="(val, key) in Enum.moduleChargeType"
                                :key="key"
                                :value="key"
                                :label="val"/>
                        </el-select>
                    </ych-form-item>

                    <ych-form-item 
                        label="计费周期"
                        key="ChargeCycle"
                        prop="ChargeCycle">
                        <el-select :disabled="isEdit && !isEditing" placeholder="请选择计费周期" v-model="microServiceFormData.ChargeCycle">
                            <el-option 
                                v-for="(val, key) in Enum.moduleChargeCycle"
                                :key="key"
                                :value="key"
                                :label="val"/>
                        </el-select>
                    </ych-form-item>

                    <ych-form-item 
                        label="售价"
                        key="Price"
                        prop="Price">
                        <ych-input-number :disabled="isEdit && !isEditing" placeholder="请输入售价" v-model="microServiceFormData.Price">
                            <span slot="append">元</span>
                        </ych-input-number>
                    </ych-form-item>

                    <ych-form-item 
                        label="功能说明"
                        :double="true"
                        key="ModuleDescribe"
                        prop="ModuleDescribe">
                        <el-input 
                            :disabled="isEdit && !isEditing"
                            placeholder="请输入模块功能说明"
                            type="textarea"
                            :rows="6"
                            v-model="microServiceFormData.ModuleDescribe"/>
                    </ych-form-item>
                
                </side-bar-form>
            </ych-sidebar-layout>
        `
    }
})