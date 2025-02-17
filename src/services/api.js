import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
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
    const responseData = response.data;
    
    // ResponseTemplate 형식 검증
    if (responseData && typeof responseData === 'object') {
      if (!responseData.isSuccess) {
        return Promise.reject({
          code: responseData.code,
          message: responseData.message || '요청이 실패했습니다.'
        });
      }
      // results 필드가 있는 경우에만 데이터 추출
      if ('results' in responseData) {
        response.data = responseData.results;
      }
    }
    return response;
  },
  error => {
    console.error('Response Error:', error.response || error);
    if (error.response?.data) {
      const errorData = error.response.data;
      return Promise.reject({
        code: errorData.code || 'UNKNOWN_ERROR',
        message: errorData.message || '알 수 없는 오류가 발생했습니다.',
        status: error.response.status
      });
    }
    return Promise.reject({
      code: 'NETWORK_ERROR',
      message: '네트워크 오류가 발생했습니다.'
    });
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

  // 비밀번호 변경
  changePassword: (newPassword) => {
    return api.put('/users/reset-password', {
      password: newPassword
    })
  },

  // 회원 탈퇴
  withdraw: () => {
    return api.delete('/users/withdraw')
  }
}

export const petsitterApi = {
  // 펫시터 신청
  applyPetsitter: () => {
    return api.post('/pet-sitters/apply')
  },

  // 펫시터 프로필 신규 등록
  createProfile: (profileData) => {
    return api.post('/pet-sitters/profile', {
      region: profileData.region,
      availableStartTime: profileData.availableStartTime,
      availableEndTime: profileData.availableEndTime,
      price: profileData.price,
      petTypeIds: profileData.petTypeIds
    })
  },

  // 펫시터 프로필 수정
  updateProfile: (profileData) => {
    return api.put('/pet-sitters/profile', {
      region: profileData.region,
      availableStartTime: profileData.availableStartTime,
      availableEndTime: profileData.availableEndTime,
      price: profileData.price,
      petTypeIds: profileData.petTypeIds
    })
  },

  // 펫시터 프로필 존재 여부 확인
  hasProfile: () => {
    return api.get('/pet-sitters/profile/exists')
  },

  // 펫시터 프로필 조회 (자신의 프로필 또는 특정 펫시터의 프로필)
  getProfile: (petsitterId = null) => {
    const params = petsitterId ? { petSitterId: petsitterId } : {}
    return api.get('/pet-sitters/profile', { params })
  },

  // 모든 펫시터 목록 조회
  getAllPetsitters: () => {
    return api.get('/pet-sitters')
  },

  // 펫시터 상태 확인
  checkStatus: () => {
    return api.get('/pet-sitters/status')
  },

  // 펫시터 탈퇴
  quitPetsitter: () => {
    return api.delete('/pet-sitters')
  }
}

// 반려동물 타입 API
export const petTypeApi = {
  // 반려동물 타입 목록 조회
  getAllPetTypes: () => {
    return api.get('/pet-types')
  },

  // 반려동물 타입 생성
  createPetType: (data) => {
    return api.post('/pet-types', data)
  },

  // 반려동물 타입 수정
  updatePetType: (id, data) => {
    return api.put(`/pet-types/${id}`, data)
  },

  // 반려동물 타입 삭제
  deletePetType: (id) => {
    return api.delete(`/pet-types/${id}`)
  }
}

export const reservationApi = {
  // 대기중인 예약 목록 조회
  getPendingReservations: () => {
    return api.get('/reservations/pending')
  },

  // 모든 예약 목록 조회
  getAllReservations: () => {
    return api.get('/reservations')
  },

  // 예약 수락
  acceptReservation: (reservationId) => {
    return api.post(`/reservations/${reservationId}/accept`)
  },

  // 예약 거절
  rejectReservation: (reservationId) => {
    return api.post(`/reservations/${reservationId}/reject`)
  },

  // 예약 요청
  createReservation: (reservationData) => {
    return api.post('/reservations/request', reservationData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },

  getUserReservations: () => {
    return api.get('/reservations/my-reservations');
  },

  updateReservationDate: (reservationId, newDate) => {
    return api.put(`/reservations/${reservationId}/update-date`, { newDate });
  }
}

// adminApi 추가
export const adminApi = {
  // 펫시터 신청 목록 조회
  getPendingPetSitters: () => {
    return api.get('/admin/pet-sitters/pending')
  },

  // 펫시터 신청 승인
  approvePetSitter: (petSitterId) => {
    return api.post(`/admin/pet-sitters/${petSitterId}/approve`)
  },

  // 펫시터 신청 거절
  rejectPetSitter: (petSitterId) => {
    return api.post(`/admin/pet-sitters/${petSitterId}/reject`)
  }
} 