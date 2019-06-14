define([
    'framework/api/terminal/v1/TerminalApp',
    'framework/mixins/sidebar-form',
    'terminal/components/select-terminal-app-type',
    'terminal/components/select-terminal-type'
],function(
    terminalApp,
    sidebarForm,
    selectTerminalAppType,
    selectTerminalType
){
    'use strict';

    return{

        name:'SidebarTerminalApp',

        mixins:[sidebarForm],

        data:function(){
            return{
                formData:{
                    Name: "",
	                AppTypeNum: "",
	                AppVersion: "",
	                ForTerminalTypes: [],
	                Details: "",
                    Summary: "",
                    UpgradePackageKey:"",
                    UpgradePackageName:"",
                    UpgradePackageSize:0,
                    UpgradePackageUrl:"",
                    ResourcePackageKey:"",
                    ResourcePackageName:"",
                    ResourcePackageSize:0,
                    ResourcePackageUrl:"",
                }
            };
        },

        components: {
            SelectTerminalAppType: selectTerminalAppType,
            SelectTerminalType: selectTerminalType
        },

        created:function(){
            var self = this;
            self.incomingData.ID && self.asyncGetTerminalApp();
        },

        computed:{
            resourcePackageData: function () {
                var resData = [];
                if(this.incomingData.ID){
                    resData = [{
                        name: this.formData.ResourcePackageName,
                        url: this.formData.ResourcePackageUrl,
                        key: this.formData.ResourcePackageKey
                    }]
                }
                return resData;
            },
            upgradePackageData: function () {
                var resData = [];
                if(this.incomingData.ID){
                    resData = [{
                        name: this.formData.UpgradePackageName,
                        url: this.formData.UpgradePackageUrl,
                        key: this.formData.UpgradePackageKey
                    }]
                }
                return resData;
            }
        },

        methods:{
            asyncGetTerminalApp:function(){
                var self = this;
                terminalApp
                    .GetByID({ID: self.incomingData.ID})
                    .then(function(data){
                        var terminalTypeIds = _.map(data.ForTerminalTypes,function(item) {
                            return item.ID;
                          });
                        _.extend(self.formData,
                            {
                                Name: data.Name,
                                AppTypeNum: data.AppTypeID,
	                            AppVersion: data.AppVersion,
	                            ForTerminalTypes:terminalTypeIds,
	                            Details: data.Details,
                                Summary: data.Summary,
                                UpgradePackageKey: data.UpgradePackageKey,
                                UpgradePackageName:data.UpgradePackageName,
                                UpgradePackageSize:data.UpgradePackageSize,
                                UpgradePackageUrl:data.UpgradePackageUrl,
                                ResourcePackageKey:data.ResourcePackageKey,
                                ResourcePackageName:data.ResourcePackageName,
                                ResourcePackageSize:data.ResourcePackageSize,
                                ResourcePackageUrl:data.ResourcePackageUrl,
                            });
                        
                    });
            },

            save:function(){
                var self = this;
                var submitData = self.formData;

                return new Promise(function(resolve,reject){
                    var saveFn = self.incomingData.ID?
                        self.editTerminalApp(submitData)
                        :self.addTerminalApp(submitData);

                    saveFn
                        .then(function(){
                            resolve(submitData);
                        },function(){
                            reject();
                        });
                });
            },

            addTerminalApp:function(data){
                return terminalApp.Add(data);
            },

            editTerminalApp:function(data){
                var submitData = _.extend({ID: this.incomingData.ID},data)
                return terminalApp.Edit(submitData);
            },
            
            handleUpgradePackageSuccess: function (res ,file, fileList) {
                this.formData.UpgradePackageUrl = res.Url;
                this.formData.UpgradePackageKey= res.Key;
                this.formData.UpgradePackageName= res.Name;
                this.formData.UpgradePackageSize= res.Size;

 
            },

            handleResourcePackageSuccess: function (res ,file, fileList) {
                // console.log(res,file,fileList,'1255');
                this.formData.ResourcePackageUrl = res.Url;
                this.formData.ResourcePackageKey= res.Key;
                this.formData.ResourcePackageName= res.Name;
                this.formData.ResourcePackageSize= res.Size;
            },
        },

        template:`
            <div>
            <side-bar-form
                    :model="formData"
                    :rules="rules"
                    :inline="false"
                    label-width="8em">

                <ych-sidebar-layout 
                    title="">

                    <ych-form-item
                        prop="AppTypeNum" 
                        label="终端应用类型:">
                            <select-terminal-app-type
                                v-model="formData.AppTypeNum">
                            </select-terminal-app-type>
                    </ych-form-item>

                    <ych-form-item
                        prop="Name" 
                        label="终端应用名称:">
                            <el-input 
                                v-model="formData.Name">
                            </el-input>
                    </ych-form-item>                    

                    <ych-form-item
                        prop="AppVersion" 
                        label="终端应用版本:">
                            <el-input 
                                v-model="formData.AppVersion">
                            </el-input>
                    </ych-form-item>

                    <ych-form-item
                        prop="Summary" 
                        label="概述:">
                            <el-input 
                                type="textarea"
                                :rows="3"
                                v-model="formData.Summary">
                            </el-input>
                    </ych-form-item>

                    <ych-form-item
                        prop="Details" 
                        label="详情:">
                            <el-input 
                                type="textarea"
                                :rows="3"
                                v-model="formData.Details">
                            </el-input>
                    </ych-form-item>

                    <ych-form-item 
                        label="适用终端类型:"
                        key="TerminalTypeID"
                        prop="TerminalTypeID">
                        <select-terminal-type 
                            :isMultiple="true"
                            v-model="formData.ForTerminalTypes">
                        </select-terminal-type>
                    </ych-form-item >

                    <ych-form-item 
                        label="升级包:"
                        key="UpgradePackageUrl"
                        prop="UpgradePackageUrl">
                        <ych-upload
                            :max-size="10240"
                            :limit="1"
                            :file-list="upgradePackageData"
                            :on-success="handleUpgradePackageSuccess">
                            <el-button 
                                style="display: block;" 
                                icon="el-icon-plus" size="mini">
                            </el-button>
                            <div slot="tip" class="el-upload__tip" >
                                文件大小不能超过10MB
                            </div>
                        </ych-upload>
                    </ych-form-item >

                    <ych-form-item 
                        label="资源包:"
                        key="ResourcePackageUrl"
                        prop="ResourcePackageUrl">
                        <ych-upload
                            :max-size="10240"
                            :limit="1"
                            :file-list="resourcePackageData"
                            :on-success="handleResourcePackageSuccess">
                            <el-button 
                                style="display: block;" 
                                icon="el-icon-plus" size="mini">
                            </el-button>
                            <div slot="tip" class="el-upload__tip">
                                文件大小不能超过10MB
                            </div>
                        </ych-upload>
                    </ych-form-item >
                </ych-sidebar-layout>
            </side-bar-form>
            </div>
        `
    }
});