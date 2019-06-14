define([
    'framework/mixins/sidebar-form',
    'mixins/pagination',
    'api/operation/v1/Firmware',
    'components/area/index',
    'components/area/area-data',
  ], function (
    sideBarForm,
    pagination,
    Firmware,
    area,
    areaDataList,
  ) {
      'use strict';
  
      return {
        name: 'SidebarUpdatedInfo',
  
        mixins: [ sideBarForm, pagination ],
  
        components: {
            YchArea: area
        },
  
        created: function () {
            this.paginationUpdateFn = this.getUpdateInfo;
            this.getAllSelectID();
        },
  
        data: function () {
          return {
              updataData: [
                  {
                    type: 'netUpdata',
                    value: '全网升级'
                  },
                  {
                    type: 'updateText',
                    value: '灰度测试'
                },
              ],
              formData: {
                Province: null,
                City: null,
                County: null,
              },
              selectFormData: {
                TenantInfo: '',
                Province: null,
                City: null,
                County: null,
              },
              updateFormData: {
                  ID: [],
                  PushArea: 'netUpdata',
                  FirmwareID: '',
              },
              dataList: [],
              alreadySelectIdList: [],
              selectArr: [],
              fillBackArr: [],
              isCanSelect: false,
              pushSingleVisible: false,
              pushSingleValue: '',
              machineStatus: '',
              searchLoading: false,
              updateLoading: false,
          }
        },

        computed: {
            machineStatusText () {
                let statusObj = {
                    '0': '设备不存在',
                    '1': '当前设备可以升级',
                    '2': '已是最新版设备',
                    '3': '固件不存在',
                    '4': '固件与设备不匹配',
                };

                return statusObj[this.machineStatus] || '';
            },
            networkUpdataShow() {
                return this.updateFormData.PushArea === 'updateText';
            },
            areaData: {
              get: function () {
                return [
                  this.formData.Province,
                  this.formData.City,
                  this.formData.County,
                ];
              },
    
              set: function (val) {
                let Provice,City,County;
                Provice = areaDataList.province_list[val[0]];

                City = areaDataList.city_list[val[1]];

                County = areaDataList.county_list[val[2]];
                
                this.formData.Province = val[0];
                this.formData.City = val[1];
                this.formData.County = val[2];

                this.selectFormData.Province = Provice;
                this.selectFormData.City = City;
                this.selectFormData.County = County;

              }
            }
          },
  
        methods: {
            getAllSelectID() {
                var self = this;

                Firmware.AlreadySelectID({
                    ID: this.incomingData.id,
                }).then(function (res) {
                    self.alreadySelectIdList = res.IDList;
                    self.updateFormData.PushArea = res.PushArea;

                    self.isCanSelect = res.PushArea === 'updateText';

                    self.getUpdateInfo();
                });
            },
            selectionChange(row) {
                var self = this;
                var selectArr = [];

                selectArr = row.map(function (item) {
                        return item.TenanatID;
                    });

                self.alreadySelectIdList = _.union(self.alreadySelectIdList.concat(selectArr));

                for (var i = 0; i < self.fillBackArr.length; i++) {
                    if (selectArr.indexOf(self.fillBackArr[i]) < 0) {
                        self.alreadySelectIdList.splice(self.alreadySelectIdList.findIndex(function (value) {
                            return self.fillBackArr[i] === value;
                        }),1);
                    }
                }

                self.fillBackArr = selectArr;

                console.log('已经选择：',selectArr, '全部选择的id：',self.alreadySelectIdList,'当前页选中的：',self.fillBackArr);
            },
            update() {
                var self = this;
                var mark = false;
                var text = '当前操作将进行“全网升级”/“部分设备升级”，该操作会影响门店正常运营。请确认是否推送';

                if (this.alreadySelectIdList.length <= 0) {
                    text = '您还没有选择推送门店';
                    mark = true;
                }

                return this.$confirm(text, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    if (mark) return Promise.reject();

                    self.updateFormData.FirmwareID =  self.incomingData.id;
                    self.updateFormData.ID =  self.alreadySelectIdList;

                    return new Promise(function (resolve, reject) {
                        Firmware
                        .PushUpdate(self.updateFormData)
                        .then(function () {
                            resolve();
                            self.$message.success('固件推送升级成功');
                        }, function () {
                            reject();
                        })
                        .catch(function () { reject() });
                    });
                }).catch(() => {
                    return Promise.reject();
                });
            },
            selectChange(val) {
                this.updateFormData.PushArea = val;
                console.log(val);
            },
            getUpdateInfo() {
                var self = this;
                var cache = [];
                this.selectFormData.ID = this.incomingData.id;
                var searchData =  _.extend(
                    {},
                    this.selectFormData,
                    this.paginationInfo
                  );
                Firmware.DataList(searchData).then(function (res) {
                    self.dataList = res.Data;
                    self.paginationTotal = res.Total;

                    self.dataList.forEach(row => {
                        // if (row.IsUpdate) {
                        //     cache.push(row.TenanatID);
                        //     self.$nextTick(function () {
                        //         self.$refs.infoTable.toggleRowSelection(row,true);
                        //     });
                        // }
                        if (self.alreadySelectIdList.indexOf(row.TenanatID) > -1) {
                            cache.push(row.TenanatID);
                            self.$nextTick(function () {
                                self.$refs.infoTable.toggleRowSelection(row,true);
                            });
                        }
                    });

                    self.fillBackArr = cache;
                });
            },
            searchSingleMachine () {
                if (!this.pushSingleValue || this.pushSingleValue.length !== 9) {
                    this.$message({
                        message: '请输入9位设备编码！',
                        type: 'error'
                    });
                    return;
                }

                this.searchLoading = true;
                Firmware.SearchSingleMachine({
                    ID: this.pushSingleValue,
                    DeviceID: this.incomingData.id,
                }).then((res) => {
                    this.machineStatus = res.Status;
                    this.searchLoading = false;
                }).catch(() => {
                    this.searchLoading = false;
                });
            },
            updateSingle () {
                this.updateLoading = true;
                Firmware.UpdateSingleMachine({
                    ID: this.pushSingleValue,
                    DeviceID: this.incomingData.id,
                }).then((res) => {
                    this.updateLoading = false;
                    this.pushSingleVisible = false;
                    this.$message({
                        message: '升级成功！',
                        type: 'success'
                    });
                }).catch(() => {
                    this.updateLoading = false;
                });
            },
            resetSingleData () {
                this.pushSingleValue = '';
                this.machineStatus = '';
            },
            handleBeforeUpload() {},
            handleFileExceed() {},
            handleFileChange() {},
            handleFileRemove() {},
        },
  
        template: `
          <div>
            <side-bar-form
            :model="selectFormData"
            size="medium">

            <ych-form-item prop="Name" label="推送范围">
                <el-select
                    v-model="updateFormData.PushArea"
                    placeholder="请选择"
                    :disabled="isCanSelect"
                    @change="selectChange">
                    <el-option
                        v-for="item in updataData"
                        :key="item.type"
                        :label="item.value"
                        :value="item.type">
                    </el-option>        
                </el-select>
            </ych-form-item>

            <div v-show="networkUpdataShow">
               
                <ych-form-item 
                    label="门店地区"
                    key="DeviceType"
                    prop="DeviceType"
                    double>

                    <ych-area
                        v-model="areaData"
                        v-bind="$attrs"
                        v-on="$listeners"
                        @blur="getUpdateInfo"></ych-area>
                </ych-form-item>

                <div>
                    <ych-form-item prop="TenantInfo" label="主体信息">
                        <el-input 
                            v-model="selectFormData.TenantInfo"
                            placeholder="主体账号">
                        </el-input>
                    </ych-form-item>
                    <el-button type="primary" @click="getUpdateInfo">查询</el-button>
                    <el-button
                        type="text"
                        style="float: right;margin-right: 30px;"
                        @click="pushSingleVisible = true">推送单台</el-button>
                </div>
                
                <div style="padding: 0 10px;">
                    <ych-table
                        slot="main"
                        :data="dataList"
                        height="388"
                        ref="infoTable"
                        @selection-change="selectionChange">

                        <el-table-column
                            type="selection"
                            width="35">
                        </el-table-column>


                        <el-table-column
                            prop="Acount"
                            label="主体账号"
                            show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column
                            prop="BrandName"
                            label="主体名称"
                            width="120"
                            show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column
                            prop="TenantName"
                            label="门店名称"
                            width="100"
                            show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column
                            prop="DeviceNum"
                            label="设备总数"
                            width="100"
                            show-overflow-tooltip>
                        </el-table-column>

                        <el-table-column
                            prop="UpdateNum"
                            label="已更新设备数"
                            width="100"
                            show-overflow-tooltip>
                        </el-table-column>
                    </ych-table>

                <ych-pagination
                    @size-change="$_pagination_sizeChange"
                    @current-change="$_pagination_currentChange"
                    :current-page="paginationTotal.PageIndex"
                    :total="paginationTotal">
                </ych-pagination>
            </div>
        </div>
        </side-bar-form>

        <el-dialog
            title="单个设备推送升级"
            :visible.sync="pushSingleVisible"
            append-to-body
            width="500px"
            @close="resetSingleData">
            <div style="width: 300px;margin: 0 auto;">
                <p>输入9位的设备编码进行搜索</p>
                <div>
                    <el-input
                        v-model="pushSingleValue"
                        placeholder="请输入设备编码"
                        style="width: 200px;margin: 20px 0;"
                        size="small"
                        maxlength="9"
                        ></el-input>
                    <el-button @click="searchSingleMachine" type="primary" :loading="searchLoading">搜索</el-button>
                </div>
                <p :style="{color: machineStatus !== '1' ? 'red' : 'green',fontWeight: 600,}">{{machineStatusText}}</p>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="pushSingleVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="updateSingle"
                    :disabled="machineStatus !== '1'"
                    :loading="updateLoading">升 级</el-button>
            </div>
        </el-dialog>
</div>
      `
      }
    });