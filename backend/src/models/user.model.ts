export interface User {
    id: number;
    username: string;
    email: string;
    password: string; // hashed
}

export const users: User[] = [];
