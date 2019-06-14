define([
    'api/pos/v1/Leaguer'
], function(
    leaguer
) {
    'use strict';
    
    return {
        name: 'Leaguer',
        
        data: function () {
            return {
                keyword: null,
                leaguerInfo: {}
            };
        },

        methods: {
            searchLeaguer: function () {
                var self = this;

                leaguer
                    .GetLeaguer({ Number: this.keyword })
                    .then(function (res) {
                        var leaguerList = res.Data || [];

                        self.keyword = null;
                        self.leaguerInfo = leaguerList[0] || {};
                    });
            }
        },

        template: `
            <el-container>
                <el-header>
                    <el-input 
                        placeholder="可搜索商品/手机号/会员号" 
                        v-model="keyword">
                        <el-button 
                            @click="searchLeaguer"
                            slot="append">
                            搜索
                        </el-button>
                    </el-input>
                </el-header>
                <el-main>
                    <el-row :gutter="20">
                        <el-col :span="8">姓名：{{ leaguerInfo.Name }}</el-col>
                        <el-col :span="8">会员号：{{ leaguerInfo.Number }}</el-col>
                        <el-col :span="8">性别：{{ leaguerInfo.Sex }}</el-col>
                        <el-col :span="8">级别：{{ leaguerInfo.LevelName }}</el-col>
                        <el-col :span="8">生日：{{ leaguerInfo.Birthday | timeFormate('YYYY-MM-DD') }}</el-col>
                        <el-col :span="8">状态：{{ leaguerInfo.State }}</el-col>
                        <el-col :span="8">手机号：{{ leaguerInfo.TelePhone }}</el-col>
                        <el-col :span="8">身份证：{{ leaguerInfo.IdentityCard }}</el-col>
                        <el-col :span="8">入会时间：{{ leaguerInfo.JoinTime | timeFormate }}</el-col>
                    </el-row>
                </el-main>
            </el-container>
        `
    }
});