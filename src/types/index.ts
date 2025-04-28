
export interface User {
  id: string;
  email: string;
  businessName: string;
  createdAt: string;
  logo?: string;
}

export interface MenuItem {
  tags: any;
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  preview: string;
}

export interface Menu {
  id: string;
  userId: string;
  businessName: string;
  logo?: string;
  themeId: string;
  qrCodeUrl: string;
  menuUrl: string;
  categories: MenuCategory[];
  items: MenuItem[];
  createdAt: string;
  updatedAt: string;
}
