import { defineStore } from 'pinia';
import axios_ from 'axios';

const axios = axios_.create({
    baseURL: "http://localhost:58000/api/v1", //后端地址
    headers: {
      'Content-type': 'application/json',
    },
  })

const ID_AUTH = 'auth'
export const useAuthStore = defineStore({
    id: ID_AUTH,
    state: () => ({
        token: "",
        refreshTokenTimeout: setTimeout(() => {}, 5*60*1000)
    }),
    getters: {
        getToken: (state) => {
            if (state.token)
                return state.token;
            const tokenStorage = localStorage.getItem(ID_AUTH)
            if (tokenStorage)
                state.token = JSON.parse(tokenStorage);
            return state.token;
        },
        getOrgAndUsername: (state) => {
            let token = null;
            if (state.token)
                token = state.token;
            const tokenStorage = localStorage.getItem(ID_AUTH)
            if (!tokenStorage) return null;
            token = JSON.parse(tokenStorage);
            const jwtBase64 = token.split('.')[1];
            const jwtToken = JSON.parse(atob(jwtBase64));
            return jwtToken;
        }
    },
    actions: {
        async login(org: String, username: String, password: String) {
            const response = await axios.post('/auth/login/', {"org": org, "user": username, "passwd": password});
            this.token = response.data.token;
            localStorage.setItem(this.$id, JSON.stringify(this.token))
            this.startRefreshTokenTimer();
            return response
        },
        async logout() {
            // await axios.post(`auth/login/revoke-token`);  // Not implemented at backend
            this.stopRefreshTokenTimer();
            this.token = "";
            localStorage.removeItem(this.$id)
            // router.push('/login');
        },
        async refreshToken() {
            // this.token = await axios.post(`auth/login/refresh-token`);  // Not implemented at backend
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