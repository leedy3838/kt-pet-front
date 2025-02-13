import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:18080/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// 요청 인터셉터 추가
api.interceptors.request.use(
  config => {
    console.log('Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 수정
api.interceptors.response.use(
  response => {
    console.log('Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('Response Error:', error.response || error);
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

export const userApi = {
  // 회원가입
  register: (userData) => {
    return api.post('/users', {
      email: userData.email,
      name: userData.name,
      password: userData.password,
      phoneNumber: userData.phone // phone을 phoneNumber로 변경
    })
  },

  // 로그인
  login: (credentials) => {
    return api.post('/users/login', {
      email: credentials.email,
      password: credentials.password
    })
  },

  // 로그아웃
  logout: () => {
    return api.get('/users/logout')
  },

  // 회원 정보 조회
  getUserInfo: () => {
    return api.get('/users/my-info')
  },

  // 회원 정보 수정
  updateUserInfo: (userInfo) => {
    return api.put('/users/update', {
      name: userInfo.name,
      phoneNumber: userInfo.phone
    })
  },

  // 비밀번호 변경 (수정된 부분)
  changePassword: (passwordData) => {
    return api.put('/users/reset-password', {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
  },

  // 회원 탈퇴
  withdraw: () => {
    return api.delete('/users/withdraw')
  }
} 