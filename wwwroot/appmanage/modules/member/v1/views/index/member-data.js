define([
    'api/member/v1/MemberInfo',
    'components/member-info-dialog/index',
    'mixins/pagination'
], function (
    memberInfo,
    memberInfoDialog,
    pagination
) {
        'use strict';

        return {
            name: 'MemberData',

            components: {
                MemberInfoDialog: memberInfoDialog
            },

            mixins: [pagination],

            created: function () {
                // 初始化分页混合更新方法
                this.paginationUpdateFn = this.asyncGetMemberLevel;
            },

            data: function () {
                return {
                    columnOpration: [
                        {
                            label: '启用',
                            value: 'enabled'
                        },
                        {
                            label: '禁用',
                            value: 'unabled'
                        }
                    ],

                    formData: {
                        LevelName: '',
                        MemberName: '',
                        Phone: '',
                        IdentityCard: '',
                        JoinTime: [],
                        Birthday: []
                        // StartJoinTime: '',
                        // EndJoinTime: '',
                        // StartBirthday: '',
                        // EndBirthday: ''
                    },

                    dataList: [],

                    order: {
                        Order: 'CreateTime',
                        OderAsc: false
                    },

                    memberDialog: {
                        visible: false,
                        id: '',
                    }
                };
            },

            methods: {
                asyncGetMemberLevel: function () {
                    var self = this;

                    this.$nextTick(function () {
                        var submitData = self.handleSubmitData();
                        memberInfo
                            .GetMemberInfoByLevelID(submitData)
                            .then(function (data) {
                                self.dataList = data.Data;
                                self.paginationTotal = data.Total;
                            })
                    });

                },

                handleSubmitData: function () {
                    var finalFormData = _.extend({}, this.formData),
                        joinTime = finalFormData.JoinTime || [],
                        birthday = finalFormData.Birthday || [];

                    finalFormData.StartJoinTime = joinTime[0];
                    finalFormData.EndJoinTime = joinTime[1];
                    delete finalFormData.JoinTime;

                    finalFormData.StartBirthday = birthday[0];
                    finalFormData.EndBirthday = birthday[1];
                    delete finalFormData.Birthday;

                    return _.extend(
                        {},
                        finalFormData,
                        this.paginationInfo,
                        this.order
                    );
                },

                handleSortChange: function (data) {
                    this.order.Order = data.prop;
                    this.order.OderAsc = data.order === 'ascending';
                    this.asyncGetMemberLevel();
                },

                handleOperationColumn: function (name, data) {
                    switch (name) {
                        case 'enabled':
                            this.handleMemberToggle(data.MemberID, true);
                            break;

                        case 'unabled':
                            this.handleMemberToggle(data.MemberID, false);
                            break;
                    }
                },

                handleMemberToggle: function (id, toggle) {
                    var self = this,
                        msg = toggle ? '会员启用成功！' : '会员禁用成功！';

                    memberInfo
                        .ChangeMemberIsEnable({
                            ID: id,
                            IsEnable: toggle
                        })
                        .then(function () {
                            self.asyncGetMemberLevel();
                            self.$message({
                                message: msg,
                                type: 'success'
                            });
                        })
                },

                setConditionLevelName: function (name) {
                    _.extend(this.formData, {
                        LevelName: name,
                        MemberName: '',
                        Phone: '',
                        IdentityCard: '',
                        JoinTime: '',
                        Birthday: '',
                    });
                    // this.$set(this.formData, 'LevelName', name);
                    this.asyncGetMemberLevel();
                },

                handleOperationToggle: function (name, row) {
                    var is = true;
                    if (name === 'enabled') {
                        is = row.MemberState === 'Disable';
                    } else if (name === 'unabled') {
                        is = row.MemberState === 'Normal';
                    }
                    return is;
                },

                handleMemberInfoClick: function (row) {
                    this.memberDialog.visible = true;
                    this.memberDialog.id = row.MemberID;
                },

                // 处理查询条件隐藏，清楚条件
                handleConditionHided: function (prop) {
                    this.formData[prop] = null;
                },

                // 处理会员状态
                handleLeaguerStatus: function (status) {
                    var statusMap = {
                        Normal: '正常',
                        Disable: '禁用',
                        Cancel: '注销'
                    }

                    return statusMap[status] || '未知状态';
                },

                // 处理会员状态
                handleLeaguerSex: function (sex) {
                    var sexMap = {
                        Man: '男',
                        WoMen: '女',
                        UnKnown: '未知'
                    }

                    return sexMap[sex] || '未知';
                }
            },

            template: `
            <div>  
                <ych-report-container>
                    <ych-report-header 
                        slot="header"
                        @hide-condition="handleConditionHided"
                        @query-click="asyncGetMemberLevel">

                        <ych-form-item
                            label="会员姓名" 
                            key="MemberName"
                            prop="MemberName">
                            <el-input v-model="formData.MemberName"></el-input>
                        </ych-form-item>

                        <ych-form-item  
                            label="会员级别"
                            key="LevelName"
                            prop="LevelName">
                            <el-input v-model="formData.LevelName"></el-input>
                        </ych-form-item >

                        <ych-form-item  
                            label="手机号码" 
                            key="Phone"
                            prop="Phone">
                            <el-input v-model="formData.Phone"></el-input>
                        </ych-form-item >
                        
                        <ych-form-item  
                            label="身份证" 
                            key="IdentityCard"
                            prop="IdentityCard">
                            <el-input v-model="formData.IdentityCard"></el-input>
                        </ych-form-item>
                        
                        <ych-form-item  
                            label="入会时间" 
                            key="JoinTime"
                            prop="JoinTime">
                            <el-date-picker 
                                v-model="formData.JoinTime"
                                type="daterange">
                            </el-date-picker>
                        </ych-form-item>

                        <ych-form-item  
                            label="会员生日" 
                            key="Birthday"
                            prop="Birthday">

                            <el-date-picker 
                                v-model="formData.Birthday"
                                type="daterange">
                            </el-date-picker>
                        </ych-form-item>

                    </ych-report-header>

                    <ych-table
                        slot="main"
                        :data="dataList"
                        :default-sort = "{prop: 'JoinTime', order: 'descending'}"
                        @sort-change="handleSortChange">

                        <ych-table-column-format
                            prop="MemberName"
                            label="会员姓名"
                            width="110"
                            :link-click="handleMemberInfoClick"
                            format-type="link" sortable>
                        </ych-table-column-format>

                        <ych-table-column-format
                            prop="MemberCode"
                            label="会员号"
                            width="128"
                            :link-click="handleMemberInfoClick"
                            format-type="link" sortable>
                        </ych-table-column-format>
                        
                        <el-table-column
                            prop="MemberLevelName"
                            label="会员级别"
                            width="110" sortable>
                        </el-table-column>
                        
                        <el-table-column
                            prop="Phone"
                            label="手机号码"
                            width="128" sortable>
                        </el-table-column>
                        
                        <el-table-column
                            prop="IdentityCard"
                            label="身份证"
                            width="128" sortable>
                        </el-table-column>
                        
                        <el-table-column
                            prop="Sex"
                            label="性别"
                            width="80" sortable>

                            <template slot-scope="scope">
                                <span>
                                    {{ 
                                        handleLeaguerSex(scope.row.Sex) 
                                    }}
                                </span>
                            </template>

                        </el-table-column>

                        <ych-table-column-format
                            prop="Birthday"
                            label="生日"
                            format-type="date" sortable>
                        </ych-table-column-format>

                        <ych-table-column-format
                            prop="JoinTime"
                            label="入会时间"
                            format-type="date" sortable>
                        </ych-table-column-format>

                        <el-table-column
                            prop="MemberState"
                            label="会员状态"
                            width="100" sortable>
                            <template slot-scope="scope">
                                <span>
                                    {{ 
                                        handleLeaguerStatus(scope.row.MemberState) 
                                    }}
                                </span>
                            </template>
                        </el-table-column>

                        <ych-table-column-format
                            prop="CanUsePackageTicket"
                            label="可用套票"
                            width="110"
                            format-type="number" sortable>
                        </ych-table-column-format>

                        <ych-table-column-format
                            prop="TotalPurchaseAmount"
                            label="累计购买金额"
                            format-type="currency"
                            width="128" sortable>
                        </ych-table-column-format>

                        <ych-table-column-format
                            prop="LastPurchaseTime"
                            label="最后购买时间"
                            format-type="date" sortable>
                        </ych-table-column-format>
                        
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
                <member-info-dialog 
                    :id.sync="memberDialog.id"
                    :visible.sync="memberDialog.visible">
                </member-info-dialog>
            </div>
            
        `
        }
    });