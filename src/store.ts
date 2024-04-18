import { defineStore } from 'pinia';
import axios_ from 'axios';

const axios = axios_.create({
    baseURL: "http://localhost:8000/api/v1", //后端地址
    headers: {
      'Content-type': 'application/json',
    },
  })

export const useAuthStore = defineStore({
    id: 'auth',
    state: () => ({
        token: "",
        refreshTokenTimeout: setTimeout(() => {}, 5*60*1000)
    }),
    actions: {
        async login(org: String, username: String, password: String) {
            const response = await axios.post('/auth/login/', {"org": org, "user": username, "passwd": password});
            this.token = response.data.token;
            this.startRefreshTokenTimer();
            return response
        },
        async logout() {
            await axios.post(`auth/login/revoke-token`);
            this.stopRefreshTokenTimer();
            this.token = "";
            // router.push('/login');
        },
        async refreshToken() {
            this.token = await axios.post(`auth/login/refresh-token`);
            this.startRefreshTokenTimer();
        },
        startRefreshTokenTimer() {
            // parse json object from base64 encoded jwt token
            const jwtBase64 = this.token.split('.')[1];
            const jwtToken = JSON.parse(atob(jwtBase64));
    
            // set a timeout to refresh the token a minute before it expires
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout);
        },    
        stopRefreshTokenTimer() {
            clearTimeout(this.refreshTokenTimeout);
        }
    }
});