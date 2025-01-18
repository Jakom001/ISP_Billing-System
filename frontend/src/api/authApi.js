import apiClient from "../services/apiClient";

const getLoginUser = apiClient.get('/auths/login');
const login = apiClient.get('/auths/login');
const registerUser = apiClient.post('/auths/register');

const logout = apiClient.post('/auths/logout');
