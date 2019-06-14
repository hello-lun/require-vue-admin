define([
    'framework/mixins/sidebar-form',
    'mixins/pagination',
    'api/operation/v1/Firmware',
    'components/area/index'
  ], function (
    sideBarForm,
    pagination,
    Firmware,
    area
  ) {
      'use strict';
  
      return {
        name: 'SidebarUpdatedInfo',
  
        mixins: [ sideBarForm, pagination ],
  
        components: {
        },
  
        created: function () {
            this.getUpdateInfo();
        },
  
        data: function () {
          return {
              updataData: {},
              selectType: '',
          }
        },
  
        computed: {
        },
  
        methods: {
            getUpdateInfo() {
                var _this = this;
                Firmware.DetailInfo({
                    ID: this.incomingData.id
                }).then(function (res) {
                    _this.updataData = res;
                    console.log(res);
                });
            },
            handleBeforeUpload() {},
            handleFileExceed() {},
            handleFileChange() {},
            handleFileRemove() {},
        },
  
        template: `
        <div>
          <side-bar-form
            :model="updataData"
            size="medium">

            <ych-sidebar-layout title="基础信息">
            <!-- <ych-form-item prop="SoftwareKey" label="安装包" double>
                <ych-upload
                  upload-type="public"
                  :limit="1"
                  :before-upload="handleBeforeUpload"
                  :on-exceed="handleFileExceed"
                  :on-success="handleFileChange"
                  :on-remove="handleFileRemove">
                  <el-button 
                    disabled
                    type="primary">
                    {{ updataData.DeviceTypeName }}
                  </el-button>
                </ych-upload>
              </ych-form-item> -->

              <ych-form-item prop="UpdateName" label="安装包" double>
                <el-input 
                    v-model="updataData.UpdateName"
                    disabled>
                </el-input>
              </ych-form-item>

              <ych-form-item prop="ResourceName" label="资源包" double>
                <el-input 
                    v-model="updataData.ResourceName"
                    disabled>
                </el-input>
              </ych-form-item>

              <!-- <ych-form-item prop="Name" label="名称" double>
                <el-input 
                    v-model="updataData.Name"
                    disabled>
                </el-input>
              </ych-form-item> -->

              <ych-form-item prop="Version" label="版本号" double>
                <el-input 
                    v-model="updataData.Version"
                    disabled>
                </el-input>
              </ych-form-item>

              <ych-form-item prop="DeviceType" label="设备类型" double>
                <el-input 
                    v-model="updataData.DeviceType"
                    disabled>
                </el-input>
              </ych-form-item>

              <!-- <ych-form-item prop="DeviceType" label="设备类型" double>
                <el-select v-model="selectType" placeholder="请选择">
                    <el-option
                        v-for="item in updataData.DeviceType"
                        :key="item.value"
                        :label="item.value"
                        :value="item.value">
                    </el-option>        
                </el-select>
              </ych-form-item> -->

              <ych-form-item prop="Remarks" label="说明" double>
                <el-input 
                    v-model="updataData.Remarks"
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 6}"
                    disabled>
                </el-input>
              </ych-form-item>

            </ych-sidebar-layout>
              
          </side-bar-form>

        </div>
      `
      }
    });