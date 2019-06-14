define(['framework/components/transfer-member/index'
], function(transferMember
)  {
    'use strict';
    
    return {
        name: 'MemberSelectDialog',

        mixins: [],

        components: {
            TransferMember: transferMember
        },

        props: {
            value : {
                type : Array,
                require : true
            },
            visible: {
                type: Boolean,
                default: false
            }
        },

        created: function () {
            // 初始化分页混合更新方法
            this.initDialog();
        },

        watch: {
            'visible': function (val) {
                if(val){
                    this.initDialog();
                }
            }
        },

        data: function () {
            return {
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
            },

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

            clearData: function () {
            },

            initDialog: function () {
                this.clearData();
            },

            handleSelectedData: function() {
                var selectedRow = _.concat([], this.localValue);

                this.localVisible = false;

                this.$emit('submit', selectedRow);
            }
        },

        template: `
            <el-dialog
                title="添加商品"
                width="930px"
                :modal-append-to-body="false"
                :visible.sync="localVisible">

                <transfer-member v-model='localValue'>
                </transfer-member>

                <span slot="footer">
                    <ych-button 
                        @click="localVisible = false">
                        取 消
                    </ych-button>
                    <ych-button 
                        type="primary" 
                        @click="handleSelectedData()">
                        确 定
                    </ych-button>
                </span>

            </el-dialog>
        `
    }
});