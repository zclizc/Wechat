Page({
  data: {
    username: '',
    password: ''
  },

  handleInput(e) {
    this.setData({ [e.target.dataset.field]: e.detail.value });
  },

  async handleLogin() {
    const res = await wx.cloud.callFunction({
      name: 'user',
      data: {
        action: 'login',
        username: this.data.username,
        password: this.data.password
      }
    });

    if (res.result.success) {
      wx.setStorage({
        key: 'userInfo',
        data: res.result.userInfo
      });
      wx.redirectTo({ url: '/pages/index/index' });
    } else {
      wx.showToast({ title: '登录失败', icon: 'none' });
    }
  },

  goToRegister() {
    wx.redirectTo({ url: '/pages/register/register' });
  }
});
