import { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "hr_admin" | "employee";

export interface AuthUser {
  id: number;
  name: string;
  role: UserRole;
  department: string;
  avatar: string;
  title: string;
  email: string;
}

export const MOCK_USERS: AuthUser[] = [
  {
    id: 1,
    name: "Jane Cooper",
    role: "hr_admin",
    department: "Human Resources",
    avatar: "JC",
    title: "HR Manager",
    email: "jane.cooper@hrportal.com",
  },
  {
    id: 2,
    name: "John Doe",
    role: "employee",
    department: "Engineering",
    avatar: "JD",
    title: "Software Engineer",
    email: "john.doe@hrportal.com",
  },
];

interface AuthContextValue {
  currentUser: AuthUser | null;
  login: (userId: number) => void;
  logout: () => void;
  isHRAdmin: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  login: () => {},
  logout: () => {},
  isHRAdmin: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const stored = sessionStorage.getItem("hr-auth-user");
    if (stored) {
      try {
        return JSON.parse(stored) as AuthUser;
      } catch {
        return null;
      }
    }
    return null;
  });

  const login = (userId: number) => {
    const user = MOCK_USERS.find((u) => u.id === userId) ?? null;
    setCurrentUser(user);
    if (user) {
      sessionStorage.setItem("hr-auth-user", JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("hr-auth-user");
  };

  const isHRAdmin = currentUser?.role === "hr_admin";

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isHRAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
