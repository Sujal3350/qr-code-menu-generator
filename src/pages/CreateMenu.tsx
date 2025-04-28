
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";
import { MenuItem, MenuCategory, Theme } from "@/types";
import { createMenu, getCategories, getMenuThemes } from "@/services/menuService";
import { Trash } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateMenu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [selectedTheme, setSelectedTheme] = useState<string>("");
  
  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("");
  const [itemImage, setItemImage] = useState<string | undefined>(undefined);
  
  // Load categories and themes
  const categories = getCategories();
  const themes = getMenuThemes();
  
  // Function to add a new menu item
  const addMenuItem = () => {
    if (!itemName || !itemPrice || !itemCategory) {
      toast.error("Please fill in required fields: name, price, and category");
      return;
    }
    
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: itemName,
      description: itemDescription,
      price: parseFloat(itemPrice),
      category: itemCategory,
      image: itemImage,
    };
    
    setMenuItems([...menuItems, newItem]);
    
    // Reset form fields
    setItemName("");
    setItemDescription("");
    setItemPrice("");
    setItemImage(undefined);
    
    toast.success("Item added to menu");
  };
  
  // Function to remove a menu item
  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    toast.success("Item removed from menu");
  };
  
  // Mock file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'item') => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, this would upload the file to a server or cloud storage
    // Here we'll use a mock URL
    const mockUrl = URL.createObjectURL(file);
    
    if (type === 'logo') {
      setLogo(mockUrl);
    } else {
      setItemImage(mockUrl);
    }
  };
  
  // Save the complete menu
  const saveMenu = async () => {
    if (!businessName || !selectedTheme) {
      toast.error("Please provide a business name and select a theme");
      return;
    }
    
    if (menuItems.length === 0) {
      toast.error("Please add at least one menu item");
      return;
    }
    
    try {
      // Get selected categories based on menu items
      const selectedCategories = categories.filter(category => 
        menuItems.some(item => item.category === category.id)
      );
      
      const menu = await createMenu(
        businessName,
        logo,
        selectedTheme,
        selectedCategories,
        menuItems
      );
      
      toast.success("Menu created successfully!");
      navigate(`/my-menus/${menu.id}`);
    } catch (error) {
      toast.error("Failed to create menu");
      console.error(error);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create Menu</h1>
        </div>
        
        <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="business-info">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="business-info">Business Info</TabsTrigger>
              <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
              <TabsTrigger value="theme-selection">Theme Selection</TabsTrigger>
            </TabsList>
            
            {/* Business Info Tab */}
            <TabsContent value="business-info" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="business-name" className="block text-sm font-medium mb-1">
                        Business Name
                      </label>
                      <Input
                        id="business-name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Your Restaurant Name"
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="logo" className="block text-sm font-medium mb-1">
                        Business Logo (Optional)
                      </label>
                      <div className="flex items-center space-x-4">
                        {logo && (
                          <div className="flex-shrink-0">
                            <img 
                              src={logo} 
                              alt="Logo Preview" 
                              className="h-16 w-16 object-cover rounded-md border"
                            />
                          </div>
                        )}
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Button onClick={() => document.getElementById("tab-trigger-menu-items")?.click()}>
                        Continue to Menu Items
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Menu Items Tab */}
            <TabsContent value="menu-items" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-4">Add Menu Item</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="item-name" className="block text-sm font-medium mb-1">
                            Item Name*
                          </label>
                          <Input
                            id="item-name"
                            value={itemName}
                            onChange={(e) => setItemName(e.target.value)}
                            placeholder="e.g. Margherita Pizza"
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="item-price" className="block text-sm font-medium mb-1">
                            Price*
                          </label>
                          <Input
                            id="item-price"
                            type="number"
                            value={itemPrice}
                            onChange={(e) => setItemPrice(e.target.value)}
                            placeholder="9.99"
                            min="0"
                            step="0.01"
                            className="w-full"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="item-category" className="block text-sm font-medium mb-1">
                            Category*
                          </label>
                          <Select value={itemCategory} onValueChange={setItemCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label htmlFor="item-image" className="block text-sm font-medium mb-1">
                            Item Image (Optional)
                          </label>
                          <Input
                            id="item-image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload(e, 'item')}
                            className="w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <label htmlFor="item-description" className="block text-sm font-medium mb-1">
                          Description (Optional)
                        </label>
                        <Textarea
                          id="item-description"
                          value={itemDescription}
                          onChange={(e) => setItemDescription(e.target.value)}
                          placeholder="Describe this menu item..."
                          className="w-full"
                        />
                      </div>
                      
                      <div className="mt-4">
                        <Button onClick={addMenuItem}>
                          Add Item
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-4">Menu Items ({menuItems.length})</h3>
                      {menuItems.length === 0 ? (
                        <div className="text-center p-4 bg-gray-50 rounded-md">
                          <p className="text-muted-foreground">No items added yet</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {menuItems.map((item) => (
                            <div 
                              key={item.id} 
                              className="flex items-center justify-between p-3 bg-white border rounded-md"
                            >
                              <div className="flex items-center space-x-3">
                                {item.image && (
                                  <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="h-12 w-12 object-cover rounded-md" 
                                  />
                                )}
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {categories.find(c => c.id === item.category)?.name} · ${item.price.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => removeMenuItem(item.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById("tab-trigger-business-info")?.click()}
                      >
                        Back to Business Info
                      </Button>
                      <Button 
                        onClick={() => document.getElementById("tab-trigger-theme-selection")?.click()}
                        disabled={menuItems.length === 0}
                      >
                        Continue to Theme Selection
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Theme Selection Tab */}
            <TabsContent value="theme-selection" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <h3 className="font-medium">Select a Theme for Your Menu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {themes.map((theme) => (
                        <div 
                          key={theme.id}
                          className={`border rounded-lg p-3 cursor-pointer ${
                            selectedTheme === theme.id
                              ? "ring-2 ring-brand-500 border-brand-500"
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedTheme(theme.id)}
                        >
                          <div className="h-48 bg-gray-200 rounded-md flex items-center justify-center mb-3">
                            <div className="text-gray-500">Theme Preview</div>
                          </div>
                          <h4 className="font-medium">{theme.name}</h4>
                          <p className="text-sm text-muted-foreground">{theme.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById("tab-trigger-menu-items")?.click()}
                      >
                        Back to Menu Items
                      </Button>
                      <Button 
                        onClick={saveMenu}
                        disabled={!selectedTheme}
                        className="bg-brand-600 hover:bg-brand-700"
                      >
                        Create Menu
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateMenu;
