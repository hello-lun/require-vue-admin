define([
    'framework/mixins/sidebar-form',
    'api/number-generate/v1/Number',
    'api/virtual-currency/v1/VirtualCurrency',
    'components/input-code/index'
], function(
    sideBarForm,
    number,
    virtualCurrency,
    inputCode
) {
    'use strict';

    return {
        name: 'SidebarVirtualCurrency',

        mixins: [sideBarForm],

        components: {
            InputCode: inputCode
        },

        created: function () {
            this.incomingData.id
                && this.asyncGetVirtualCurrencyInfo();
        },

        data: function () {
            
            return {
                formData: {
                    Name: null,
                    Number: null,
                    PayMent: false,
                    SwingCard:false,
                    Exchange:false,
                    PhysicalCoin:false,
                    Recharge:false,
                    SaveTicket:false,
                    Give: false,
                    ConsumeGive:false,
                    RechargeGive:false,
                    SavePhysicalCoinChange:false,
                    Validity:false,
                    Decimal:0,
                    Refund:false,
                    VirtualCurrencyType:''
                },
                rules: {
                    Name: [
                        { required: true, message: '请输货币名称', trigger: 'blur' }
                    ],
                   // Number: [
                   //     { required: true, message: '请输入会员级别编码', trigger: 'blur' }
                   // ]
                }
            }
        },
        mounted: function() {
           
            var selectKind= this.incomingData.SelectKind || null;
            if(selectKind==null) return;
            this.formData.VirtualCurrencyType=selectKind.ID;
            switch(selectKind.ID){
                case "PreDeposit":
                this.formData.Name=selectKind.Name;
                this.formData.PayMent=true;
                this.formData.SwingCard=true;
                this.formData.Recharge=true;
                this.formData.Decimal=2;
                this.formData.Refund=true;
                break;
                case "Gold":
                this.formData.Name=selectKind.Name;
                this.formData.SwingCard=true;   
               // this.formData.Exchange=true;
                this.formData.Recharge=true;
                this.formData.Decimal=0;
                break;
                case "Token":
                this.formData.Name=selectKind.Name;
                this.formData.SwingCard=true;
               // this.formData.Exchange=true;
                this.formData.PhysicalCoin=true;
                this.formData.SavePhysicalCoinChange=true;
                this.formData.Recharge=true;
                this.formData.Decimal=0;
                break;
                case "Lottery":
                this.formData.Name=selectKind.Name;
                this.formData.Exchange=true;
                this.formData.SaveTicket=true;
                this.formData.Decimal=0;                
                break;
                case "Integral":
                this.formData.Name=selectKind.Name;
                this.formData.Exchange=true;
                this.formData.Give=true;
                this.formData.Decimal=0; 
                break; 
                case "Custom":
                break;                                                              
                default:
                break;
            };
            
        },
        methods: {
            save: function () {
                var methodName = this.incomingData.id ? 'Edit' : 'Add';
                var self = this;
                return new Promise(function (resolve, reject) {
                    virtualCurrency[methodName](self.formData)
                        .then(function (data) {
                            return resolve(self.formData);
                        }, function () {
                            return reject(false);
                        });
                });
                
            },

            asyncGetVirtualCurrencyInfo: function () {
                var self = this;
                virtualCurrency.GetInfo({ ID: this.incomingData.id })
                    .then(function (data) {
                        _.assign(self.formData, data);
                    });
            }
        },

        template: `
            <el-tabs value="base">
                <el-tab-pane label="基础设置" name="base">
                    <side-bar-form
                        :model="formData"
                        :rules="rules">

                        <ych-sidebar-layout title=" ">
                        <el-form-item 
                            prop="Name" 
                            label="货币名称:">

                            <el-input
                                v-model="formData.Name">
                            </el-input>

                        </el-form-item>
                       
                        <el-form-item 
                            prop="Number" 
                            label="货币编号:">
                            <input-code 
                                v-model="formData.Number"
                                type="virtual-currency"
                                :get-code="!Boolean(incomingData.id)"
                                disabled>
                            </input-code>
                        </el-form-item>
                        
                        </ych-sidebar-layout>

                        <!-------------------能力开始------------------------->
                        <ych-sidebar-layout title="能力"  style="margin-left:30px;">  
                        <el-form-item prop="" label=" "> 
                           <el-row>                                             
                           <el-checkbox v-model="formData.PayMent">支付货币能力</el-checkbox>                     
                           </el-row>
                        <el-row>                 
                        <el-checkbox v-model="formData.SwingCard">刷卡游玩能力</el-checkbox>                    
                        </el-row>
                       <el-row>                    
                       <el-checkbox v-model="formData.Exchange">兑换商品能力</el-checkbox>                    
                       </el-row>                  
                        <el-row>                       
                        <el-checkbox v-model="formData.PhysicalCoin">提取实物币</el-checkbox>                       
                        </el-row>
                        </el-form-item>
                     </ych-sidebar-layout>
                     <!-------------------能力结束------------------------->

                     
                     <!-------------------来源开始------------------------->
                     <ych-sidebar-layout title="来源">
                     <el-form-item prop="" label=" "> 
                        <el-row>
                        <el-checkbox v-model="formData.Recharge">充值(商品)</el-checkbox>
                        </el-row>
                     <el-row>
                     <el-checkbox v-model="formData.SaveTicket">存彩票转化</el-checkbox>
                     </el-row>                     
                    <el-row>
                    <el-checkbox v-model="formData.Give">消费赠送</el-checkbox>
                    </el-row>                         
                   <el-row>
                   <el-checkbox v-model="formData.ConsumeGive">消耗其他虚拟货币赠送</el-checkbox>
                   </el-row>                                
                   <el-row>
                   <el-checkbox v-model="formData.RechargeGive">充值其他虚拟货币赠送</el-checkbox>
                   </el-row>                       
                   <el-row>
                   <el-checkbox v-model="formData.SavePhysicalCoinChange">存实物币转化</el-checkbox>
                   </el-row>
                   </el-form-item>
                  </ych-sidebar-layout>
                  <!-------------------来源结束------------------------->

                  <!-------------------其它开始------------------------->
                  <ych-sidebar-layout title="其它"  style="margin-left:30px;">
                  <ych-form-item prop="" label=" " double> 
                     <el-row>
                     <el-checkbox v-model="formData.Validity">有效期限制</el-checkbox>
                     </el-row>
                               
                  <el-row>
                  <el-checkbox v-model="formData.Refund">支持退款</el-checkbox>
                  </el-row>
               
                  <el-row>
                  小数位:
                 <el-radio-group v-model="formData.Decimal" size="mini">
                    <el-radio-button label="0" border>整数</el-radio-button>
                    <el-radio-button label="1" border>1个小数</el-radio-button>
                    <el-radio-button label="2" border>2个小数</el-radio-button>
                  </el-radio-group>
                 </el-row>
                 </ych-form-item>

               </ych-sidebar-layout>
               <!-------------------其它结束------------------------->


                    </side-bar-form>
                </el-tab-pane>

         
            </el-tabs>
            
        `
    }
});