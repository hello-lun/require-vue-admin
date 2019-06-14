define([
    'framework/mixins/sidebar-form',
    'api/customer/v1/TerminalManagement',
    'customer/components/Enum',
], function(
    sideBarFormMixins,
    TerminalManagement,
    Enum
) {
    'use strict';

    return {
        name: 'TerminalDetail',
        mixins: [sideBarFormMixins],

        data: function () {
            return {
                terminalData: {},
                terminalFactoryVersion: {},
                currentTerminalId: '',
                Enum: {}
            }
        },

        computed: {
        },

        created () {
            this.Enum = Enum
            this.currentTerminalId = this.incomingData.ID
            this.asyncGetTerminalData()
            this.asyncGetTerminalFactoryVersion()
        },

        methods: {
            asyncGetTerminalData: function () {
                TerminalManagement.GetByID(this.currentTerminalId).then(res => {
                    if (res) {
                        this.terminalData = res
                    }
                })
            },

            asyncGetTerminalFactoryVersion: function () {
                TerminalManagement.FactoryVersion({
                    ID: this.currentTerminalId
                }).then(res => {
                    if (res) {
                        this.terminalFactoryVersion = res
                    }
                })
            },

            toCheckUrl: function (url) {
                console.log(url)
                window.open(url, '_blank')
            }
        },

        template: `
            <div>
                <ych-sidebar-layout 
                    title="基础信息">

                    <side-bar-form
                        :model="terminalData">

                        <ych-form-item 
                            prop="Number"
                            label="终端编码">
                            <el-input :disabled="true" :value="terminalData.Number">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="Name"
                            label="终端名称">
                            <el-input :disabled="true" :value="terminalData.Name">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="TerminalType"
                            label="终端类型">
                            <el-select v-model="terminalData.TerminalType" :disabled="true">
                                <el-option 
                                    v-for="(val, key) in Enum.terminalType"
                                    :key="key"
                                    :value="key"
                                    :label="val"/>
                            </el-select>
                        </ych-form-item>

                        <ych-form-item 
                            prop="PortNum"
                            label="终端标识码">
                            <el-input :disabled="true" :value="terminalData.PortNum">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="TenantState"
                            label="终端状态">
                            <el-select v-model="terminalData.TenantState" :disabled="true">
                                <el-option 
                                    v-for="(val, key) in Enum.terminalState"
                                    :key="key"
                                    :value="key"
                                    :label="val"/>
                            </el-select>
                        </ych-form-item>

                        <ych-form-item 
                            prop="TenantName"
                            label="门店名称">
                            <el-input :disabled="true" :value="terminalData.TenantName">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="TenantNumber"
                            label="门店编码">
                            <el-input :disabled="true" :value="terminalData.TenantNumber">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="TenantTel"
                            label="门店电话">
                            <el-input :disabled="true" :value="terminalData.TenantTel">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="InstallationAddress"
                            label="终端安装地址"
                            :double="true">
                            <el-input :disabled="true" :value="terminalData.InstallationAddress">
                            </el-input>
                        </ych-form-item>

                    </side-bar-form>

                </ych-sidebar-layout>

                <ych-sidebar-layout title="出厂信息">
                    <side-bar-form
                            :model="terminalFactoryVersion">

                        <ych-form-item 
                            prop="BatchNumber"
                            label="出厂批次号">
                            <el-input :disabled="true" :value="terminalFactoryVersion.BatchNumber">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="AppNumber"
                            label="固件版本号">
                            <el-input :disabled="true" :value="terminalFactoryVersion.AppNumber">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="DateProduction"
                            label="出厂日期">
                            <el-input :disabled="true" :value="terminalFactoryVersion.DateProduction">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="QualityCheck"
                            label="质检人">
                            <el-input :disabled="true" :value="terminalFactoryVersion.QualityCheck">
                            </el-input>
                        </ych-form-item>

                        <ych-form-item 
                            prop="QualityCheckListUrl"
                            label="质检单">
                            <el-button type="text" @click="toCheckUrl(terminalFactoryVersion.QualityCheckListUrl)">
                                {{terminalFactoryVersion.QualityCheckList}}
                            </el-button>
                        </ych-form-item>

                    </side-bar-form>
                </ych-sidebar-layout>
                
            </div>
        `
    }
})