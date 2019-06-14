define([
    'api/member/v1/MemberLevel'
], function(memberService) {
    'use strict';
    
    return {
        name: 'TransferMember',

        props: {
            value: {
                type: Array,
                required: true
            }
        },

        created: function () {
            this.asyncGetMemberLevel();
        },

        data: function () {
            return {
                data: []
            };
        },

        computed: {
            localValue : {
                get : function(){
                    return this.value;
                },
                set : function(val){
                    this.$emit('input',val);
                }
            }
        },

        methods: {
            asyncGetMemberLevel: function () {
                var self = this;
                memberService.GetMemberLevelTree().then(function (data) {
                    self.data = data.Data;
                });
            }
        },

        template: `
            <el-transfer
                v-model="localValue"
                filterable
                :props="{
                    key: 'ID',
                    label: 'Name'
                }"
                :titles="['会员级别', '已选列表']"
                :button-texts="['删除', '添加']"
                :data="data">
            </el-transfer>
        `
    }
});