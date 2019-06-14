define([
    'mixins/pagination',
    'api/operation/v1/Device',
    'device/components/sidebar-device-detail'
], function (
    pagination,
    Device,
    SidebarDeviceDetail
) {
        'use strict';

        // 操作列按钮
        var operationGroup = [
            {
                label: '查看',
                value: 'detail'
            },
            {
                label: '解绑',
                value: 'unbind'
            },
            // {
            //     label: '启用',
            //     value: 'on'
            // },
            // {
            //     label: '停用',
            //     value: 'off'
            // },
        ];

        return {
            name: 'DeviceList',
            components: {
            },

            mixins: [pagination],

            created: function () {
                // 初始化分页混合更新方法
                this.paginationUpdateFn = this.asyncGetDataList;

                this.asyncGetDataList();
            },

            data: function () {
                return {
                    columnOpration: operationGroup,
                    formData: {
                        Customer: null,
                        Code: null,
                        Status: null
                    },

                    dataList: [],

                    deviceStatusEnum: {
                        Online: '在线',
                        Fault: '故障',
                        Offline: '离线',
                        Disabled: '停用'
                    },
                    // 统计数据
                    statData: {
                        amount: 0,
                        online: 0,
                        offline: 0,
                        fault: 0
                    }

                };
            },

            computed: {
                tableTitle: function () {
                    return `设备：${ this.statData.amount }  在线： ${ this.statData.online }  离线： ${ this.statData.offline }   故障: ${ this.statData.fault }`;
                }
            },

            methods: {
                queryBtnClick: function () {
                    this.paginationInfo.PageIndex = 1;
                    this.asyncGetDataList();
                },

                asyncGetDataList: function () {
                    var self = this;

                    Device
                        .List(self.handleSubmitData())
                        .then(function (data) {
                            self.dataList = data.List;
                            self.paginationTotal = data.Total;

                            _.extend(self.statData, {
                                amount: data.DeviceAmount,
                                online: data.OnlineAmount,
                                offline: data.OfflineAmount,
                                fault: data.FaultAmount
                            });
                        });
                },

                // 处理提交数据
                handleSubmitData: function () {
                    return _.extend(
                        {},
                        this.formData,
                        this.paginationInfo
                    );
                },

                offDevice: function (data) {
                    var self = this;
                    this.$confirm('停用设备将影响正常经营使用，确定要停用改设备吗？', '停用提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        return Device.Off({
                            ID: data.ID,
                        }).then(function () {
                            self.$message.success('停用设备成功！');
                            self.asyncGetDataList();
                        })
                    }).catch(function () { });
                },

                onDevice: function (data) {
                    var self = this;
                    Device
                        .On({ ID: data.ID })
                        .then(function () {
                            self.$message.success('启用设备成功！');
                            self.asyncGetDataList();
                        });
                },

                showDeviceDetail: function (data) {
                    var self = this,
                        id = data.ID;

                    this.sideBar({
                        title: '设备详情',
                        datas: {
                            id: id
                        },
                        modules: [{
                            component: SidebarDeviceDetail
                        }]
                    }).show();
                },

                unBindDevice: function (data) {
                    var self = this;
                    this.$confirm('解绑设备将影响正常经营使用，确定要解绑改设备吗？', '解绑提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        return Device.Unbind({
                            ID: data.ID,
                        }).then(function () {
                            self.$message.success('解绑设备成功！');
                            self.asyncGetDataList();
                        })
                    }).catch(function () { });
                },

                handleOperationColumn: function (name, data) {
                    var fnMap = {
                        'detail': this.showDeviceDetail,
                        'off': this.offDevice,
                        'on': this.onDevice,
                        'unbind': this.unBindDevice,
                    };

                    var fn = fnMap[name];
                    fn && fn(data);
                },

                handleConditionHided: function (prop) {
                    this.formData[prop] = null;
                },

                statusToStateTagTypeMap: function (status) {
                    var map = {
                        Online: 'success',
                        Fault: 'danger',
                        Offline: 'info',
                        Disabled: 'danger'
                    };
                    return map[status];
                },

                handleOperationToggle: function (name, row) {
                    var is = true;
                    if (name === 'on') {
                        is = (row.Status === 'Disabled');
                    } else if (name === 'off') {
                        is = (row.Status !== 'Disabled');
                    } else if (name === 'unbind') {
                        is = (row.Status === 'Bind');
                    }

                    return is;
                },
            },

            template: `
                <el-card :body-style="{'min-height': '100%'}" >
                    <ych-report-container>
                        <ych-report-header 
                            slot="header"
                            @hide-condition="handleConditionHided"
                            @query-click="queryBtnClick">

                            <ych-form-item 
                                label="主体信息"
                                key="Customer"
                                prop="Customer">
                                <el-input v-model="formData.Customer" clearable></el-input>
                            </ych-form-item>

                            <ych-form-item 
                                label="设备编码"
                                key="Code"
                                prop="Code">
                                <el-input v-model="formData.Code" clearable></el-input>
                            </ych-form-item>

                            <ych-form-item 
                                label="固件状态"
                                key="Status"
                                prop="Status">
                                <el-select v-model="formData.Status" clearable>
                                    <el-option
                                        v-for="(name, key) in deviceStatusEnum"
                                        :key="key"
                                        :label="name"
                                        :value="key">
                                    </el-option>
                                </el-select>
                            </ych-form-item>
                            
                        </ych-report-header>

                        <ych-table
                            slot="main"
                            :data="dataList">

                            <el-table-column :label="tableTitle">
                                <ych-table-column-format
                                    prop="Code"
                                    label="设备编码"
                                    width="150"
                                    format-type="link"
                                    :link-click="showDeviceDetail"
                                    show-overflow-tooltip>
                                </ych-table-column-format>
                                
                                <el-table-column
                                    prop="Name"
                                    label="设备名称"
                                    width="150"
                                    show-overflow-tooltip>
                                </el-table-column>
                                
                                <el-table-column
                                    prop="TypeName"
                                    label="设备类型"
                                    width="150"
                                    show-overflow-tooltip>
                                </el-table-column>

                                <el-table-column
                                    prop="Version"
                                    label="安装包版本"
                                    width="120"
                                    show-overflow-tooltip>
                                </el-table-column>

                                <el-table-column
                                    prop="AssetsVersion"
                                    label="资源包版本"
                                    width="120"
                                    show-overflow-tooltip>
                                </el-table-column>

                                <el-table-column
                                    prop="BindCustomerName"
                                    label="绑定主体"
                                    width="150"
                                    show-overflow-tooltip>
                                </el-table-column>
                                
                                <el-table-column
                                    prop="BindTenantName"
                                    label="绑定门店"
                                    width="150"
                                    show-overflow-tooltip>
                                </el-table-column>

                                <el-table-column
                                    prop="Status"
                                    label="设备状态"
                                    show-overflow-tooltip>

                                    <template slot-scope="scope">
                                        <ych-state-tag
                                            :state="statusToStateTagTypeMap(scope.row.Status)"
                                            :text="deviceStatusEnum [scope.row.Status] || '-'"
                                        />
                                    </template>
                                </el-table-column>
                            </el-table-column>
                                
                            <ych-table-column-operation
                                @operation-click="handleOperationColumn"
                                :toggle="handleOperationToggle"
                                :operation="columnOpration">
                            </ych-table-column-operation>
                            
                        </ych-table>

                        <ych-pagination
                            slot="footerRight"
                            @size-change="$_pagination_sizeChange"
                            @current-change="$_pagination_currentChange"
                            :current-page="paginationInfo.PageIndex"
                            :total="paginationTotal">
                        </ych-pagination>
                    </ych-report-container>
                </el-card>
            `
        }
    });