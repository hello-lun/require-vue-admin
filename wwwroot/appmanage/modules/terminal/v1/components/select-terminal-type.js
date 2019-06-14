define([
    'framework/api/terminal/v1/TerminalType'
],function(
    terminalType
){
    'use strict';

    return{
        name:'SelectTerminlType',

        props:{
            value: '',
            isMultiple: {
                type: Boolean,
                default: false
            }
        },

        data:function(){
            return{
                list:[],
            }
        },

        created:function(){
            this.asyncGetTerminalTypes();
        },

        methods:{
            asyncGetTerminalTypes:function(){
                var self = this;
                terminalType
                    .GetTerminalTypes()
                    .then(function(data){
                        self.list = data.TerminalTypes;
                    });
            },

            setSelectedTypes: function(values){
                this.selected = values;
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
            <el-select v-model="localValue" placeholder="请选择" 
            :multiple=isMultiple :clearable=!isMultiple
            >
                <el-option
                    v-for="item in list"
                    :key="item.ID"
                    :label="item.TypeName"
                    :value="item.ID">
                </el-option>
            </el-select>
        `
    }
})