define([
    'framework/mixins/sidebar-form',
    'api/operation/v1/Customer',
  ], function (
    sideBarForm,
    Customer,
  ) {
      'use strict';
  
      return {
        name: '',

        props: {
            bindWechatVisible: {
                type: Boolean,
                default: false,
            },
            customerId: {
                type: String,
                default: '',
            },
            templateId: [String, Number],
        },
  
        mixins: [ sideBarForm ],
  
        components: {
        },
  
        data: function () {
          return {
            wechatInfo: {
                Pages: [],
                OneCategories: [],
                TwoCategories: [],
                ThreeCategories: [],
                DefaultData: [],
            },
            submitDisable: false,
            ReviewSubmitDisable: false,
            reviewData: [],
            cascaderProps: {
                value: 'ID',
                label: 'ClassName',
                children: 'Children',
            },
            debouncedMark: true,
          }
        },
  
        computed: {
        },
  
        methods: {
            asyncGetWechatInfo: function () {
                Customer.GetAppInfo({
                    CustomerID: this.customerId,
                }).then((res) => {
                    this.wechatInfo.OneCategories = res.OneCategories;
                    this.wechatInfo.TwoCategories = res.TwoCategories;
                    this.wechatInfo.ThreeCategories = res.ThreeCategories;
                    this.wechatInfo.Pages = res.Pages;
                    this.wechatInfo.DefaultData = res.DefaultData || [];
                    
                    this.reviewData = [];
                    if (this.wechatInfo.DefaultData.length > 0) {
                        this.wechatInfo.DefaultData.forEach((item) => {
                            this.reviewData.push({
                                Title: item.Title,
                                Page: item.Pageskey,
                                FeatureOne: item.FeatureOne,
                                FeatureTwo: item.FeatureTwo,
                                FeatureThree: item.FeatureThree,

                                filterFeatureOne: '',
                                filterFeatureTwo: '',
                                filterFeatureThree: '',
                                Tag: item.Label,
                            });
                        });
                        this.fillBackData();
                    }
                });
            },

            fillBackData () {
                this.reviewData.forEach((value, index) => {
                    this.reviewData[index].filterFeatureOne = this.wechatInfo.OneCategories.find((item) => {
                        return value.FeatureOne === item.ID;
                    });
                    this.reviewData[index].filterFeatureTwo = this.wechatInfo.TwoCategories.find((item) => {
                        return value.FeatureTwo === item.ID;
                    });
                    this.reviewData[index].filterFeatureThree = this.wechatInfo.ThreeCategories.find((item) => {
                        return value.FeatureThree === item.ID;
                    });
                });
            },

            reviewHandle: function (methodsName) {
                let arr = [];
                let passMark = false;
                let itemData = {};

                //判断哪项没有填写完整信息
                this.reviewData.forEach((item, index) => {
                    if (item.Page !== '') {
                        //克隆对象，避免arr和 this.reviewData公用同一个对象引用造成出错
                        itemData = _.cloneDeep(item);
                        arr.push(itemData);
                        if (item.Title === '') {
                            passMark = true;
                            this.$message({
                                message: `功能页面${index + 1}需要填写页面标题`,
                                type: 'warning'
                            });
                        }
                    }
                });

                if (arr.length <= 0 || passMark) {
                    !passMark && this.$message({
                        message: '最少需要填写一个功能页面',
                        type: 'warning'
                    });
                    return;
                }

                //处理提交数据
                arr.forEach((item) => {
                    item.FeatureOne = item.filterFeatureOne;
                    item.FeatureTwo = item.filterFeatureTwo;
                    item.FeatureThree = item.filterFeatureThree;
                });

                this.startLoading(methodsName,true);
                Customer[methodsName]({
                    ItemInfo: arr,
                    CustomerID: this.customerId,
                    TemplateId: this.templateId,
                }).then((res) => {
                    this.$emit('update:bindWechatVisible', false);
                    this.$emit('reflesh');
                    this.startLoading(methodsName,false);
                }, () => {
                    this.asyncGetWechatInfo();
                    this.startLoading(methodsName,false);
                });
            },

            startLoading(methodsName,status) {
                if (methodsName === 'WeAppPublishReview') {
                    this.ReviewSubmitDisable = status;
                } else {
                    this.submitDisable = status;
                }
            },

            filterChange(val, index,num) {
                let wechatInfoName = '';
                let reviewDataName = '';
                let obj = {

                    1: () => {
                        wechatInfoName = 'OneCategories';
                        reviewDataName = 'filterFeatureOne';
                    },
                    2: () => {
                        wechatInfoName = 'TwoCategories';
                        reviewDataName = 'filterFeatureTwo';
                    },
                    3: () => {
                        wechatInfoName = 'ThreeCategories';
                        reviewDataName = 'filterFeatureThree';
                    },
                };

                obj[num] && obj[num];

                if (wechatInfoName && reviewDataName) {
                    this.reviewData[index][reviewDataName] = this.wechatInfo[wechatInfoName].find((item) => {
                        return val === item.ID;
                    });
                }

                // if (num === 1) {
                //     this.reviewData[index].filterFeatureOne = this.wechatInfo.OneCategories.find((item) => {
                //         return val === item.ID;
                //     });
                // } else if (num === 2) {
                //     this.reviewData[index].filterFeatureTwo = this.wechatInfo.TwoCategories.find((item) => {
                //         return val === item.ID;
                //     });
                // } else if (num === 3) {
                //     this.reviewData[index].filterFeatureThree = this.wechatInfo.ThreeCategories.find((item) => {
                //         return val === item.ID;
                //     });
                // }
            },
            scrollPage () {
                var that = this;
                //滚动节流
                if (!this.debouncedMark) return;
                this.debouncedMark = false;

                setTimeout(function(){
                    that.$refs.hiddenDropDown.forEach((item) => {
                        item.blur();
                    });
                    that.debouncedMark = true;
                }, 100);
            },
        },
  
        template: `
        <el-dialog
            title="配置功能页面"
            :visible="bindWechatVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="700px"
            @close="$emit('update:bindWechatVisible', false)"
            @open="asyncGetWechatInfo">

            <div
                style="height: 400px;overflow: auto;"
                @scroll="scrollPage">
            <ych-form
                v-for="(items, index) in reviewData"
                :key="index"
                :model="reviewData[index]">
              <ych-sidebar-layout
                :title="'功能页面' + (index+1)">

                <ych-form-item
                    prop="Page"
                    label="功能页面"
                    double>
                    <el-select
                        v-model="reviewData[index].Page"
                        placeholder="请选择功能页面"
                        ref="hiddenDropDown">
                    <el-option 
                        v-for="item in wechatInfo.Pages"
                        :key="item.Key"
                        :label="item.Key"
                        :value="item.Key"/>
                    </el-select>
                </ych-form-item>

                <el-form-item prop="Title" label="标题">
                    <el-input
                        v-model="reviewData[index].Title"/>
                </el-form-item>

                <el-form-item prop="title" label="标签">
                    <el-input v-model="reviewData[index].Tag" />
                </el-form-item>

                <ych-form-item
                    prop="category"
                    label="一级类目"
                    v-show="wechatInfo.OneCategories.length > 0">
                    <el-select
                        v-model="reviewData[index].FeatureOne"
                        @change="(val) => filterChange(val,index,1)"
                        ref="hiddenDropDown">
                        <el-option 
                          v-for="item in wechatInfo.OneCategories"
                          :key="item.ID"
                          :label="item.ClassName"
                          :value="item.ID"/>
                    </el-select>
                </ych-form-item>

                <ych-form-item
                    prop="category"
                    label="二级类目"
                    v-show="wechatInfo.TwoCategories.length > 0">
                    <el-select
                        v-model="reviewData[index].FeatureTwo"
                        @change="(val) => filterChange(val,index,2)"
                        ref="hiddenDropDown">
                        <el-option 
                          v-for="item in wechatInfo.TwoCategories"
                          :key="item.ID"
                          :label="item.ClassName"
                          :value="item.ID"/>
                    </el-select>
                </ych-form-item>

                <ych-form-item
                    prop="category"
                    label="三级类目"
                    v-show="wechatInfo.ThreeCategories.length > 0">
                    <el-select
                        v-model="reviewData[index].FeatureThree"
                        @change="(val) => filterChange(val,index,3)"
                        ref="hiddenDropDown">
                        <el-option 
                          v-for="item in wechatInfo.ThreeCategories"
                          :key="item.ID"
                          :label="item.ClassName"
                          :value="item.ID"/>
                    </el-select>
                </ych-form-item>

              </ych-sidebar-layout>
            </ych-form>
            </div>
            
            <div style="height: 50px;line-height: 50px;overflow: hidden;">
                <p style="width: 50%;float: left;">
                <el-button
                    type="primary"
                    @click="reviewHandle('SubmitAudit')"
                    :loading="submitDisable">提交审核并发布</el-button></p>
                <p style="width: 50%;float: right;text-align: right;">
                    <el-button @click="$emit('update:bindWechatVisible', false)">返回</el-button>
                    <el-button
                        type="primary"
                        @click="reviewHandle('WeAppPublishReview')"
                        :loading="ReviewSubmitDisable">提交审核</el-button>
                </p>
            </div>
        </el-dialog>
        `
      }
    });