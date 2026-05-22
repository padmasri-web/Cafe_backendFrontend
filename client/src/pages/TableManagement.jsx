import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Trash2, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getAdminTables, createTable, deleteTable } from "../services/api";

export default function TableManagement() {
  const { adminId } = useParams();
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  useEffect(() => {
    fetchTables();
  }, [adminId]);

  const fetchTables = async () => {
    try {
      const { data } = await getAdminTables(adminId);
      setTables(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createTable({ adminId, tableNumber: Number(tableNumber) });
      setShowModal(false);
      setTableNumber("");
      fetchTables();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this table?")) {
      await deleteTable(id);
      fetchTables();
    }
  };

  if (loading) return <div className="text-neutral-400">Loading tables...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tables & QR Codes</h1>
          <p className="text-neutral-400">Manage your restaurant tables and generate order QRs.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-xl font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Table
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <div key={table._id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col items-center p-6 hover:border-neutral-700 transition-colors">
            <h3 className="text-2xl font-bold text-white mb-4">Table {table.tableNumber}</h3>
            <div className="bg-white p-3 rounded-xl mb-4 shadow-xl">
              <QRCodeSVG
                value={table.qrCodeUrl}
                size={160}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"L"}
                includeMargin={false}
              />
            </div>
            <div className="flex gap-2 w-full mt-2">
              <a 
                href={table.qrCodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 py-2 rounded-xl text-sm font-medium transition-colors text-center"
              >
                Open Link
              </a>
              <button
                onClick={() => handleDelete(table._id)}
                className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-3 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-sm p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Table</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-400 mb-1">Table Number</label>
                <input required type="number" min="1" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500" placeholder="e.g. 12" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-neutral-800 text-white px-4 py-2 rounded-xl font-medium hover:bg-neutral-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-amber-500 text-black px-4 py-2 rounded-xl font-medium hover:bg-amber-600 transition-colors">Add Table</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
