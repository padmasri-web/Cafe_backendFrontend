import { ShoppingBag } from "lucide-react";

export default function MenuItemCard({ item, onAdd }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-neutral-700 transition-colors flex flex-col group relative">
      <div className="h-56 relative overflow-hidden bg-neutral-800">
        {item.imageUrl ? (
          <img 
            src={item.imageUrl} 
            alt={item.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900"></div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 text-xs font-bold rounded-full backdrop-blur-md shadow-lg ${
            item.isVeg ? "bg-green-500/80 text-white" : "bg-red-500/80 text-white"
          }`}>
            {item.isVeg ? "Veg" : "Non-Veg"}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2 gap-4">
          <h3 className="text-xl font-bold text-white leading-tight">{item.name}</h3>
          <span className="text-amber-500 font-bold whitespace-nowrap">${item.price}</span>
        </div>
        <p className="text-sm text-neutral-400 mb-6 flex-1 line-clamp-3">{item.description}</p>
        
        <button 
          onClick={() => onAdd?.(item)}
          className="w-full bg-white/5 hover:bg-amber-500 text-white hover:text-black py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 group/btn"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Add to Order</span>
        </button>
      </div>
    </div>
  );
}
