const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  console.log('Received event:', JSON.stringify(event));
  const { action, userId, questionId } = event;

  switch (action) {
    case 'getQuestions':
      return await getQuestions();
    case 'addWrongQuestion':
      return await addWrongQuestion(userId, questionId);
    case 'getWrongQuestions':
      return await getWrongQuestions(userId);
    default:
      return { success: false, message: '未知操作' };
  }
};

async function getQuestions() {
  try {
    const questionCollection = await db.collection('questionCollection').get();
    return { success: true, data: questionCollection.data };
  } catch (error) {
    console.error('获取题目失败:', error);
    return { success: false, message: error.message || '获取题目失败' };
  }
}

async function addWrongQuestion(userId, questionId) {
  try {
    if (!userId || !questionId) {
      return { success: false, message: '用户ID和题目ID不能为空' };
    }

    const res = await db.collection('wrong_questionCollection').add({
      data: {
        userId,
        questionId,
        createTime: new Date(),
      }
    });

    console.log('错误题目添加结果:', res);
    return { success: true };
  } catch (error) {
    console.error('添加错误题目失败:', error);
    return { success: false, message: error.message || '添加错误题目失败' };
  }
}

async function getWrongQuestions(userId) {
  try {
    if (!userId) {
      return { success: false, message: '用户ID不能为空' };
    }

    const wrongQuestions = await db.collection('wrong_questionCollection').where({ userId }).get();
    console.log('错题查询结果:', wrongQuestions);

    return { success: true, data: wrongQuestions.data };
  } catch (error) {
    console.error('获取错题失败:', error);
    return { success: false, message: error.message || '获取错题失败' };
  }
}
