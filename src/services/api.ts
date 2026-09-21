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

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.getAccess();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  }
);

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

const unwrap = <T>(
  data: T | { results: T }
): T => {
  return (
    data &&
    typeof data === "object" &&
    "results" in data
      ? data.results
      : data
  ) as T;
};

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
  }) =>
    (
      await api.post(
        "/auth/register/",
        payload
      )
    ).data,

  me: async () =>
    (await api.get("/auth/me/")).data,

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

  verifyEmail: async (token: string) =>
    (
      await api.post(
        "/auth/verify-email/",
        { token }
      )
    ).data,

  forgotPassword: async (email: string) =>
    (
      await api.post(
        "/auth/forgot-password/",
        { email }
      )
    ).data,

  resetPassword: async (
    token: string,
    password: string
  ) =>
    (
      await api.post(
        "/auth/reset-password/",
        { token, password }
      )
    ).data,

  updateProfile: async (
    payload: Record<string, unknown>
  ) =>
    (
      await api.patch(
        "/auth/me/",
        payload
      )
    ).data,
};

export const movieService = {
  getMovies: async (
    params: Record<string, unknown> = {}
  ) =>
    unwrap(
      (
        await api.get("/movies/", {
          params: {
            content_type: "movie",
            ...params,
          },
        })
      ).data
    ),

  getMovie: async (id: number) =>
    (
      await api.get(`/movies/${id}/`)
    ).data,

  searchMovies: async (q: string) =>
    unwrap(
      (
        await api.get("/movies/search/", {
          params: { q },
        })
      ).data
    ),

  getTrending: async () =>
    unwrap(
      (
        await api.get("/movies/trending/")
      ).data
    ),
};

export const showService = {
  getShows: async () =>
    unwrap(
      (
        await api.get("/movies/", {
          params: {
            content_type: "show",
          },
        })
      ).data
    ),

  getShow: async (id: number) =>
    (
      await api.get(`/movies/${id}/`)
    ).data,
};

export const animeService = {
  getAnime: async () =>
    unwrap(
      (
        await api.get("/movies/", {
          params: {
            content_type: "anime",
          },
        })
      ).data
    ),
};

export const episodeService = {
  getEpisodes: async (showId: number) =>
    unwrap(
      (
        await api.get(
          `/movies/${showId}/episodes/`
        )
      ).data
    ),
};

export const catalogService = {
  getGenres: async () =>
    unwrap(
      (await api.get("/genres/")).data
    ),

  getPeople: async () =>
    unwrap(
      (await api.get("/people/")).data
    ),

  getLive: async () =>
    unwrap(
      (await api.get("/live/")).data
    ),
};

export const blogService = {
  getBlogs: async () =>
    unwrap(
      (await api.get("/blogs/")).data
    ),

  getBlog: async (slug: string) =>
    (
      await api.get(`/blogs/${slug}/`)
    ).data,
};

export const userService = {
  getProfile: authService.me,

  updateProfile: authService.updateProfile,

  getMyList: async () =>
    unwrap(
      (
        await api.get("/user/my-list/")
      ).data
    ),

  addToMyList: async (content: number) =>
    (
      await api.post(
        "/user/my-list/",
        { content }
      )
    ).data,

  removeFromMyList: async (id: number) =>
    (
      await api.delete(
        `/user/my-list/${id}/`
      )
    ).data,

  getHistory: async () =>
    unwrap(
      (
        await api.get("/user/history/")
      ).data
    ),

  saveHistory: async (payload: {
    content: number;
    episode?: number | null;
    progress_seconds?: number;
    duration_seconds?: number;
  }) =>
    (
      await api.post(
        "/user/history/",
        payload
      )
    ).data,

  clearHistory: async () =>
    (
      await api.delete(
        "/user/history/clear/"
      )
    ).data,
};

export const subscriptionService = {
  getPlans: async () =>
    unwrap(
      (
        await api.get(
          "/subscriptions/plans/"
        )
      ).data
    ),

  getSubscriptions: async () =>
    unwrap(
      (
        await api.get(
          "/subscriptions/"
        )
      ).data
    ),

  checkout: async (
    plan_id: number,
    provider = "manual"
  ) =>
    (
      await api.post(
        "/subscriptions/checkout/",
        {
          plan_id,
          provider,
        }
      )
    ).data,
};

export const reviewService = {
  getReviews: async (id: number) =>
    unwrap(
      (
        await api.get(
          `/content/${id}/reviews/`
        )
      ).data
    ),

  createReview: async (
    id: number,
    rating: number,
    body: string
  ) =>
    (
      await api.post(
        `/content/${id}/reviews/`,
        {
          rating,
          body,
        }
      )
    ).data,
};

export const notificationService = {
  getNotifications: async () =>
    unwrap(
      (
        await api.get(
          "/notifications/"
        )
      ).data
    ),

  markRead: async (id: number) =>
    (
      await api.post(
        `/notifications/${id}/read/`
      )
    ).data,

  markAllRead: async () =>
    (
      await api.post(
        "/notifications/read_all/"
      )
    ).data,
};

export const analyticsService = {
  playback: async (payload: {
    content: number;
    event: string;
    position_seconds?: number;
    session_id?: string;
  }) =>
    (
      await api.post(
        "/analytics/playback/",
        payload
      )
    ).data,
};

export function getApiError(
  error: unknown,
  fallback = "Something went wrong"
) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as any;

    if (
      typeof data?.detail === "string"
    ) {
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
