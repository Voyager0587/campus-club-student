import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const TOKEN_KEY = "auth_token";
  const USER_INFO_KEY = "user_info";

  const token = ref(localStorage.getItem(TOKEN_KEY) || "");
  const userInfo = ref(JSON.parse(localStorage.getItem(USER_INFO_KEY) || "{}"));

  const login = (tokenVal, userInfoVal) => {
    token.value = tokenVal;
    userInfo.value = userInfoVal;

    localStorage.setItem(TOKEN_KEY, tokenVal);
    localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfoVal));
  };

  const logout = () => {
    token.value = "";
    userInfo.value = {};

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
  };

  return { token, userInfo, login, logout };
});
