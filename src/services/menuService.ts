import { Menu, MenuItem, MenuCategory, Theme } from "@/types";
import { toast } from "sonner";
import { getCurrentUser } from "./auth";

// Storage keys
const MENUS_STORAGE_KEY = "qr_menu_menus";
const CATEGORIES_STORAGE_KEY = "qr_menu_categories";
const MENU_THEMES_KEY = "qr_menu_themes";

// Initialize with some default categories if none exist
const initializeCategories = (): MenuCategory[] => {
  const existingCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  
  if (!existingCategories) {
    const defaultCategories: MenuCategory[] = [
      { id: "1", name: "Starters" },
      { id: "2", name: "Main Dishes" },
      { id: "3", name: "Desserts" },
      { id: "4", name: "Beverages" },
      { id: "5", name: "Sides" },
    ];
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
    return defaultCategories;
  }
  
  return JSON.parse(existingCategories);
};

// Initialize with some default themes if none exist
const initializeThemes = (): Theme[] => {
  const existingThemes = localStorage.getItem(MENU_THEMES_KEY);
  
  if (!existingThemes) {
    const defaultThemes: Theme[] = [
      {
        id: "1",
        name: "Classic",
        description: "A timeless design with elegant typography",
        primaryColor: "#1d4ed8", // Blue
        secondaryColor: "#f59e0b", // Amber
        fontFamily: "Lora, serif",
        preview: "classic-preview.jpg"
      },
      {
        id: "2",
        name: "Modern",
        description: "Clean, minimalist design with focus on presentation",
        primaryColor: "#10b981", // Emerald
        secondaryColor: "#a855f7", // Purple
        fontFamily: "Inter, sans-serif",
        preview: "modern-preview.jpg"
      },
      {
        id: "3",
        name: "Rustic",
        description: "Warm earth tones with a homely feel",
        primaryColor: "#b45309", // Amber
        secondaryColor: "#064e3b", // Emerald
        fontFamily: "Lora, serif",
        preview: "rustic-preview.jpg"
      },
      {
        id: "4",
        name: "Vibrant",
        description: "Bold colors and playful typography",
        primaryColor: "#db2777", // Pink
        secondaryColor: "#fcd34d", // Amber
        fontFamily: "Poppins, sans-serif",
        preview: "vibrant-preview.jpg"
      },
    ];
    localStorage.setItem(MENU_THEMES_KEY, JSON.stringify(defaultThemes));
    return defaultThemes;
  }
  
  return JSON.parse(existingThemes);
};

// Get all categories
export const getCategories = (): MenuCategory[] => {
  return initializeCategories();
};

// Get all menu themes
export const getMenuThemes = (): Theme[] => {
  return initializeThemes();
};

// Get a specific theme by ID
export const getThemeById = (themeId: string): Theme | undefined => {
  const themes = getMenuThemes();
  return themes.find(theme => theme.id === themeId);
};

// Initialize menus array if it doesn't exist
const initializeMenus = (): Menu[] => {
  const existingMenus = localStorage.getItem(MENUS_STORAGE_KEY);
  
  if (!existingMenus) {
    localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify([]));
    return [];
  }
  
  return JSON.parse(existingMenus);
};

// Helper function to save menus
const saveMenus = (menus: Menu[]): void => {
  localStorage.setItem(MENUS_STORAGE_KEY, JSON.stringify(menus));
};

// Generate a QR code URL (in a real app, this would generate an actual QR code)
const generateQRCode = (menuUrl: string): string => {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(menuUrl)}`;
};

// Create a new menu
export const createMenu = async (
  businessName: string,
  logo: string | undefined,
  themeId: string,
  categories: MenuCategory[],
  items: MenuItem[]
): Promise<Menu> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error("User must be authenticated to create a menu");
  }
  
  const menus = initializeMenus();
  const menuId = Date.now().toString();
  const menuUrl = `${window.location.origin}/menu/${menuId}`;
  const qrCodeUrl = generateQRCode(menuUrl);

  const newMenu: Menu = {
    id: menuId,
    userId: user.id,
    businessName,
    logo,
    themeId,
    qrCodeUrl,
    menuUrl,
    categories,
    items,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  // Save the QR code to the backend
  try {
    await fetch("http://localhost:5000/api/qr-codes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ menuId, qrCodeUrl }),
    });
  } catch (error) {
    console.error("Failed to save QR code to the backend:", error);
    throw new Error("Failed to save QR code");
  }

  menus.push(newMenu);
  saveMenus(menus);
  
  toast.success("Menu created successfully!");
  return newMenu;
};

// Get all menus for a specific user
export const getUserMenus = async (userId: string): Promise<Menu[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const menus = initializeMenus();
  return menus.filter(menu => menu.userId === userId);
};

// Get a specific menu by ID
export const getMenuById = async (menuId: string): Promise<Menu | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const menus = initializeMenus();
  const menu = menus.find(menu => menu.id === menuId);
  
  return menu || null;
};

// Update an existing menu
export const updateMenu = async (
  menuId: string,
  updates: Partial<Menu>
): Promise<Menu> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error("User must be authenticated to update a menu");
  }
  
  const menus = initializeMenus();
  const menuIndex = menus.findIndex(menu => menu.id === menuId);
  
  if (menuIndex === -1) {
    throw new Error("Menu not found");
  }
  
  // Check if the user owns this menu
  if (menus[menuIndex].userId !== user.id) {
    throw new Error("You don't have permission to update this menu");
  }
  
  // Update the menu
  menus[menuIndex] = {
    ...menus[menuIndex],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveMenus(menus);
  
  toast.success("Menu updated successfully!");
  return menus[menuIndex];
};

// Delete a menu
export const deleteMenu = async (menuId: string): Promise<void> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error("User must be authenticated to delete a menu");
  }
  
  const menus = initializeMenus();
  const menuIndex = menus.findIndex(menu => menu.id === menuId);
  
  if (menuIndex === -1) {
    throw new Error("Menu not found");
  }
  
  // Check if the user owns this menu
  if (menus[menuIndex].userId !== user.id) {
    throw new Error("You don't have permission to delete this menu");
  }
  
  // Delete the menu
  menus.splice(menuIndex, 1);
  saveMenus(menus);
  
  toast.success("Menu deleted successfully!");
};

// Get a public menu by ID (accessible without authentication)
export const getPublicMenu = async (menuId: string): Promise<Menu | null> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const menus = initializeMenus();
  const menu = menus.find(menu => menu.id === menuId);
  
  return menu || null;
};