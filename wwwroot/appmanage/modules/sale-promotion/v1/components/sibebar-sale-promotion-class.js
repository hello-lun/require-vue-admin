define([
    'framework/mixins/sidebar-form',
    'api/number-generate/v1/Number',
    'api/price/v1/PricePromotionClass',
    'components/input-code/index',
    'components/cascader-sale-promotion-class/index'
], function (
    sideBarForm,
    number,
    PricePromotionClass,
    inputCode,
    cascaderSalePromotionClass
) {
    'use strict';

    return {
        name: 'SidebarSalePromotionClass',

        mixins: [sideBarForm],

        components: {
            InputCode: inputCode,
            CascaderSalePromotionClass: cascaderSalePromotionClass
        },

        created: function () {
            // this.incomingData.ID &&
            // this.asyncGetSalePromotionClass();
            console.log(this.incomingData.currentItem);
            this.formData = Object.assign({}, this.incomingData.currentItem)
        },

        computed: {
            promotionClassId: function () {
                return this.incomingData.ID || null;
            }
        },

        data: function () {

            return {
                formData: {
                    ID: null,
                    Number: null,
                    Name: '',
                },
                rules: {
                    Name: [{
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }]
                }
            }
        },

        methods: {
            GetParentID: function (idList) {
                return idList[idList.length - 1];
            },
            save: function () {

                // this.formData.ParentID = this.GetParentID(this.formData.ParentIDList);
                if (this.incomingData.isEdit) {
                    return this.edit();
                } else {
                    this.formData.ParentID = 
                        this.incomingData.ID === '00000000-0000-0000-0000-000000000000' ? 
                        '' : 
                        this.incomingData.ID;
                    return this.add();
                }
            },

            add: function () {
                return PricePromotionClass.Add(this.formData);
            },

            edit: function () {
                return PricePromotionClass.UpdatePromotionClass(this.formData);
            },

            asyncGetSalePromotionClass: function () {
                var self = this;
                // this.incomingData.ID && PricePromotionClass.GetPromotionClass({
                //     ID: this.incomingData.ID === '00000000-0000-0000-0000-000000000000' ? '' : this.incomingData.ID
                // }).then(function (res) {
                //     self.formData = res;
                // });
            }
        },

        template: `
            <ych-sidebar-layout title="基础设置">
                    <side-bar-form
                        :model="formData"
                        :rules="rules">

                        <el-form-item prop="Number" label="活动编号编号">
                            <input-code 
                                v-model="formData.Number"
                                type="goods"
                                :disabled="true"
                                :get-code="!incomingData.isEdit">
                            </input-code>
                        </el-form-item>

                        <el-form-item prop="Name" label="活动名称">
                            <el-input  v-model="formData.Name">
                            </el-input >
                        </el-form-item>

                        <!--
                        <el-form-item prop="ParentIDs" label="上级活动">
                            <cascader-sale-promotion-class 
                                v-model="formData.ParentIDs">
                            </cascader-sale-promotion-class>
                        </el-form-item>
                        -->

                    </side-bar-form>
            </ych-sidebar-layout>
            
        `
    }
});