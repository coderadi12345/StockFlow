import apiClient from '../api/axiosInstance';
import { API } from '../constants';
import { localAuthService } from './localAuthService';

export const authService = {
  register: (payload) => {
    const user = localAuthService.register(payload);
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: '',
      image: '',
      token: `local_${user.id}`,
    };
  },

  login: async (username, password) => {
    const localUser = localAuthService.login(username, password);
    if (localUser) {
      return {
        ...localUser,
        gender: '',
        image: '',
      };
    }

    try {
      const { data } = await apiClient.post(API.LOGIN, {
        username,
        password,
        expiresInMins: 60,
      });
      return {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
        token: data.accessToken || data.token,
      };
    } catch {
      throw new Error('Invalid credentials');
    }
  },
};
