import axiosClient from "./axiosClient";

export const loginUser = async (email: string, password: string) => {
    const res = await axiosClient.post("auth/login", { email, password });
    return res.data;
};

export const registerUser = async (username: string, email: string, password: string) => {
    const res = await axiosClient.post("auth/register", { username, email, password });
    return res.data;
};