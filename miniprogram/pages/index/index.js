Page({
  goToLogin() {
    wx.redirectTo({ url: '/pages/login/login' });
  },

  goToRegister() {
    wx.redirectTo({ url: '/pages/register/register' });
  },

  goToProfile() {
    wx.redirectTo({ url: '/pages/profile/profile' });
  },

  goToLearning() {
    wx.redirectTo({ url: '/pages/learning/learning' });
  },

  goToSignIn() {
    wx.redirectTo({ url: '/pages/signIn/signIn' }); 
  }
});
