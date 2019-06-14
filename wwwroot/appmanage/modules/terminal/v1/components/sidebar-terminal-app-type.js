define([
    'framework/api/terminal/v1/TerminalAPPType',
    'framework/mixins/sidebar-form',
    'components/input-code/index'
],function(
    terminalAppType,
    sidebarForm,
    inputCode
){
    'use strict';

    return{

        name:'SidebarTerminalAppType',

        mixins:[sidebarForm],

        data:function(){
            return{
                formData:{
                    TypeNum:'',
                    TypeName:''
                }
            };
        },

        components: {
            InputCode: inputCode
        },

        created:function(){
            var self = this;
            self.incomingData.ID && self.asyncGetTerminalAppType();
        },

        methods:{
            asyncGetTerminalAppType:function(){
                var self = this;
                terminalAppType
                    .GetByID({ID: self.incomingData.ID})
                    .then(function(data){
                        _.extend(self.formData,
                            {
                                TypeNum: data.TypeNum,
                                TypeName: data.TypeName
                            });
                    });
            },

            save:function(){
                var self = this;
                var submitData = self.formData;

                return new Promise(function(resolve,reject){
                    var saveFn = self.incomingData.ID?
                        self.editTerminalAppType(submitData)
                        :self.addTerminalAppType(submitData);

                    saveFn
                        .then(function(){
                            resolve(submitData);
                        },function(){
                            reject();
                        });
                });
            },

            addTerminalAppType:function(data){
                return terminalAppType.Create(data);
            },

            editTerminalAppType:function(data){
                var submitData = _.extend({ID: this.incomingData.ID},data)
                return terminalAppType.Edit(submitData);
            }
        },

        template:`
            <div>
            <side-bar-form
                    :model="formData"
                    :rules="rules"
                    :inline="false"
                    label-width="10em">

                <ych-sidebar-layout 
                    title="">
                    <ych-form-item
                        prop="TypeNum" 
                        label="终端应用类型编号:">
                            <input-code 
                                v-model="formData.TypeNum"
                                type="terminal-app-type"
                                :get-code="!Boolean(incomingData.ID)"
                                disabled>
                            </input-code>
                    </ych-form-item>

                    <ych-form-item
                        prop="TypeName" 
                        label="终端应用类型名称:">
                            <el-input 
                                v-model="formData.TypeName">
                            </el-input>
                    </ych-form-item>
                </ych-sidebar-layout>
            </side-bar-form>
            </div>
        `
    }
});