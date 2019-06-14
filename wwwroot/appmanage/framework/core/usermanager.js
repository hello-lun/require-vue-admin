define([
  'framework/lib/axios.min',
  '_'
], function(
  axios, 
  _
) {
  'use strict'; 

  function UserManager () {

  }
  
  var setUser = function (userInfo) {
    var json = JSON.stringify(userInfo);
    sessionStorage.setItem('user-info', json);
  };

  UserManager.prototype.clearUser = function () {
    sessionStorage.removeItem('user-info');
  }

  UserManager.prototype.getUser = function () {
    var self = this;

    var json = sessionStorage.getItem('user-info');

    var userInfo = JSON.parse(json !== 'undefined' ? json : null);
    // 没有用户信息
    if (!userInfo ) {
      this.signoutRedirect();
    }

    return Promise.resolve(userInfo);
  }

  UserManager.prototype.login = function (user) {
    setUser(user);
    window.location = globalConfig.baseUrl + '/index.html';
  }

  UserManager.prototype.logout = function () {
    this.clearUser();
    this.signoutRedirect();
  }

  UserManager.prototype.signinRedirect = function () {
      this.manager.signinRedirect()
        .then()
        .catch(function (error) {
            console.error('error while signing out user', error);
        });
  }

  UserManager.prototype.signoutRedirect = function () {
    window.location = globalConfig.baseUrl + '/login/manage.html';   
  }

  return new UserManager();
});