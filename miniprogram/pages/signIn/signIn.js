Page({
  data: {
    latitude: null,
    longitude: null,
    targetLocation: null, // 用于存储目标位置
    distance: null,
    isSignedIn: false,
  },

  onLoad() {
    this.getLocation();
  },

  getLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        });
        // 计算距离时确保目标位置已选择
        if (this.data.targetLocation) {
          this.calculateDistance(res.latitude, res.longitude);
        }
      },
      fail: () => {
        wx.showToast({ title: '获取位置失败，请允许定位', icon: 'none' });
      }
    });
  },

  chooseTargetLocation() {
    wx.navigateTo({
      url: '/pages/chooseLocation/chooseLocation', // 跳转到选择位置页面
    });
  },

  setTargetLocation(location) {
    this.setData({ targetLocation: location });
    this.calculateDistance(this.data.latitude, this.data.longitude);
  },

  calculateDistance(latitude, longitude) {
    if (!this.data.targetLocation) return;

    const target = this.data.targetLocation;
    const distance = this.getDistance(latitude, longitude, target.latitude, target.longitude);
    this.setData({ distance });
  },

  getDistance(lat1, lon1, lat2, lon2) {
    const rad = (d) => d * Math.PI / 180.0;
    const earthRadius = 6378137; // 地球半径，单位为米
    const dLat = rad(lat2 - lat1);
    const dLon = rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadius * c; // 返回米
  },

  handleSignIn() {
    if (this.data.distance < 50) {
      wx.showToast({ title: '签到成功', icon: 'success' });
      this.setData({ isSignedIn: true });
      // 这里可以调用云函数保存签到记录
    } else {
      wx.showToast({ title: '距离目标位置过远', icon: 'none' });
    }
  }
});
