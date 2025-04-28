
import { toast } from "sonner";
import { User } from "@/types";

// Mock data for users in localStorage
const STORAGE_KEY = "qr_menu_users";
const TOKEN_KEY = "qr_menu_token";
const CURRENT_USER_KEY = "qr_menu_current_user";

// Initialize users if they don't exist
const initUsers = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  }
};

// Helper to get users
const getUsers = (): User[] => {
  initUsers();
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
};

// Helper to save users
const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const register = async (email: string, password: string, businessName: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getUsers();
  
  // Check if user already exists
  if (users.some(user => user.email === email)) {
    throw new Error("Email already in use");
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    businessName,
    createdAt: new Date().toISOString(),
  };
  
  // Store user
  users.push(newUser);
  saveUsers(users);
  
  // Create a fake JWT token
  const token = `mock_token_${newUser.id}`;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  
  return newUser;
};

export const login = async (email: string, password: string): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  // Check if user exists (in a real app, also verify password)
  if (!user) {
    throw new Error("Invalid email or password");
  }
  
  // Create a fake JWT token
  const token = `mock_token_${user.id}`;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  
  return user;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CURRENT_USER_KEY);
  toast.success("Logged out successfully");
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem(TOKEN_KEY) !== null;
};

export const updateUserProfile = async (user: Partial<User>): Promise<User> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const currentUser = getCurrentUser();
  if (!currentUser) {
    throw new Error("No user authenticated");
  }
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === currentUser.id);
  
  if (userIndex === -1) {
    throw new Error("User not found");
  }
  
  // Update user data
  const updatedUser = { ...users[userIndex], ...user };
  users[userIndex] = updatedUser;
  
  // Save updated users
  saveUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  
  return updatedUser;
};
