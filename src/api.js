import Taro from '@tarojs/taro';

function request(url, data, method = 'GET') {
  return new Promise(resolve => {
    Taro.request(
      {
        url,
        data,
        method,
        header: {
          'Authorization': 'Bearer ' + Taro.getStorageSync('access_token')
        },
      }).then(res => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(res.data);
      } else {
        Taro.showToast({
          title: `${res.data.message}~` || '网络请求错误～',
          icon: 'none',
          mask: true
        });
      }
    });
  });
}
