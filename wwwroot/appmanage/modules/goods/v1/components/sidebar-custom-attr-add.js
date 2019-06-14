define([
    'framework/mixins/sidebar-form',
    'components/input-code/index',
    'api/goods/v1/GoodsAttribute',
], function(
    sideBarForm,
    inputCode,
    goodsAttribute,
) {
    'use strict';

    return {
        name: 'SidebarCustomAtrrAdd',

        mixins: [sideBarForm],

        components: {
            InputCode: inputCode
        },

        created: function () {
            this.handleAddOrEdit();
        },

        data: function () {
            var self = this;

            var validatorOptions = function (rule, value, callback) {
                if (
                    self.formData.DisplayType === 'Select' 
                    && value.length <= 0
                ) {
                    return callback(new Error('下拉选项不能少于一个'));
                }
                callback();
            }

            return {
                formData: {
                    Number: '',
                    Name: '',
                    IsEnable: null,
                    DisplayType: null,
                    Options: []
                },
                rules: {
                    Name: [
                        { required: true, message: '请填写属性名称', trigger: 'blur' }
                    ],
                    Number: [
                        { required: true, message: '请输入属性编号', trigger: 'blur' }
                    ],
                    IsEnable: [
                        { type: 'boolean', required: true, message: '请选择属性是否启用', trigger: 'blur' }
                    ],
                    DisplayType: [
                        { required: true, message: '请选择属性显示类型', trigger: 'blur' }
                    ],
                    Options: [
                        { validator: validatorOptions, trigger: 'blur' }
                    ]
                },

                // 类型选择
                typeOptions: [{
                    label: '下拉列表',
                    value: 'Select'
                }, {
                    label: '文本框',
                    value: 'TextBox'
                }, {
                    label: '日期选择',
                    value: 'DateSelect'
                }]

            }
        },

        computed: {
            id: function () {
                return this.incomingData.id;
            },

            localOptions: {
                get: function () {
                    return _.map(this.formData.Options, function (item) {
                        return item.Text;
                    })
                },

                set: function (val) {
                    var arr = _.map(val, function (val) {
                        return {
                            Text: val,
                            Value: val
                        }
                    });

                    this.formData.Options = arr;
                }
            }
        },

        methods: {
            save: function () {
                var self = this,
                    data = this.handleSubmitData(),
                    msg = self.id ? '保存' : '添加';

                return new Promise(function (resolve, reject) {
                    var resFn = self.id 
                                ? self.editAttr(data) 
                                : self.addAttr(data);
                    resFn
                        .then(function () {
                            resolve();
                            self.$message({
                                message: '商品自定义属性' + msg + '成功！',
                                type: 'success'
                            });
                        }, function () {
                            reject();
                        });
                });
            },

            addAttr: function (data) {
                return goodsAttribute.Add(data);
            },

            editAttr: function (data) {
                return goodsAttribute.Edit(data);
            },

            // 商品编辑操作
            handleEditOperation: function () {
                this.asyncGetGoodsInfo();
            },
            
            handleAddOrEdit: function () {
                this.id && this.handleEditOperation();
            },
            // 获取商品自定义属性信息
            asyncGetGoodsInfo: function () {
                var self = this;
                goodsAttribute
                    .GetAttribute({ ID: this.id })
                    .then(function (data) {
                        delete data.ID
                        _.extend(self.formData, data);
                    });
            },

            handleSubmitData: function () {
                return _.extend(
                    {},
                    this.formData,
                    { ID: this.id }
                );
            }

        },

        template: `
            <div>
                <side-bar-form
                    :model="formData"
                    :rules="rules">
                    
                    <ych-sidebar-layout >

                        <el-form-item 
                            prop="Number" 
                            label="属性编号">
                            <input-code 
                                v-model="formData.Number"
                                type="goods"
                                :get-code="!Boolean(id)">
                            </input-code>
                        </el-form-item>

                        <el-form-item 
                            prop="Name" 
                            label="属性名称">
                            <el-input 
                                v-model="formData.Name">
                            </el-input>
                        </el-form-item>

                        <el-form-item 
                            prop="IsEnable" 
                            label="是否启用">
                            <el-select v-model="formData.IsEnable">
                                <el-option
                                    label="是"
                                    :value="true">
                                </el-option>
                                <el-option
                                    label="否"
                                    :value="false">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item 
                            prop="DisplayType" 
                            label="显示类型">
                            <el-select 
                                v-model="formData.DisplayType"
                                :disabled="id">
                                <el-option
                                    v-for="item in typeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <ych-form-item 
                            v-show="formData.DisplayType === 'Select'"
                            key="Options"
                            prop="Options" 
                            label="列表选项" 
                            double>
                            <ych-tag-group v-model="localOptions">
                            </ych-tag-group>
                        </ych-form-item>

                    </ych-sidebar-layout>

                </side-bar-form>

            </div>
        `
    }
});