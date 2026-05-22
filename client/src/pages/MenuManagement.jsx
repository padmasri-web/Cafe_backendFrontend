import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { getAdminMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } from "../services/api";

export default function MenuManagement() {
  const { adminId } = useParams();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    isVeg: true,
    imageUrl: "",
  });

  useEffect(() => {
    fetchMenus();
  }, [adminId]);

  const fetchMenus = async () => {
    try {
      const { data } = await getAdminMenuItems(adminId);
      setMenus(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createMenuItem({ ...formData, adminId });
      setShowModal(false);
      setFormData({ name: "", category: "", price: "", description: "", isVeg: true, imageUrl: "" });
      fetchMenus();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this item?")) {
      await deleteMenuItem(id);
      fetchMenus();
    }
  };

  const handleToggle = async (id) => {
    await toggleMenuItemAvailability(id);
    fetchMenus();
  };

  if (loading) return <div className="text-neutral-400">Loading menu...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Menu Management</h1>
          <p className="text-neutral-400">Add, edit, and organize your dishes.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((item) => (
          <div key={item._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-colors">
            <div className="h-48 bg-neutral-800 relative">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-600">
                  <ImageIcon className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleToggle(item._id)}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    item.isAvailable ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {item.isAvailable ? "Available" : "Hidden"}
                </button>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{item.name}</h3>
                <span className="text-amber-500 font-bold">${item.price}</span>
              </div>
              <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-md ${item.isVeg ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                  {item.isVeg ? "Veg" : "Non-Veg"}
                </span>
                <span className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded-md">{item.category}</span>
              </div>
              <div className="mt-6 flex gap-3 border-t border-neutral-800 pt-4">
                <button onClick={() => handleDelete(item._id)} className="flex items-center gap-2 text-neutral-400 hover:text-red-400 transition-colors text-sm font-medium">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Add Menu Item</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Category</label>
                  <input required type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-400 mb-1">Price</label>
                  <input required type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500 h-24 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Image URL</label>
                <input type="text" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={formData.isVeg} onChange={(e) => setFormData({...formData, isVeg: e.target.checked})} className="w-4 h-4 rounded accent-amber-500" />
                <label className="text-sm text-neutral-300">Is Vegetarian?</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-neutral-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-amber-500 text-black px-4 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
