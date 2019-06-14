define([
    'framework/api/customer/ModuleManage',
    'incss!framework/components/permission-list/index.css'
], function (modulemanage) {
    'use strict';

    var PermissionGroup = {
        name: 'PermissionGroup',

        props: {
            funcItem: Object,
            moduleName: String,
            value: ''
        },

        computed: {
            localValue: {
                get: function () {
                    //if (!this.value || (this.value || []).length <= 0) {
                    //    return [];
                    //}
                    var finalValue, diffValue,
                        currentValue = this.value || [];
                    // 处理选中权限的逻辑
                    finalValue = this.handleCheckboxGroupValue(currentValue);
                    diffValue = _.difference(finalValue, currentValue);
                    // 经过权限逻辑处理后，
                    // 如果finalValue元素个数大于currentValue，
                    // 需要触发input事件，改变父组件的value
                    if (diffValue.length > 0) {
                        this.$emit('input', finalValue);
                    }

                    // 改变多选框控制器状态
                    this.changeControlCheckBoxStatus(finalValue);
                    return finalValue;
                },
                set: function (val) {
                    this.$emit('input', val || []);
                }
            },

            showPermissions: function () {
                return _.map(this.funcItem.PermissionItems || [], _.iteratee('Value'));
            }
        },

        data: function () {
            return {
                isIndeterminate: false,
                checkAll: false,
                checkboxdisabled: []
            }
        },

        methods: {
            handleCheckAllChange: function (is) {
                this.localValue = is ? this.showPermissions : [];
                this.isIndeterminate = false;
            },

            handleCheckedChange: function (val) {
                var checkedCount = val.length,
                    permissionItemList = (this.funcItem.PermissionItems || []).length;
                this.checkAll = checkedCount === permissionItemList;
                this.isIndeterminate = checkedCount > 0 && checkedCount < permissionItemList;
            },
            // 改变checkbox Group的控制器状态
            changeControlCheckBoxStatus: function (finalValue) {
                var valueLength = finalValue.length,
                    permissionItemList = (this.funcItem.PermissionItems || []).length,
                    checkboxStatus;

                if (valueLength >= permissionItemList) {
                    // 0: 全选， 1: 不确定
                    checkboxStatus = [true, false];
                } else if (valueLength === 0) {
                    checkboxStatus = [false, false];
                } else {
                    checkboxStatus = [false, true];
                }

                // 触发change事件，用于改变模块控制器状态
                this.$emit(
                    'change',
                    this.moduleName,
                    this.funcItem.PermissionName,
                    {
                        all: checkboxStatus[0],
                        indeterminate: checkboxStatus[1],
                    }
                );
                this.checkAll = checkboxStatus[0];
                this.isIndeterminate = checkboxStatus[1];
            },

            handleCheckboxGroupValue: function (value) {
                var mustArr = [];
                if (value.indexOf('删除') > -1) {
                    mustArr = ['查询', '编辑', '新增'];
                } else if (value.indexOf('新增') > -1) {
                    mustArr = ['查询', '编辑'];
                } else if (value.indexOf('编辑') > -1) {
                    mustArr = ['查询'];
                }

                this.checkboxdisabled = mustArr;
                return _.union(value, mustArr);
            }
        },

        template: `
      <el-row
        class="permission-modules__func">
        <el-col :span="4">
          <el-checkbox 
            :indeterminate="isIndeterminate" 
            v-model="checkAll" 
            @change="handleCheckAllChange" 
            class="permission-list__func-name">
            {{ funcItem.PermissionName }}
          </el-checkbox>
        </el-col>
        <el-col :span="20">
          <el-checkbox-group 
            v-model="localValue"
            class="permission-list__operation"
            @change="handleCheckedChange">
            <el-checkbox 
              v-for="item in funcItem.PermissionItems" 
              :label="item.Key"
              :disabled="checkboxdisabled.indexOf(item.Value) > -1"
              :key="item.Value">
            </el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    `
    }

    return {
        name: 'PermissionList',

        components: {
            PermissionGroup: PermissionGroup
        },

        created: function () {
            this.fetchPermissionList();
            this.fetchUserPermissionList();
        },

        props: {
            selectedNode: Object
        },

        data: function () {
            return {
                // 活动模块索引
                activeModules: [0, 1],
                // 展示的权限列表
                permissionList: [],
                // 用户权限
                userPermissionData: {
                    ID: '',
                    ParentID: '',
                    NodeType: '',
                    PermissionItems: {}
                },
                // 功能多选框组的控制器状态列表
                funcControllerStatus: {},
                // 模块控制器状态列表
                modulesContrllerStatus: {},
                // 搜索关键字
                searchKey: ''
            }
        },

        computed: {
            // 过滤后的展示权限列表
            filteredPermissionList: function () {
                var list,
                    key = this.searchKey;

                if (key) {
                    list = _.filter(this.permissionList, function (item) {
                        var modulesPermission = _.filter(
                            item.PermissioCollection,
                            function (functional) {
                                return functional.PermissionName.indexOf(key) > -1;
                            }, this);

                        return (modulesPermission || []).length > 0;
                    }, this);
                } else {
                    list = this.permissionList;
                }
                return list;
            }
        },

        methods: {
            fetchPermissionList: function () {
                var self = this;
                
                modulemanage.getmoduleList().then(_.bind(function (res) {
                    var list = res.Data.ModulesPermissionsList;
                    self.createdModuleDefaultStatus(list);
                    self.permissionList = list;
                }, this));


                //global.getParentAuthUser(function (user) {
                //    var accessToken = user.access_token;
                //    $.ajax({
                //        headers: {
                //            Authorization: "Bearer " + accessToken
                //        },
                //        type: 'GET',
                //        contentType: "application/json",
                //        dataType: 'json',
                //        url: "mall/api/module/getmoduleList",
                //        success: function (res) {

                //            var list = res.Data.ModulesPermissionsList;
                //            // 预创建模块的控制器状态属性对象，为了模板渲染时使用v-modal
                //            self.createdModuleDefaultStatus(list);
                //            self.permissionList = list;
                //            //self.userPermissionData.ID = res.id;
                //            //self.userPermissionData.ParentID = res.parentID;
                //            //self.userPermissionData.NodeType = res.nodeType;
                //            //self.userPermissionData.PermissionItems = res.permissionItems;
                //        }
                //    });
                //});




                //  //需要修改的地址
                //  var url = "http://localhost:20003/api/module/getmoduleList";
                //  $.get(url, function (res) {
                //  if (res.ResponseStatus.ErrorCode != 0) {
                //    return;
                //      }
                //  var list = res.Data.ModulesPermissionsList;
                //  // 预创建模块的控制器状态属性对象，为了模板渲染时使用v-modal
                //  self.createdModuleDefaultStatus(list);
                //  self.permissionList = list;
                //})
            },
            // 创建模块的状态属性
            createdModuleDefaultStatus: function (list) {
                var self = this;
                _.each(list, function (item) {
                    if (!self.modulesContrllerStatus[item.ModuleName]) {
                        self.$set(self.modulesContrllerStatus, item.ModuleName, {
                            all: false,
                            indeterminate: false
                        });
                    }
                }, this);
            },

            fetchUserPermissionList: function () {
                var self = this;
                var requestData = this.selectedNode;

                var FunctionalAuth = require('framework/api/organization/FunctionalAuth');
                FunctionalAuth.GetAuth(requestData).then(_.bind(function (res) {
                    self.userPermissionData.ID = res.id;
                    self.userPermissionData.ParentID = res.parentID;
                    self.userPermissionData.NodeType = res.nodeType;
                    self.userPermissionData.PermissionItems = res.permissionItems;
                }, this));

                //global.getParentAuthUser(function (user) {
                //    var accessToken = user.access_token;
                //    $.ajax({
                //        headers: {
                //            Authorization: "Bearer " + accessToken
                //        },
                //        type: 'GET',
                //        contentType: "application/json",
                //        dataType: 'json',
                //        url: "framework/api/FunctionalAuth/GetAuth",
                //        data: requestData,
                //        success: function (res) {

                //            self.userPermissionData.ID = res.id;
                //            self.userPermissionData.ParentID = res.parentID;
                //            self.userPermissionData.NodeType = res.nodeType;
                //            self.userPermissionData.PermissionItems = res.permissionItems;
                //        }
                //    });
                //});

                // //var url = "http://localhost:20004/api/FunctionalAuth/GetAuth";
                // $.get(url, requestData, function (res) {
                //  //if (res.ResponseStatus.ErrorCode != 0) {
                //  //  return;
                //     //}
                //     //_.extend(self.userPermissionData, res);
                //     self.userPermissionData.ID = res.id;
                //     self.userPermissionData.ParentID = res.parentID;
                //     self.userPermissionData.NodeType = res.nodeType;
                //     self.userPermissionData.PermissionItems = res.permissionItems;

                //});
            },
            // 处理模块选择控制器的change事件
            handleCheckAllModuleChange: function (moduleObj) {
                var self = this,
                    modulePermission = moduleObj.PermissioCollection || [];
                // 确保checkbox的v-model已赋值
                this.$nextTick(function () {
                    var triggerModuleAll = {},
                        moduleControllerStatus = self.modulesContrllerStatus[moduleObj.ModuleName] || {},
                        isAll = moduleControllerStatus.all || false;

                    _.each(modulePermission, function (funcPermission) {
                        // 全选
                        if (isAll) {
                            // 获取功能权限的value值
                            var oprationAll = _.map(funcPermission.PermissionItems, _.iteratee('Value'));
                            self.$set(
                                self.userPermissionData.PermissionItems,
                                funcPermission.PermissionName,
                                oprationAll
                            );
                        } else {
                            var userFuncPermission = self.userPermissionData.PermissionItems[funcPermission.PermissionName];
                            // 当去掉全选时，如果当前模块已选有权限，将清空
                            if ((userFuncPermission || []).length > 0) {
                                self.$set(
                                    self.userPermissionData.PermissionItems,
                                    funcPermission.PermissionName,
                                    []
                                );
                            }

                        }
                    });
                })
            },
            // 模块选择控制器状态处理
            modulesControllerStatus: function (moduleName) {
                // 用户选择的权限列表
                var userPermission = this.userPermissionData.PermissionItems;
                // 判断是否已加载完展示权限列表，并且用户权限列表不为空对象
                if (this.permissionList.length <= 0 || _.isEmpty(userPermission)) {
                    return;
                }

                var self = this,
                    moduleInfo;

                moduleInfo = _.find(this.permissionList, function (item) {
                    return item.ModuleName === moduleName;
                });
                // 当前模块下功能的选择控制器的全选状态临时存放变量，
                // 用于后面判断是否有全选的功能项
                var tempAll = false,
                    functionalListLength = moduleInfo.PermissioCollection.length,
                    // 模块选择控制器默认状态
                    moduleControllerStatus = {
                        all: true,
                        indeterminate: false
                    };

                for (var i = 0; i < functionalListLength; i++) {
                    var functional = moduleInfo.PermissioCollection[i],
                        functionalName = functional.PermissionName,
                        statusModulKey = self.funcControllerStatus[moduleName] || {},
                        functionalStatus = statusModulKey[functionalName] || {};

                    // 如果用户没有此功能权限，将模块全选状态设为false,并跳过
                    var functionalPermission = userPermission[functionalName];
                    if (!functionalPermission
                        || (functionalPermission
                            && functionalPermission.length <= 0)
                    ) {
                        moduleControllerStatus.all = false;
                        continue;
                    }

                    // 当有模块有一个功能控制器为indeterminate，
                    // 直接中断循环，并将当前模块状态设为indeterminate
                    if (functionalStatus.indeterminate) {
                        moduleControllerStatus = {
                            all: false,
                            indeterminate: true
                        };
                        break;
                    }
                    // 当功能全选为true,记录tempAll
                    if (functionalStatus.all) {
                        tempAll = true;
                    } else {
                        // 否则模块全选false
                        moduleControllerStatus.all = false;
                    }
                }

                // 循环结束后，如果当前模块的“不确定”状态为false时，
                if (!moduleControllerStatus.indeterminate) {
                    // 当前模块最少一个功能有全选， 并且模块的“不确定”状态为false
                    moduleControllerStatus.indeterminate = tempAll && !moduleControllerStatus.all;
                }
                this.modulesContrllerStatus[moduleName] = moduleControllerStatus;
            },

            // 处理功能权限组件的change事件
            handleGroupChange: function (moduleName, funcName, status) {
                var self = this,
                    modulesStatus = this.funcControllerStatus[moduleName];

                // 没有保存当前功能控制器状态,
                // 因funcControllerStatus没有预先设置key值，导致不能触发到值得改变，
                // 所以用$set的方法，手动触发
                modulesStatus || this.$set(this.funcControllerStatus, moduleName, {});
                self.funcControllerStatus[moduleName][funcName] = status;
                // 确保数据更新成功后执行
                this.$nextTick(function () {
                    self.modulesControllerStatus(moduleName);
                });
            },

            search: function (key) {
                this.searchKey = key;
            },
            save: function () {
                return this.userPermissionData;
            }

        },

        template: `
      <el-collapse 
        v-model="activeModules" 
        class="permission-list">
        <el-collapse-item 
          v-for="(module, index) in filteredPermissionList"
          :key="module.ModuleName"
          :name="index"
          class="permission-modules">
          <template slot="title">
            <el-checkbox
              v-model="modulesContrllerStatus[module.ModuleName].all"
              :indeterminate="modulesContrllerStatus[module.ModuleName].indeterminate"
              @change="handleCheckAllModuleChange(module)" 
              class="permission-modules__name">
              {{ module.ModuleName }}
            </el-checkbox>
          </template>

          <permission-group
            v-for="funcItem in module.PermissioCollection"
            v-model="userPermissionData.PermissionItems[funcItem.PermissionName]"
            :key="funcItem.PermissionName"
            @change="handleGroupChange"
            :func-item="funcItem"
            :module-name="module.ModuleName">
          </permission-group>

        </el-collapse-item>
      </el-collapse>
    `
    }
});
