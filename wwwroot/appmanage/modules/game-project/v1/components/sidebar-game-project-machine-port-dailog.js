define([
    'mixins/pagination',
    'api/game-project/v1/GameProjectPort',
], function(
    pagination,
    gameProjectPort
) {
    'use strict';   
    return {
        name: 'gameProjectMachinePortDailogDialog',
        mixins: [pagination],
        props:['visible','selectedPort','dailogTitle','formDataBases','showDelete'],
        created: function () {
            this.asyncGetPortFlagList();
        },
        data: function () {
            var self = this;
            var validateReturn = function (rule, value, callback) {
                if (self.formData.Num=="") {
                    return callback('请选择P位编号');
                }
                self.formDataBases.PortData.forEach(item=>{
                    if(self.formData.Num==item.Num &&  self.formData.ID!=item.ID){
                        return callback(self.formData.Num+'-P位编号已设置');
                    }                 
                 });

                callback();
            };
            var validatePortFlagReturn=function(rule, value, callback){
                if (self.formData.PortFlag=="") {
                    return callback('请选择卡头标识');
                }     
                self.portFlagList.forEach(item=>{              
                    if(item.PortFlag==self.formData.PortFlag&&item.IsBinding  ){
                        return callback(self.formData.PortFlag+'-卡头标识已被其它项目使用');
                    }
                 });
                self.formDataBases.PortData.forEach(item=>{          
                    if(item.PortFlag==self.formData.PortFlag &&  self.formData.ID!=item.ID ){
                        return callback(self.formData.PortFlag+'-卡头标识已设置');
                    }
                 });

                callback();
            };
            return {
                ability:false,
                portNumPList:[
                    {
                        label:'1P',
                        value:'1P'
                    },{
                        label:'2P',
                        value:'2P'
                    },{
                        label:'3P',
                        value:'3P'
                    },
                    {
                        label:'4P',
                        value:'4P'
                    },
                    {
                        label:'5P',
                        value:'5P'
                    }
                ],
                portNumList:[
                  {
                        label:'入口1',
                        value:'入口1'
                    },  {
                        label:'出口1',
                        value:'出口1'
                    },
                    {
                        label:'入口2',
                        value:'入口2'
                    },{
                        label:'出口2',
                        value:'出口2'
                    }
                ],      
                portFlagList:[],
               formData:{             
                    ID: '',
                    Num: '',
                    PortFlag:'',
                    IsInverse:false,
                    IsEnable:true,
                    PortType:''
               },
               formDataBack:{             
                ID: '',
                Num: '',
                PortFlag:'',
                IsInverse:false,
                IsEnable:true,
                PortType:''
               },
               rules:{
                  Num:[
                    {required: true,  validator: validateReturn, trigger: 'blur' }
                ],
                PortFlag:[{
                    required: true,  validator: validatePortFlagReturn, trigger: 'blur' 
                }]


               },
            };
        },

        watch: {
            visible:{               
                immediate: true,
                deep: true,
                handler: function(val,oldVal){ 

                }             
            },
            'dailogTitle':function(val)
            {
                this.dailogTitle=val;
                if(val.indexOf("出入口")!=-1){                  
                    this.ability=true;
                }else{
                    this.ability=false; 
                }
                         
            },
            selectedPort: {               
                immediate: true,
                deep: true,
                handler: function(val,oldVal){                
                    //this.formData=this.selectedPort;
                    _.assign(this.formData, val);
                   
                }          
            },
            formDataBases: {               
                immediate: true,
                deep: true,
                handler: function(val,oldVal){                
                    if(this.formDataBases.Ability=="Gate"){                  
                        this.ability=true;
                    }else{
                        this.ability=false;
                    }    
                }
            },
            showDelete:{
                immediate: true,
                deep: true,
                handler: function(val,oldVal){                                  
                }
            },                     
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
            //数据校验
            validate: function () {

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.handleSubmitForm();
                    } else {             
                      return false;
                    }
                  });             
            },
            //获取p位下拉数据
            asyncGetPortFlagList:function(){
                var self = this;                     
                gameProjectPort.GetPortIDList()
                    .then(function (res) {                       
                       self.portFlagList=res.Data;
                    });
            },
            //
            handleSelectedData: function () {
               var self=this;
                self.validate();
            },
            //p位保存事件
            handleSubmitForm(){
                var self=this;
                self.portFlagList.forEach(item=>{

                    if(self.formData.PortFlag==item.PortFlag){
                        self.formData.ID=item.ID;
                    }
                });
                  _.assign(self.formDataBack, self.formData);
                

                 self.localVisible = false;               
                 self.$emit('submit', self.formDataBack);
            },
            //p位删除事件
            handleDelData:function(){
                var self=this;
              //  if(self.formData.ID.length>10){                
             //   self.handleDelOldData();
             //   }else{                
                self.handleDelNewData();
            //    }
                       
            },
            handleDelOldData:function(){
                var self=this;
                this.$confirm('确定删除？', '提示', 
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
                ).then(function () {

                    var port=self.formData;
                    var data={
                        ID:port.ID
                        };

                    gameProjectPort.Unbundling(data)
                    .then(function () {
                        self.$message({
                            message: '游乐项目端口删除成功！',
                            type: 'success'
                        });  

                        var port=self.selectedPort;
                        var portList=[];
        
                        self.formDataBases.PortData.forEach(item=>{
                            if(item.Num!=port.Num){
                                portList.push(item);
                            }                          
                         });
                        self.formDataBases.PortData=portList;
                        self.localVisible = false;
                        self.$emit('delete',  self.formDataBases);  
                                                  
                    }, function () {
                       // self.localVisible = true;
                       // reject();                   
                    })
                    .catch(function(){
    
                    });

                  
                },function(){
                   // self.localVisible = true;
                }).catch(function () 
                    {
                        self.localVisible = false;
                    }
                );
            },
            handleDelNewData:function(){
                var self=this;
                this.$confirm('确定删除？', '提示', 
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
                ).then(function () {
                    var port=self.selectedPort;
                    var portList=[];
    
                    self.formDataBases.PortData.forEach(item=>{
                        if(item.Num!=port.Num){
                            portList.push(item);
                        }
                        
                     });
                    self.formDataBases.PortData=portList;
                    self.localVisible = false;
                    self.$emit('delete',  self.formDataBases);                    
                },function(){
                   // self.localVisible = true;
                }
                ).catch(function () 
                    {
                        self.localVisible = false;
                    }
                );
            },
            //弹出框关闭事件
            handlecolse:function(){        
                this.Visible = false
                this.localVisible = false;
                this.$refs.form.resetFields(); 
                this.formData={             
                    ID: '',
                    Num: '',
                    PortFlag:'',
                    IsInverse:false,
                    IsEnable:true,
                    PortType:''
               };
            }

        },
        

        template: `
            <el-dialog              
                @close="handlecolse"
                :lock-scroll="false"
                :modal-append-to-body="false"
                :title="dailogTitle"
                :visible.sync="localVisible"
                width="33%">
                    <side-bar-form
                        :model="formData"
                        :rules="rules"
                        ref="form">

                        <div  style="text-align:center;display: block;width: 100%;
                        height:100%;padding-top:20px;">

      
                        <ych-form-item 
                            prop="Num" 
                            label="P位编号">
                            <el-select 
                                v-model="formData.Num" 
                                placeholder="请选择">
                                    <el-option
                                        v-if="ability==false"
                                        v-for="item in portNumPList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                    <el-option
                                        v-if="ability==true"
                                        v-for="item in portNumList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                            </el-select>
                        </ych-form-item>

                
                        <ych-form-item 
                            prop="PortFlag" 
                            label="卡头标识" 
                            tips="在卡头开机时会显示在屏幕上">             
                                 <el-select 
                                    v-model="formData.PortFlag" 
                                    placeholder="请选择">
                                        <el-option                                        
                                            v-for="item in portFlagList"
                                            :key="item.ID"
                                            :label="item.PortFlag"
                                            :value="item.PortFlag">
                                        </el-option>           
                                </el-select>
                        </ych-form-item>                    
                      

                       <ych-form-item 
                            prop="IsEnable" 
                            label="是否启用" 
                            >
                                    <el-radio-group
                                        style="float:left;" 
                                        v-model="formData.IsEnable" 
                                        size="mini">
                                        <el-radio-button :label="true" border>启用</el-radio-button>
                                        <el-radio-button :label="false" border>禁用</el-radio-button>
                                    </el-radio-group>
                       </ych-form-item>
                      
                       <ych-form-item                          
                            prop="IsInverse" 
                            label=" " >
                                <el-checkbox 
                                v-model="formData.IsInverse"
                                style="float:left;">卡头倒置</el-checkbox>      
                       </ych-form-item>

                       </div>

                    </side-bar-form>
                    <span slot="footer">                 
                        <div 
                            style="display:inherit;margin-right:10px;float:left;" 
                            v-show='showDelete==true'>
                                    <ych-button    
                                    type="primary" 
                                    @click="handleDelData">
                                    删 除
                                    </ych-button>
                        </div>                   
                        <ych-button 
                            @click="handlecolse">
                            取 消
                        </ych-button>
                        <ych-button 
                            type="primary" 
                            @click="handleSelectedData">
                            确 定
                        </ych-button>
                    </span>
            </el-dialog>
        `
    }
});