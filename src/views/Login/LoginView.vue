<template>
    <div class="custom-container">
        <div>
            <h1 class="text-center">Log in</h1>
            <el-form ref="loginForm" :model="loginData" :rules="loginRules">
                <el-form-item label="Org" prop="org">
                    <el-input v-model="loginData.org" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Username" prop="username">
                    <el-input v-model="loginData.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Password" prop="password">
                    <el-input v-model="loginData.password" type="password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login()">Login</el-button>
                </el-form-item>
            </el-form>
            <el-alert v-if="loginError" title="Invalid login" type="error"
                description="Please check your credentials and try again." />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useAuthStore } from '@/store';
import { AxiosError } from 'axios';
import { ElMessage } from 'element-plus';
const authStore = useAuthStore();

interface LoginData {
    org: string;
    username: string;
    password: string;
}

const loginData = ref<LoginData>({
    org: '',
    username: '',
    password: '',
});

const loginRules = {
    org: [{ required: true, message: 'Please enter your org', trigger: 'blur' }],
    username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
    password: [{ required: true, message: 'Please enter your password', trigger: 'blur' }],
};

const loginError = ref(false);
const loginForm = ref('');

const login = () => {
    loginError.value = false;
    (loginForm.value as any).validate(async (valid: boolean) => {
        if (valid) {
            authStore.login(loginData.value.org, loginData.value.username, loginData.value.password)
            .then((result) => {
                console.log(result)
                ElMessage({ showClose: true, message: "Login success", type: 'success'});
            }).catch((result: AxiosError) => {
                console.log(result)
                ElMessage({ showClose: true, message: result.response.data.detail, type: 'error'});
            })
        } else {
            loginError.value = true;
        }
    });
};

</script>
  
<style scoped>
.custom-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>import type { defineStore } from 'pinia';useAuthStore, import type { AxiosError } from 'axios';
, Axios
