define([
    'api/game-project/v1/GameProject',
    'components/cascader-game-project-type/index',
    'game-project/components/sidebar-game-project',
    'mixins/pagination',
    'incss!game-project/styles/index.css'
], function (
    gameProject,
    cascaderGameProjectType,
    sidebarGameProject,
    pagination
) {
        'use strict';
        // 操作列按钮
        var operationGroup = [
            {
                label: '编辑',
                value: 'edit'
            },
            {
                label: '删除',
                value: 'delete'
            }
        ];
        return {
            name: 'GameProjectList',
            props: ['selectnode', 'treeData'],
            components: {
                CascaderGameProjectType: cascaderGameProjectType
            },

            mixins: [pagination],

            created: function () {
                // 初始化分页混合更新方法
                this.paginationUpdateFn = this.asyncGetGameProjectList;
                this.asyncGetGameProjectList();
            },

            data: function () {
                return {
                    columnOpration: operationGroup,
                    multipleSelection: [],
                    dataList: [],
                    order: {
                        Order: 'LastUpdateTime',
                        OderAsc: false
                    },
                    formData: {
                        ProjectName: '',
                        ProjectTypeID: [],
                        IsEnable: '',
                        Statistics: null
                    },
                    enableOptions: [{
                        label: '全部',
                        value: '',
                    }, {
                        label: '启用',
                        value: true
                    }, {
                        label: '禁用',
                        value: false
                    }],
                    gameProjectTypeOptions: [
                        {
                            Path: [],
                            Childs: [],
                            Name: '',
                            ID: ''
                        }
                    ],
                    dialogVisible: false,
                    kindSetting: [{
                        ID: 'Game',
                        Name: '电玩机台'
                    }, {
                        ID: 'Naughty',
                        Name: '淘气堡'
                    }, {
                        ID: 'Experience',
                        Name: '体验项目'
                    }, {
                        ID: 'Scenic',
                        Name: '景区门票'
                    }, {
                        ID: 'Sports',
                        Name: '体育类'
                    }, {
                        ID: 'Theatrical ',
                        Name: '剧场演出'
                    }, {
                        ID: 'Course',
                        Name: '课程'
                    }, {
                        ID: 'Custom',
                        Name: '自定义'
                    }],

                };
            },
            watch: {
                selectnode: {
                    immediate: true,
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        if (newval) {
                            this.selectnode = newval;
                            var projectTypeID = newval.Path;
                            if (projectTypeID == 'all' || projectTypeID == undefined) {
                                return projectTypeID = [];
                            }
                            this.formData.ProjectTypeID = projectTypeID;
                            this.gameProjectTypeOptions = newval;

                        } else {
                        }
                        this.asyncGetGameProjectList();
                    }
                },
                treeData: {
                    immediate: true,
                    deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                    handler: function (newval, oldval) {
                        if (newval) {

                        } else {
                        }
                    }
                },

            },

            computed: {
                kindDailogWidth: function () {
                    return (this.kindSetting.length * 150 + 124) + 'px';
                }
            },

            methods: {
                // 获取项目列表
                asyncGetGameProjectList: function () {
                    var self = this;
                    self.$nextTick(function () {
                        var submitData = self.handleSubmitData();;
                        gameProject.GetProjectList(submitData).then(function (data) {
                            if (data != null && data != undefined) {
                                self.dataList = data.Data;
                                self.paginationTotal = data.Total;
                            }
                        });
                    });
                },
                // 处理提交数据
                handleSubmitData: function () {
                    var projectTypeID = '';
                    if (this.formData.ProjectTypeID.length > 0) {
                        projectTypeID = this.formData.ProjectTypeID[this.formData.ProjectTypeID.length - 1];
                        if (projectTypeID == "all") {
                            projectTypeID = '';
                        }
                    }
                    var datapost = {
                        ProjectName: this.formData.ProjectName,
                        ProjectTypeID: projectTypeID,
                        IsEnable: this.formData.IsEnable,
                        Statistics: this.formData.Statistics
                    };
                    var finalFormData = _.extend({}, datapost),
                        statistics = finalFormData.Statistics || [];

                    finalFormData.StartTime = statistics[0];
                    finalFormData.EndTime = statistics[1];
                    delete finalFormData.Statistics;

                    return _.extend(
                        {},
                        finalFormData,
                        this.paginationInfo,
                        this.order
                    );
                },
                //排序
                handleSortChange: function (data) {
                    this.order.Order = data.prop;
                    this.order.OderAsc = data.order === 'ascending';
                    this.asyncGetGameProjectList();
                },
                //操作事件    
                handleOperationColumn: function (name, data) {
                    var fnMap = {
                        'edit': this.editGameProject,
                        'delete': this.confirmDeleteGameProject
                    };

                    var fn = fnMap[name];
                    fn && fn(data);
                },

                handleConditionHided: function (prop) {
                    this.formData[prop] = null;
                },

                //选中行
                handleSelectionChange: function (val) {
                    this.multipleSelection = val;
                },
                handleSelectKind: function (selectKind) {
                    this.dialogVisible = false;
                    this.addAddGameProject(selectKind, false);
                },
                //新增游乐项目
                handleAddGameProject: function () {
                    if (this.treeData[0].Childs.length < 1) {
                        this.dialogVisible = true;
                    } else {
                        this.addAddGameProject(null, true);
                    }

                },
                addAddGameProject: function (data, show) {
                    var self = this;
                    var name = null;
                    var format = null;
                    var add = false;
                    if (data != null && data != undefined && data != "") {
                        name = data.Name;
                        format = data.ID;
                        if (data.Name == "自定义" || data.ID == "Custom") {
                            self.$emit('game-project-type-add');
                            return;
                        } else {
                            add = true;
                        }
                    } else {
                        add = true;
                    }
                    if (add == true) {
                        this.sideBar({
                            title: '新增游乐项目',
                            datas: {
                                hasProjectType: show,
                                ProjectTypeName: name,
                                Format: format
                            },
                            modules: [{
                                component: sidebarGameProject
                            }],
                            operation: [{
                                label: '保存',
                                value: 'save'
                            }],
                            success: function (data) {
                                self.$message({
                                    message: '保存成功！',
                                    type: 'success'
                                });
                                self.asyncGetGameProjectList();
                                if (self.treeData[0].Childs.length < 1) {

                                    self.$emit('refresh-tree-data');
                                }
                            }
                        }).show();
                    }

                },
                //编辑游乐项目
                editGameProject: function (data) {

                    var self = this;
                    this.sideBar({
                        title: '编辑游乐项目',
                        datas: {
                            ID: data.ID,
                            hasProjectType: true
                        },
                        modules: [{
                            component: sidebarGameProject
                        }],
                        operation: [{
                            label: '保存',
                            value: 'save'
                        }],
                        success: function (data) {
                            self.$message({
                                message: '保存成功！',
                                type: 'success'
                            });
                            self.asyncGetGameProjectList();
                        }
                    }).show();

                },
                //选择删除行提示
                confirmDeleteGameProject: function (data) {
                    var self = this;
                    this.$confirm('确定删除游乐项目？', '提示', {
                        confirmButtonText: '删除',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(function () {
                        self.deleteGameProject(data.ID);
                    }).catch(function () { });
                },
                //删除游乐项目
                deleteGameProject: function (id) {
                    var self = this;
                    gameProject
                        .Delete({ ID: id })
                        .then(function () {
                            self.$message({
                                message: '游乐项目删除成功！',
                                type: 'success'
                            });
                            self.asyncGetGameProjectList();
                        });
                },


                //点击名称
                handleProjectNameClick: function (row) {
                    this.editGameProject(row);
                },
                //导出二维码
                deleteQRCode: function (ids) {
                    var self = this,
                        data = (typeof ids === 'string')
                            ? [ids]
                            : _.map(this.multipleSelection, function (item) {
                                return item.ID;
                            });
                },

            },

            template: `
        <div>
        
            <el-dialog
                title="请选择项目类型"
                :width="kindDailogWidth"
                :visible.sync="dialogVisible">
                    <el-row 
                        type="flex"
                        class="goods-info__dialog" 
                        :gutter="20">
                        <el-col 
                            v-for="item in kindSetting"
                            class="goods-info__dialog-col"
                            :key="item.ID"
                            @click.native="handleSelectKind(item)" 
                            :span="6">
                            <i class="el-icon-edit"></i>
                            <center> {{ item.Name }}</center>
                        </el-col>
                    </el-row>
            </el-dialog>

            <ych-report-container>

                <ych-report-header 
                    slot="header"
                    @hide-condition="handleConditionHided"
                    @query-click="asyncGetGameProjectList">

                        <ych-form-item 
                            label="项目名称"
                            key="ProjectName"
                            prop="ProjectName">
                            <el-input v-model="formData.ProjectName"></el-input>
                        </ych-form-item >

                        <ych-form-item  
                            label="项目类型" 
                            key="ProjectTypeID"
                            prop="ProjectTypeID">
                            <cascader-game-project-type 
                                v-model="formData.ProjectTypeID">
                            </cascader-game-project-type>
                        </ych-form-item >

                
                        <ych-form-item
                        label="是否启用"
                        key="IsEnable"
                        prop="IsEnable">
                        <el-select 
                            v-model="formData.IsEnable" 
                            placeholder="请选择">
                            <el-option
                                v-for="item in enableOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        </ych-form-item>
                        <!--
                        <ych-form-item  
                            label="数据统计日期" 
                            key="Statistics"
                            prop="Statistics">
                            <el-date-picker 
                                v-model="formData.Statistics"
                                type="daterange">
                            </el-date-picker>
                        </ych-form-item >
                        -->

                </ych-report-header>

                <ych-table
                    slot="main"
                    :data="dataList"
                    @sort-change="handleSortChange"
                    @selection-change="handleSelectionChange"
                    :height="400">

                    <el-table-column
                        type="selection"
                        width="30">
                    </el-table-column>
                                            
                    <ych-table-column-format prop="ProjectName" label="项目名称" width="120" 
                    :link-click="handleProjectNameClick" format-type="link"  sortable>
                    </ych-table-column-format>

                    <el-table-column
                        prop="Code"
                        label="项目编号"
                        width="100" sortable>
                    </el-table-column>

                    <el-table-column
                    prop="ProjectTypeName"
                    label="项目类型"
                    width="120" sortable>
                    </el-table-column>

                    <el-table-column
                    prop="PortID"
                    label="端口ID"
                    width="120">
                    </el-table-column>
                
                    <el-table-column
                        prop="ConsumeSchemeInfo"
                        label="消费方案"
                        width="200"
                        :link-click="handleProjectNameClick" format-type="link"
                        >
                        <template slot-scope="scope">                      
                            <el-row 
                                type="flex" 
                                :gutter="20"
                                align="left"
                                justify="space-between"> 
                                <el-col>                                  
                                <template    v-for="item in scope.row.ConsumeSchemeInfo">
                                    <ych-button 
                                        :key="item"
                                        @click="editGameProject(scope.row)" 
                                        type="text"
                                        >
                                        {{ item }}
                                    </ych-button>
                                    <br/>
                                </template>                                                               
                                </el-col>
                            </el-row>                       
                        </template>
                    </el-table-column>
                    
                    <el-table-column              
                    prop="IsEnable"
                    label="是否启用"
                    min-width="100"
                    sortable>
                    <template slot-scope="scope">
                        {{ scope.row.IsEnable ? '启用' : '禁用' }}
                    </template>
                    </el-table-column>

                    <el-table-column
                    prop="LastUpdaterName"
                    label="最后修改人"
                    width="120" sortable>
                    </el-table-column>

                    <ych-table-column-format
                        prop="LastUpdateTime"
                        label="最后修改时间"
                        width="135" 
                        format-type="date"
                        sortable>
                    </ych-table-column-format>


                    <ych-table-column-operation
                        @operation-click="handleOperationColumn"
                        :operation="columnOpration">
                    </ych-table-column-operation>
                </ych-table>

                <template slot="footerLeft">
                    <ych-button 
                    @click="handleAddGameProject"                            
                    type="primary">
                    新增游乐项目
                    </ych-button>    
                    
                    <ych-button 
                    :disabled="multipleSelection.length <= 0" 
                    @click="deleteQRCode">
                    导出二维码
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
        
        </div>
    `
        }
    });