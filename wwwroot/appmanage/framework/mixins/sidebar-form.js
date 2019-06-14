define(function() {
  'use strict';
  
  return {
    props: {
      incomingData: Object
    },

    data: function () {
      return {
        formData: {},
        rules: {},
        // $_sidebarForm_loading: false
      }
    },

    methods: {
      $_sidebarForm_valid: function (operation) {
        var that = this;
        var oparateFn = that[operation];

        return new Promise(function (resolve, reject) {
          if (oparateFn) {
            var refs = that.$refs,
                refsKey = _.keys(refs),
                sidebarFormLen = refsKey.length,
                isValidPass = true;

            // 表单验证成功后执行
            var validSuccess = function () {

              if (!isValidPass) {
                return reject();
              }

              oparateFn().then(function (data) {
                data === false 
                  ? reject() 
                  : resolve(that.$options.name, data);
              }).catch(function (e) {
                reject();
              });
            }
            
            if (refsKey.length > 0) {
              _.forEach(refsKey, function (val) {
                if (!refs[val] || !refs[val].validate) {
                  return --sidebarFormLen;
                }
  
                refs[val].validate()
                  .then(function () {
                    (--sidebarFormLen === 0) && validSuccess();
                  }, function () {
                    isValidPass = false;
                    (--sidebarFormLen === 0) && validSuccess();
                  });
              });
            } else {
              return validSuccess();
            }
            
          } else {
            console.error(`侧栏组件${this.$options.name},没有实现${operation}操作方法！`)
            return resolve();
          }
        });
      }

      // reset: function () {
      //   this.$refs.elForm.resetFields();
      // }
    }
  }
});