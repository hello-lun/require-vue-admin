define([
    'framework/api/terminal/v1/TerminalAPPType'
],function(
    terminalAppType
){
    'use strict';

    return{
        name:'SelectTerminlAppType',

        props:{
            value: ''
        },

        data:function(){
            return{
                list:[]
            }
        },

        created:function(){
            this.asyncGetTerminalAppTypes();
        },

        methods:{
            asyncGetTerminalAppTypes:function(){
                var self = this;
                terminalAppType
                    .GetAll()
                    .then(function(data){
                        self.list = data.Data;
                    });
            }
        },

        computed:{
            localValue:{
                get: function(){
                    return this.value;
                },
                set: function(val){
                    return this.$emit('input',val);
                }
            }
        },

        template:`
            <el-select v-model="localValue" clearable placeholder="请选择">
                <el-option
                    v-for="item in list"
                    :key="item.TypeNum"
                    :label="item.TypeName"
                    :value="item.ID">
                </el-option>
            </el-select>
        `
    }
})