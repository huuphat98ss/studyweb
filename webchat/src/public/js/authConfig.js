function showRegisterForm() {
  $('.loginBox').fadeOut('fast', function() {
    $('.registerBox').fadeIn('fast');
    $('.login-footer').fadeOut('fast', function() {
      $('.register-footer').fadeIn('fast');
    });
    $('.login .title').html('Đăng ký tài khoản');
  });
}

function showLoginForm() {
  $('.registerBox').fadeOut('fast', function() {
    $('.loginBox').fadeIn('fast');
    $('.register-footer').fadeOut('fast', function() {
      $('.login-footer').fadeIn('fast');
    });
    $('.login .title').html('Đăng nhập');
  });
}
  
function openLoginModal(){
  setTimeout(function(){
    showLoginForm();
  });
}
function openRegisterModal(){
  setTimeout(function(){
    showRegisterForm();
  });
}
