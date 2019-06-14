define([
    'components/cascader-goods-class/index',
    'components/input-code/index',
    'modules/goods/v1/components/goods-select-dialog'], 
    function (
        cascaderGoodsClass,
        InputCode,
        GoodsSelectDialog
    ) {
    'use strict';

    return {
        name: 'SalePromotionBase',

        components: {
            CascaderGoodsClass: cascaderGoodsClass,
            GoodsSelectDialog:GoodsSelectDialog,
            InputCode : InputCode
        },

        data: function () {
            var self = this;

            return {
                formData: {
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
                    GoodsList: ''
                },

                ChannelList : [
                    {
                        ID:'6719D05B-F3F2-4F90-84F2-25657CF1F6ED',
                        Name:'本店'
                    }
                ],
                moreSettingChecked:false,
                WeekDay :[],

                GoodsRange:[],

                GoodsClassList:[],

                GoodsType:[{
                    label:'零售商品',
                    value:'Normal',
                }, {
                    label: '计次票',
                    value: 'TicketTimesCount'
                }, {
                    label: '期限票',
                    value: 'TicketTermRule'
                }, {
                    label: '虚拟货币',
                    value: 'VirtualCurrency'
                }],
                GoodsTypeList:[],

                goodsSelectDialogVisible:false,
                CustomList:[],

                rules: {
                    Name: [
                        { required: true, message: '请填写方案名称', trigger: 'blur' }
                    ],
                    Number: [
                        { required: true, message: '请填写方案编号', trigger: 'blur' }
                    ],
                    StartTime: [
                        {  required: true, message: '请填写时间范围', trigger: 'change' }
                    ],
                    /*ChannelList : [
                        {type: 'array', required: true, message: '请至少选择一个适用渠道', trigger: 'change'}
                    ],*/
                    RuleType : [
                        { required: true, message: '请选择折扣规则', trigger: 'blur' }
                    ],                    
                    GoodsRange : [
                        { required: true, message: '请选择商品范围', trigger: 'change' }
                    ]
                }
            };
        },

        props : {
            data : Object,
            incomingData : ''
        },


        watch:{
            'formData.Discount':function(val){
                var self = this;
                _.forEach(this.CustomList,function(item){
                  self.$set(item,'Discount', val);//  item.Discount = val;
                });
            },
            'data' : function(val){
                this.formData = _.extend({}, val);
            },
            'formData.RuleType' : function(val){
                if(val == 'EveryGoods'){
                    this.GoodsRange = [{
                        'label':'按商品分类',
                        'value':'GoodsClass'
                    },{
                        'label':'按商品类型',
                        'value':'GoodsType'
                    },{
                        'label':'自定义选择',
                        'value':'Custom'
                    }];
                }else if(val == 'UnifieDiscounts'){
                    this.GoodsRange = [{
                        'label':'全部商品参与',
                        'value':'AllGoods'
                    },{
                        'label':'按商品分类',
                        'value':'GoodsClass'
                    },{
                        'label':'按商品类型',
                        'value':'GoodsType'
                    },{
                        'label':'自定义选择',
                        'value':'Custom'
                    }];
                }
                else if(val == 'SpecialOffer'){
                    this.GoodsRange = [{
                        'label':'自定义选择',
                        'value':'Custom'
                    }];
                }else{
                    this.GoodsRange = [];
                }
            }
        },

        created : function(){
            var self = this;
            var unwatchGoodList = this.$watch('formData.GoodsList', function (val) {
                if (val == undefined) return;
                // 如果是新增方案就不执行, 如果是编辑方案, 就执行
                if (!self.data.Number) {
                    unwatchGoodList();
                    return;
                }

                _.forEach(self.formData.GoodsList, function(item){
                    if(self.formData.GoodsRange == 'GoodsClass'){
                        const classId = item.ParamID.split(',')

                        self.GoodsClassList.push({
                            ClassID : classId,
                            Discount : item.Param,
                        });
                    }else if(self.formData.GoodsRange == 'GoodsType'){
                        self.GoodsTypeList.push({
                            GoodsType : item.ParamEnum,
                            Discount : item.Param
                        });
                    }else if(self.formData.GoodsRange == 'Custom'){
                        if( self.formData.RuleType == 'SpecialOffer' ){
                            self.CustomList.push({
                                Name : item.Name,
                                Price : item.GoodsPrice,
                                DiscountPrice : item.Param
                            });
                        }
                        else{
                            self.CustomList.push({
                                Name : item.Name,
                                Price : item.GoodsPrice,
                                Discount : item.Param,
                                DiscountPrice : 0
                            });
                        }

                    }
                });

                unwatchGoodList();
            });
        },

        computed: {
            salePromotionId : {
                get : function(){
                    return undefined;
                }
            },
            Time: {
                get: function () {
                    if (this.formData.StartTime) {
                        return [this.formData.StartTime, this.formData.EndTime]; 
                    } else {
                        return [new Date(), new Date()]
                    }
                    
                },

                set: function (val) {
                    val = val || [];

                    this.formData.StartTime = val[0] || null;
                    this.formData.EndTime = val[1] || null;
                }
            },

            WeekDayChecked:{
                get:function(){
                    return this.formData.CanUseDays != 0;
                },
                set:function(val){
                    if(val){
                        this.WeekDay = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
                        this.formData.CanUseDays = this.convertWeekToInt(this.WeekDay);
                    }
                    else{
                        this.WeekDay = [];
                        this.formData.CanUseDays = 0;
                    }
                }
            },
            TimeSlot:{
                get:function(){
                    return [this.formData.StartTimeSlot,this.formData.EndTimeSlot];
                },
                set:function(val){
                    val = val || [];

                    this.formData.StartTimeSlot = val[0] || null;
                    this.formData.EndTimeSlot = val[1] || null;
                }
            },
            TimeSlotChecked:{
                get:function(){
                    return Boolean(this.formData.StartTimeSlot) && Boolean(this.formData.EndTimeSlot);
                },
                set:function(val){
                    if(val){
                        this.formData.StartTimeSlot = new Date(0, 0, 0, 8, 0);
                        this.formData.EndTimeSlot = new Date(0, 0, 0, 18, 0);
                    }
                    else{
                        this.formData.StartTimeSlot = null;
                        this.formData.EndTimeSlot = null;
                    }
                }
            }
        },

        methods: {
            validate: function () {
                return this.$refs.form.validate();
            },

            convertWeekToInt:function(weekday){
                //'Mon','Tue','Wed','Thu','Fri','Sat','Sun'
                var weekMap = {
                    'Mon':0x1,
                    'Tue':0x2,
                    'Wed':0x4,
                    'Thu':0x8,
                    'Fri':0x10,
                    'Sat':0x20,
                    'Sun':0x40
                };
                var res = 0;
                weekday.forEach(element => {
                    res += weekMap[element];
                });
                return res;
            },

            InitDataList : function(){
                this.formData.GoodsRange = '';
                this.CustomList = [];
                this.GoodsClassList = [];
                this.GoodsTypeList = [];
            },

            handleChangeRuleType: function(){
                this.InitDataList();
            },

            getData: function () {
                var self = this;
                self.formData.GoodsList = [];
                
                if(self.formData.GoodsRange == 'GoodsClass'){
                    _.forEach(self.GoodsClassList, function(item){
                        self.formData.GoodsList.push({
                            Param : item.Discount,
                            ParamID : item.ClassID[item.ClassID.length - 1]
                        });
                    });
                }else if(self.formData.GoodsRange == 'GoodsType'){
                    _.forEach(self.GoodsTypeList, function(item){
                        self.formData.GoodsList.push({
                            Param : item.Discount,
                            ParamEnum : item.GoodsType
                        });
                    });
                }else if (self.formData.GoodsRange == 'Custom') {
                    if (self.formData.RuleType == 'SpecialOffer') {

                        _.forEach(self.CustomList, function(item){
                            self.formData.GoodsList.push({
                                Param : item.DiscountPrice,
                                ParamID : item.GoodsID
                            });
                        });
                    } else {
                        _.forEach(self.CustomList, function(item){
                            self.formData.GoodsList.push({
                                Param : item.Discount,
                                ParamID : item.GoodsID
                            });
                        });
                    }
                }

                return _.extend({}, this.formData);
            },

            handleCheckedWeekDayChange:function(){
                this.formData.CanUseDays = this.convertWeekToInt(this.WeekDay);
            },

            handleAddGoodsType:function(){
                this.GoodsTypeList.push({
                    GoodsType: 'Normal',
                    Discount:0
                });
            },

            handleDeleteGoodsType:function(index){
                this.GoodsTypeList.splice(index,1);
            },

            handleAddGoodsClass: function(){
                this.GoodsClassList.push({
                    ClassID:[],
                    Name:'',
                    Discount:0
                });
            },

            handleDeleteGoodsClass:function(index){
                this.GoodsClassList.splice(index,1);
            },

            handleAddCustom:function(){
                this.goodsSelectDialogVisible = true;
            },

            handleDeleteCustom:function(index){
                this.CustomList.splice(index,1);
            },


            addGoods:function(val){
                var self = this;

                _.forEach(val, function (item) {
                    self.CustomList.push(
                        _.extend({},item,{
                            Discount : 0,
                            DiscountPrice : 0
                        }));
                });
            }
        },

        template: `
            <div>

                <goods-select-dialog 
                    ref="goodsSelect"
                    :visible.sync="goodsSelectDialogVisible"
                    @submit="addGoods">
                </goods-select-dialog>

                <side-bar-form 
                    ref="form"
                    :model="formData"
                    :rules="rules">
                    <ych-sidebar-layout title="方案信息">

                    <el-form-item prop="Number" label="商品编号">
                        <input-code 
                            v-model="formData.Number"
                            type="Number"
                            :disabled="Boolean(incomingData.id)"
                            :get-code="!Boolean(incomingData.id)">
                        </input-code>
                    </el-form-item>

                        <el-form-item prop="Name" label="方案名称">
                            <el-input v-model="formData.Name">
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="ChannelList" label="适用渠道">
                            <el-select v-model="formData.ChannelList" :multiple='true'>
                                <el-option
                                    v-for="item in ChannelList"
                                    :key="item.ID"
                                    :label="item.Name"
                                    :value="item.ID">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </ych-sidebar-layout>

                    <ych-sidebar-layout title="有效期">

                    <ych-form-item  
                        label="时间范围" prop='StartTime'>
                        <el-date-picker 
                            v-model="Time"
                            type="daterange">
                        </el-date-picker>
                    </ych-form-item >

                    <el-row :gutter='38'>
                        <el-col :span="3">
                            &nbsp;
                        </el-col>
                        <el-col :span="21">
                            <el-row>
                                <el-form-item>
                                <el-checkbox v-model='moreSettingChecked'>更多设置</el-checkbox>
                                </el-form-item>
                            </el-row>
                            <el-row v-if='moreSettingChecked'>
                                <el-col :span='5'>
                                <el-form-item >
                                    <el-checkbox 
                                        v-model='WeekDayChecked'>
                                        可使用星期：
                                    </el-checkbox>
                                    </el-form-item>
                                </el-col>
                                <el-col :span='19'>
                                    <el-checkbox-group 
                                        v-model="WeekDay"  
                                        @change='handleCheckedWeekDayChange'>

                                        <el-row>
                                            <el-checkbox label="Mon">周一</el-checkbox>
                                            <el-checkbox label="Tue">周二</el-checkbox>
                                            <el-checkbox label="Wed">周三</el-checkbox>
                                            <el-checkbox label="Thu">周四</el-checkbox>
                                        </el-row>
                                        <el-row>
                                            <el-checkbox label="Fri">周五</el-checkbox>
                                            <el-checkbox label="Sat">周六</el-checkbox>
                                            <el-checkbox label="Sun">周日</el-checkbox>
                                        </el-row>

                                    </el-checkbox-group>
                                </el-col>
                            </el-row>
                            <el-row  v-if='moreSettingChecked'>
                                <el-col :span='5'>
                                <el-form-item>
                                    <el-checkbox v-model='TimeSlotChecked'>可使用时段：</el-checkbox>
                                    </el-form-item>
                                </el-col>
                                <el-col  :span='19'>
                                    <el-form-item>
                                        <el-time-picker
                                            is-range
                                            v-model="TimeSlot"
                                            placeholder="选择时间范围">
                                        </el-time-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                                

                    </ych-sidebar-layout>

                    <ych-sidebar-layout title="折扣规则" >
                        <ych-form-item label='折扣规则' prop='RuleType' double>
                            <el-row>
                                <el-radio 
                                    v-model="formData.RuleType" 
                                    label="EveryGoods"
                                    @change='handleChangeRuleType()'>
                                    每种活动商品设置不同折扣比例
                                </el-radio>
                            </el-row>
                                <el-row>
                                    <el-col :span='11'>
                                        <el-radio 
                                            v-model="formData.RuleType" 
                                            label="UnifieDiscounts"
                                            @change='handleChangeRuleType()'>
                                            所有活动商品设置统一折扣比例
                                        </el-radio>
                                    </el-col>
                                    <el-col 
                                        v-if='formData.RuleType=="UnifieDiscounts"'  
                                        :span='3'>
                                        <el-input-number 
                                            :controls='false'
                                            :min='0'
                                            :max='100'
                                            v-model="formData.Discount">
                                        </el-input-number>
                                    </el-col>
                                    <el-col :span='3' v-if='formData.RuleType=="UnifieDiscounts"' >
                                        %
                                    </el-col>
                                </el-row>
                            <el-row>
                                <el-radio 
                                    v-model="formData.RuleType" 
                                    label="SpecialOffer"
                                    @change='handleChangeRuleType()'>
                                    活动商品直接特价销售
                                </el-radio>
                             </el-row>
                        </ych-form-item>
                    </ych-sidebar-layout>

                    <ych-sidebar-layout title="活动商品">
                        <el-form-item prop='GoodsRange' label='商品范围'>
                            <el-select v-model='formData.GoodsRange'>
                                <el-option
                                    v-for="item in GoodsRange"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <template  v-if='formData.GoodsRange=="GoodsClass"'>

                            <el-table :data='GoodsClassList'>
                            
                                <el-table-column
                                    prop="ClassID"
                                    label="商品分类">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <cascader-goods-class  
                                                v-model="scope.row.ClassID">
                                            </cascader-goods-class>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="Discount"
                                    label="折扣比例（%）">

                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <span v-if='formData.RuleType == "UnifieDiscounts"'>{{formData.Discount}}</span>
                                            <ych-input-number   
                                                v-if='formData.RuleType != "UnifieDiscounts"'
                                                :percentage='true'
                                                v-model="scope.row.Discount">

                                            </ych-input-number>
                                        </el-form-item>
                                    </template>
                                    
                                </el-table-column>
                                <el-table-column
                                    fixed="right"
                                    label="操作"
                                    width="100">
                                    <template slot-scope="scope">
                                        <el-form-item>
                                            <el-button @click="handleDeleteGoodsClass(scope.$index)" type="text" size="small">删除</el-button>
                                        </el-form-item>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <el-button @click="handleAddGoodsClass" type="text" size="small">添加行</el-button>
                        </template>

                        <template  v-if='formData.GoodsRange==="GoodsType"'>
                        <el-table :data='GoodsTypeList'>
                            <el-table-column
                                prop="date"
                                label="商品类型">

                                <template slot-scope="scope">
                                    <el-form-item>
                                        <el-select v-model='scope.row.GoodsType'>  
                                            <el-option
                                                v-for="item in GoodsType"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </template>

                            </el-table-column>
                            <el-table-column
                                prop="date"
                                label="折扣比例 %">

                                <template slot-scope="scope">
                                    <el-form-item>
                                        <span v-if='formData.RuleType == "UnifieDiscounts"'>{{formData.Discount}}</span>
                                        <ych-input-number 
                                            v-if='formData.RuleType != "UnifieDiscounts"'
                                            :percentage='true'
                                            v-model="scope.row.Discount">
                                        </ych-input-number>
                                    </el-form-item>
                                </template>

                            </el-table-column>
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <el-button @click="handleDeleteGoodsType(scope.$index)" type="text" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-button @click="handleAddGoodsType()" type="text" size="small">添加行</el-button>
                        </template>

                        <template v-if='formData.GoodsRange=="Custom"'>
                            <el-table :data='CustomList'>
                                <el-table-column
                                    prop="Name"
                                    label="商品名称">
                                </el-table-column>
                                <el-table-column
                                    prop="Kind"
                                    label="商品类型">
                                </el-table-column>
                                <el-table-column
                                    prop="Price"
                                    label="当前售价">
                                </el-table-column>

                            <el-table-column
                                label="折扣比例 %" v-if='formData.RuleType!="SpecialOffer"'>
                                <template  slot-scope="scope">
                                    <span  v-if='formData.RuleType=="UnifieDiscounts"'>{{formData.Discount}}</span>

                                    <span  v-if='formData.RuleType=="EveryGoods"'>
                                        <el-form-item>
                                            <ych-input-number 
                                                :percentage='true'
                                                v-model='scope.row.Discount'>
                                            </ych-input-number>
                                        </el-form-item>
                                    </span>                                    

                                </template>
                            </el-table-column>

                            <el-table-column
                                label="折后售价">
                                <template  slot-scope="scope">
                                    <span  v-if='formData.RuleType=="UnifieDiscounts"'>
                                        {{ scope.row.Price * formData.Discount / 100}}
                                    </span>
                                    <span  v-if='formData.RuleType=="SpecialOffer"'>
                                        <el-form-item>
                                            <el-input-number 
                                                :controls='false'
                                                v-model='scope.row.DiscountPrice'>
                                            </el-input-number>
                                        </el-form-item>
                                    </span>
                                </template>
                            </el-table-column>

                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="100">
                                <template slot-scope="scope">
                                    <el-button @click="handleDeleteCustom(scope.$index)" type="text" size="small">删除</el-button>
                                </template>
                            </el-table-column>
                            </el-table>
                            <el-button @click="handleAddCustom()" type="text" size="small">从商品列表添加</el-button>
                        </template>

                    </ych-sidebar-layout>
                </side-bar-form>

            </div>
        `
    }
});