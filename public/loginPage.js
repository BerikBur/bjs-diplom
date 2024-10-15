"use strict";
let responseCheck; 
const userForm = new UserForm;
//this.getData(this.loginForm) --> returns data for loginFormCallback
//and it is { login, password }
userForm.loginFormCallback = function(data) {
    //data is { login, password }
    //send the data to static method of ApiConnector
    //and call callback function with the result of server response
    ApiConnector.login(data, (response) => {
      localStorage.setItem('loginResponse', JSON.stringify(response));//to check: what the structure of response
      if(response.success) {
        location.reload();
      } else {
        userForm.setLoginErrorMessage(response.error || 'Ошибка при авторизации');
      };
    });
  };


//same as userForm.loginFormCallback
userForm.registerFormCallback = function (data) {
    ApiConnector.register(data, (response) => {
      if (response.success) {
        location.reload();
      } else {
        userForm.setRegisterErrorMessage(response.error || 'Ошибка регистрации');
      }
    });
  };
