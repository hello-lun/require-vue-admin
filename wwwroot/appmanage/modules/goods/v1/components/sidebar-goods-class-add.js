define([
    'framework/mixins/sidebar-form',
    'components/input-code/index',
    'components/cascader-goods-class/index',
    'api/goods/v1/GoodsAttribute',
    'api/goods/v1/GoodsClass',
    'goods/components/custom-attr-dialog'
], function(
    sideBarForm,
    inputCode,
    cascaderGoodsClass,
    goodsAttribute,
    goodsClass,
    customAttrDailog
) {
    'use strict';

    // 操作列按钮
    var operationGroup = [
        {
            label: '移除',
            value: 'remove'
        }
    ];

    return {
        name: 'SidebarGoodsClassAdd',

        mixins: [sideBarForm],

        components: {
            InputCode: inputCode,
            CascaderGoodsClass: cascaderGoodsClass,
            CustomAttrDailog: customAttrDailog
        },

        created: function () {
            this.classId && this.asyncGetClassDetail();
        },

        data: function () {
            return {
                columnOpration: operationGroup,

                formData: {
                    Number: '',
                    Name: '',
                    ParentID: [],
                    CustomAttributes: []
                },
                rules: {
                    Number: [
                        { required: true, message: '', trigger: 'blur' }
                    ],
                    Name: [
                        { required: true, message: '请填写分类名称', trigger: 'blur' }
                    ],
                    // ParentID: [
                    //     { required: true, message: '请选择上级分类', trigger: 'blur' }
                    // ],
                },

                // 继承上级分类的自定义属性
                inheritCustomAttr: [],
                // 局部自定义属性
                localCustomAttr: [],

                customAttrDailogVisible: false
            }
        },

        computed: {
            classId: function () {
                return this.incomingData.id || null;
            },

            customAttrData: function () {
                return _.concat(
                    [], 
                    this.inheritCustomAttr, 
                    this.localCustomAttr
                );
            },

            selectedIds: function () {
                return (_.map(this.customAttrData, function (item) {
                    return item.ID;
                }) || []);
            },

            localCustomAttrId: function () {
                return (_.map(this.localCustomAttr, function (item) {
                    return item.ID;
                }) || []);
            }
        },

        methods: {
            save: function () {
                var self = this,
                    submitData = this.handleSubmitData();

                return new Promise(function (resolve, reject) {
                    var thenFn = self.classId 
                                    ? self.editGoodsClass(submitData) 
                                    : self.addGoodsClass(submitData);

                    thenFn
                        .then(function () {
                            resolve(submitData);
                        }, function () {
                            reject();
                        });
                });
            },

            editGoodsClass: function (data) {
                data['ID'] = this.classId;
                return goodsClass.Edit(data);
            },

            addGoodsClass: function (data) {
                return goodsClass.Add(data);
            },

            handleSubmitData: function () {
                var data = _.extend({}, this.formData, {
                    CustomAttributes: this.localCustomAttrId
                });

                data.ParentID = (data.ParentID || []).pop();

                return data;
            },

            asyncGetClassDetail: function () {
                var self = this;
                goodsClass
                    .GetInfo({ ID: this.classId })
                    .then(function (res) {
                        _.extend(self.formData, {
                            Number: res.ClassNo,
                            Name: res.Name,
                            ParentID: res.Path
                        });

                        _.forEach(res.CustomAttributes, function (item) {
                            item.IsInherit 
                                ? self.inheritCustomAttr.push(item) 
                                : self.localCustomAttr.push(item);
                        });
                    });
            },

            removeCustom: function (data) {
                var index = _.findIndex(
                    this.localCustomAttr, 
                    function (item) {
                        return item.ID === data.ID;
                    }
                );

                (index > -1) && this.localCustomAttr.splice(index, 1);
            },

            handleOperationColumn: function (name, data) {
                var fnMap = {
                    'remove': this.removeCustom,
                };

                var fn = fnMap[name];
                fn && fn(data);
            },

            handleParentChange: function (val) {
                this.formData.ParentID = val;
                var self = this,
                parentId = _.concat([], val || []).pop();
            
                if (parentId) {
                    goodsAttribute
                        .SearchByClass({ ClassID: parentId })
                        .then(function(res) {
                            self.inheritCustomAttr = res.Data;
                        });
                } else {    // 清空继承的自定义属性
                    self.inheritCustomAttr = [];
                }
            },

            addCustomAttr: function (val) {
                var self = this;

                _.forEach(val, function (item) {
                    self.localCustomAttr.push(item);
                });
            },

            handleOperationToggle: function (name, row) {
                var is = true;
                if (name === 'remove') {
                    is = !row.IsInherit;
                }
                return is;
            }
        },

        template: `
            <div>
                <custom-attr-dailog 
                    ref="customAttr"
                    :visible.sync="customAttrDailogVisible"
                    :selected="selectedIds"
                    @submit="addCustomAttr">
                </custom-attr-dailog>
                <side-bar-form
                    :model="formData"
                    :rules="rules">

                    <ych-sidebar-layout >
                        <el-form-item prop="Number" label="分类编号">
                            <input-code 
                                v-model="formData.Number"
                                type="goods-class"
                                :get-code="!Boolean(classId)">
                            </input-code>
                        </el-form-item>

                        <el-form-item prop="Name" label="分类名称">
                            <el-input 
                                v-model="formData.Name">
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="ParentID" label="上级分类">
                            <cascader-goods-class 
                                :value="formData.ParentID"
                                @input="handleParentChange">
                            </cascader-goods-class>
                        </el-form-item>

                    </ych-sidebar-layout>
                   
                </side-bar-form>

                <side-bar-form
                    :model="formData"
                    :rules="rules">

                    <ych-sidebar-layout>
                        <el-form-item prop="Custom">
                            <ych-button 
                                type="primary" 
                                @click="customAttrDailogVisible = true">
                                添加自定义属性
                            </ych-button>
                        </el-form-item>
                        <ych-table
                            :data="customAttrData"
                            :column-controller="false"
                            :max-height="350"
                            row-key="ID">

                            <el-table-column
                                prop="Name"
                                label="属性名称"
                                width="120">
                            </el-table-column>
                            
                            <el-table-column
                                prop="Option"
                                label="列表选项"
                                min-width="250" 
                                show-overflow-tooltip>
                            </el-table-column>

                            <ych-table-column-operation
                                @operation-click="handleOperationColumn"
                                :toggle="handleOperationToggle"
                                :operation="columnOpration">
                            </ych-table-column-operation>
                        </ych-table>
                    </ych-sidebar-layout>
                   
                </side-bar-form>
            </div>
        `
    }
});