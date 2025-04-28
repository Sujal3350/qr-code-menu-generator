
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Menu } from "@/types";
import { getUserMenus } from "@/services/menuService";

const Dashboard = () => {
  const { user } = useAuth();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        if (user) {
          const userMenus = await getUserMenus(user.id);
          setMenus(userMenus);
        }
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
          {/* Welcome Card */}
          <Card className="mb-6 bg-gradient-to-br from-brand-50 to-white">
            <CardHeader>
              <CardTitle className="text-xl">Welcome back, {user?.businessName}!</CardTitle>
              <CardDescription>
                Manage your digital menus and QR codes from this dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Get started by creating a new menu or managing your existing ones.
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/create-menu">
                <Button className="bg-brand-600 hover:bg-brand-700">Create New Menu</Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Menus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{menus.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">QR Code Scans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">0</div>
                <p className="text-xs text-muted-foreground mt-1">Analytics coming soon</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Menu Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {menus.reduce((total, menu) => total + menu.items.length, 0)}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Menus */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Menus</CardTitle>
              <CardDescription>
                Your most recently created digital menus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse flex space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ) : menus.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">You haven't created any menus yet.</p>
                  <Link to="/create-menu" className="mt-2 inline-block">
                    <Button variant="outline" className="mt-2">Create your first menu</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {menus.slice(0, 3).map((menu) => (
                    <div key={menu.id} className="flex items-center justify-between border-b last:border-b-0 pb-3 last:pb-0">
                      <div className="flex items-center">
                        <div className="mr-4">
                          {menu.logo ? (
                            <img 
                              src={menu.logo} 
                              alt={menu.businessName}
                              className="h-12 w-12 rounded-md object-cover" 
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-md bg-gray-200 flex items-center justify-center text-gray-500">
                              {menu.businessName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{menu.businessName}</p>
                          <p className="text-sm text-muted-foreground">
                            {menu.items.length} items · Created on {new Date(menu.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Link to={`/my-menus/${menu.id}`}>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            {menus.length > 0 && (
              <CardFooter>
                <Link to="/my-menus" className="w-full">
                  <Button variant="outline" className="w-full">View all menus</Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
