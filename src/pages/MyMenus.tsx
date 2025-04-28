
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Menu } from "@/types";
import { deleteMenu, getUserMenus } from "@/services/menuService";
import { Loader, QrCode, Trash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const MyMenus = () => {
  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [menuToDelete, setMenuToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (user) {
          const userMenus = await getUserMenus(user.id);
          setMenus(userMenus);
        }
      } catch (error) {
        console.error("Failed to fetch menus:", error);
        toast.error("Failed to load menus");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, [user]);

  const handleDeleteMenu = async () => {
    if (!menuToDelete) return;
    
    try {
      await deleteMenu(menuToDelete);
      setMenus(menus.filter(menu => menu.id !== menuToDelete));
      setMenuToDelete(null);
    } catch (error) {
      console.error("Failed to delete menu:", error);
      toast.error("Failed to delete menu");
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">My Menus</h1>
            <Link to="/create-menu">
              <Button className="mt-3 md:mt-0 bg-brand-600 hover:bg-brand-700">
                Create New Menu
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 animate-spin text-brand-600" />
            </div>
          ) : menus.length === 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>No Menus Found</CardTitle>
                <CardDescription>
                  You haven't created any menus yet. Create your first menu to get started.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/create-menu">
                  <Button>Create Your First Menu</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menus.map((menu) => (
                <Card key={menu.id} className="overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {menu.logo && (
                          <img 
                            src={menu.logo} 
                            alt={menu.businessName} 
                            className="h-10 w-10 object-cover rounded-full" 
                          />
                        )}
                        <h3 className="font-semibold">{menu.businessName}</h3>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="hover:bg-red-50 hover:text-red-500"
                            onClick={() => setMenuToDelete(menu.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                            <DialogDescription>
                              Are you sure you want to delete "{menu.businessName}" menu? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setMenuToDelete(null)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              onClick={handleDeleteMenu}
                            >
                              Delete
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="flex justify-center mb-4">
                      <img 
                        src={menu.qrCodeUrl} 
                        alt="QR Code" 
                        className="h-32 w-32" 
                      />
                    </div>
                    
                    <div className="text-sm text-muted-foreground mb-4">
                      <p><strong>Menu Items:</strong> {menu.items.length}</p>
                      <p><strong>Categories:</strong> {menu.categories.length}</p>
                      <p><strong>Created:</strong> {new Date(menu.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/my-menus/${menu.id}`} className="w-full">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <a 
                        href={menu.qrCodeUrl} 
                        download={`${menu.businessName.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`}
                        className="w-full"
                      >
                        <Button className="w-full flex items-center justify-center bg-brand-600 hover:bg-brand-700">
                          <QrCode className="h-4 w-4 mr-2" />
                          Download QR
                        </Button>
                      </a>
                      <a href={`/menu/${menu.id}`} target="_blank" rel="noreferrer" className="w-full">
                        <Button variant="secondary" className="w-full">
                          Preview Menu
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MyMenus;
