define([
    'framework/api/organization/v1/FunctionalAuth',

    'incss!organization/views/operating-page/jurisdiction-page/index.css'
    
], function (
    FunctionalAuth
) {
        'use strict';

        const cityOptions = ['上海', '北京', '广州', '深圳'];

        return {
            name: 'PermissionGroup',

            template: `
                <el-collapse 
                    v-model="activeNames"
                    @change="handleChange">
                    <el-collapse-item  
                        v-for="(city,index01) in allOrganizationData" 
                        :key="index01" 
                        :name="city.ModularName">
                        
                        <template slot="title">
                            <el-checkbox 
                                :indeterminate="isIndeterminate01" 
                                v-model="checkAll01" 
                                @change="CheckAllChange" >{{city.ModularName}}--全选1</el-checkbox>
                        </template>

                            <div style="margin: 15px 0;"></div>
                                <el-row
                                    v-for="(items,index02) in city.ListFunctional"
                                    :key="index02">
                                    <el-col :span="4">
                                        <el-checkbox 
                                            :indeterminate="isIndeterminate02" 
                                            v-model="checkAll" 
                                            @change="handleCheckAllItemChange(items)">{{items.FunctionalName}}--全选2</el-checkbox>
                                    </el-col>

                                    <el-checkbox-group 
                                        v-model="checkedCities" 
                                        @change="handleCheckedAllChange">
                                        <el-col 
                                            v-for="(groupItem,index03) in items.ListAuth"
                                            :key="index03"
                                            :span="4" 
                                            class="checkbox-item">
                                                <el-checkbox
                                                :checked="groupItem.IsSelected"  
                                                :label="groupItem.AuthName">{{groupItem.AuthName}}</el-checkbox>
                                        </el-col>
                                    </el-checkbox-group>
                                    
                                </el-row>
                    </el-collapse-item>
                   
                </el-collapse>
            `,
     
            props: {

            },

            data: function () {
                return {
                    activeNames: [],
                    checkAll: false,
                    //选中了多少个权限
                    checkedCities: {},
                    allOrganizationData: [],
                    isIndeterminate01: true,
                    isIndeterminate02: true,
                    checkAll01:false,
                    firstFloorData:{}
                }
            },

            computed: {

            },

            methods: {
                dataHandle:function(){
                    var that = this;
                    // 总共有多少个折叠板
                    var firstFloorLength = this.allOrganizationData.length;
                    var newarrdata=[] ;

                    console.log( _.omit(this.allOrganizationData,'ModularName'),'787887');
                    console.log( this.allOrganizationData,'7877');
                    

                    // firstFloorData = _.map(this.allOrganizationData,'ListFunctional');

                    _.forEach(this.allOrganizationData,function(name,index){
                        that.firstFloorData[name.ModularName] = {};
                        that.checkedCities[name.ModularName] = {};
                        
                        _.forEach(name.ListFunctional,function(item){
                            that.firstFloorData[name.ModularName][item.FunctionalName] = [];
                            that.checkedCities[name.ModularName][item.FunctionalName] = '';
                            
                            _.forEach(item.ListAuth,function(val){
                                that.firstFloorData[name.ModularName][item.FunctionalName].push(val.AuthName);
                            });
                        });
                    });
                    // 某个折叠板下面有多少个层级
                    var secondFloorLength = this.allOrganizationData[0].ListFunctional.length;

                    console.log(that.firstFloorData,that.checkedCities,'权限数据处理');
                },
                handleChange(val) {
                    console.log(val,'折叠面板');
                },
                handleCheckAllItemChange(val) {
                    console.log(val,'全选2');
                    var that = this,itemData = [];

                    _.forEach(val.ListAuth,function(item){
                        itemData.push(item.AuthName);
                    });
                    console.log(itemData,'opopo');

                    // this.checkedCities = this.isIndeterminate02 ? itemData : [];
                    
                    this.isIndeterminate02 = !this.isIndeterminate02;
                  },
                  handleCheckedAllChange(value) {
                    var that = this;
                      console.log(value,'选项');
                      _.forEach(function(val){
                        that.checkedCities.push(val);
                      });
                      
                    let checkedCount = value.length;
                    this.checkAll = checkedCount === this.allOrganizationData.length;
                    this.isIndeterminate = checkedCount > 0 && checkedCount < this.allOrganizationData.length;
                  },
                  CheckAllChange:function(val){
                    console.log(val,'全选1');
                  },
                  getOrganizationDataById:function(){
                      var that = this;
                    FunctionalAuth.GetFunctionalAuth()
                        .then(function(res){
                            console.log(res,'权限管理数据');
                            that.allOrganizationData = res.Data;
                            that.dataHandle();
                        });

                  }
            },
            created: function () {
                this.getOrganizationDataById();
            }
        }


    });