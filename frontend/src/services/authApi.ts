import axiosClient from "./axiosClient";

export const loginUser = async (username: string, password: string) => {
    try {
        const res = await axiosClient.post("/auth/login", { username, password });
        return res.data;
    } catch (err: any) {
        throw new Error(
            err?.response?.data?.message || 
            err?.response?.data?.errors?.[0]?.msg || 
            "Invalid username or password");
    }
};

export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const res = await axiosClient.post("/auth/register", { username, email, password });
        return res.data;
    } catch (err: any) {
        throw new Error(err?.response?.data?.message || "Registration failed");
    }
};