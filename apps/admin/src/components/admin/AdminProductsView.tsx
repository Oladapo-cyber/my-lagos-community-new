import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, FileText, Loader2, AlertCircle, X, Trash2, Pencil, Camera, Check } from 'lucide-react';
import { getAllProducts, createProduct, updateProduct, deleteProduct, parseApiResponseError } from '@mlc/api-client';
import { useToast } from '@mlc/ui-components';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import type { Product, CreateProductPayload } from '@mlc/shared-types';

// ────────────────────────────────────────────────────────────
// Image slot type (used in the Add/Edit modal)
// ────────────────────────────────────────────────────────────
interface ImageSlot {
  preview: string | null;
  uploadedUrl: string | null;
  isUploading: boolean;
  error: string | null;
}
const MAX_IMAGES = 4;
const emptySlots = (): ImageSlot[] =>
  Array.from({ length: MAX_IMAGES }, () => ({ preview: null, uploadedUrl: null, isUploading: false, error: null }));

const EMPTY_FORM: CreateProductPayload = {
  name: '',
  category: '',
  tag: [],
  price: 0,
  description: '',
  quantity: 0,
  images: [],
};

export const AdminProductsView = () => {
  const toast = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [retryKey, setRetryKey] = useState(0);
  const itemsPerPage = 10;

  // API state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<CreateProductPayload>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Separate text inputs for price/quantity (avoids number spinners, gives full control)
  const [priceInput, setPriceInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');

  // Tag chip state
  const [tagInput, setTagInput] = useState('');

  // Image slot state
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(emptySlots());
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setFetchError(null);
      try {
        const raw = await getAllProducts('admin');
        if (cancelled) return;
        setProducts(Array.isArray(raw) ? raw : (raw as any)?.items ?? []);
      } catch (err) {
        if (!cancelled) setFetchError('Failed to load products. Please retry.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [retryKey]);

  const openAddModal = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setPriceInput('');
    setQuantityInput('');
    setTagInput('');
    setImageSlots(emptySlots());
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      category: product.category,
      tag: product.tag ?? [],
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      images: product.image ?? [],
    });
    setPriceInput(product.price > 0 ? String(product.price) : '');
    setQuantityInput(product.quantity > 0 ? String(product.quantity) : '');
    setTagInput('');
    // Populate image slots from existing product images
    const slots = emptySlots();
    (product.image ?? []).slice(0, MAX_IMAGES).forEach((url, i) => {
      slots[i] = { preview: url, uploadedUrl: url, isUploading: false, error: null };
    });
    setImageSlots(slots);
    setShowModal(true);
  };

  // ── Tag helpers ───────────────────────────────────────────
  const handleTagInput = (value: string) => {
    // If the user typed a comma or space, commit everything before it as tags
    const parts = value.split(/[,\s]+/);
    if (parts.length > 1) {
      const toCommit = parts.slice(0, -1).map(t => t.trim()).filter(Boolean);
      const remaining = parts[parts.length - 1];
      if (toCommit.length) {
        setForm(f => ({ ...f, tag: [...new Set([...f.tag, ...toCommit])] }));
      }
      setTagInput(remaining);
    } else {
      setTagInput(value);
    }
  };

  const commitTagInput = () => {
    const trimmed = tagInput.trim();
    if (trimmed) {
      setForm(f => ({ ...f, tag: [...new Set([...f.tag, trimmed])] }));
      setTagInput('');
    }
  };

  const removeTag = (idx: number) =>
    setForm(f => ({ ...f, tag: f.tag.filter((_, i) => i !== idx) }));

  // ── Image helpers ─────────────────────────────────────────
  const handleImageSelect = async (index: number, file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setImageSlots(prev => {
        const next = [...prev];
        next[index] = { ...next[index], error: 'File exceeds 5 MB' };
        return next;
      });
      return;
    }
    const preview = URL.createObjectURL(file);
    setImageSlots(prev => {
      const next = [...prev];
      next[index] = { preview, uploadedUrl: null, isUploading: true, error: null };
      return next;
    });
    try {
      const url = await uploadToCloudinary(file);
      setImageSlots(prev => {
        const next = [...prev];
        next[index] = { preview, uploadedUrl: url, isUploading: false, error: null };
        return next;
      });
    } catch {
      setImageSlots(prev => {
        const next = [...prev];
        next[index] = { preview: null, uploadedUrl: null, isUploading: false, error: 'Upload failed. Retry.' };
        return next;
      });
    }
  };

  const removeImage = (index: number) =>
    setImageSlots(prev => {
      const next = [...prev];
      next[index] = { preview: null, uploadedUrl: null, isUploading: false, error: null };
      if (fileInputRefs.current[index]) fileInputRefs.current[index]!.value = '';
      return next;
    });

  // ── Save ──────────────────────────────────────────────────
  const handleSave = async () => {
    // Commit any partial tag still in the input box
    const allTags = [...form.tag];
    const partialTag = tagInput.trim();
    if (partialTag) allTags.push(partialTag);

    // Validate price
    const parsedPrice = parseFloat(priceInput.replace(/,/g, ''));
    if (!form.name.trim()) {
      toast.error('Validation error', 'Product name is required.');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error('Validation error', 'Enter a valid price greater than 0.');
      return;
    }
    const parsedQty = parseInt(quantityInput.replace(/,/g, ''), 10);
    if (isNaN(parsedQty) || parsedQty < 0) {
      toast.error('Validation error', 'Enter a valid quantity (0 or more).');
      return;
    }
    if (imageSlots.some(s => s.isUploading)) {
      toast.error('Please wait', 'Images are still uploading.');
      return;
    }

    const images = imageSlots.filter(s => s.uploadedUrl).map(s => s.uploadedUrl!);
    // Normalise category casing: first letter uppercase, rest lowercase
    const normalizedCategory = form.category.trim()
      ? form.category.trim().charAt(0).toUpperCase() + form.category.trim().slice(1).toLowerCase()
      : '';

    const payload: CreateProductPayload = {
      ...form,
      category: normalizedCategory,
      tag: allTags,
      price: parsedPrice,
      quantity: parsedQty,
      images,
    };

    setIsSaving(true);
    try {
      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, payload, 'admin');
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updated : p));
        toast.success('Product updated', `"${updated.name}" has been saved.`);
      } else {
        const created = await createProduct(payload, 'admin');
        setProducts(prev => [created, ...prev]);
        toast.success('Product added', `"${created.name}" is now in the catalogue.`);
      }
      setShowModal(false);
    } catch (err) {
      toast.error('Save failed', parseApiResponseError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await deleteProduct(product.id, 'admin');
      setProducts(prev => prev.filter(p => p.id !== product.id));
      toast.success('Product deleted', `"${product.name}" has been removed.`);
    } catch (err) {
      toast.error('Delete failed', parseApiResponseError(err));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'in-stock' && p.quantity > 0) ||
      (statusFilter === 'out-of-stock' && p.quantity <= 0);
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <FileText size={18} />
            Export CSV
          </button>
          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={18} />
            ADD PRODUCT
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Product List</h3>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search Product"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              All
            </button>
            <button
              onClick={() => { setStatusFilter('out-of-stock'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'out-of-stock' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              Out of Stock
            </button>
            <button
              onClick={() => { setStatusFilter('in-stock'); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${statusFilter === 'in-stock' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              In Stock
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tags</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <Loader2 className="mx-auto mb-2 text-blue-600 animate-spin" size={28} />
                    <p className="text-sm text-gray-400 font-medium">Loading products...</p>
                  </td>
                </tr>
              ) : fetchError ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <AlertCircle className="mx-auto mb-2 text-red-400" size={28} />
                    <p className="text-sm text-red-500 font-medium mb-3">{fetchError}</p>
                    <button
                      onClick={() => setRetryKey(k => k + 1)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                    >
                      Retry
                    </button>
                  </td>
                </tr>
              ) : paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-400">No products found.</td>
                </tr>
              ) : paginatedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.category || '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₦{product.price.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-[160px] truncate">
                    {product.tag?.join(', ') || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{product.quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded text-xs font-medium ${product.quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product)}
                        disabled={deletingId === product.id}
                        className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !fetchError && filteredProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} records
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40"
              >
                «
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 rounded ${currentPage === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40"
              >
                »
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative flex flex-col max-h-[90vh]">
            {/* Modal header */}
            <div className="flex items-center justify-between px-8 pt-8 pb-4 flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto px-8 pb-6 space-y-5 flex-1">

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                <input
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product name"
                />
              </div>

              {/* Price + Quantity — text inputs, numeric keyboard */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Price (₦) *</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={priceInput}
                    onChange={e => {
                      const v = e.target.value;
                      if (/^[\d,]*\.?\d*$/.test(v)) setPriceInput(v);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Quantity</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantityInput}
                    onChange={e => {
                      const v = e.target.value;
                      if (/^\d*$/.test(v)) setQuantityInput(v);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
                <input
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Electronics"
                />
              </div>

              {/* Tags — chip UI */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tags</label>
                <div className="border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap gap-1.5 min-h-[42px]">
                  {form.tag.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                      {tag}
                      <button type="button" onClick={() => removeTag(i)} className="text-blue-400 hover:text-blue-700 leading-none">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={tagInput}
                    onChange={e => handleTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); commitTagInput(); }
                      if (e.key === 'Backspace' && !tagInput && form.tag.length) removeTag(form.tag.length - 1);
                    }}
                    onBlur={commitTagInput}
                    placeholder={form.tag.length === 0 ? 'Type a tag and press space or comma…' : ''}
                    className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Separate tags by space or comma. Press Backspace to remove the last tag.</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Product description"
                />
              </div>

              {/* Image uploads */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Product Images (max {MAX_IMAGES})</label>
                <p className="text-[10px] text-gray-400 mb-3">First image is the primary / cover photo. Max 5 MB each.</p>
                <div className="grid grid-cols-4 gap-3">
                  {imageSlots.map((slot, idx) => (
                    <div key={idx} className="relative">
                      {slot.preview ? (
                        <div className="aspect-square rounded-xl overflow-hidden relative group border border-gray-200">
                          <img src={slot.preview} alt={`Product image ${idx + 1}`} className="w-full h-full object-cover" />
                          {/* Uploading overlay */}
                          {slot.isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                              <Loader2 className="w-5 h-5 text-white animate-spin" />
                            </div>
                          )}
                          {/* Success tick */}
                          {slot.uploadedUrl && !slot.isUploading && (
                            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                              <Check size={10} className="text-white stroke-[3px]" />
                            </div>
                          )}
                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ) : (
                        <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all group">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={el => { fileInputRefs.current[idx] = el; }}
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleImageSelect(idx, f); e.target.value = ''; }}
                          />
                          <Camera size={16} className="text-gray-300 group-hover:text-blue-500" />
                          <span className="text-[9px] font-bold uppercase text-gray-300 group-hover:text-blue-500">
                            {idx === 0 ? 'Cover' : `Photo ${idx + 1}`}
                          </span>
                        </label>
                      )}
                      {slot.error && <p className="text-red-500 text-[9px] font-bold mt-0.5 text-center">{slot.error}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-8 py-5 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || imageSlots.some(s => s.isUploading)}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isSaving
                  ? <><Loader2 size={16} className="animate-spin" /> Saving…</>
                  : editingProduct ? 'Save Changes' : 'Add Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
