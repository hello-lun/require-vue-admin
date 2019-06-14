define([
    'framework/mixins/sidebar-form',
    'game-project/components/sidebar-game-project-machine-setting-dailog',
], function(
    sideBarForm,
    gameProjectMachineSettingDailog,

) {
    'use strict';

    return {
        name: 'SidebarGameProjectMachineSetting',
        props:['formDataBase'],
        mixins: [sideBarForm],

        components: {
            GameProjectMachineSettingDailog:gameProjectMachineSettingDailog
        },

        created: function () {
           
           
        },
        data: function () {
            return {
                actionBtnsList: 
                [
                    {
                    label: '编辑',
                    key: 'edit'
                    }         
                ],
                enumMachine:
                [{
                    label:'投币',
                    value:'CoinIn'
                },{
                    label:'出彩票',
                    value:'LotteryOut'
                },{
                    label:'出币',
                    value:'CoinOut'
                },{
                    label:'出礼品',
                    value:'GiftOut'
                }], 
                lotteryOutType:'自动',
                coinOutType:'自动',
                enumCoinOutType:[
                    {
                        label:'自动',
                        value:'Auto'
                    },
                    {
                        label:'只出电子币',
                        value:'Ele'
                    },
                    {
                        label:'只出实物币',
                        value:'Phy'
                    },

                ],
                enumLotteryOutType:[
                    {
                        label:'自动',
                        value:'Auto'
                    },
                    {
                        label:'只出电子票',
                        value:'Ele'
                    },
                    {
                        label:'只出实物票',
                        value:'Phy'
                    },

                ],
                gameProjectMachineSettingDailogVisible:false,
                dailogTitles:'机台参数设置',
                machineSetting:{
                    //出礼品光眼高电平
                    GiftOutEyesPot:false,
                    //出票光眼高电平
                    LotteryEyesPot:false,
                    //出币光眼高电平
                    CoinEyesPot:false,
                    //投币器高电平
                    CoinInPot:false,
                    //出币马达高电平
                    CoinMotorPot:false,
                    //出礼品脉宽
                    GiftOutWidth:0,
                    //出票马达高电平
                    LotteryMotorPot:false,
                    //投币速度
                    CoinInSpeed:0,
                    //出票延时
                    LotteryOutDelay:0,
                    //出币延时
                    CoinOutDelay:0,
                    //投币脉宽
                    CoinInWidth:0,
                    //出票放大倍数
                    LotteryOutAmplificationFactor:0,
                    //出币放大倍数
                    CoinOutAmplificationFactor:0,
                    //投币识别脉宽
                    CoinInRecognitionWidth:0,
                    //出币速度
                    CoinOutSpeed:0,
                    //出票速度
                    LotteryOutSpeed:0,
                    //投币脉冲数
                    CoinInPulsePerTime:0,
                    //出币脉宽
                    CoinOutWidth:0,
                    //出票脉宽
                    LotteryOutWidth:0,
                    //出币模式
                    CoinOutType:'Auto',
                    //出票模式
                    LotteryOutType:'Auto',
                    isUpdate:false,
                },
                formData:{},
                rules: {},

            }
        },
        computed: {
        },
        mounted: function() {
           
        },
        watch: {
            
            formDataBase: {
                deep: true,//还可以加一个deep，表示跟踪所有对象下的属性
                handler: function (newval, oldval) {
                    if (newval) {
                        var self=this;
                        //出票模式
                        self.enumLotteryOutType.forEach(item=>{
                            if(item.value== self.formDataBase.LotteryOutType){
                                self.lotteryOutType=item.label;                             
                            }
                        });
                         //出币模式
                        self.enumCoinOutType.forEach(item=>{
                            if(item.value== self.formDataBase.CoinOutType){
                                self.coinOutType=item.label;
                            }
                        });
               
                        
                       
                                
                    } else {
                    }
                   
                }
            },          
        },
        methods: {
            //编辑按钮事件
            handleEditMachineStting:function(){
                var self=this;                     
               self.gameProjectMachineSettingDailogVisible = true;
            },
            //重置编辑对象数据
            getmachineSetting:function(){
                return {
                //出礼品光眼高电平
                GiftOutEyesPot:false,
                //出票光眼高电平
                LotteryEyesPot:false,
                //出币光眼高电平
                CoinEyesPot:false,
                //投币器高电平
                CoinInPot:false,
                //出币马达高电平
                CoinMotorPot:false,
                //出礼品脉宽
                GiftOutWidth:0,
                //出票马达高电平
                LotteryMotorPot:false,
                //投币速度
                CoinInSpeed:0,
                //出票延时
                LotteryOutDelay:0,
                //出币延时
                CoinOutDelay:0,
                //投币脉宽
                CoinInWidth:0,
                //出票放大倍数
                LotteryOutAmplificationFactor:0,
                //出币放大倍数
                CoinOutAmplificationFactor:0,
                //投币识别脉宽
                CoinInRecognitionWidth:0,
                //出币速度
                CoinOutSpeed:0,
                //出票速度
                LotteryOutSpeed:0,
                //投币脉冲数
                CoinInPulsePerTime:0,
                //出币脉宽
                CoinOutWidth:0,
                //出票脉宽
                LotteryOutWidth:0,
                //出币模式
                CoinOutType:'Auto',
                //出票模式
                LotteryOutType:'Auto',
                isUpdate:true,
            }},
            //投币
            handleEditCoinIn:function(value){
                var self=this;            
                self.dailogTitles="投币选项";
                self.formDataBase.editCoinIn=true;
                self.formDataBase.editLotteryOut=false;
                self.formDataBase.editCoinOut=false;
                self.formDataBase.editGiftOut=false;
                self.machineSetting= self.getmachineSetting();
                _.assign(self.machineSetting, self.formDataBase);  
                self.machineSetting.isUpdate=!self.machineSetting.isUpdate;                    
                if(value=='edit'){
                    this.handleEditMachineStting();
                }
            },
            //出彩票
            handleEditLotteryOut:function(value){
                var self=this;
                self.dailogTitles="出票选项";
                self.formDataBase.editCoinIn=false;
                self.formDataBase.editLotteryOut=true;
                self.formDataBase.editCoinOut=false;
                self.formDataBase.editGiftOut=false;
                self.machineSetting= self.getmachineSetting();
                _.assign(self.machineSetting, self.formDataBase);  
                self.machineSetting.isUpdate=!self.machineSetting.isUpdate;
                if(value=='edit'){
                    this.handleEditMachineStting();
                }
            },
            //出币
            handleEditCoinOut:function(value){
                var self=this;
                self.dailogTitles="出币选项";
        
                self.formDataBase.editCoinIn=false;
                self.formDataBase.editLotteryOut=false;
                self.formDataBase.editCoinOut=true;
                self.formDataBase.editGiftOut=false;
                self.machineSetting= self.getmachineSetting();
                _.assign(self.machineSetting, self.formDataBase);  
                self.machineSetting.isUpdate=!self.machineSetting.isUpdate;
                if(value=='edit'){
                    this.handleEditMachineStting();
                }
               
            },
            //出礼品
            handleEditGiftOut:function(value){
                var self=this;
                self.dailogTitles="出礼品选项";
                self.formDataBase.editCoinIn=false;
                self.formDataBase.editLotteryOut=false;
                self.formDataBase.editCoinOut=false;
                self.formDataBase.editGiftOut=true;

                self.machineSetting= self.getmachineSetting();
                _.assign(self.machineSetting, self.formDataBase);  
                self.machineSetting.isUpdate=!self.machineSetting.isUpdate;              
                if(value=='edit'){
                    this.handleEditMachineStting();
                }
              
            },
            //监听编辑保存数据
            editGameProjectMachineSettingDailog:function(value){
                var self=this;
                _.assign(this.formDataBase, value);
                self.gameProjectMachineSettingDailogVisible =false;
                self.$emit('consume-scheme-edit', self.formDataBase); 
            }

                  
        },
 
        template: `
                <div>
                    <!----------------------------------投币、出票、出币、出礼品编辑弹出框开始-----------------------------------> 
                    <game-project-machine-setting-dailog
                        ref="editGameProjectMachineSettingDailog"
                        :visible.sync="gameProjectMachineSettingDailogVisible" 
                        :enumLotteryOutType='enumLotteryOutType'
                        :enumCoinOutType='enumCoinOutType'
                        :dailogTitle='dailogTitles'
                        :machineSetting='formDataBase'
                        @submit="editGameProjectMachineSettingDailog" >
                    </game-project-machine-setting-dailog>
                    <!----------------------------------投币、出票、出币、出礼品编辑弹出框开始-----------------------------------> 
                    <!----------------------------------机台参数设置开始-----------------------------------> 
                    <side-bar-form
                        :model="formDataBase"
                        :rules="rules">
                            <!----------------------------------机台功能选项开始-----------------------------------> 
                            <el-row 
                               style="margin-bottom: 10px;">
                                    <div  style="padding: 8px 16px;background-color: #ecf8ff; 
                                        border-radius: 4px;height: 22px;display: block;color:#606266;">
                                        <el-col :span="4">
                                            <p> 机台功能</p>
                                        </el-col>
                                        <el-col :span="20">
                                            <el-checkbox v-model="formDataBase.IsCoinIn">投币</el-checkbox>
                                            <el-checkbox v-model="formDataBase.IsLotteryOut">出彩票</el-checkbox>
                                            <el-checkbox v-model="formDataBase.IsCoinOut">出币</el-checkbox>
                                            <el-checkbox v-model="formDataBase.IsGiftOut">出礼品</el-checkbox>
                                        </el-col>
                                    </div>
                            </el-row>
                            <!----------------------------------机台功能选项结束----------------------------------->
                            <!----------------------------------投币、出票、出币、出礼品编辑选项开始-----------------------------------> 
                            <el-row >
            
                                    <!----------------------------------投币选项开始----------------------------------->
                                    <div 
                                        style="margin-bottom:10px;;float:left;margin-right:3px;"
                                        v-show="formDataBase.IsCoinIn==true">
                                            <ych-card  
                                                style="color:#606266;"                          
                                                :width="140"
                                                :height="192"
                                                :action-btns-list="actionBtnsList"
                                                header-divider
                                                action-btns
                                                @action-btns-click="handleEditCoinIn">    

                                                <span slot="header">投币选项</span>   

                                                <div   style="width:100%;height: 100%;">                        
                                                    <el-row style="text-align:left;">
                                                    <el-col :span="18">投币器高电平:</el-col>
                                                    <el-col :span="6" style="text-align:right;" v-show="formDataBase.CoinInPot==true">是</el-col>
                                                    <el-col :span="6" style="text-align:right;" v-show="formDataBase.CoinInPot!=true">否</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">投币速度:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.CoinInSpeed}}ms</el-col>
                                                    </el-row>
                
                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">投币脉宽:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.CoinInWidth}}ms</el-col>
                                                    </el-row>
                
                                                    <el-row style="text-align:left;">
                                                    <el-col :span="15">投币识别脉宽:</el-col>
                                                    <el-col :span="9" style="text-align:right;">{{formDataBase.CoinInRecognitionWidth}}ms</el-col>
                                                    </el-row>
                
                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">投币脉冲数:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.CoinInPulsePerTime}}</el-col>
                                                    </el-row>
                                                
                                                </div>

                                            </ych-card>
                                    </div>
                                    <!----------------------------------投币选项结束----------------------------------->
                                    <!----------------------------------出票选项开始----------------------------------->
                                    <div 
                                        style="margin-bottom:10px;;float:left;margin-right:3px;"
                                        v-show="formDataBase.IsLotteryOut==true">
                                            <ych-card
                                                style="color:#606266;"                               
                                                :width="140"
                                                :height="192"
                                                :action-btns-list="actionBtnsList"
                                                header-divider
                                                action-btns
                                                @action-btns-click="handleEditLotteryOut">
                                
                                                <span slot="header">出票选项</span>
                                
                                                <div   style="width:100%;height: 100%;">    
                                                
                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">光眼高电平:</el-col>
                                                    <el-col :span="12" style="text-align:right;" v-if="formDataBase.LotteryEyesPot==true">是</el-col>
                                                    <el-col :span="12" style="text-align:right;" v-else>否</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">马达高电平:</el-col>
                                                    <el-col :span="12" style="text-align:right;"v-if="formDataBase.LotteryMotorPot==true">是</el-col>
                                                    <el-col :span="12" style="text-align:right;"v-else>否</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">出票延时:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.LotteryOutDelay}}ms</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="15">出票放大倍数:</el-col>
                                                    <el-col :span="9" style="text-align:right;">{{formDataBase.LotteryOutAmplificationFactor}}倍</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">出票速度:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.LotteryOutSpeed}}ms</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">出票脉宽:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.LotteryOutWidth}}ms</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">出票模式:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{lotteryOutType}}</el-col>
                                                    </el-row>
                                                
                                                    
                                                </div>

                                            </ych-card>
                                    </div>
                                    <!----------------------------------出票选项结束----------------------------------->
                                    <!----------------------------------出币选项开始----------------------------------->
                                    <div 
                                        style="margin-bottom:10px;;float:left;margin-right:3px;"
                                        v-show="formDataBase.IsCoinOut==true">
                                            <ych-card 
                                                style="color:#606266;"                              
                                                :width="140"
                                                :height="192"
                                                :action-btns-list="actionBtnsList"
                                                header-divider
                                                action-btns
                                                @action-btns-click="handleEditCoinOut">
                                
                                                <span slot="header">出币选项</span>
                                
                                                <div   style="width:100%;height: 100%;">     
                                                                    
                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">光眼高电平:</el-col>
                                                    <el-col :span="12" style="text-align:right;" v-if="formDataBase.CoinEyesPot==true">是</el-col>
                                                    <el-col :span="12" style="text-align:right;" v-else>否</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">马达高电平:</el-col>
                                                    <el-col :span="12" style="text-align:right;" v-if="formDataBase.CoinMotorPot==true">是</el-col>
                                                    <el-col :span="12" style="text-align:right;" v-else>否</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">出币延时:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.CoinOutDelay}}ms</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="15">出币放大倍数:</el-col>
                                                    <el-col :span="9" style="text-align:right;">{{formDataBase.CoinOutAmplificationFactor}}倍</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">出币速度:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.CoinOutSpeed}}ms</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">出币脉宽:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{formDataBase.CoinOutWidth}}ms</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">出币模式:</el-col>
                                                    <el-col :span="12" style="text-align:right;">{{coinOutType}}</el-col>
                                                    </el-row>

                                                </div>

                                            </ych-card>
                                    </div>
                                    <!----------------------------------出币选项结束----------------------------------->
                                    <!----------------------------------出礼品选项开始----------------------------------->
                                    <div 
                                        style="margin-bottom:10px;;float:left;margin-right:3px;"
                                        v-show="formDataBase.IsGiftOut==true">
                                            <ych-card
                                                style="color:#606266;"                               
                                                :width="140"
                                                :height="192"
                                                :action-btns-list="actionBtnsList"
                                                header-divider
                                                action-btns
                                                @action-btns-click="handleEditGiftOut">
                                
                                                <span slot="header">出礼品选项</span>
                                
                                                <div   style="width:100%;height: 100%;">   

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="15">礼品识别脉宽:</el-col>
                                                    <el-col :span="9" style="text-align:right;">{{formDataBase.GiftOutWidth}}ms</el-col>
                                                    </el-row>

                                                    <el-row style="text-align:left;">
                                                    <el-col :span="12">光眼高电平:</el-col>
                                                    <el-col :span="12" style="text-align:right;" v-if="formDataBase.GiftOutEyesPot==true">是</el-col>
                                                    <el-col :span="12" style="text-align:right;" v-else>否</el-col>
                                                    </el-row>                   
                                                        
                                                </div>

                                            </ych-card>
                                    </div>
                                    <!----------------------------------出礼品选项结束----------------------------------->

                            </el-row>
                            <!----------------------------------投币、出票、出币、出礼品编辑选项结束----------------------------------->
                    </side-bar-form>
                    <!----------------------------------机台参数设置开始-----------------------------------> 
                </div>
        `
    }
});