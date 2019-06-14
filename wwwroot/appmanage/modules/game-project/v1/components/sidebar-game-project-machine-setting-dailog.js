define([
   
], function(
   
) {
    'use strict';
    
    return {
        name: 'gameProjectMachineSettingDailog',
        props:['visible','machineSetting','enumLotteryOutType','enumCoinOutType','dailogTitle'],
        created: function () {
         
        },
        data: function () {
           
            return {
                schemeOptions:
                [
                    {
                    label:'自定义参数',
                    value:'custom',
                    },{
                        label:'高电平方案',
                        value:'highLevel',
                    },{
                        label:'低电平方案',
                        value:'lowlevel',
                    }
                ],
                schemevalue:'custom',
                defaultformData:{
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
                },
                highLevelformData:{
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
                },
                lowlevelformData:{
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
                },
                
                formData:{
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
                },
                 rules:{

                 },
            };
        },

        watch: {
                
            visible: function (val)
            { 

            },  
            machineSetting:
            {               
                immediate: true,
                deep: true,
                handler: function(val,oldVal){          
                   _.assign(this.formData, val);
                   _.assign(this.defaultformData, val);

                }
            },        
            'enumLotteryOutType':function(val)
            {              
                this.enumLotteryOutType=val;
            }, 
            'enumCoinOutType':function(val)
            {
              
                this.enumCoinOutType=val;
            },
            'dailogTitle':function(val)
            {
               
                this.dailogTitle=val;
            },
            'schemevalue':function(val)
            {
                var self=this;
                if(this.schemevalue=="custom"){
                    
                    if(this.machineSetting.editCoinIn==true){

                        self.formData.CoinInPot=self.defaultformData.CoinInPot;
                        self.formData.CoinInWidth=self.defaultformData.CoinInWidth;
                        self.formData.CoinInSpeed=self.defaultformData.CoinInSpeed;
                        self.formData.CoinInRecognitionWidth=self.defaultformData.CoinInRecognitionWidth;
                        self.formData.CoinInPulsePerTime=self.defaultformData.CoinInPulsePerTime;
  
                    }else if(this.machineSetting.editLotteryOut==true){

                        self.formData.LotteryEyesPot=self.defaultformData.LotteryEyesPot;
                        self.formData.LotteryMotorPot=self.defaultformData.LotteryMotorPot;
                        self.formData.LotteryOutDelay=self.defaultformData.LotteryOutDelay;
                        self.formData.LotteryOutAmplificationFactor=self.defaultformData.LotteryOutAmplificationFactor;
                        self.formData.LotteryOutSpeed=self.defaultformData.LotteryOutSpeed;
                        self.formData.LotteryOutWidth=self.defaultformData.LotteryOutWidth;
                        self.formData.LotteryOutType=self.defaultformData.LotteryOutType;

                    }
                    else if(this.machineSetting.editCoinOut==true){

                        self.formData.CoinEyesPot=self.defaultformData.CoinEyesPot;
                        self.formData.CoinMotorPot=self.defaultformData.CoinMotorPot;
                        self.formData.CoinOutDelay=self.defaultformData.CoinOutDelay;
                        self.formData.CoinOutAmplificationFactor=self.defaultformData.CoinOutAmplificationFactor;
                        self.formData.CoinOutSpeed=self.defaultformData.CoinOutSpeed;
                        self.formData.CoinOutWidth=self.defaultformData.CoinOutWidth;
                        self.formData.CoinOutType=self.defaultformData.CoinOutType;

                    }
                    else if(this.machineSetting.editGiftOut==true){

                        self.formData.GiftOutWidth=self.defaultformData.GiftOutWidth;
                        self.formData.GiftOutEyesPot=self.defaultformData.GiftOutEyesPot;

                    }
                }
                else if(this.schemevalue=="highLevel"){
                    var self=this;
                    if(this.machineSetting.editCoinIn==true){

                        self.formData.CoinInPot=self.highLevelformData.CoinInPot;
                        self.formData.CoinInWidth=self.highLevelformData.CoinInWidth;
                        self.formData.CoinInSpeed=self.highLevelformData.CoinInSpeed;
                        self.formData.CoinInRecognitionWidth=self.highLevelformData.CoinInRecognitionWidth;
                        self.formData.CoinInPulsePerTime=self.highLevelformData.CoinInPulsePerTime;

                    }else if(this.machineSetting.editLotteryOut==true){

                        self.formData.LotteryEyesPot=self.highLevelformData.LotteryEyesPot;
                        self.formData.LotteryMotorPot=self.highLevelformData.LotteryMotorPot;
                        self.formData.LotteryOutDelay=self.highLevelformData.LotteryOutDelay;
                        self.formData.LotteryOutAmplificationFactor=self.highLevelformData.LotteryOutAmplificationFactor;
                        self.formData.LotteryOutSpeed=self.highLevelformData.LotteryOutSpeed;
                        self.formData.LotteryOutWidth=self.highLevelformData.LotteryOutWidth;
                        self.formData.LotteryOutType=self.highLevelformData.LotteryOutType;
                    }
                    else if(this.machineSetting.editCoinOut==true){

                        self.formData.CoinEyesPot=self.highLevelformData.CoinEyesPot;
                        self.formData.CoinMotorPot=self.highLevelformData.CoinMotorPot;
                        self.formData.CoinOutDelay=self.highLevelformData.CoinOutDelay;
                        self.formData.CoinOutAmplificationFactor=self.highLevelformData.CoinOutAmplificationFactor;
                        self.formData.CoinOutSpeed=self.highLevelformData.CoinOutSpeed;
                        self.formData.CoinOutWidth=self.highLevelformData.CoinOutWidth;
                        self.formData.CoinOutType=self.highLevelformData.CoinOutType;

                    }
                    else if(this.machineSetting.editGiftOut==true){
                        self.formData.GiftOutWidth=self.highLevelformData.GiftOutWidth;
                        self.formData.GiftOutEyesPot=self.highLevelformData.GiftOutEyesPot;
                    }

                }
                else if(this.schemevalue=="lowlevel"){
                    var self=this;
                    if(this.machineSetting.editCoinIn==true){
                        self.formData.CoinInPot=self.lowlevelformData.CoinInPot;
                        self.formData.CoinInWidth=self.lowlevelformData.CoinInWidth;
                        self.formData.CoinInSpeed=self.lowlevelformData.CoinInSpeed;
                        self.formData.CoinInRecognitionWidth=self.lowlevelformData.CoinInRecognitionWidth;
                        self.formData.CoinInPulsePerTime=self.lowlevelformData.CoinInPulsePerTime;
                    }else if(this.machineSetting.editLotteryOut==true){

                        self.formData.LotteryEyesPot=self.lowlevelformData.LotteryEyesPot;
                        self.formData.LotteryMotorPot=self.lowlevelformData.LotteryMotorPot;
                        self.formData.LotteryOutDelay=self.lowlevelformData.LotteryOutDelay;
                        self.formData.LotteryOutAmplificationFactor=self.lowlevelformData.LotteryOutAmplificationFactor;
                        self.formData.LotteryOutSpeed=self.lowlevelformData.LotteryOutSpeed;
                        self.formData.LotteryOutWidth=self.lowlevelformData.LotteryOutWidth;
                        self.formData.LotteryOutType=self.lowlevelformData.LotteryOutType;

                    }
                    else if(this.machineSetting.editCoinOut==true){

                        self.formData.CoinEyesPot=self.lowlevelformData.CoinEyesPot;
                        self.formData.CoinMotorPot=self.lowlevelformData.CoinMotorPot;
                        self.formData.CoinOutDelay=self.lowlevelformData.CoinOutDelay;
                        self.formData.CoinOutAmplificationFactor=self.lowlevelformData.CoinOutAmplificationFactor;
                        self.formData.CoinOutSpeed=self.lowlevelformData.CoinOutSpeed;
                        self.formData.CoinOutWidth=self.lowlevelformData.CoinOutWidth;
                        self.formData.CoinOutType=self.lowlevelformData.CoinOutType;
                    }
                    else if(this.machineSetting.editGiftOut==true){
                        self.formData.GiftOutWidth=self.lowlevelformData.GiftOutWidth;
                        self.formData.GiftOutEyesPot=self.lowlevelformData.GiftOutEyesPot;
                    }

                }

            }
           
            
        },

        computed: {
            //弹出框显示控制
            localVisible: {
                get: function () {                 
                    return this.visible;                   
                },

                set: function (val) {                   
                    this.$emit('update:visible', val);
                }
            }

        
        },

        methods: {
            //保存事件
            handleSaveData:function(){
                var self=this;           
                self.localVisible = false;
                self.$emit('submit',  self.formData);
            },
            //弹出框关闭事件
            handlecolse:function(){        
                this.Visible = false
                this.localVisible = false;
                _.assign(this.formData, this.defaultformData);               
                this.machineSetting.isUpdate!=this.machineSetting.isUpdate;
            }
            
        },

        template: `
            <el-dialog
                @close="handlecolse"
                :title="dailogTitle"
                :visible.sync="localVisible"
                :lock-scroll="false"
                :modal-append-to-body="false"
                width="48%">
                    <!----------------------------------投币、出票、出币、出礼品设置开始---------------------------------->
                    <side-bar-form
                        :model="formData"
                        :rules="rules"
                        ref="form">
                                <!----------------------------------高低电平设置开始---------------------------------->
                                <el-row style="margin-top:10px;">
                                    <div  style="text-align: center;padding: 8px 6px;background-color: #ecf8ff; 
                                    border-radius: 4px;height:26px;display: block;
                                    font-size: 12px;color: #999999;">
                                        <el-col :span="13" style="text-align:right;">
                                            <p>不知道怎么设置参数？试试常用的参数方案吧</p>
                                        </el-col>
                                        <el-col :span="7" 
                                            style="padding-left:5px;">
                                            <ych-form-item 
                                                label=""
                                                key="schemevalue"
                                                prop="schemevalue">
                                                <el-select 
                                                    v-model="schemevalue" 
                                                    placeholder="请选择">
                                                    <el-option
                                                        v-for="item in schemeOptions"
                                                        :key="item.value"
                                                        :label="item.label"
                                                        :value="item.value">
                                                    </el-option>
                                                </el-select>
                                            </ych-form-item>
                                        </el-col>
                                    </div>
                                </el-row>
                                <!----------------------------------高低电平设置结束---------------------------------->
                                
                                <!----------------------------------投币选项开始---------------------------------->
                                <el-row v-show="machineSetting.editCoinIn==true">
                                    <el-row :span="24">
                                    <el-col :span="12" >
                                    <ych-form-item  
                                    label="投币器高电平" 
                                    key="CoinInPot"
                                    prop="CoinInPot">                       
                                        <el-radio-group v-model="formData.CoinInPot" size="mini">
                                        <el-radio-button :label="true" border>是</el-radio-button>
                                        <el-radio-button :label="false" border>否</el-radio-button>
                                        </el-radio-group>                        
                                    </ych-form-item >
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item   
                                        key="CoinInSpeed" 
                                        prop="CoinInSpeed" 
                                        label="投币速度">                          
                                            <ych-input-number 
                                                size="mini"
                                                :controls="false"
                                                :min="0" 
                                                :max="999999999"
                                                onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                                v-model="formData.CoinInSpeed">
                                                <span slot="append">毫秒</span>
                                            </ych-input-number>  
                                        </el-form-item>
                                    </el-col>
                                    </el-row>

                                    <el-row :span="24">
                                        <el-col :span="12">
                                            <el-form-item 
                                            key="CoinInWidth"
                                            prop="CoinInWidth" 
                                            label="投币脉宽">
                                                <ych-input-number 
                                                    size="mini"
                                                    :controls="false"
                                                    :min="0" 
                                                    :max="999999999"
                                                    onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                                    v-model="formData.CoinInWidth">
                                                    <span slot="append">毫秒</span>
                                                </ych-input-number>                          
                                            </el-form-item>                       
                                        </el-col>

                                        <el-col :span="12">
                                            <el-form-item 
                                            key="CoinInRecognitionWidth"
                                            prop="CoinInRecognitionWidth" 
                                            label="投币识别脉宽">
                                                    <ych-input-number 
                                                    size="mini"
                                                    :controls="false"
                                                    :min="0" 
                                                    :max="999999999"
                                                    onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                                    v-model="formData.CoinInRecognitionWidth">
                                                    <span slot="append">毫秒</span>
                                                    </ych-input-number>                          
                                            </el-form-item>         
                                        </el-col>
                                    </el-row>

                                    <el-form-item 
                                        key="CoinInPulsePerTime"
                                        prop="CoinInPulsePerTime" 
                                        label=" 投币脉冲数">
                                        <ych-input-number 
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.CoinInPulsePerTime">
                                        </ych-input-number>                             
                                    </el-form-item>

                                </el-row>
                                <!----------------------------------投币选项结束---------------------------------->

                                
                                <!----------------------------------出票选项开始---------------------------------->
                                <el-row v-show="machineSetting.editLotteryOut==true">

                                    <ych-form-item  
                                    label="光眼高电平" 
                                    key="LotteryEyesPot"
                                    prop="LotteryEyesPot">                       
                                        <el-radio-group 
                                        v-model="formData.LotteryEyesPot" 
                                        size="mini">
                                        <el-radio-button :label="true" border>是</el-radio-button>
                                        <el-radio-button :label="false" border>否</el-radio-button>
                                        </el-radio-group>                        
                                    </ych-form-item >

                                    <ych-form-item  
                                    label="马达高电平" 
                                    key="LotteryMotorPot"
                                    prop="LotteryMotorPot">                       
                                        <el-radio-group v-model="formData.LotteryMotorPot" size="mini">
                                        <el-radio-button :label="true" border>是</el-radio-button>
                                        <el-radio-button :label="false" border>否</el-radio-button>
                                        </el-radio-group>                        
                                    </ych-form-item >   

                                    <el-form-item prop="LotteryOutDelay" label="出票延时">
                                        <ych-input-number 
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.LotteryOutDelay">
                                            <template slot="append">毫秒</template>
                                        </ych-input-number>                           
                                    </el-form-item>

                                    <el-form-item prop="LotteryOutAmplificationFactor" label="出票放大倍数">
                                        <ych-input-number 
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.LotteryOutAmplificationFactor">
                                            <template slot="append">倍</template>
                                        </ych-input-number >                           
                                    </el-form-item>

                                    <el-form-item prop="LotteryOutSpeed" label="出票速度">
                                        <ych-input-number  
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.LotteryOutSpeed">
                                            <template slot="append">毫秒</template>
                                        </ych-input-number >                           
                                    </el-form-item>

                                    <el-form-item prop="LotteryOutWidth" label=" 出票脉宽">
                                        <ych-input-number  
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.LotteryOutWidth">   
                                            <template slot="append">毫秒</template>                               
                                        </ych-input-number >                           
                                    </el-form-item>

                                    <el-form-item prop="LotteryOutType" label=" 出票模式">
                                        <el-select 
                                        v-model="formData.LotteryOutType" 
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in enumLotteryOutType"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                        </el-select>
                                    </el-form-item>

                                </el-row>
                                <!----------------------------------出票选项结束---------------------------------->

                                                    
                                <!----------------------------------出币选项开始---------------------------------->
                                <el-row v-show="machineSetting.editCoinOut==true">

                                    <ych-form-item  
                                    label="光眼高电平" 
                                    key="CoinEyesPot"
                                    prop="CoinEyesPot">                       
                                        <el-radio-group v-model="formData.CoinEyesPot" size="mini">
                                            <el-radio-button :label="true" border>是</el-radio-button>
                                            <el-radio-button :label="false" border>否</el-radio-button>
                                        </el-radio-group>                        
                                    </ych-form-item >

                                    <ych-form-item  
                                    label="马达高电平" 
                                    key="CoinMotorPot"
                                    prop="CoinMotorPot">                       
                                        <el-radio-group v-model="formData.CoinMotorPot" size="mini">
                                            <el-radio-button :label="true" border>是</el-radio-button>
                                            <el-radio-button :label="false" border>否</el-radio-button>
                                        </el-radio-group>                        
                                    </ych-form-item >   

                                    <el-form-item prop="CoinOutDelay" label="出币延时">
                                        <ych-input-number 
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.CoinOutDelay">
                                            <template slot="append">毫秒</template>
                                        </ych-input-number >                           
                                    </el-form-item>

                                    <el-form-item prop="CoinOutAmplificationFactor" label="出币放大倍数">
                                        <ych-input-number 
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.CoinOutAmplificationFactor">
                                            <template slot="append">倍</template>
                                        </ych-input-number >                           
                                    </el-form-item>

                                    <el-form-item prop="CoinOutSpeed" label="出币速度">
                                        <ych-input-number  
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                            onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.CoinOutSpeed">
                                            <template slot="append">毫秒</template>
                                        </ych-input-number >                           
                                    </el-form-item>

                                    <el-form-item prop="CoinOutWidth" label="出币脉宽">
                                        <ych-input-number   
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                        onkeypress="return event.keyCode>=48&&event.keyCode<=57" 
                                        v-model="formData.CoinOutWidth">                                                                  
                                        </ych-input-number >                           
                                    </el-form-item>

                                    <el-form-item prop="CoinOutType" label="出币模式">
                                        <el-select 
                                        v-model="formData.CoinOutType" 
                                        placeholder="请选择">
                                        <el-option
                                            v-for="item in enumCoinOutType"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                        </el-select>
                                    </el-form-item>

                                </el-row>
                                <!----------------------------------出币选项结束---------------------------------->

                                <!----------------------------------出礼品选项开始---------------------------------->
                                <el-row v-show="machineSetting.editGiftOut==true">
        
                                    <el-form-item prop="GiftOutWidth" label="礼品识别脉宽">
                                        <ych-input-number 
                                            size="mini"
                                            :controls="false"
                                            :min="0" 
                                            :max="999999999"
                                        onkeypress="return event.keyCode>=48&&event.keyCode<=57"
                                            v-model="formData.GiftOutWidth">                                 
                                        </ych-input-number >                           
                                    </el-form-item>

                                    <ych-form-item  
                                    label="光眼高电平" 
                                    key="GiftOutEyesPot"
                                    prop="GiftOutEyesPot">                       
                                        <el-radio-group v-model="formData.GiftOutEyesPot" size="mini">
                                            <el-radio-button :label="true" border>是</el-radio-button>
                                            <el-radio-button :label="false" border>否</el-radio-button>
                                        </el-radio-group>                        
                                    </ych-form-item >

                

                                </el-row>
                                <!----------------------------------出礼品选项结束---------------------------------->

                    </side-bar-form>
                    <!----------------------------------投币、出票、出币、出礼品设置结束---------------------------------->
                    <span slot="footer">                                      
                        <ych-button 
                            @click="localVisible = false">
                            取 消
                        </ych-button>
                        <ych-button 
                            type="primary" 
                            @click="handleSaveData">
                            确 定
                        </ych-button>
                    </span>
            </el-dialog>
        `
    }
});