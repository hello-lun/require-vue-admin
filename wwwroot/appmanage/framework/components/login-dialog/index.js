define([
  'vue',
  'components/login-dialog/dialog'
], function(
  Vue,
  LoginDialog
) {
  'use strict';

  var instance;
  var LoginDialogConstructor = Vue.extend(LoginDialog);

  var initInstance = function () {
    if (!instance) {
      instance = new LoginDialogConstructor({
        el: document.createElement('div'),
        destroyed: function () {
          if (this.$el && this.$el.parentNode) {
            this.$el.parentNode.removeChild(this.$el);
          }

          instance = null;
        },
      });

      document.body.appendChild(instance.$el);

      Vue.nextTick(function () {
        instance.visible = true;
      });
      
    }
  }

  return initInstance;
});