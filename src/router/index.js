import { createRouter, createWebHistory } from 'vue-router';
import MainPage from '../components/MainPage.vue'; // 메인 페이지
import UserRegisterPage from '../components/UserRegisterPage.vue'; // 회원가입 페이지
import LoginPage from '../components/LoginPage.vue'; // 로그인인 페이지
import UserDetailInfoPage from '../components/UserDetailInfoPage.vue'; // 상세정보 페이지
import UserInfoUpdatePage from '../components/UserInfoUpdatePage.vue'; // 회원정보 수정 페이지
import WithdrawPage from '../components/WithdrawPage.vue'; // 회원탈퇴 페이지
import PetsitterProfilePage from '@/components/PetsitterProfilePage.vue'
import PetsitterListPage from '@/components/PetsitterListPage.vue'
import PetsitterDetailPage from '@/components/PetsitterDetailPage.vue'
import ReservationManagePage from '@/components/ReservationManagePage.vue'
import PetTypeManagePage from '@/components/admin/PetTypeManagePage.vue'
import PetSitterManagePage from '@/components/admin/PetSitterManagePage.vue'

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegisterPage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'UserRegister',
    component: UserRegisterPage
  },
  {
    path: '/users/info',
    name: 'UserDetailInfoPage',
    component: UserDetailInfoPage
  },
  {
    path: '/users/update',
    name: 'UserInfoUpdatePage',
    component: UserInfoUpdatePage
  },
  {
    path: '/users/withdraw',
    name: 'WithdrawPage',
    component: WithdrawPage
  },
  {
    path: '/petsitter/profile',
    name: 'PetsitterProfile',
    component: PetsitterProfilePage
  },
  {
    path: '/petsitters',
    name: 'PetsitterList',
    component: PetsitterListPage
  },
  {
    path: '/petsitter/:id',
    name: 'PetsitterDetail',
    component: PetsitterDetailPage
  },
  {
    path: '/reservations/manage',
    name: 'ReservationManage',
    component: ReservationManagePage
  },
  {
    path: '/admin/pet-types',
    name: 'PetTypeManage',
    component: PetTypeManagePage
  },
  {
    path: '/admin/pet-sitters',
    component: PetSitterManagePage,
    meta: { requiresAuth: true, requiresAdmin: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
