define([
    'framework/mixins/sidebar-form',
    'api/customer/v1/Customer',
    'components/input-code/index'
], function (
    sideBarFormMixins,
    Customer,
    InputCode
) {
    'use strict';

    return {
        name: 'CustomerAdd',
        mixins: [sideBarFormMixins],
        components: {InputCode: InputCode},

        data: function () {
            const validateLicense = function (rule, value, callback) {
                if (value) {
                    if (value.length !== 15 && value.length !== 18) {
                        callback(new Error('执照注册号格式不正确'))
                    } else {
                        callback()
                    }
                } else {
                    callback()
                }
            };

            return {
                addCustomerFormData: {
                    Name: '',
                    Tel: '',
                    SalesConsultant: '',
                    StoreCount: 0,
                    Address: '',
                    License: '',
                    Remark: ''
                },
                rules: {
                    Name: [
                        {required: true, trigger: 'blur', message: '请输入客户姓名'}
                    ],
                    Tel: [
                        {required: true, trigger: 'blur', message: '请输入联系方式'},
                        {len: 11, trigger: 'blur', message: '手机号码格式不正确'}
                    ],
                    SalesConsultant: [
                        {required: true, trigger: 'blur', message: '请输入销售顾问'}
                    ],
                    StoreCount: [
                        {required: true, trigger: 'blur', message: '请输入门店数量'}
                    ],
                    Address: [
                        {required: true, trigger: 'blur', message: '请输入详细地址'}
                    ],
                    License: [
                        {validator: validateLicense, trigger: 'blur'}
                    ]
                }
            }
        },

        methods: {
            import: function () {
                console.log('import click')
            },
            
            save: function () {
                const _self = this

                return new Promise((resolve, reject) => {
                    // 调用保存客户信息方法
                    Customer.Create(_self.addCustomerFormData).then(function (res) {
                        resolve()

                        _self.$message({
                            message: '保存成功',
                            type: 'success'
                        })
                    }).catch(function (e) {
                        reject(e)
                    })
                }).catch(function (e) {
                    return Promise.reject()
                })
            }
        },

        template: `
            <ych-sidebar-layout
                title="基础信息">

                <side-bar-form
                    :model="addCustomerFormData"
                    :rules="rules">

                    <ych-form-item 
                        prop="Number"
                        label="客户编号">
                        <input-code 
                            v-model="addCustomerFormData.Number"
                            type="customer"
                            :getCode="true"
                            disabled />
                    </ych-form-item>

                    <ych-form-item 
                        prop="Name"
                        label="客户姓名">
                        <el-input 
                            v-model="addCustomerFormData.Name">
                        </el-input>
                    </ych-form-item>

                    <ych-form-item 
                        prop="Tel" 
                        label="手机号">
                        <el-input 
                            v-model="addCustomerFormData.Tel">
                        </el-input>
                    </ych-form-item>

                    <ych-form-item 
                        prop="SalesConsultant" 
                        label="销售顾问">
                        <el-input 
                            v-model="addCustomerFormData.SalesConsultant">
                        </el-input>
                    </ych-form-item>

                    <ych-form-item 
                        prop="StoreCount" 
                        label="门店数量">
                        <ych-input-number
                            v-model="addCustomerFormData.StoreCount">
                        </ych-input-number>
                    </ych-form-item>

                    <ych-form-item 
                        prop="Address" 
                        label="详细地址"
                        :double="true">
                        <el-input 
                            v-model="addCustomerFormData.Address">
                        </el-input>
                    </ych-form-item>

                    <ych-form-item 
                        prop="License" 
                        label="执照注册号"
                        :double="true"
                        tips="15位营业执照注册号或18位统一社会信用代码">
                        <el-input 
                            v-model="addCustomerFormData.License">
                        </el-input>
                    </ych-form-item>
                    
                    <ych-form-item 
                        prop="Remark" 
                        label="客户备注"
                        :double="true">
                        <el-input 
                            type="textarea"
                            :rows="6"
                            v-model="addCustomerFormData.Remark">
                        </el-input>
                    </ych-form-item>

                </side-bar-form>
            </ych-sidebar-layout>
        `
    }
})  