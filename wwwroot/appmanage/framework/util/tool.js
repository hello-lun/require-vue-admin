define(function(require) {
  'use strict';
  
  return {
    inheritPrototype: function (subType, superType) {
      var prototype = Object.create(superType.prototype);
      prototype.constructor = subType;
      subType.prototype = prototype;
    },

    resolveComponent: function (dependency) {
      return new Promise(function (resolve, rejects) {
        if (!(dependency instanceof Array)) {
          dependency = [dependency];
        }
        require(dependency, function (res) {
          resolve(res);
        });
      })
    },

    /**
     * 判断权限
     * @argument permission 需要判断的权限
     * @returns Boolean
     */
    hasPermission: function (permission) {
      var permissions = sessionStorage.getItem('userPermission') || {};
      return permissions[permission] ? true : false;
    },
    // 全屏
    requestFullScreen: function () {
      var docElm = document.documentElement;
      //W3C  
      if (docElm.requestFullscreen) {  
        docElm.requestFullscreen();  
      }
      //FireFox  
      else if (docElm.mozRequestFullScreen) {  
        docElm.mozRequestFullScreen();  
      }
      //Chrome等  
      else if (docElm.webkitRequestFullScreen) {  
        docElm.webkitRequestFullScreen();  
      }
      //IE11
      else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    },
    // 退出全屏
    exitFullScreen: function () {
      if (document.exitFullscreen) {  
        document.exitFullscreen();  
      }  
      else if (document.mozCancelFullScreen) {  
        document.mozCancelFullScreen();  
      }  
      else if (document.webkitCancelFullScreen) {  
        document.webkitCancelFullScreen();  
      }
      else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    },

    /**
     * 添加全屏事件监听器
     * @argument cb 事件触发的回调方法
     */
    addFullScreenEvent: function (cb) {
      document.addEventListener("fullscreenchange", function () {  
        cb(document.fullscreen);
      });
        
      document.addEventListener("mozfullscreenchange", function () {  
        cb(document.mozFullScreen);
      });
        
      document.addEventListener("webkitfullscreenchange", function () {  
        cb(document.webkitIsFullScreen);
      });

      document.addEventListener("msfullscreenchange", function () {
        cb(document.msFullscreenElement);
      });
    }
  }
});