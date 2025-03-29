import { ReactNode } from 'react';
interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => Promise<void>;
}
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}
export declare function AuthProvider({ children }: {
    children: ReactNode;
}): import("react").JSX.Element;
export declare const useAuth: () => AuthContextType;
export {};
