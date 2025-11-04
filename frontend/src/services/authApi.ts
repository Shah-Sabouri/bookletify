import axiosClient from "./axiosClient";
import { AxiosError } from "axios";

export const loginUser = async (username: string, password: string) => {
    try {
        const res = await axiosClient.post("/auth/login", { username, password });
        return res.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string; errors?: { msg: string }[] }>;

        throw new Error(
            error.response?.data?.message ||
            error.response?.data?.errors?.[0]?.msg ||
            "Invalid username or password"
        );
    }
};

export const registerUser = async (username: string, email: string, password: string) => {
    try {
        const res = await axiosClient.post("/auth/register", { username, email, password });
        return res.data;
    } catch (err: unknown) {
        const error = err as AxiosError<{ message?: string }>;

        throw new Error(
            error.response?.data?.message || "Registration failed"
        );
    }
};
