define([
    'framework/mixins/sidebar-form',
    'api/game-project/v1/GameProjectType',
    'components/cascader-game-project-type/index'
], function(
    sideBarForm,
    gameProjectType,
    cascaderGameProjectType
) {
    'use strict';
    return {
        name: 'SidebarGameProjectType',
        mixins: [sideBarForm],
        components: {
            CascaderGameProjectType:cascaderGameProjectType
        },
        created: function () {
            if (!this.ID && this.incomingData.Node && this.incomingData.Node.Path) {
                this.formData.ParentID = this.incomingData.Node.Path;
            }
            this.ID && this.asyncGetGameProjectTypeDetail();          
        },
        data: function () {
            return {
                Node: [
                    {
                        Path:[],
                        Childs:[],
                        Name: '',
                        ID: ''
                    }
                ] ,
                formData: {                  
                    Name: '',
                    ParentID:[],
                    Format:''
                },
                rules: {
                    Name: [
                        { required: true, message: '请填写类型名称', trigger: 'blur' }
                    ],
                    Format: [
                        { required: true, message: '请选择所属业态', trigger: 'blur' }
                    ],
                },              
                projectTypeOptions: [{
                        label: '电玩',
                        value: 'Game',
                    }, {
                        label: '淘气堡',
                        value: 'Naughty'
                    }, {
                        label: '体验项目',
                        value: 'Experience'
                    }
                    , {
                        label: '体育项目',
                        value: 'Sports'
                    }, {
                        label: '景区门票',
                        value: 'Scenic'
                    }, {
                        label: '剧场演出',
                        value: 'Theatrical '
                    },{
                        label: '课程',
                        value: 'Course '
                    }
                ],
            }
        },
        computed: {
            //编辑创建ID        
            ID: function () {                   
                this.formData.Name=this.incomingData.Name || null;                   
                return this.incomingData.ID || null;
            }
        },
        mounted: function() {
            this.Node = this.incomingData.Node||null;
        },

        methods: {
            //保存
            save: function () {
                var self = this,
                    submitData = this.handleSubmitData();
                    
                return new Promise(function (resolve, reject) {
                    var thenFn = self.ID 
                                    ? self.editGameProjectType(submitData) 
                                    : self.addGameProjectType(submitData);
                    thenFn
                        .then(function () {
                            resolve(submitData);                       
                        }, function () {
                            reject();                   
                        })
                        .catch(function(){

                        });
                });
            },
            //编辑
            editGameProjectType: function (data) {
                data['ID'] = this.ID;
                return gameProjectType.EditProjectType(data);
            },
            //保存
            addGameProjectType: function (data) {
                return gameProjectType.AddProjectType(data);

            },
            //提交参数
            handleSubmitData: function () {
                var parentID=this.formData.ParentID;
                if(parentID.length>0){
                parentID=parentID[parentID.length-1];
                }else{
                    parentID=null;
                }
                var data = {
                    ParentID:parentID,
                    Name:this.formData.Name,
                    Format:this.formData.Format,
                };   
         
                return data;
            },
           //根据ID获取详情  
            asyncGetGameProjectTypeDetail: function () {
                var self = this;                    
                gameProjectType.GetProjectType({ ID: this.ID })
                    .then(function (res) {
                        _.extend(self.formData, {                         
                           Name: res.Name,
                           ParentID: res.Path,
                           Format:res.Format
                       });
                  });
            
            
            },
      
        },

        template: `
            <div>
  
                <side-bar-form
                    :model="formData"
                    :rules="rules">

                    <ych-sidebar-layout >    

                        <ych-form-item 
                            prop="Name" 
                            label="类型名称:" 
                            double >
                                <el-input 
                                    v-model="formData.Name">
                                </el-input>
                        </ych-form-item>

                        <ych-form-item  
                            label="上级分类:" 
                            key="ParentID"
                            prop="ParentID" double>
                            <cascader-game-project-type 
                                v-model="formData.ParentID"
                                :disabled="Boolean(ID)">
                            </cascader-game-project-type>
                        </ych-form-item >

                        <ych-form-item
                            label="所属业态:"
                            key="Format"
                            prop="Format" double>
                             <el-select 
                                v-model="formData.Format" 
                                placeholder="请选择">
                                <el-option
                                v-for="item in projectTypeOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                              </el-option>
                           </el-select>
                        </ych-form-item>
        
                    </ych-sidebar-layout>   

                </side-bar-form>

            </div>
        `
    }
});