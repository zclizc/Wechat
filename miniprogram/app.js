App({
  onLaunch() {
    // 初始化云开发
        wx.cloud.init({
          env: 'work-0gndl4l951fef2db', // 替换为你的云环境 ID
          traceUser: true
        });
    // 检查用户是否登录
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        // 用户已登录，可以在这里执行相关操作
        const userInfo = res.data;
        wx.redirectTo({
          url: '/pages/profile/profile'
        });
      },
      fail() {
        // 用户未登录，弹出提示
        wx.showModal({
          title: '提示',
          content: '请先登录',
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '/pages/login/login'
              });
            }
          }
        });
      }
    });
  wx.authorize({
    scope: 'scope.userLocation',
    success() {
      // 用户允许获取位置
    },
    fail() {
      wx.showModal({
        title: '提示',
        content: '请允许获取位置权限',
        success: (res) => {
          if (res.confirm) {
            wx.openSetting();
          }
        }
      });
    }
  });
  }
});
