define([
    'mixins/pagination',
    'api/operation/v1/Firmware',
    'api/operation/v1/DeviceType',
    'firmware/components/sidebar-updated-list',
    'firmware/components/sidebar-level-test',
    'firmware/components/sidebar-firmware-add',
    'firmware/components/sidebar-update-info',
    'firmware/components/sidebar-push-update',
], function (
    pagination,
    Firmware,
    DeviceType,
    SidebarUpdatedList,
    SidebarLevelTest,
    SidebarFirmwareAdd,
    SidebarUpdateInfo,
    SidebarPushUpdate,
) {
        'use strict';

        // 操作列按钮
        var operationGroup = [
            {
                label: '查看',
                value: 'read'
            },
            {
                label: '推送升级',
                value: 'update'
            }
        ];

        return {
            name: 'GoodsList',
            components: {
            },

            mixins: [pagination],

            created: function () {
                // 初始化分页混合更新方法
                this.paginationUpdateFn = this.asyncGetDataList;

                this.asyncGetDataList();
                this.asyncGetDeviceList();
            },

            mounted: function () {
                this.isOpenAddOfSibebar();
            },

            activated: function () {
                this.isOpenAddOfSibebar();

                this.activatedCallBack && this.activatedCallBack();
            },

            data: function () {
                return {
                    columnOpration: operationGroup,
                    // Online Disable MentionCoin
                    formData: {
                        DeviceType: '',
                        Status: '',
                        Name: ''
                    },

                    dataList: [],

                    deviceList: [],

                    deviceStatusEnum: {
                        Online: '在线',
                        Disable: '停用',
                        Alpha: '内测'
                    },

                    deviceAmount: 0,

                    activatedCallBack: null
                };
            },

            computed: {
                tableTitle: function () {
                    return `设备总数： ${this.deviceAmount}`;
                }
            },

            methods: {
                queryBtnClick: function () {
                    this.paginationInfo.PageIndex = 1;
                    this.asyncGetDataList();
                },
                asyncGetDataList: function () {
                    var self = this;

                    this.$nextTick(function () {

                        Firmware
                            .List(self.handleSubmitData())
                            .then(function (data) {
                                self.dataList = data.List;
                                self.deviceAmount = data.DeviceAmount;
                                self.paginationTotal = data.Total;
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

                asyncGetDeviceList: function () {
                    var self = this;

                    DeviceType
                        .List()
                        .then(function (data) {
                            self.deviceList = data.List || [];
                        });
                },

                readInfo: function (data) {
                    // let abc = [1,3,4,6,8,7,41];
                    // let selecet = [2,4,5,9];
                    // let fill = [1,4,6,7,41];
                    // abc = _.union(abc.concat(selecet));
                    // for (var i = 0; i < fill.length; i++) {
                    //     if (selecet.indexOf(fill[i]) < 0) {
                    //         abc.splice(abc.findIndex(function (value) {
                    //             return fill[i] === value;
                    //         }),1);
                    //     }
                    // }
                    // console.log(abc);

                    var self = this;

                    this.sideBar({
                        title: '安装包详情',

                        modules: [{
                            component: SidebarUpdateInfo
                        }],
                        // operation: [{
                        //     label: '删除',
                        //     value: 'delete'
                        // }],
                        datas: {
                            id: data.ID
                        },
                        success: function () {
                            // self.asyncGetDataList();
                        }
                    }).show();
                },

                handleOperationColumn: function (name, data) {
                    var fnMap = {
                        // 'update': this.pushUpdate,
                        // 'test': this.pushTest
                        read: this.readInfo,
                        update: this.pushUpdateHandle,
                    };

                    var fn = fnMap[name];
                    fn && fn(data);
                },

                pushUpdateHandle: function (data) {
                    console.log(data,3);
                    var self = this;

                    this.sideBar({
                        title: '推送升级',

                        modules: [{
                            component: SidebarPushUpdate,
                        }],
                        operation: [{
                            label: '推送升级',
                            value: 'update'
                        }],
                        datas: {
                            id: data.ID
                        },
                        success: function () {
                            // self.asyncGetDataList();
                        }
                    }).show();
                },

                handleOperationToggle(name, row) {
                    if (name === 'update' && !row.IsCanEdit) {
                        return false;
                    }

                    return true;
                },

                showUpdatedDevice: function (data) {
                    if (!data.UpdatedAmount) return;

                    var self = this,
                        id = data.ID;
                    this.sideBar({
                        title: data.Name + ' - 已更新设备列表',
                        datas: {
                            id: id
                        },
                        modules: [{
                            component: SidebarUpdatedList
                        }]
                    }).show();
                },

                isOpenAddOfSibebar: function () {
                    var isAdd = this.$route.query.add;

                    if (isAdd === 'true') {
                        var self = this;
                        setTimeout(function () {
                            self.addFirmware();
                        }, 500);
                    }
                },

                pushTest: function (data) {
                    var self = this,
                        id = data.ID;

                    this.sideBar({
                        title: data.Name + ' - 灰度测试列表',
                        datas: {
                            id: id
                        },
                        modules: [{
                            component: SidebarLevelTest
                        }],
                        operation: [{
                            label: '推送升级',
                            value: 'push'
                        }],
                        success: function () {
                            self.asyncGetDataList();
                        }
                    }).show();
                },

                // 全网推送升级
                pushUpdate: function (data) {
                    var self = this;

                    this.$confirm('您现在即将进行全网升级操作，该操作可能影响客户正常经营，确定要全网推送升级？', '全网升级推送', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        return Firmware.Push({
                            ID: data.ID,
                            IsFull: true,
                        }).then(function () {
                            self.$alert(
                                '升级将于设备启动后首次联网进行静默升级，升级期间将影响正常使用！',
                                '推送成功',
                                { type: 'success' }
                            );
                        })
                    }).catch(function () { });
                },

                handleConditionHided: function (prop) {
                    this.formData[prop] = null;
                },

                addFirmware: function () {
                    var self = this;

                    var activatedFn = function (cb) {
                        self.activatedCallBack = cb;
                    };

                    this.sideBar({
                        title: '固件管理 - 新增',

                        datas: {
                            activated: activatedFn
                        },

                        modules: [{
                            component: SidebarFirmwareAdd
                        }],
                        operation: [{
                            label: '添加',
                            value: 'add'
                        }],
                        success: function () {
                            self.asyncGetDataList();
                        }
                    }).show();
                }
            },

            template: `
                <el-container 
                    :body-style="{'width': '220px'}" 
                    style="min-height: 100%;">

                    <el-card :body-style="{'height': '100%'}" >
                        <ych-report-container>
                            <ych-report-header 
                                slot="header"
                                @hide-condition="handleConditionHided"
                                @query-click="queryBtnClick">

                                <ych-form-item 
                                    label="适用设备"
                                    key="DeviceType"
                                    prop="DeviceType">
                                    <el-select v-model="formData.DeviceType" clearable>
                                        <el-option
                                            v-for="item in deviceList"
                                            :key="item.Code"
                                            :label="item.Name"
                                            :value="item.Code">
                                        </el-option>
                                    </el-select>
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

                                <ych-form-item  
                                    label="固件名称" 
                                    key="Name"
                                    prop="Name">
                                    <el-input v-model="formData.Name" clearable></el-input>
                                </ych-form-item >
                                
                            </ych-report-header>

                            <ych-table
                                slot="main"
                                :data="dataList">

                                <el-table-column
                                    :label="tableTitle">

                                    <el-table-column
                                        type="index"
                                        label="序号"
                                        align="center">
                                    </el-table-column>

                                    <el-table-column
                                        prop="Name"
                                        label="固件包名称"
                                        width="100"
                                        show-overflow-tooltip>
                                    </el-table-column>
                                    
                                    <el-table-column
                                        prop="FirmwareVersion"
                                        label="固件包版本号"
                                        width="100"
                                        show-overflow-tooltip>
                                    </el-table-column>
                                    
                                    <el-table-column
                                        prop="AssetsVersion"
                                        label="资源包版本号"
                                        width="100"
                                        show-overflow-tooltip>
                                    </el-table-column>

                                    <el-table-column
                                        prop="DeviceType"
                                        label="适用设备类型"
                                        width="100"
                                        show-overflow-tooltip>
                                    </el-table-column>

                                    <el-table-column
                                        prop="Status"
                                        label="固件包状态"
                                        width="100"
                                        show-overflow-tooltip>
                                        <template slot-scope="scope">
                                            {{ deviceStatusEnum[scope.row.Status] || '-' }}
                                        </template>
                                    </el-table-column>
                                    
                                    <ych-table-column-format
                                        prop="ReleaseDate"
                                        label="发布日期"
                                        format-type="date">
                                    </ych-table-column-format>
                                    
                                    <el-table-column
                                        prop="Remarks"
                                        label="固件包备注"
                                        width="250"
                                        show-overflow-tooltip>
                                    </el-table-column>

                                    <el-table-column
                                        prop="PushArea"
                                        label="推送范围"
                                        width="150"
                                        show-overflow-tooltip>
                                    </el-table-column>

                                    <ych-table-column-format
                                        prop="UpdatedAmount"
                                        label="已更新设备数"
                                        width="100"
                                        format-type="link"
                                        :link-click="showUpdatedDevice">
                                    </ych-table-column-format>
                                    
                                </el-table-column>

                                <ych-table-column-operation
                                    @operation-click="handleOperationColumn"
                                    :operation="columnOpration"
                                    :toggle="handleOperationToggle">
                                </ych-table-column-operation>
                                
                            </ych-table>

                            <template slot="footerLeft">
                                <ych-button
                                    @click="addFirmware"
                                    type="primary">
                                    添加固件包
                                </ych-button>

                            </template>

                            <ych-pagination
                                slot="footerRight"
                                @size-change="$_pagination_sizeChange"
                                @current-change="$_pagination_currentChange"
                                :current-page="paginationInfo.PageIndex"
                                :total="paginationTotal">
                            </ych-pagination>
                        </ych-report-container>
                    </el-card>
                </el-container>
            `
        }
    });