define([
    'framework/api/terminal/v1/TerminalType',
    'framework/mixins/sidebar-form',
    'components/input-code/index'
],function(
    terminalType,
    sidebarForm,
    inputCode
){
    'use strict';

    return{

        name:'SidebarTerminalType',

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
            self.incomingData.ID && self.asyncGetTerminalType();
        },

        methods:{
            asyncGetTerminalType:function(){
                var self = this;
                terminalType
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
                        self.editTerminalType(submitData)
                        :self.addTerminalType(submitData);

                    saveFn
                        .then(function(){
                            resolve(submitData);
                        },function(){
                            reject();
                        });
                });
            },

            addTerminalType:function(data){
                return terminalType.CreateTerminalType(data);
            },

            editTerminalType:function(data){
                var submitData = _.extend({ID: this.incomingData.ID},data)
                return terminalType.EditTerminalType(submitData);
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
                        label="终端类型编号:">
                            <input-code 
                                v-model="formData.TypeNum"
                                type="terminal-type"
                                :get-code="!Boolean(incomingData.ID)"
                                disabled>
                            </input-code>
                    </ych-form-item>

                    <ych-form-item
                        prop="TypeName" 
                        label="终端类型名称:">
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