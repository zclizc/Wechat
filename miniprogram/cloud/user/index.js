const cloud = require('wx-server-sdk');

cloud.init();
const db = cloud.database();

exports.main = async (event, context) => {
  console.log('Received event:', JSON.stringify(event));
  const { action, username, password, userInfo } = event;

  switch (action) {
    case 'register':
      return await registerUser(username, password);
    case 'login':
      return await loginUser(username, password);
    case 'getUserInfo':
      return await getUserInfo(username);
    case 'updateUserInfo':
      return await updateUserInfo(username, userInfo); // 新增的更新用户信息调用
    case 'getCurrentUserInfo':
      return await getCurrentUserInfo(username);
    default:
      return { success: false, message: '未知操作' };
  }
};

async function registerUser(username, password) {
  try {
    if (!username || username.length < 3 || username.length > 20) {
      return { success: false, message: '用户名必须在3到20个字符之间' };
    }

    const userCheck = await db.collection('userCollection').where({ username }).get();
    console.log('User check result:', userCheck);

    if (userCheck.data.length > 0) {
      return { success: false, message: '用户名已存在' };
    }

    const res = await db.collection('userCollection').add({
      data: {
        username,
        password, // 生产环境中请加密密码
        email: '',
        phone: '',
        createTime: new Date(),
      }
    });

    console.log('User registration result:', res);
    return { success: true, userId: res._id };
  } catch (error) {
    console.error('注册失败:', error);
    return { success: false, message: error.message || '注册失败' };
  }
}

async function loginUser(username, password) {
  try {
    const userCheck = await db.collection('userCollection').where({ username }).get();
    console.log('User check result:', userCheck);

    if (userCheck.data.length === 0) {
      return { success: false, message: '用户不存在' };
    }

    const user = userCheck.data[0];

    if (user.password !== password) {
      return { success: false, message: '密码错误' };
    }

    return { success: true, userId: user._id };
  } catch (error) {
    console.error('登录失败:', error);
    return { success: false, message: error.message || '登录失败' };
  }
}

async function getUserInfo(username) {
  try {
    const user = await db.collection('userCollection').where({ username }).get();
    console.log('User retrieval result:', user);

    if (user.data.length === 0) {
      return { success: false, message: '用户不存在' };
    }
    return { success: true, data: user.data[0] };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return { success: false, message: error.message || '获取用户信息失败' };
  }
}

async function getCurrentUserInfo(username) {
  try {
    if (!username) {
      return { success: false, message: '用户名不能为空' };
    }

    const user = await db.collection('userCollection').where({ username }).get();
    console.log('Current user retrieval result:', user);

    if (user.data.length === 0) {
      return { success: false, message: '用户不存在' };
    }
    return { success: true, data: user.data[0] };
  } catch (error) {
    console.error('获取当前用户信息失败:', error);
    return { success: false, message: error.message || '获取当前用户信息失败' };
  }
}

// 新增的更新用户信息函数
async function updateUserInfo(username, userInfo) {
  try {
    if (!username) {
      return { success: false, message: '用户名不能为空' };
    }

    const res = await db.collection('userCollection').where({ username }).update({
      data: {
        email: userInfo.email || '',
        phone: userInfo.phone || '',
      }
    });

    console.log('User info update result:', res);
    if (res.stats.updated === 0) {
      return { success: false, message: '用户信息更新失败' };
    }
    return { success: true };
  } catch (error) {
    console.error('更新用户信息失败:', error);
    return { success: false, message: error.message || '更新用户信息失败' };
  }
}
