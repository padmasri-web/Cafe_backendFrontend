import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Coffee, Search } from "lucide-react";
import { getPublicMenuItems, getPublicTable } from "../services/api";
import MenuItemCard from "../components/MenuItemCard";

export default function MenuPage() {
  const { restoId, tableToken } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [restaurant, setRestaurant] = useState(null);
  const [table, setTable] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    fetchData();
  }, [restoId, tableToken]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [menuRes, tableRes] = await Promise.all([
        getPublicMenuItems(restoId),
        getPublicTable(restoId, tableToken)
      ]);
      setMenuItems(menuRes.data.menuItems || []);
      setRestaurant(menuRes.data.restaurant);
      setTable(tableRes.data.table);
    } catch (err) {
      console.error(err);
      setError("Failed to load menu. The table QR might be invalid or the restaurant is unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const categories = useMemo(() => {
    const cats = new Set(menuItems.map(item => item.category));
    return ["All", ...Array.from(cats)];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === "All" || item.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [menuItems, searchQuery, activeCategory]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-xl font-medium">Loading menu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
        <div className="text-red-400 bg-red-400/10 p-6 rounded-2xl max-w-md border border-red-400/20">
          <p className="font-medium text-lg mb-2">Oops!</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-amber-500 bg-clip-text text-transparent">
              {restaurant?.restaurantName || "Our Cafe"}
            </h1>
            {table && (
              <p className="text-sm text-neutral-400 mt-0.5">Table {table.tableNumber}</p>
            )}
          </div>
          <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center">
            <Coffee className="w-5 h-5 text-amber-500" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-8">
        {/* Search */}
        <div className="relative mb-8 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-amber-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search your cravings..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-neutral-500 outline-none focus:border-amber-500 focus:bg-neutral-800/50 transition-all shadow-xl"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide -mx-6 px-6 sm:mx-0 sm:px-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === cat 
                  ? "bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]" 
                  : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredItems.map(item => (
              <MenuItemCard key={item._id} item={item} onAdd={(i) => alert(`Added ${i.name} to order (Cart coming soon!)`)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-neutral-800">
            <p className="text-neutral-400 text-lg">No items found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}
