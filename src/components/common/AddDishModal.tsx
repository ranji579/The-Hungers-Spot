'use client';

import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
  Trash2,
  Sparkles
} from 'lucide-react';

interface AddDishModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  submitLabel?: string;
  onSubmit: (dishData: {
    name: string;
    category: string;
    description: string;
    price: number;
    dietary: 'veg' | 'non-veg' | 'vegan';
    image: string;
  }) => void;
}

const PRESET_IMAGES = [
  { label: 'Biryani', url: '/images/dishes/ambur_chicken_biryani.jpg' },
  { label: 'Chicken 65', url: '/images/dishes/chicken_65.jpg' },
  { label: 'Chicken Lollipop', url: '/images/dishes/chicken_lollipop.jpg' },
  { label: 'Curry / Gravy', url: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=800&q=80' },
  { label: 'Rice / Noodles', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80' },
  { label: 'Tandoori Naan', url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80' }
];

export const AddDishModal: React.FC<AddDishModalProps> = ({
  isOpen,
  onClose,
  title = 'Add New Menu Item',
  submitLabel = 'Add to Menu',
  onSubmit
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Chicken Starters');
  const [price, setPrice] = useState('');
  const [dietary, setDietary] = useState<'veg' | 'non-veg' | 'vegan'>('veg');
  const [description, setDescription] = useState('');

  // Image upload modes: 'local' | 'url'
  const [imageSource, setImageSource] = useState<'local' | 'url'>('local');
  const [imageUrl, setImageUrl] = useState('');
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(null);
  const [localFileName, setLocalFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    setLocalFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setLocalImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setLocalImagePreview(null);
    setLocalFileName(null);
    setImageUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    // Determine final image
    let finalImage = '';
    if (imageSource === 'local' && localImagePreview) {
      finalImage = localImagePreview;
    } else if (imageUrl.trim()) {
      finalImage = imageUrl.trim();
    } else {
      // Default fallback
      finalImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    }

    onSubmit({
      name: name.trim(),
      category,
      price: parseFloat(price) || 250,
      dietary,
      description: description.trim() || 'Chef signature specialty crafted with fresh local ingredients.',
      image: finalImage
    });

    // Reset form
    setName('');
    setCategory('Appetizers');
    setPrice('');
    setDietary('veg');
    setDescription('');
    clearImage();
    onClose();
  };

  const activePreviewImage = imageSource === 'local' ? localImagePreview : imageUrl;

  return (
    <div className="modal-overlay">
      <div className="modal-sheet" style={{ maxWidth: '520px', padding: '26px' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>{title}</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>
              Add a new dish to the live restaurant menu with a local image or URL
            </p>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ width: '32px', height: '32px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Dish Name */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Dish Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Crispy Honey Garlic Chicken Wings"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', fontSize: '14px' }}
            />
          </div>

          {/* Category & Price */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', fontSize: '13px' }}
              >
                <option value="Chef's Special">Chef's Special</option>
                <option value="Chicken Starters">Chicken Starters</option>
                <option value="Mutton Starters">Mutton Starters</option>
                <option value="Seafood Starters">Seafood Starters</option>
                <option value="Chicken Gravies">Chicken Gravies</option>
                <option value="Mutton Gravies">Mutton Gravies</option>
                <option value="Seafood Curries">Seafood Curries</option>
                <option value="Rice & Noodles">Rice &amp; Noodles</option>
                <option value="Vegetarian Corner">Vegetarian Corner</option>
                <option value="Breads & Rotis">Breads &amp; Rotis</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Selling Price (₹ INR) *
              </label>
              <input
                type="number"
                step="1"
                min="1"
                required
                placeholder="250"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '100%', fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Dietary Classification */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Dietary Tag
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              {(['veg', 'non-veg', 'vegan'] as const).map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDietary(d)}
                  style={{
                    padding: '8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: dietary === d ? 'var(--color-primary)' : 'var(--bg-card)',
                    color: dietary === d ? '#fff' : 'var(--text-secondary)',
                    border: dietary === d ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    boxShadow: dietary === d ? '0 2px 8px rgba(255, 94, 58, 0.3)' : 'none'
                  }}
                >
                  {d === 'veg' ? '🌱 Veg' : d === 'vegan' ? '🥑 Vegan' : '🥩 Non-Veg'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Description &amp; Ingredients
            </label>
            <textarea
              rows={2}
              placeholder="Crispy seasoned wings glazed in sweet hot honey, toasted sesame, scallions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', fontSize: '13px' }}
            />
          </div>

          {/* IMAGE SELECTION SECTION */}
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px',
              border: '1px solid var(--glass-border)',
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ImageIcon size={15} color="var(--color-primary)" />
                <span>Food Photo</span>
              </label>

              {/* Mode Toggle: Local File vs URL */}
              <div style={{ display: 'flex', background: 'var(--bg-surface)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                <button
                  type="button"
                  onClick={() => setImageSource('local')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: imageSource === 'local' ? 'var(--color-primary)' : 'transparent',
                    color: imageSource === 'local' ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  <Upload size={12} />
                  <span>From Device / Local</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageSource('url')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    background: imageSource === 'url' ? 'var(--color-primary)' : 'transparent',
                    color: imageSource === 'url' ? '#fff' : 'var(--text-secondary)'
                  }}
                >
                  <LinkIcon size={12} />
                  <span>Web URL</span>
                </button>
              </div>
            </div>

            {/* OPTION 1: LOCAL UPLOAD */}
            {imageSource === 'local' && (
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileChange(e.target.files[0]);
                    }
                  }}
                />

                {localImagePreview ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
                    <img
                      src={localImagePreview}
                      alt="Local Preview"
                      style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--glass-border)' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircle size={14} color="var(--color-accent)" />
                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Local Image Loaded</span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                        {localFileName || 'Custom local photo'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      className="btn-icon"
                      style={{ width: '32px', height: '32px', color: 'var(--color-danger)' }}
                      title="Remove local photo"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: isDragging ? '2px dashed var(--color-primary)' : '2px dashed var(--glass-border)',
                      background: isDragging ? 'rgba(255, 94, 58, 0.08)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        background: 'rgba(255, 94, 58, 0.12)',
                        color: 'var(--color-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 10px auto'
                      }}
                    >
                      <Upload size={20} />
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>
                      Click to choose image from your local computer
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      or drag &amp; drop PNG, JPG, or WEBP here
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* OPTION 2: WEB URL */}
            {imageSource === 'url' && (
              <div>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  style={{ width: '100%', fontSize: '13px', marginBottom: '10px' }}
                />

                {imageUrl && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-surface)', padding: '8px 12px', borderRadius: 'var(--radius-md)', marginBottom: '10px' }}>
                    <img
                      src={imageUrl}
                      alt="URL Preview"
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div style={{ flex: 1, fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Live image preview ready
                    </div>
                  </div>
                )}

                {/* Preset quick picks */}
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Or pick a sample photo:</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '11px',
                          background: imageUrl === preset.url ? 'var(--color-primary-light)' : 'rgba(255,255,255,0.06)',
                          color: imageUrl === preset.url ? 'var(--color-primary)' : 'var(--text-secondary)',
                          border: imageUrl === preset.url ? '1px solid var(--color-primary)' : '1px solid transparent'
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
          >
            <span>{submitLabel}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
