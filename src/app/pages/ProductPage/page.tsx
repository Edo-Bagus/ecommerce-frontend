"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for making API requests

const ProductPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValues, setEditValues] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/data/products");
      setItems(response.data); // Set the response data to the items state
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handles clicking the edit button
  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setEditValues(items[index]); // Set edit values to the item being edited
  };

  // Handles input change for editing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles saving the edited item
  const handleSaveClick = async () => {
    if (editingIndex === null) return;

    try {
      const updatedItem = editValues;
      const response = await axios.put(
        `http://localhost:5000/data/products/${items[editingIndex]._id}`,
        updatedItem
      );
      const updatedItems = [...items];
      updatedItems[editingIndex] = response.data; // Update the item with response data
      setItems(updatedItems);
      setEditingIndex(null); // Reset editing index after saving
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  // Handles deleting an item
  const handleDeleteClick = async (id: string, index: number) => {
    try {
      // Send DELETE request to the API
      await axios.delete(`http://localhost:5000/data/products/${id}`);

      // Remove the item from the UI state
      const updatedItems = items.filter((_, i) => i !== index);
      setItems(updatedItems);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Add new dummy product
  const handleCreateNewItem = async () => {
    try {
      const newItem = {
        name: "New Dummy",
        price: 20000,
        description: "New Description",
        category: "New Category",
        stock: 20,
      };
      const response = await axios.post(
        "http://localhost:5000/data/products",
        newItem
      );
      setItems((prevItems) => [...prevItems, response.data]);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="w-screen h-screen bg-[#F4F4F9] relative flex flex-row">
      <div className="w-full h-full">
        <h1 className="text-[2.604vw] text-[#343A40] font-bold py-[1.5vw] px-[3vw]">
          Hi, Admin!
        </h1>
        <div className="w-full flex justify-between py-[1vw] px-[4vw]">
          <div>
            <h1 className="text-[1.563vw] font-bold text-[#343A40] mb-[0.5vw]">
              Products
            </h1>
          </div>
        </div>

        <div className="px-[3vw] flex-1">
          <div className="w-full max-h-[50vh] overflow-y-auto">
            <table className="min-w-full table-auto border-collapse text-left">
              <thead className="bg-[#E9ECEF] sticky top-0 z-10 border-b border-t">
                <tr>
                  <th style={{ width: "5%" }} className="border px-4 py-2 text-[#343A40]">No</th>
                  <th style={{ width: "20%" }} className="border px-4 py-2 text-[#343A40]">Name</th>
                  <th style={{ width: "15%" }} className="border px-4 py-2 text-[#343A40]">Price</th>
                  <th style={{ width: "25%" }} className="border px-4 py-2 text-[#343A40]">Description</th>
                  <th style={{ width: "15%" }} className="border px-4 py-2 text-[#343A40]">Category</th>
                  <th style={{ width: "10%" }} className="border px-4 py-2 text-[#343A40]">Stock</th>
                  <th style={{ width: "10%" }} className="border px-4 py-2 text-[#343A40]">Option</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {items.map((item, i) => (
                  <tr key={i} className="hover:bg-[#F8F9FA]">
                    <td className="border px-4 py-2 text-[#343A40]">{i + 1}</td>
                    {editingIndex === i ? (
                      <>
                        <td className="border px-4 py-2 text-[#343A40]">
                          <input
                            name="name"
                            value={editValues.name}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-4 py-2 text-[#343A40]">
                          <input
                            name="price"
                            type="number"
                            value={editValues.price}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-4 py-2 text-[#343A40]">
                          <input
                            name="description"
                            value={editValues.description}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-4 py-2 text-[#343A40]">
                          <input
                            name="category"
                            value={editValues.category}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-4 py-2 text-[#343A40]">
                          <input
                            name="stock"
                            type="number"
                            value={editValues.stock}
                            onChange={handleInputChange}
                            className="border border-gray-300 rounded px-2 py-1"
                          />
                        </td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={handleSaveClick}
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="border px-4 py-2 text-[#343A40]">{item.name}</td>
                        <td className="border px-4 py-2 text-[#343A40]">{item.price}</td>
                        <td className="border px-4 py-2 text-[#343A40]">{item.description}</td>
                        <td className="border px-4 py-2 text-[#343A40]">{item.category}</td>
                        <td className="border px-4 py-2 text-[#343A40]">{item.stock}</td>
                        <td className="border px-4 py-2">
                          <button
                            onClick={() => handleEditClick(i)}
                            className="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item._id, i)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleCreateNewItem}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add New Product
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductPage;
