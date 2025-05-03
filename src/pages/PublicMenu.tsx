import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { Menu, Theme } from "@/types";
import { getPublicMenu, getThemeById } from "../services/menuService";
import { toast } from "sonner";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const generatePDF = async (menuElement: HTMLElement, headerElement: HTMLElement, menuName: string) => {
  const canvasHeader = await html2canvas(headerElement);
  const canvasMenu = await html2canvas(menuElement);

  const pdf = new jsPDF("p", "mm", "a4");
  const pdfWidth = pdf.internal.pageSize.getWidth();

  // Add header to PDF
  const headerImgData = canvasHeader.toDataURL("image/png");
  const headerHeight = (canvasHeader.height * pdfWidth) / canvasHeader.width;
  pdf.addImage(headerImgData, "PNG", 0, 0, pdfWidth, headerHeight);

  // Add menu content to PDF
  const menuImgData = canvasMenu.toDataURL("image/png");
  const menuHeight = (canvasMenu.height * pdfWidth) / canvasMenu.width;
  pdf.addImage(menuImgData, "PNG", 0, headerHeight, pdfWidth, menuHeight);

  pdf.save(`${menuName.replace(/\s+/g, "_")}_Menu.pdf`);
};

const PublicMenu = () => {
  const { id } = useParams<{ id: string }>();
  const [menu, setMenu] = useState<Menu | null>(null);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        if (id) {
          const menuData = await getPublicMenu(id);
          
          if (menuData) {
            setMenu(menuData);
            
            // Get theme information
            const themeData = getThemeById(menuData.themeId);
            if (themeData) {
              setTheme(themeData);
            }

            // Generate and store the menu as a PDF
            setTimeout(() => {
              const menuElement = document.getElementById("menu-preview");
              const headerElement = document.getElementById("menu-header");
              if (menuElement && headerElement) {
                generatePDF(menuElement, headerElement, menuData.businessName);
              }
            }, 1000); // Delay to ensure the menu is fully rendered
          }
        }
      } catch (error) {
        console.error("Failed to fetch menu:", error);
        toast.error("Failed to load menu");
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
      <div className="flex justify-center items-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-2">Menu Not Found</h1>
        <p className="text-gray-500 text-center">
          The menu you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  // Apply theme colors if available
  const themeStyles = theme ? {
    primary: theme.primaryColor,
    secondary: theme.secondaryColor,
    fontFamily: theme.fontFamily
  } : {
    primary: '#8a5cf6',
    secondary: '#e69c35',
    fontFamily: 'Lora, serif'
  };

  return (
    <div 
      className="min-h-screen pb-16"
      style={{ 
        fontFamily: themeStyles.fontFamily,
        backgroundColor: '#fefefe'
      }}
    >
      {/* Header */}
      <header 
        id="menu-header"
        className="py-4 px-4 text-white"
        style={{ backgroundColor: themeStyles.primary }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          {menu.logo && (
            <img 
              src={menu.logo} 
              alt={menu.businessName} 
              className="h-12 w-12 rounded-full object-cover border-2 border-white mr-4" 
            />
          )}
          <h1 className="text-2xl font-bold">{menu.businessName}</h1>
        </div>
      </header>

      {/* Menu Categories Navigation */}
      <div className="sticky top-0 z-10 bg-white shadow-sm overflow-x-auto">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex space-x-4 py-3">
            {menu.categories.map((category) => {
              const items = itemsByCategory?.[category.id] || [];
              if (items.length === 0) return null;
              
              return (
                <a 
                  key={category.id} 
                  href={`#category-${category.id}`}
                  className="whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100"
                  style={{ color: themeStyles.primary }}
                >
                  {category.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div id="menu-preview">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="space-y-10">
            {menu.categories.map((category) => {
              const items = itemsByCategory?.[category.id] || [];
              if (items.length === 0) return null;
              
              return (
                <div key={category.id} id={`category-${category.id}`} className="scroll-mt-16">
                  <h2 
                    className="text-2xl font-bold mb-6 pb-2 border-b"
                    style={{ color: themeStyles.primary, borderColor: themeStyles.secondary }}
                  >
                    {category.name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex animate-fade-up border border-gray-100"
                      >
                        {item.image && (
                          <div className="flex-shrink-0 mr-4">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-28 w-28 object-cover rounded-md border border-gray-200" 
                            />
                          </div>
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-lg">{item.name}</h3>
                              <p 
                                className="font-semibold text-lg" 
                                style={{ color: themeStyles.secondary }}
                              >
                                ${item.price.toFixed(2)}
                              </p>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 line-clamp-3">{item.description}</p>
                            )}
                          </div>
                          <div className="mt-2">
                            {item.tags?.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                  <span 
                                    key={tag} 
                                    className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-4 px-4 text-center text-sm text-gray-500 mt-8">
        <p>Powered by QR Menu Generator</p>
      </footer>
    </div>
  );
};

export default PublicMenu;