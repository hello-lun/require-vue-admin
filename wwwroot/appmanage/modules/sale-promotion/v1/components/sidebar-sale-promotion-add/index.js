define([
    'framework/mixins/sidebar-form',
    'api/price/v1/PricePromotion',
    'modules/sale-promotion/v1/components/sidebar-sale-promotion-add/sale-promotion-base',
    'modules/sale-promotion/v1/components/sidebar-sale-promotion-add/sale-promotion-setting',
    'modules/sale-promotion/v1/components/sidebar-sale-promotion-add/sale-promotion-modify-record'
], function(
    sideBarForm,
    salePromotionService,
    salePromotionBase,
    salePromotionSetting,
    salePromotionModifyRecord
) {
    'use strict';

    return {
        name: 'SidebarSalePromotionAdd',

        mixins: [sideBarForm],

        components: {
            SalePromotionBase: salePromotionBase,
            SalePromotionSetting: salePromotionSetting,
            SalePromotionModifyRecord: salePromotionModifyRecord
        },

        data: function () {
            return {
                formData: {},
                base : {
                    Number : '',
                    Name: '',
                    ChannelList: [],
                    StartTime: '',
                    EndTime: '',
                    CanUseDays: 0,
                    StartTimeSlot: '',
                    EndTimeSlot: '',
                    RuleType: '',
                    Discount: '',
                    GoodsRange: '',
                    GoodsList: ''},

                setting : {
                    Crowd : 'UnLimit',
                    CrowdData:[],
                    IsUseCountUnlimited : 'false',
                    UseCount : 0,
                    IsFrequencyUnlimited : 'false',
                    FrequencyCycle : '',
                    FrequencyUseCount : 0
                }
            }
        },

        computed: {
            salePromotionId: function () {
                return this.incomingData.id;
            }
        },

        created : function(){
            var self = this;
            if(this.salePromotionId){
                salePromotionService.GetPromotionPlan({ID : this.salePromotionId})
                .then(function(data){
                    self.formData = data;
                    self.base = _.pick(data, [
                        'Number','Name','ChannelList',
                        'StartTime','EndTime','CanUseDays',
                        'StartTimeSlot','EndTimeSlot','RuleType',
                        'Discount','GoodsRange','GoodsList'
                    ]);

                    self.setting = _.pick(data,[
                        'Crowd','CrowdData','IsUseCountUnlimited',
                        'UseCount','IsFrequencyUnlimited','FrequencyCycle',
                        'FrequencyUseCount'
                    ]);
                });
            }
        },

        methods: {
            save: function () {
                var self = this;
                var data = _.extend({
                    PromotionClassID: this.incomingData.promotionClassID || self.formData.PromotionClassID
                }, 
                this.$refs.base.getData(),
                this.$refs.setting.getData());
                
                if(this.salePromotionId){
                    data.ID = this.salePromotionId;
                    return this.handleEdit(data);
                }
                else{
                    return this.handleAdd(data);
                }

            },


            handleEdit: function (data) {
                return salePromotionService.PromotionEdit(data);
            },
            
            handleAdd: function (data) {
                // TODO: 新增目前写死 PromotionType, 等待优化
                data.PromotionType = 'Discount';
                
                return salePromotionService.PromotionAdd(data);
            },


        },

        template: `
            <el-tabs value="base">
                <el-tab-pane 
                    label="基本信息" 
                    name="base">
                    <sale-promotion-base 
                        ref="base" 
                        :incoming-data="incomingData"
                        :data='base'>
                    </sale-promotion-base>
                </el-tab-pane>

                <el-tab-pane 
                    label="高级设置" 
                    name="setting">
                    <sale-promotion-setting
                        ref="setting" 
                        :data='setting'>
                    </sale-promotion-setting>
                </el-tab-pane>

                <el-tab-pane 
                    label="修改日志" 
                    name="modify">
                    <sale-promotion-modify-record
                        :incoming-data="incomingData">
                    </sale-promotion-modify-record>
                </el-tab-pane>
            </el-tabs>
        `
    }
});