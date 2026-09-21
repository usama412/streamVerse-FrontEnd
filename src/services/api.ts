import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000/api"
).replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

const accessKey = "streamverse_access";
const refreshKey = "streamverse_refresh";

export const tokenStore = {
  getAccess: () => localStorage.getItem(accessKey),

  getRefresh: () => localStorage.getItem(refreshKey),

  set: (access: string, refresh?: string) => {
    localStorage.setItem(accessKey, access);

    if (refresh) {
      localStorage.setItem(refreshKey, refresh);
    }
  },

  clear: () => {
    localStorage.removeItem(accessKey);
    localStorage.removeItem(refreshKey);
  },
};

// ========================================
// REQUEST INTERCEPTOR
// ========================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getAccess();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

// ========================================
// RESPONSE INTERCEPTOR
// ========================================

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      original.url?.includes("/auth/refresh/")
    ) {
      return Promise.reject(error);
    }

    const refresh = tokenStore.getRefresh();

    if (!refresh) {
      tokenStore.clear();
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = api
          .post("/auth/refresh/", { refresh })
          .then(({ data }) => {
            tokenStore.set(
              data.access,
              data.refresh || refresh
            );

            return data.access as string;
          })
          .catch(() => null)
          .finally(() => {
            refreshPromise = null;
          });
      }

      const access = await refreshPromise;

      if (!access) {
        tokenStore.clear();
        return Promise.reject(error);
      }

      original.headers.Authorization = `Bearer ${access}`;

      return api(original);
    } catch {
      tokenStore.clear();
      return Promise.reject(error);
    }
  }
);

// ========================================
// UNWRAP PAGINATED RESPONSE
// ========================================

const unwrap = <T>(
  data: T | { results: T }
): T => {
  if (
    data &&
    typeof data === "object" &&
    "results" in data &&
    Array.isArray((data as any).results)
  ) {
    return (data as any).results as T;
  }

  return data as T;
};

// ========================================
// AUTH
// ========================================

export const authService = {
  login: async (payload: {
    email: string;
    password: string;
  }) => {
    const { data } = await api.post(
      "/auth/login/",
      payload
    );

    tokenStore.set(data.access, data.refresh);

    return data;
  },

  register: async (payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const { data } = await api.post(
      "/auth/register/",
      payload
    );

    return data;
  },

  me: async () => {
    const { data } = await api.get("/auth/me/");
    return data;
  },

  logout: async () => {
    const refresh = tokenStore.getRefresh();

    try {
      await api.post(
        "/auth/logout/",
        refresh ? { refresh } : {}
      );
    } finally {
      tokenStore.clear();
    }
  },

  verifyEmail: async (token: string) => {
    const { data } = await api.post(
      "/auth/verify-email/",
      { token }
    );

    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await api.post(
      "/auth/forgot-password/",
      { email }
    );

    return data;
  },

  resetPassword: async (
    token: string,
    password: string
  ) => {
    const { data } = await api.post(
      "/auth/reset-password/",
      {
        token,
        password,
      }
    );

    return data;
  },

  updateProfile: async (
    payload: Record<string, unknown>
  ) => {
    const { data } = await api.patch(
      "/auth/me/",
      payload
    );

    return data;
  },
};

// ========================================
// MOVIES
// ========================================

export const movieService = {
  getMovies: async (
    params: Record<string, unknown> = {}
  ) => {
    const { data } = await api.get(
      "/movies/",
      {
        params: {
          content_type: "movie",
          ...params,
        },
      }
    );

    return unwrap(data);
  },

  getMovie: async (id: number) => {
    const { data } = await api.get(
      `/movies/${id}/`
    );

    return data;
  },

  searchMovies: async (q: string) => {
    const { data } = await api.get(
      "/movies/search/",
      {
        params: { q },
      }
    );

    return unwrap(data);
  },

  getTrending: async () => {
    const { data } = await api.get(
      "/movies/trending/"
    );

    return unwrap(data);
  },
};

// ========================================
// SHOWS
// ========================================

export const showService = {
  getShows: async () => {
    const { data } = await api.get(
      "/movies/",
      {
        params: {
          content_type: "show",
        },
      }
    );

    return unwrap(data);
  },

  getShow: async (id: number) => {
    const { data } = await api.get(
      `/movies/${id}/`
    );

    return data;
  },
};

// ========================================
// ANIME
// ========================================

