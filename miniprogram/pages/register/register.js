Page({
  data: {
    username: '',
    password: '',
    confirmPassword: ''
  },

  handleInput(e) {
    this.setData({ [e.target.dataset.field]: e.detail.value });
  },

  goToLogin() {
    wx.redirectTo({ url: '/pages/login/login' });
  },

  async handleRegister() {
    const { username, password, confirmPassword } = this.data;

    if (password !== confirmPassword) {
      wx.showToast({ title: '密码不一致', icon: 'none' });
      return;
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: {
          action: 'register',
          username,
          password
        }
      });

      console.log('Cloud function response:', res); // 输出云函数响应

      if (res.result.success) {
        wx.showToast({ title: '注册成功', icon: 'success' });
        wx.redirectTo({ url: '/pages/login/login' });
      } else {
        // 显示详细的错误信息
        wx.showToast({
          title: res.result.message || '注册失败',
          icon: 'none',
          duration: 2000
        });
      }
    } catch (error) {
      // 处理云函数调用错误
      console.error('云函数调用失败:', error); // 输出错误信息
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none',
        duration: 2000
      });
    }
  }
});
