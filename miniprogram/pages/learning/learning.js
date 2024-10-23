Page({
  data: {
    questions: [],
    currentQuestion: null,
    userId: '', // 假设用户ID在登录时设置
  },

  onLoad() {
    this.getUserId(); // 获取用户ID
    this.getQuestions(); // 获取题目
  },

  getUserId() {
    this.setData({ userId: wx.getStorageSync('userId') }); // 从本地存储获取用户ID
  },

  async getQuestions() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'getQuestions',
        },
      });

      if (res.result.success) {
        this.setData({ questions: res.result.data });
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' });
      }
    } catch (error) {
      wx.showToast({ title: '获取题目失败', icon: 'none' });
      console.error('获取题目失败:', error);
    }
  },

  selectQuestion(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentQuestion: this.data.questions[index] });
  },

  async addWrongQuestion() {
    if (!this.data.currentQuestion) {
      wx.showToast({ title: '请先选择题目', icon: 'none' });
      return;
    }

    try {
      const res = await wx.cloud.callFunction({
        name: 'question',
        data: {
          action: 'addWrongQuestion',
          userId: this.data.userId,
          questionId: this.data.currentQuestion._id,
        },
      });

      if (res.result.success) {
        wx.showToast({ title: '错题已收藏', icon: 'success' });
      } else {
        wx.showToast({ title: res.result.message, icon: 'none' });
      }
    } catch (error) {
      wx.showToast({ title: '收藏错题失败', icon: 'none' });
      console.error('收藏错题失败:', error);
    }
  },
});
