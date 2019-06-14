define([
  'components/ticket-style-layout-manager/param-panel',
  'components/ticket-style-layout-manager/param-item'
], function(
  ParamPanel,
  ParamItem
) {
  'use strict';
  
  return {
    name: 'OtherELementParams',

    components: {
      ParamPanel: ParamPanel,
      ParamItem: ParamItem
    },

    props: {
      'data': {
        type: Object,
        default: function () {
          return {
            name: '元素',
            width: 0,
            height: 0,
            left: 0,
            right: 0,
            fontFamily: '微软雅黑',
            fontSize: 12
          };
        }
      }
    },

    data: function () {
      return {
        params: this.$options.propsData.data,
        fontFamily: ['微软雅黑', '黑体', '宋体'],
        fontSize: [10, 12, 14, 16, 18, 20, 26],

        uploadImageCallBack: null,
        imageUploading: false
      };
    },

    watch: {
      data: function (val) {
        var self = this;
        _.forEach(val, function (value, key) {
          self.$set(self.params, key, value);
        })
        // _.extend(this.params, val);
      },

      // params: {
      //   deep: true,
      //   handler: function (val) {
      //     this.$emit('update:data', val);
      //   }
      // }
    },

    methods: {
      handleInputChange: function () {
        this.$emit('update:data', this.params);
      },

      handleScaleChange: function (val) {
        this.params.scaleX = val;
        this.params.scaleY = val;
        this.handleInputChange();
      },

      uploadImage: function (cb) {
        this.$refs.uploadBtn.$el.click();
        // 暂存callback
        this.uploadImageCallBack = cb;
      },

      imageUploadOnSuccess: function (file) {
        if (this.uploadImageCallBack) {
          this.uploadImageCallBack(file.Url);
          this.uploadImageCallBack = null;
        } else {
          this.$emit('image-change', file.Url);
        }
      },

      handleUploadOnChnage: function () {
        this.imageUploading = false;
      },

      handleUploadBeforeUpload: function () {
        this.imageUploading = true;
      }
    },

    computed: {
      paramsStatus: function () {
        var defaultStatus = {
          left: {
            show: true,
            disabled: false
          },
          top: {
            show: true,
            disabled: false
          },
          width: {
            show: true,
            disabled: false
          },
          height: {
            show: true,
            disabled: false
          },
          fontFamily: {
            show: true,
            disabled: false
          },
          fontSize: {
            show: true,
            disabled: false
          },
          scale: {
            show: false,
            disabled: false
          }
        };

        var elName = this.params.elName || null;

        switch (elName) {
          case 'remark':
            defaultStatus.height.disabled = true;
            break;
          
          case 'ticket-price':
          case 'ticket-name':
          case 'print-time':
          case 'expiry-date':
          case 'order-number':
          case 'serial-number':
            defaultStatus.height.show = false;
            defaultStatus.width.show = false;
            break;

          case 'image':
          case 'qrcode':
            defaultStatus.fontFamily.show = false;
            defaultStatus.fontSize.show = false;
            defaultStatus.width.show = false;
            defaultStatus.height.show = false;
            defaultStatus.scale.show = true;
            break;

        }

        return defaultStatus;
      }
    },

    template: `
      <div>
        <param-panel title="文本">
          <param-item v-show="paramsStatus.left.show" label="X">
            <ych-input-number 
              v-model="params.left"
              @change="handleInputChange" 
              :disabled="paramsStatus.left.disabled">
            </ych-input-number>
          </param-item>

          <param-item 
            v-show="paramsStatus.top.show" 
            label="Y">
            <ych-input-number 
              v-model="params.top"
              @change="handleInputChange"
              :disabled="paramsStatus.top.disabled">
            </ych-input-number>
          </param-item>

          <param-item 
            v-show="paramsStatus.width.show" 
            label="宽度">
            <ych-input-number 
              v-model="params.width"
              @change="handleInputChange" 
              :min="0"
              :disabled="paramsStatus.width.disabled">
            </ych-input-number>
          </param-item>

          <param-item 
            v-show="paramsStatus.height.show" 
            label="高度">
            <ych-input-number 
              v-model="params.height"
              @change="handleInputChange" 
              :disabled="paramsStatus.height.disabled">
            </ych-input-number>
          </param-item>

          <param-item 
            label="字体" 
            v-show="paramsStatus.fontFamily.show" 
            double>
            <el-select 
              @change="handleInputChange"
              v-model="params.fontFamily"
              size="mini"
              :disabled="paramsStatus.fontFamily.disabled">

              <el-option
                v-for="item in fontFamily"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </param-item>

          <param-item 
            v-show="paramsStatus.fontSize.show"
            label="字体大小">
            <el-select 
              @change="handleInputChange"
              v-model="params.fontSize"
              size="mini"
              :disabled="paramsStatus.fontSize.disabled">

              <el-option
                v-for="item in fontSize"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </param-item>

          <param-item 
            v-show="paramsStatus.scale.show" 
            label="缩放">
            <ych-input-number 
              v-model="params.scaleX"
              :step="0.1"
              :min="0.1"
              @change="handleScaleChange" 
              :disabled="paramsStatus.scale.disabled">
            </ych-input-number>
          </param-item>
        </param-panel>

        <param-panel 
          v-show="params.elName === 'image'"
          title="图片">
          <param-item>
            <ych-upload
              accept=".jpg, .jpeg .png"
              :show-file-list="false"
              :before-upload="handleUploadBeforeUpload"
              :on-change="handleUploadOnChnage"
              :on-success="imageUploadOnSuccess">
              <el-button 
                ref="uploadBtn" 
                :loading="imageUploading"
                type="text">
                {{ imageUploading ? '' : '更换图片' }}
              </el-button>
            </ych-upload>
          </param-item>
        </param-panel>
      </div>
      
    `
  }
});