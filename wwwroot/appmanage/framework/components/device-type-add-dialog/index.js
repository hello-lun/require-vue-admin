define([
  'api/operation/v1/Device'
], function(
  Device
) {
  'use strict';
  
  return {
    name: 'DevcieTypeAddDialog',

    created: function () {
    },

    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },

    data: function () {
      return {
        formData: {
          Name: null,
          Code: null
        },

        rules: {
          Name: [
            { required: true, message: '请输入设备类型名称', trigger: 'blur' }
          ],
          Code: [
            { required: true, message: '请输入设备类型编码', trigger: 'blur' }
          ]
        },
      };
    },

    computed: {
      localVisible: {
        get: function () {
          return this.visible;
        },

        set: function (val) {
          if (val === false) {
            _.assign(this.formData, {
              Name: null,
              Code: null
            });
          }

          this.$emit('update:visible', val);
        }
      }
    },

    methods: {
      submit: function () {
        var self = this;
        this.$refs.form.validate(function (valid) {
          if (!valid) return;

          Device
            .Add(self.formData)
            .then(function () {
              self.$message.success('设备类型添加成功！');
              self.localVisible = false;
              self.$emit('success');
            })
        })
      }
    },

    template: `
      <el-dialog
        :visible.sync="localVisible"
        :lock-scroll="false"
        :modal-append-to-body="false"
        title="新增适用设备类型"
        width="350px"
      >
        <ych-form 
          ref="form" 
          :model="formData"
          :rules="rules">

          <el-form-item label="名称">
            <el-input v-model="formData.Name"></el-input>
          </el-form-item>

          <el-form-item label="编码">
            <el-input v-model="formData.Code"></el-input>
          </el-form-item>
        
        </ych-form>

        <span slot="footer">
          <el-button @click="localVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    `
  }
});