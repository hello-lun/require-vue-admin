define([
    'framework/mixins/sidebar-form',
    'components/input-code/index',
    'components/cascader-goods-class/index',
    'api/goods/v1/GoodsAttribute',
    'components/transfer-user/index',
    'api/product/v1/Product'
], function(
    sideBarForm,
    inputCode,
    cascaderGoodsClass,
    goodsAttribute,
    transferUser,
    product
) {
    'use strict';

    return {
        name: 'GoodsBase',

        components: {
            InputCode: inputCode,
            CascaderGoodsClass: cascaderGoodsClass,
            TransferUser: transferUser
        },

        props: {
            incomingData: '',

            classId: {
                type: String
            },

            goodsData: {
                type: Object,
                default: function () {
                    return {};
                }
            }
        },

        created: function () {
            this.handleAddOrEdit();
        },

        data: function () {
            return {
                formData: {
                    Send: [],
                    Make: [],
                    CustomAttribute: null,
                    Image: [],
                    Describe: ''
                },
                customAttr: [],

                customValue: {},

                isFirstGetCustomAttr: true,
                // 记录是否首次变更 商品类型
                isFirstChangeClass: true
            }
        },

        watch: {
            // // 监控分类变化，获取自定义属性
            'classId': function (id) {
                id && this.asyncGetClassCustom(id);
            },

            'goodsData': function (val) {
                _.assign(this.formData, val);
            },

            'customAttr': {
                deep: true,
                handler: function (val) {
                    // 在编辑 首次变更不做处理
                    if (this.isFirstChangeClass) {
                        this.isFirstChangeClass = false;
                        return;
                    }

                    this.$emit('tab-need-change', 'base');
                    this.$message.warning('该商品的自定义属性已变更');
                }
            },

            'formData.CustomAttribute': function (val) {
                var self = this;
                var customAttr = val;
                if (_.isArray(customAttr)) {
                    _.forEach(customAttr, function (item) {
                        self.$set(self.customValue, item.ID, item.Value);
                    });
                }
            }
        },

        computed: {
            goodsId: function () {
                return this.incomingData.id;
            },

            imgData: function () {
                var imgs = [];

                if (this.goodsId) {
                    imgs = _.map(this.formData.Image, function (item) {
                        var tempItem = {};
                        if (item) {
                            tempItem = {
                                name: item.Name,
                                url: item.Url,
                                key: item.Key
                            };
                        }
                        return tempItem;
                    });
                }

                return imgs;
            }
        },

        methods: {
            // 提供父组件获取数据
            getData: function () {
                return this.handleSubmitData();
            },

            validate: function () {
                return this.$refs.form.validate();
            },

            // 商品添加操作
            handleAddOperation: function () {
                // var kindSetting = this.incomingData.setting
                // _.extend(this.formData, {
                //     Kind: kindSetting.Kind,
                //     VirtualCurrencyID: kindSetting.ID
                // });
            },
            // 商品编辑操作
            handleEditOperation: function () {
                // this.asyncGetGoodsInfo();
            },
            
            handleAddOrEdit: function () {
                this.goodsId
                    ? this.handleEditOperation() 
                    : this.handleAddOperation();
            },
            // 获取商品信息
            asyncGetGoodsInfo: function () {
                var self = this;
                product
                    .GetByID({ ID: this.goodsId })
                    .then(function (data) {
                        var customAttr = data.CustomAttribute;
                        if (_.isArray(customAttr)) {
                            _.forEach(customAttr, function (item) {
                                self.$set(self.customValue, item.ID, item.Value);
                                // self.customValue[item.ID] = item.Value;
                            });
                        }

                        // 因商品分类级联组件需要层级ID
                        data.ClassID = data.ClassPath || [];
                        delete data.ClassPath;
                        delete data.Coin;
                        delete data.StartValidity;
                        delete data.EndValidity

                        _.extend(self.formData, data);
                    });
            },

            handleSubmitData: function () {
                return _.extend(
                    {},
                    this.formData,
                    {
                        CustomAttribute: this.handleCustomAttrSubmit()
                    },
                );
            },

            handleCustomAttrSubmit: function () {
                var data = [];
                _.forIn(this.customValue, function (value, key) {
                    data.push({
                        AttributeID: key,
                        Value: value
                    });
                });

                return data;
            },

            asyncGetClassCustom: function (id) {
                if (!id) {
                    return;
                }

                var self = this;
                goodsAttribute
                    .GetInfoByClass({ ClassID: id })
                    .then(function (data) {
                        self.customAttr = data.Data;
                        // 提取切换分类后，获取新自定义属性ID
                        var newCustomAttrIds = _.map(
                            data.Data, 
                            function (item) {
                                return item.ID;
                            }
                        )

                        // 判断是否为编辑首次获取分类的自定义属性列表
                        // 如果不是，执行以下操作
                        if (!self.isFirstGetCustomAttr) {
                            // 遍历当前的自定义属性ID 是否存在 newCustomAttrIds中，
                            _.forIn(self.customValue, function (value, key) {
                                // 若不存在移除该自定义属性值
                                if (newCustomAttrIds.indexOf(key) < 0) {
                                    delete self.customValue[key];
                                }
                            });
                        }

                        self.isFirstGetCustomAttr = false;
                    })
            },

            handleFileExceed: function(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },

            handleImageRemove: function (file, fileList) {
                var index = _.findIndex(
                    this.formData.Image, 
                    function (item) {
                        return item.Key === file.key;
                    }
                );
                this.formData.Image.splice(index, 1);
            },

            handleFileChange: function (file) {
                file && (this.formData.Image.push(file));
            }
        },

        template: `
            <div>
                <side-bar-form
                    ref="form"
                    :model="formData">

                    <ych-sidebar-layout 
                        v-if="classId" 
                        title="自定义属性">

                        <el-form-item 
                            v-for="item in customAttr" 
                            :key="item.AttributeNo"
                            :prop="item.AttributeNo" 
                            :label="item.Name">

                            <el-date-picker
                                v-if="item.DisplayType === 'DateSelect'"
                                v-model="customValue[item.ID]"
                                type="date">
                            </el-date-picker>

                            <el-select 
                                v-else-if="item.DisplayType === 'Select'"
                                v-model="customValue[item.ID]"
                                clearable>
                                <el-option
                                    v-for="opt in (item.Option || [])"
                                    :key="opt.ID"
                                    :label="opt.Text"
                                    :value="opt.Value">
                                </el-option>
                            </el-select>

                            <el-input
                                v-else-if="item.DisplayType === 'TextBox'"
                                v-model="customValue[item.ID]">
                            </el-input>

                        </el-form-item>
                    </ych-sidebar-layout>

                    <ych-sidebar-layout title="商品图片">
                        <ych-upload
                            ref="upload"
                            multiple
                            :limit="3"
                            :file-list="imgData"
                            list-type="picture-card"
                            :max-size="20480"
                            accept=".jpg, .jpeg .png"
                            :on-exceed="handleFileExceed"
                            :on-remove="handleImageRemove"
                            :on-success="handleFileChange">
                            <i class="el-icon-plus"></i>
                        </ych-upload>

                        <small slot="subtitle" style="color: red;">
                            第一张为商品首图
                        </small>
                    </ych-sidebar-layout>

                    <ych-sidebar-layout  title="商品描述">
                        <ych-editor v-model="formData.Describe">
                        </ych-editor>
                    </ych-sidebar-layout>
                </side-bar-form>

                <!--side-bar-form 
                    :model="formData"
                    label-width="3em" 
                    :inline="false">
                    <ych-sidebar-layout title="消息发送" >
                        <el-form-item prop="Send" label="发送">
                            <transfer-user v-model="formData.Send">
                            </transfer-user>
                        </el-form-item>

                        <el-form-item prop="Make" label="抄送">
                            <transfer-user v-model="formData.Make">
                            </transfer-user>
                        </el-form-item>
                    </ych-sidebar-layout>
                </side-bar-form-->
            </div>
        `
    }
});