const amapFile = require("../../libs/amap-wx.130.js");
Page({
  data: {
    latitude: null,
    longitude: null,
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
        this.map = new amapFile.AMapWX({
          key: '31d496adea40bd28eb0be8aafb564b3a' 
        });
      },
    });
  },

  chooseLocation(e) {
    const { latitude, longitude } = e.detail; // 选中的位置
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; // 获取上一个页面

    // 将选中的位置传回签到页面
    prevPage.setTargetLocation({ latitude, longitude });
    wx.navigateBack();
  }
});
