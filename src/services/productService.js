import apiClient from '../api/axiosInstance';
import { API } from '../constants';

export const productService = {
  getAll: async (params = {}) => {
    const { limit = 100, skip = 0, select } = params;
    const { data } = await apiClient.get(API.PRODUCTS, {
      params: { limit, skip, ...(select ? { select } : {}) },
    });
    return data;
  },

  getById: async (id) => {
    const { data } = await apiClient.get(`${API.PRODUCTS}/${id}`);
    return data;
  },

  search: async (query, params = {}) => {
    const { limit = 100, skip = 0 } = params;
    const { data } = await apiClient.get(API.SEARCH, {
      params: { q: query, limit, skip },
    });
    return data;
  },

  getByCategory: async (category, params = {}) => {
    const { limit = 100, skip = 0 } = params;
    const { data } = await apiClient.get(`${API.PRODUCTS}/category/${category}`, {
      params: { limit, skip },
    });
    return data;
  },

  getCategories: async () => {
    const { data } = await apiClient.get(API.CATEGORIES);
    return data;
  },
};
