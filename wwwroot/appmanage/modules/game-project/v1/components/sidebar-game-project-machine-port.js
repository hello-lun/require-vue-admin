define([
    'framework/mixins/sidebar-form',
    'game-project/components/sidebar-game-project-machine-port-dailog',
    'api/game-project/v1/GameProjectPort',
], function(
    sideBarForm,
    gameProjectMachinePortDailog,
    gameProjectPort
) {
    'use strict';

    return {
        name: 'SidebarGameProjectMachinePort',
        props:['formDataBase'],
        mixins: [sideBarForm],

        components: {
            GameProjectMachinePortDailog:gameProjectMachinePortDailog
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
                    }, {
                        label: '删除',
                        key: 'delete'
                    }
                ],
                gameProjectMachinePortDailogVisible: false,
                selectedPort:
                {
                    ID: '',
                    Num: '',
                    PortFlag:'',
                    IsInverse:false,
                    IsEnable:true,
                    PortType:'',
                },                
                dailogTitle:'新增P位',
                formDataBases:null,
                showDelete:false,
                isShowDelete:false,
                formData: {
           
                },
                rules: {
     
                },


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
                       // this.$emit('machine-port-edit', this.formDataBase);                                                
                    } 
                   
                }
            },
        },

        methods: {           
            //编辑
            handleEditPort:function(item){                    
                  var self=this;
                  self.selectedPort={
                    ID: '',
                    Num: '',
                    PortFlag:'',
                    IsInverse:false,
                    IsEnable:true,
                    PortType:''
                  };
               
                  _.assign(self.selectedPort, item);
                    if(self.formDataBase.Ability=="Gate"){
                        self.dailogTitle="编辑出入口";
    
                    }else{
                        self.dailogTitle="编辑P位";
                    }
                    self.formDataBases=self.formDataBase;
                    self.isShowDelete=true;
                    self.showDelete=self.isShowDelete;
                    self.gameProjectMachinePortDailogVisible = true;
                  
            },
            //删除
            handleDeletePort:function(item){
                var self=this;

                this.$confirm('确定删除？', '提示', 
                {
                    confirmButtonText: '删除',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
                ).then(function () {


                    /*************后台删除已存在的********* */
                    /*
                    var port=item;
                    var data={
                        ID:port.ID
                        };

                    gameProjectPort.Unbundling(data)
                    .then(function () {
                        self.$message({
                            message: '删除成功！',
                            type: 'success'
                        });  

                      
                    var port=item;
                    var portList=[];
    
                    self.formDataBase.PortData.forEach(item=>{
                        if(item.Num!=port.Num){
                            portList.push(item);
                        }
                     });
                    self.formDataBase.PortData=portList;
                    self.$emit('machine-port-edit', self.formDataBase);                                                  
                    }, function () {                     
                       // reject();                   
                    })
                    .catch(function(){
    
                    });
                    */
                   /*************后台删除已存在的********* */

                          
                    var port=item;
                    var portList=[];
    
                    self.formDataBase.PortData.forEach(item=>{
                        if(item.Num!=port.Num){
                            portList.push(item);
                        }
                     });
                    self.formDataBase.PortData=portList;
                    self.$emit('machine-port-edit', self.formDataBase);

                }).catch(function () 
                    {
        
                    }
                );
            },
            //新增
            handleAddPort:function(){
                var self=this;
                var index=self.formDataBase.PortData.length;
                var port={                   
                    ID: ''+index+'',
                    Num: '',
                    PortFlag:'',
                    IsInverse:false,
                    IsEnable:true,
                    PortType:'',
                };
                _.assign(self.selectedPort,port);
                if(self.formDataBase.Ability=="Gate"){
                    self.dailogTitle="添加出入口";

                }else{
                    self.dailogTitle="添加P位";
                }
                self.formDataBases=self.formDataBase;
                self.isShowDelete=false;
                self.showDelete=self.isShowDelete;
                self.gameProjectMachinePortDailogVisible = true;
            },
            //保存数组
            addGameProjectMachinePort: function (val) {
                var self = this;
               var  port={
                    ID: '',
                    Num: '',
                    PortFlag:'',
                    IsInverse:false,
                    IsEnable:true,
                    PortType:''
                };
                _.assign(port, val);

                
                if(self.formDataBase.PortData.length==0){
                    self.formDataBase.PortData.push(port);
                 }else{
                    var isExit=false;
                    self.formDataBase.PortData.forEach(item=>{
                        if(port.ID==item.ID){
                            _.assign(item,port);
                            isExit=true;
                        }
                    });
                    if(isExit==false){
                        self.formDataBase.PortData.push(port);
                    }
                }

                self.gameProjectMachinePortDailogVisible = false;
                self.$emit('machine-port-edit', self.formDataBase); 
            },
            //删除
            deleteGameProjectMachinePort:function(val){
                var self = this;
                self.formDataBase=val;         
                self.gameProjectMachinePortDailogVisible = false;
                self.$emit('machine-port-edit', self.formDataBase); 
            }

        },

        template: `
         <div>

             <!----------------------------------编辑Pp位开始----------------------------------->
            <game-project-machine-port-dailog 
                ref="addGameProjectMachinePort"
                :visible.sync="gameProjectMachinePortDailogVisible"
                :selectedPort="selectedPort"
                :dailogTitle='dailogTitle'
                :formDataBases='formDataBase'
                :showDelete='isShowDelete'
                @submit="addGameProjectMachinePort"
                @delete="deleteGameProjectMachinePort">
            </game-project-machine-port-dailog>            
            <!----------------------------------编辑p位结束----------------------------------->

            <!----------------------------------p位设置开始----------------------------------->
             <side-bar-form
                :model="formDataBase"
                :rules="rules">
                                
                        <el-form-item prop="portNum" label="端口数量">
                            {{formDataBase.PortData.length}}
                        </el-form-item>

                        <el-row>
                                      
                                <!----------------------------------p位列表开始----------------------------------->
                                <div 
                                    v-for="item  in formDataBase.PortData" :key="item.ID" 
                                    style="margin-bottom:10px;float:left;margin-right:3px;">
                
                                            <ych-card 
                                                :width="140"
                                                :height="150"
                                                :action-btns-list="actionBtnsList"
                                            
                                                action-btns
                                                mask>                                       
                                                    <span 
                                                        slot="header" 
                                                        style="text-align:left;float:left;color:#666666;padding-left:10px;" 
                                                        v-if="item.IsEnable==true">
                                                        在线
                                                    </span>
                                                    <span 
                                                        slot="header" 
                                                        style="text-align:left;float:left;color: #666666;padding-left:10px;" 
                                                        v-else>
                                                        禁用
                                                    </span>      
                                                    <div style="text-align:center;">
                                                        <div style="text-align:center; font-size:20px; color: #666666;">{{item.Num}}</div>
                                                        <div style="text-align:center;color:#999999;" >标识:{{item.PortFlag}}</div>                           
                                                    </div>
                                
                                                    <span 
                                                        slot="footer" 
                                                        style="text-align:left;float:left;color:#999999;padding-left:10px;" 
                                                        v-show="item.IsInverse==true">
                                                        倒置
                                                    </span>
                                                    <span 
                                                        slot="footer" 
                                                        style="text-align:left;float:left;color:#999999;padding-left:10px;" 
                                                        v-show="item.IsInverse==false">
                                                        &nbsp;&nbsp;
                                                    </span>
                            
                                
                                                    <template slot="mask">
                                                        <el-button size="mini" @click="handleEditPort(item)">
                                                            编辑
                                                        </el-button>
                                                        <el-button size="mini"  @click="handleDeletePort(item)">
                                                            删除
                                                        </el-button>
                                                    </template>
                                            </ych-card>

                                </div>
                                <!----------------------------------p位列表结束----------------------------------->
                                
                                <!----------------------------------添加P位开始----------------------------------->
                                <div style="margin-bottom:10px;;float:left;margin-right:3px;">
                                    <ych-card 
                                    :width="140"
                                    :height="150"
                                    type="add"
                                    @click.native="handleAddPort">
                                    </ych-card>
                                </div> 
                                <!----------------------------------添加p位结束----------------------------------->                           
                            
                       </el-row>
             </side-bar-form>
            <!----------------------------------p位设置结束----------------------------------->

         </div>
              
        `
    }
});