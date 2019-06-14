define([
    'framework/mixins/sidebar-form',
    'api/ticket/v1/Ticket',
], function(
    sideBarForm,
    gameProjectTicketList,

) {
    'use strict';

    return {
        name: 'SidebarGameProjectTicketList',
        props:['formDataBase'],
        mixins: [sideBarForm],
        components: {

        },
        created: function () {
             this.asyncGetGameProjectTicketList();       
        },
        data: function () {
            return {
                ticketList:[],    
                ticketCount:0,         
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
                            var self=this;                       
                            self.formData=newval;
                                    
                        } else {
                        }
                       
                    }
                },
         },
        methods: {
            //根据ID获取票绑定项目详情  
            asyncGetGameProjectTicketList: function ()
            {
                
                    var self = this;
                    if(self.formDataBase.ID!=null&&self.formDataBase.ID!=""&&self.formDataBase.ID!=undefined){                  
                        gameProjectTicketList.SearchByMachine({ MachineID: self.formDataBase.ID })
                            .then(function (res) {
                            var list=res.Data;

                            list.forEach(item=>{  
                                var model={
                                    TicketType:'',
                                    TicketName:''
                                };        
                                if(item.TicketType=="TimesCount"){
                                    model.TicketType="计次票";
                                }else if(item.TicketType=="Time"){
                                    model.TicketType="计时票";
                                }else if(item.TicketType=="Term"){
                                    model.TicketType="期限票";
                                }
                                item.Data.forEach(temp=>{
                                    model.TicketName=model.TicketName+temp+"        ";
                                    self.ticketCount=self.ticketCount+1;
                                });
                                    self.ticketList.push(model);
                            });
                            
                        });
                    }
                    
            },

           
        },

        template: `
            <div>
  
                <side-bar-form
                    :model="formData"
                    :rules="rules">
                    
                        <el-row>
                            <el-form-item prop="ticketCount" label="可用套票数量">
                            {{ticketCount}}
                            </el-form-item>
                        </el-row>

                        <el-row>
                            <el-col 
                                :span="24"
                                v-for="item in ticketList"
                                :key="item.TicketType"
                                style="margin-bottom:10px">
                                    <div style="background: #e5e9f2">
                                        <el-col :span="4" >
                                            <el-alert
                                            :title="item.TicketType"                                                 
                                            type="info"
                                            close-text=""
                                            :closable="false">
                                            </el-alert>
                                        </el-col>
                                        <el-col :span="20">
                                            <el-alert
                                            :title="item.TicketName"                                                 
                                            type="info"
                                            close-text=""
                                            :closable="false">
                                            </el-alert>
                                        </el-col>
                                    </div>
                            </el-col>                     
                        </el-row>    
                                                    
                </side-bar-form>

            </div>
        `
    }
});