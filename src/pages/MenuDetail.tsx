
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Menu } from "@/types";
import { getMenuById, getThemeById } from "@/services/menuService";
import { Loader, QrCode, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const MenuDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<any | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (id) {
          const menuData = await getMenuById(id);
          if (menuData) {
            setMenu(menuData);
            
            // Get theme information
            const themeData = getThemeById(menuData.themeId);
            setTheme(themeData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        toast.error("Failed to load menu details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [id]);

  // Group menu items by category
  const itemsByCategory = menu?.items.reduce((acc: Record<string, typeof menu.items>, item) => {
    const categoryId = item.category;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </DashboardLayout>
    );
  }

  if (!menu) {
    return (
      <DashboardLayout>
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">Menu Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The menu you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <Link to="/my-menus">
                <Button>Back to My Menus</Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-4">
            <Link to="/my-menus">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-semibold text-gray-900 ml-2">Menu Details</h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Menu Information</CardTitle>
                    <Link to={`/edit-menu/${menu.id}`}>
                      <Button variant="outline">Edit Menu</Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium mb-2">Business Details</h3>
                      <div className="flex items-center space-x-3 mb-4">
                        {menu.logo && (
                          <img 
                            src={menu.logo} 
                            alt={menu.businessName} 
                            className="h-12 w-12 object-cover rounded-md" 
                          />
                        )}
                        <div>
                          <p className="font-semibold">{menu.businessName}</p>
                          <p className="text-sm text-muted-foreground">
                            Created on {new Date(menu.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Theme</h3>
                        <p>{theme?.name || "Custom Theme"}</p>
                        {theme && (
                          <div className="flex mt-2 space-x-2">
                            <div 
                              className="h-6 w-6 rounded-full" 
                              style={{ backgroundColor: theme.primaryColor }}
                            ></div>
                            <div 
                              className="h-6 w-6 rounded-full" 
                              style={{ backgroundColor: theme.secondaryColor }}
                            ></div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Menu Overview</h3>
                        <p><strong>Items:</strong> {menu.items.length}</p>
                        <p><strong>Categories:</strong> {menu.categories.length}</p>
                        <p><strong>Last Updated:</strong> {new Date(menu.updatedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">QR Code</h3>
                      <div className="flex justify-center mb-4">
                        <img 
                          src={menu.qrCodeUrl} 
                          alt="QR Code" 
                          className="h-40 w-40" 
                        />
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <a 
                          href={menu.qrCodeUrl} 
                          download={`${menu.businessName.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`}
                        >
                          <Button className="w-full flex items-center justify-center bg-brand-600 hover:bg-brand-700">
                            <QrCode className="h-4 w-4 mr-2" />
                            Download QR Code
                          </Button>
                        </a>
                        <a href={`/menu/${menu.id}`} target="_blank" rel="noreferrer">
                          <Button variant="outline" className="w-full">
                            Open Menu Page
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {menu.categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between">
                        <p>{category.name}</p>
                        <span className="bg-gray-100 text-xs py-1 px-2 rounded-full">
                          {itemsByCategory?.[category.id]?.length || 0} items
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Menu Link</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-3 rounded-md mb-4">
                    <p className="text-sm break-all">{menu.menuUrl}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      navigator.clipboard.writeText(menu.menuUrl);
                      toast.success("Menu URL copied to clipboard!");
                    }}
                  >
                    Copy Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Menu Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {menu.categories.map((category) => {
                  const items = itemsByCategory?.[category.id] || [];
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={category.id}>
                      <h3 className="font-medium text-lg mb-3">{category.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => (
                          <div key={item.id} className="border rounded-md p-3">
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
                                <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                              </div>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MenuDetail;
