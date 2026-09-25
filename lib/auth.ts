export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("token");
  return !!token;
};

export const getToken = (): string => {
  if (typeof window === "undefined") return "";
  const token = localStorage.getItem("token");
  return token || "";
};

export const setToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const deleteToken = (): boolean => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    return true;
  }
  return false;
};