export const animeService = {
  getAnime: async () => {
    const { data } = await api.get(
      "/movies/",
      {
        params: {
          content_type: "anime",
        },
      }
    );

    return unwrap(data);
  },
};

// ========================================
// EPISODES
// ========================================

export const episodeService = {
  getEpisodes: async (showId: number) => {
    const { data } = await api.get(
      `/movies/${showId}/episodes/`
    );

    return unwrap(data);
  },
};

// ========================================
// CATALOG
// ========================================

export const catalogService = {
  getGenres: async () => {
    const { data } = await api.get("/genres/");
    return unwrap(data);
  },

  getPeople: async () => {
    const { data } = await api.get("/people/");
    return unwrap(data);
  },

  getLive: async () => {
    const { data } = await api.get("/live/");
    return unwrap(data);
  },
};

// ========================================
// BLOG
// ========================================

export const blogService = {
  getBlogs: async () => {
    const { data } = await api.get("/blogs/");
    return unwrap(data);
  },

  getBlog: async (slug: string) => {
    const { data } = await api.get(
      `/blogs/${slug}/`
    );

    return data;
  },
};

// ========================================
// USER
// ========================================

export const userService = {
  getProfile: authService.me,

  updateProfile: authService.updateProfile,

  getMyList: async () => {
    const { data } = await api.get(
      "/user/my-list/"
    );

    return unwrap(data);
  },

  addToMyList: async (content: number) => {
    const { data } = await api.post(
      "/user/my-list/",
      { content }
    );

    return data;
  },

  removeFromMyList: async (id: number) => {
    const { data } = await api.delete(
      `/user/my-list/${id}/`
    );

    return data;
  },

  getHistory: async () => {
    const { data } = await api.get(
      "/user/history/"
    );

    return unwrap(data);
  },

  saveHistory: async (payload: {
    content: number;
    episode?: number | null;
    progress_seconds?: number;
    duration_seconds?: number;
  }) => {
    const { data } = await api.post(
      "/user/history/",
      payload
    );

    return data;
  },

  clearHistory: async () => {
    const { data } = await api.delete(
      "/user/history/clear/"
    );

    return data;
  },
};

// ========================================
// SUBSCRIPTIONS
// ========================================

export const subscriptionService = {
  getPlans: async () => {
    const { data } = await api.get(
      "/subscriptions/plans/"
    );

    return unwrap(data);
  },

  getSubscriptions: async () => {
    const { data } = await api.get(
      "/subscriptions/"
    );

    return unwrap(data);
  },

  checkout: async (
    plan_id: number,
    provider = "manual"
  ) => {
    const { data } = await api.post(
      "/subscriptions/checkout/",
      {
        plan_id,
        provider,
      }
    );

    return data;
  },
};

// ========================================
// REVIEWS
// ========================================

export const reviewService = {
  getReviews: async (id: number) => {
    const { data } = await api.get(
      `/content/${id}/reviews/`
    );

    return unwrap(data);
  },

  createReview: async (
    id: number,
    rating: number,
    body: string
  ) => {
    const { data } = await api.post(
      `/content/${id}/reviews/`,
      {
        rating,
        body,
      }
    );

    return data;
  },
};

// ========================================
// NOTIFICATIONS
// ========================================

export const notificationService = {
  getNotifications: async () => {
    const { data } = await api.get(
      "/notifications/"
    );

    return unwrap(data);
  },

  markRead: async (id: number) => {
    const { data } = await api.post(
      `/notifications/${id}/read/`
    );

    return data;
  },

  markAllRead: async () => {
    const { data } = await api.post(
      "/notifications/read_all/"
    );

    return data;
  },
};

// ========================================
// ANALYTICS
// ========================================

export const analyticsService = {
  playback: async (payload: {
    content: number;
    event: string;
    position_seconds?: number;
    session_id?: string;
  }) => {
    const { data } = await api.post(
      "/analytics/playback/",
      payload
    );

    return data;
  },
};

// ========================================
// API ERROR
// ========================================

export function getApiError(
  error: unknown,
  fallback = "Something went wrong"
) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as any;

    if (typeof data?.detail === "string") {
      return data.detail;
    }

    if (
      typeof data === "object" &&
      data !== null
    ) {
      const first = Object.values(data)
        .flat()
        .find(
          (x) => typeof x === "string"
        );

      if (first) {
        return String(first);
      }
    }

    if (error.message) {
      return error.message;
    }
  }

  return fallback;
}