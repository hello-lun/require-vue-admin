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
        props:['visible','GamePeojectPort'],
        created: function () {           
            this.asyncGetPortFlagList();
        },
        data: function () {
            var self = this;
            var validateReturn = function (rule, value, callback) {
                if (self.formData.Num=="") {
                    return callback('请选择P位编号');
                }
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
                callback();
            };
            return {             
                portNumList:[
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
                    },
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
            GamePeojectPort:{
                immediate: true,
                deep: true,
                handler: function(newval,oldVal){ 
                    if (newval) {
                        _.assign(this.formData,newval);                     
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
            },
          

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
                        res.Data.forEach(item=>{
                            if(!item.IsBinding){
                                self.portFlagList.push(res.Data);
                            }
                        });          
                       //self.portIDList=res.Data;
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
                var item=self.formData;
                if(item.Num=="1P"||item.Num=="2P"||item.Num=="3P"||item.Num=="4P"||item.Num=="5P")
                {
                    item.PortType="GamePlyer";
                }
                else if(item.Num=="入口1" ||item.Num=="入口2"){
                    item.PortType="GateIn";
                }
                else if(item.Num=="出口1" ||item.Num=="出口2"){
                    item.PortType="GateOut";
                }else{
                    item.PortType="Auto";
                }
                gameProjectPort.EditPort(item)
                .then(function () {
                    self.$message({
                        message: '端口编辑成功！',
                        type: 'success'
                    });  
                    self.localVisible = false;               
                    self.$emit('submit');                      
                }, function () {
                   // reject();                   
                })
                .catch(function(){

                });
            
            },
            //p位删除事件
            handleDelData:function(){
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
                        self.localVisible = false;
                        self.$emit('delete');                            
                    }, function () {
                       // reject();                   
                    })
                    .catch(function(){
    
                    });

                                 
                  },function(){
                    self.localVisible =true;
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
                       
            }

        },
        

        template: `
            <el-dialog              
                @close="handlecolse"
                :lock-scroll="false"
                :modal-append-to-body="false"
                title="端口编辑"
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
                               disabled 
                                v-model="formData.Num" 
                                placeholder="请选择">               
                                    <el-option
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
                            style="display:inherit;margin-right:10px;float:left;" >
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