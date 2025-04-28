
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [logo, setLogo] = useState<string | undefined>(user?.logo);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, this would upload the file to a server or cloud storage
    const reader = new FileReader();
    reader.onload = () => {
      setLogo(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName) {
      toast.error("Business name is required");
      return;
    }
    
    setIsLoading(true);
    try {
      await updateProfile({
        businessName,
        logo,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your business information
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>
                Update your business details that will be displayed on your menus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Business Logo */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-200">
                    {logo ? (
                      <img 
                        src={logo} 
                        alt="Business Logo" 
                        className="h-full w-full object-cover" 
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                        {businessName ? businessName.charAt(0).toUpperCase() : "B"}
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="max-w-xs"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: Square image, at least 300x300 pixels
                    </p>
                  </div>
                </div>
                
                {/* Business Name */}
                <div>
                  <label htmlFor="business-name" className="block text-sm font-medium mb-1">
                    Business Name
                  </label>
                  <Input
                    id="business-name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Restaurant or Business Name"
                    className="w-full"
                  />
                </div>
                
                {/* Email (readonly) */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    readOnly
                    disabled
                    className="w-full bg-gray-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your email address cannot be changed
                  </p>
                </div>
                
                <div>
                  <Button type="submit" className="bg-brand-600 hover:bg-brand-700" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Profile"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
