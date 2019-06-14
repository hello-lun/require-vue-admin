define([
    'organization/views/operating-page/jurisdiction-page/index',
    'components/cascader-goods-class/index',
    'incss!organization/views/operating-page/jurisdiction-page/index.css'
    
    
], function(
    jurisdictionPage,
    cascaderGoodsClass,
) {
    'use strict';

    return {
        name:'jurisdiction',
        data:function(){
            return {
                message:'市地税局 ',
                message2:[],
                radio7:'',
                locationName:'',
                allname:[],
                value3:'',
                nodeData:{
                    "ID": "1",
                    "NodeType": "Customer"
                }
                
            }
        },
        props:{
           
        },
        computed:{

        },
        components: {
            CascaderGoodsClass: cascaderGoodsClass,
            jurisdictionPage:jurisdictionPage
        },
        methods:{

        },
        create:function(){
            
        },
        template:`
            <el-container>
                    <ych-report-header>
                        <ych-form-item
                            label="设置范围"
                            prop="message2">
                            <cascader-goods-class 
                                v-model="message2">
                            </cascader-goods-class>
                        </ych-form-item>

                        <ych-form-item
                            label="权限名称"
                            prop="message">
                            <el-input 
                            v-model="message"></el-input>
                        </ych-form-item>

                    </ych-report-header >

                <el-main>
                    <el-row style="">
                        <el-row >
                            <el-col :span="6" >
                            <span >当前修改:名称（部门/岗位/员工）</span>
                            </el-col>
                            <el-col :span="18" >
                                <el-switch
                                    v-model="value3"
                                    active-text="按月付费"
                                    inactive-text="按年付费">
                                </el-switch>

                            </el-col>
                        </el-row>

                        <el-row>
                            <jurisdiction-page
                                style="margin-top:10px;"></jurisdiction-page>
                        </el-row>
                    </el-row>
                </el-main>

                <el-footer>Footer</el-footer>
            </el-container>


                

             

            
        `

    }
});