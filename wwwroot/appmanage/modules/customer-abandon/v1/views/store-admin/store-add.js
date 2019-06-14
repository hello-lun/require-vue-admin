define([
    'framework/mixins/sidebar-form',
    'api/customer/v1/Tenant',
    'api/customer/v1/Customer',
    'components/input-code/index',
    'customer/components/Enum',
], function (
    sideBarFromMixins,
    Tenant,
    Customer,
    InputCode,
    Enum
) {
    'use strict';

    return {
        name: 'StoreAdd',
        mixins: [sideBarFromMixins],
        components: {InputCode: InputCode},

        data: function () {

            const validateCustomerNumber = (rule, value, callback) => {
                Customer.GetCustomerByNumber({Number: value}).then(res => {
                    if (res && res.ID) {
                        this.storeFormData.CustomerID = res.ID
                        this.storeFormData.CustomerName = res.Name
                        callback()
                    } else {
                        callback(new Error('客户编码不存在'))
                    }
                })
            }

            return {
                storeFormData: {
                    Number: '',
                    StoreType: '',
                    Name: '',
                    Abbreviation: '',
                    Person: '',
                    Tel: '',
                    CustomerNumber: '',
                    CustomerID: '',
                    CustomerName: '',
                    Summary: '',
                    State: '',
                    BusinessHours: '',
                    BusinessHoursArray: '',
                    TenantTel: '',
                    Floor: '',
                    Acreage: '',
                    Address: '',
                    Province: '',
                    City: ''
                },
                rules: {
                    Number: [{required: true, trigger: 'blur'}],
                    StoreType: [{required: true, trigger: 'blur', message: '请选择门店类型'}],
                    Name: [{required: true, trigger: 'blur', message: '请输入门店名称'}],
                    Abbreviation: [{required: true, trigger: 'blur', message: '请输入门店简称'}],
                    Person: [{required: true, trigger: 'blur', message: '请输入负责人姓名'}],
                    Tel: [{required: true, trigger: 'blur', message: '请输入负责人电话'}],
                    CustomerNumber: [
                        {required: true, trigger: 'blur', message: '请输入客户编码'},
                        {validator: validateCustomerNumber, trigger: 'blur'}
                    ],

                    State: [{required: true, trigger: 'blur', message: '请选择营业状态'}],
                    BusinessHours: [{required: true, trigger: 'blur', message: '请选择营业时间'}],
                    BusinessHoursArray: [{required: true, trigger: 'blur', message: '请选择营业时间'}],
                    TenantTel: [{required: true, trigger: 'blur', message: '请输入门店电话'}],
                    Address: [{required: true, trigger: 'blur', message: '请输入门店地址'}]
                },

                isEdit: false,
                isEditing: false,
                editStoreId: '',
                microServiceStateSwitch: '已开通',
                microServiceList: []
            }
        },

        computed: {
            microServiceDisplayList: function () {
                return this.microServiceList
            }
        },

        watch: {
            'storeFormData.BusinessHoursArray': function (newVal) {
                if (newVal instanceof Array && newVal.length === 2 && !this.isEdit) {
                    let start = newVal[0]
                    let end = newVal[1]
                    start = this.$moment(start).hour() + ':' + this.$moment(start).minute()
                    end = this.$moment(end).hour() + ':' + this.$moment(end).minute()
                    let result = start + '-' + end
                    this.storeFormData.BusinessHours = result
                }
            },
            'storeFormData.BusinessHours': function (newVal) {
                if (this.isEdit) {
                    let value = newVal.split('-')
                    let start = value[0]
                    let end = value[1]

                    let prefix = this.$moment().format('YYYY-MM-DD')
                    start = new Date(prefix + ' ' + start)
                    end = new Date(prefix + ' ' + end)
                    this.storeFormData.BusinessHoursArray = [start, end]
                }
            },


        },

        created: function () {
            this.isEdit = !!this.incomingData.isEdit
            if (this.isEdit) {
                this.editStoreId = this.incomingData.storeID
                this.asyncGetStoreInfo()
            }
        },

        methods: {
            edit: function () {
                this.isEditing = true
                return Promise.reject()
            },

            save: function () {
                const _self = this
                if (_self.isEdit) {
                    // 编辑状态，如果编辑按钮没有点击，isEditing 为 false
                    if (_self.isEditing) {
                        // 需要执行编辑门店信息之后的保存
                        return new Promise((resolve, reject) => {
                            Tenant.Edit(_self.storeFormData).then(res => {
                                if (res) {
                                    _self.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    })
    
                                    resolve()
                                } else {
                                    reject()
                                }
                            })
                        })
                    } else {
                        this.$message({
                            message: '请选择编辑之后点击保存',
                            type: 'warning'
                        })
                        return Promise.reject()
                    }
                } else {
                    return new Promise((resolve, reject) => {
                        // 执行保存新门店
                        Tenant.Create(_self.storeFormData).then(res => {
                            if (res) {
                                _self.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })

                                resolve()
                            } else {
                                reject()
                            }
                        })
                    }).catch((e) => {
                        reject(e)
                    })
                }
            },

            asyncGetStoreInfo: function () {
                Tenant.GetInfo({ID: this.editStoreId}).then(res => {
                    if (res) {
                        console.log(res)
                        this.storeFormData = res
                    }
                })
            }
        },

        template: `
            <div>
                <ych-sidebar-layout
                    title="基础信息">

                    <side-bar-form
                        :model="storeFormData"
                        :rules="rules">

                        <ych-form-item 
                            label="门店编码"
                            key="Number"
                            prop="Number">

                            <input-code 
                                v-model="storeFormData.Number"
                                type="tenant"
                                :getCode="true"
                                disabled />

                        </ych-form-item>

                        <ych-form-item 
                            label="门店类型"
                            key="StoreType"
                            prop="StoreType">
                            <el-select v-model="storeFormData.StoreType" placeholder="请选择门店类型" :disabled="isEdit">
                                <el-option label="主题乐园" value="ThemePark"/>
                                <el-option label="游乐场所" value="AmusementPlace"/>
                                <el-option label="早教机构" value="EarlyChildhood"/>
                                <el-option label="景点景区" value="ScenicSpot"/>
                                <el-option label="电玩娱乐" value="VideoGame"/>
                            </el-select>
                        </ych-form-item>

                        <ych-form-item 
                            label="门店名称"
                            key="Name"
                            prop="Name">
                            <el-input placeholder="请输入门店名称" v-model="storeFormData.Name" :disabled="isEdit"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="门店简称"
                            key="Abbreviation"
                            prop="Abbreviation">
                            <el-input placeholder="请输入门店简称" v-model="storeFormData.Abbreviation" :disabled="isEdit"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="负责人姓名"
                            key="Person"
                            prop="Person">
                            <el-input placeholder="请输入负责人姓名" v-model="storeFormData.Person" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="联系电话"
                            key="Tel"
                            prop="Tel">
                            <el-input placeholder="请输入联系电话" v-model="storeFormData.Tel" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="客户编码"
                            key="CustomerNumber"
                            prop="CustomerNumber">
                            <el-input placeholder="请输入客户编码" v-model="storeFormData.CustomerNumber" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="客户姓名"
                            key="CustomerName"
                            prop="CustomerName">
                            <el-input placeholder="自动加载客户姓名" :disabled="true" :value="storeFormData.CustomerName"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="门店简介"
                            key="Summary"
                            prop="Summary"
                            :double="true">
                            <el-input placeholder="请输入门店简介，400字以内~" type="textarea" :rows="5" v-model="storeFormData.Summary" :disabled="isEdit && !isEditing"></el-input>
                        </ych-form-item>

                    </side-bar-form>

                </ych-sidebar-layout>

                <ych-sidebar-layout
                    title="营业信息">

                    <side-bar-form
                        :model="storeFormData"
                        :rules="rules">

                        <ych-form-item 
                            label="营业状态"
                            key="State"
                            prop="State">
                            <el-select placeholder="请选择营业状态" v-model="storeFormData.State" :disabled="isEdit && !isEditing">
                                <el-option label="营业中" value="DoBusiness"/>
                                <el-option label="停业" value="StopBusiness"/>
                            </el-select>
                        </ych-form-item>

                        <ych-form-item 
                            label="营业时间"
                            key="BusinessHoursArray"
                            prop="BusinessHoursArray">
                            <el-time-picker
                                :disabled="isEdit && !isEditing"  
                                is-range
                                arrow-control
                                v-model="storeFormData.BusinessHoursArray"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="请选择营业时间">
                            </el-time-picker>
                        </ych-form-item>

                        <ych-form-item 
                            label="门店电话"
                            key="TenantTel"
                            prop="TenantTel">
                            <el-input :disabled="isEdit && !isEditing" placeholder="请输入门店电话" v-model="storeFormData.TenantTel"></el-input>
                        </ych-form-item>

                        <ych-form-item 
                            label="所在楼层"
                            key="Floor"
                            prop="Floor">
                            <ych-input-number
                                :disabled="isEdit"
                                v-model="storeFormData.Floor">
                                <span slot="append">层</span>
                            </ych-input-number>
                        </ych-form-item>

                        <ych-form-item 
                            label="门店面积"
                            key="Acreage"
                            prop="Acreage">
                            <ych-input-number
                                :disabled="isEdit"
                                v-model="storeFormData.Acreage">
                                <span slot="append">㎡</span>
                            </ych-input-number>
                        </ych-form-item>

                        <ych-form-item 
                            label="门店地址"
                            key="Address"
                            prop="Address"
                            :double="true">
                            <el-input :disabled="isEdit && !isEditing" placeholder="请输入门店地址" v-model="storeFormData.Address"></el-input>
                        </ych-form-item>

                    </side-bar-form>

                </ych-sidebar-layout>

                <ych-sidebar-layout v-if="false">
                    
                    <el-tabs>
                        <el-tab-pane label="微服务信息">
                            <el-radio-group v-model="microServiceStateSwitch" size="mini">
                                <el-radio-button label="已开通"></el-radio-button>
                                <el-radio-button label="未开通"></el-radio-button>
                            </el-radio-group>   
                            
                            <ych-table
                                :columnController="false"
                                :data="microServiceDisplayList">

                                <el-table-column
                                    prop="Number"
                                    label="编码"
                                    align="center">
                                </el-table-column>

                                <el-table-column
                                    prop="Name"
                                    label="模块名称"
                                    align="center">
                                </el-table-column>

                                <el-table-column
                                    prop="ModuleType"
                                    label="模块类型"
                                    align="center">
                                    <template slot-scope="scope">
                                        {{Enum.moduleType[scope.ModuleType]}}
                                    </template>
                                </el-table-column>

                                <el-table-column
                                    prop="Number"
                                    label="模块状态"
                                    align="center">

                                </el-table-column>

                                <el-table-column
                                    prop="Number"
                                    label="截止有效期"
                                    align="center">
                                </el-table-column>

                            </ych-table>
                            
                        </el-tab-pane>

                        <el-tab-pane label="终端设备信息">
                            test            
                        </el-tab-pane>
                    </el-tabs>

                </ych-sidebar-layout>
            </div>
        `
    }
})