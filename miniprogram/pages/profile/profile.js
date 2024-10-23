Page({
  data: {
    username: '',
    email: '',
    phone: '',
  },

  onLoad() {
    // 假设用户名在登录时存储在全局状态或直接获取
    this.getCurrentUserInfo();
  },


  async getCurrentUserInfo() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: {
          action: 'getUserInfo', // 假设你会在此处理当前用户信息的获取
          username: this.data.username,
        },
      });

      if (res.result.success) {
        this.setData({
          username: res.result.data.username,
          email: res.result.data.email,
          phone: res.result.data.phone,
        });
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' });
      }
    } catch (error) {
      wx.showToast({ title: '获取用户信息失败', icon: 'none' });
      console.error('获取用户信息失败:', error);
    }
  },

  async updateUserInfo() {
    const { username, email, phone } = this.data;
    try {
      const res = await wx.cloud.callFunction({
        name: 'user',
        data: {
          action: 'updateUserInfo',
          username,
          userInfo: { email, phone },
        },
      });

      if (res.result.success) {
        wx.showToast({ title: '信息更新成功', icon: 'success' });
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' });
      }
    } catch (error) {
      wx.showToast({ title: '更新信息失败', icon: 'none' });
      console.error('更新信息失败:', error);
    }
  },
});
