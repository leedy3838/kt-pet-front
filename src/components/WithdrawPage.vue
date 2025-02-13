<template>
  <div class="container">
    <div class="form-card">
      <h2 class="title">회원 탈퇴</h2>
      
      <div class="warning">
        <p class="warning-text">주의: 회원 탈퇴는 되돌릴 수 없습니다.</p>
        <p class="info-text">탈퇴 시 다음 사항을 숙지해 주세요:</p>
        <ul class="info-list">
          <li>모든 개인 정보가 삭제됩니다.</li>
          <li>진행 중인 예약이나 거래가 모두 취소됩니다.</li>
          <li>작성한 리뷰와 댓글은 삭제되지 않습니다.</li>
          <li>탈퇴 후 30일간 재가입이 제한됩니다.</li>
        </ul>
      </div>

      <div class="form-group">
        <label for="reason" class="form-label">탈퇴 사유 (선택사항)</label>
        <select id="reason" v-model="reason" class="form-select">
          <option value="">선택해주세요</option>
          <option value="서비스 불만족">서비스 불만족</option>
          <option value="개인정보 보호 우려">개인정보 보호 우려</option>
          <option value="사용 빈도 낮음">사용 빈도 낮음</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div v-if="reason === '기타'" class="form-group">
        <label for="otherReason" class="form-label">기타 사유</label>
        <textarea id="otherReason" v-model="otherReason" rows="3" class="form-textarea" placeholder="탈퇴 사유를 자세히 적어주세요."></textarea>
      </div>

      <div class="form-group">
        <label for="password" class="form-label">비밀번호 확인</label>
        <input id="password" v-model="password" type="password" required class="form-input" placeholder="현재 비밀번호를 입력해주세요">
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input v-model="confirmDeletion" type="checkbox" class="form-checkbox">
          <span class="checkbox-text">위 내용을 모두 확인했으며, 회원 탈퇴에 동의합니다.</span>
        </label>
      </div>

      <div class="button-group">
        <button @click="cancelDeletion" class="cancel-button">취소</button>
        <button @click="confirmAccountDeletion" :disabled="!isFormValid" class="delete-button">회원 탈퇴</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AccountDeletion',
  data() {
    return {
      reason: '',
      otherReason: '',
      password: '',
      confirmDeletion: false
    }
  },
  computed: {
    isFormValid() {
      return this.password && this.confirmDeletion && 
             (this.reason !== '기타' || (this.reason === '기타' && this.otherReason.trim() !== ''));
    }
  },
  methods: {
    cancelDeletion() {
      console.log('탈퇴 취소');
    },
    confirmAccountDeletion() {
      if (!this.isFormValid) {
        return;
      }

      console.log('회원 탈퇴 처리:', {
        reason: this.reason === '기타' ? this.otherReason : this.reason,
        password: this.password
      });
      alert('회원 탈퇴가 완료되었습니다. 이용해 주셔서 감사합니다.');
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f4f8;
}

.form-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 400px;
  width: 100%;
}

.title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.warning {
  margin-bottom: 20px;
}

.warning-text {
  color: #e63946;
  font-weight: bold;
}

.info-text {
  color: #555;
}

.info-list {
  list-style-type: disc;
  padding-left: 20px;
  color: #555;
}

.form-group {
  margin-bottom: 15px;
}

.form-label {
  display: block;
  font-weight: 500;
  margin-bottom: 5px;
  color: #333;
}

.form-select, .form-input, .form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  transition: border-color 0.2s;
}

.form-select:focus, .form-input:focus, .form-textarea:focus {
  border-color: #007bff;
  outline: none;
}

.form-textarea {
  resize: vertical;
}

.checkbox-label {
  display: flex;
  align-items: center;
}

.form-checkbox {
  margin-right: 10px;
}

.checkbox-text {
  color: #333;
}

.button-group {
  display: flex;
  justify-content: space-between;
}

.cancel-button {
  background-color: #ccc;
  color: #333;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #bbb;
}

.delete-button {
  background-color: #e63946;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #d62839;
}

.delete-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
