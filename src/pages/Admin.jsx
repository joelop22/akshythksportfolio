import React, { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  where
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import SEO from '../components/SEO';
import LoadingSpinner from '../components/LoadingSpinner';
// Converts an image file to a compressed base64 data URL, resizing it so the
// resulting string comfortably fits inside Firestore's 1MB document limit.
// No Firebase Storage is used -- the image itself is stored directly in Firestore.
const fileToCompressedBase64 = (file, maxDimension = 1600, targetBytes = 700000) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxDimension || height > maxDimension) {
          const ratio = Math.min(maxDimension / width, maxDimension / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > targetBytes && quality > 0.3) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Could not read image file.'));
      img.src = event.target.result;
    };
    reader.onerror = () => reject(new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
};

export default function Admin() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('categories'); // categories, upload, manage, messages
  
  // Auth Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

// Categories State
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatOrder, setNewCatOrder] = useState('0');
  const [newCatFile, setNewCatFile] = useState(null);
  const [catUploading, setCatUploading] = useState(false);
  const [catUploadProgress, setCatUploadProgress] = useState(0);
  const [catError, setCatError] = useState('');
  const [editingCatId, setEditingCatId] = useState(null);

  // Image Upload State
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadYear, setUploadYear] = useState('');
  const [uploadNote, setUploadNote] = useState('');
  const [uploadOrder, setUploadOrder] = useState('0');
  const [uploadSize, setUploadSize] = useState('1080x1350');
  const [uploadFile, setUploadFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageError, setImageError] = useState('');
  const [imageSuccess, setImageSuccess] = useState(false);

  // Manage Images State
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Track user login state
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Fetch categories when logged in
  useEffect(() => {
    if (user) {
      fetchCategories();
      fetchMessages();
    }
  }, [user]);

  // Fetch images based on selected category in "Manage" tab
  useEffect(() => {
    if (user && activeTab === 'manage' && selectedCategoryFilter) {
      fetchCategoryImages(selectedCategoryFilter);
    }
  }, [user, activeTab, selectedCategoryFilter]);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setCategories(list);
      if (list.length > 0 && !uploadCategory) {
        setUploadCategory(list[0].slug);
      }
      if (list.length > 0 && !selectedCategoryFilter) {
        setSelectedCategoryFilter(list[0].slug);
      }
    } catch (err) {
      console.error("Error loading categories: ", err);
    }
  };

  const fetchCategoryImages = async (categorySlug) => {
    setImagesLoading(true);
    try {
      const q = query(
        collection(db, 'images'), 
        where('categorySlug', '==', categorySlug),
        orderBy('order', 'asc')
      );
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setFilteredImages(list);
    } catch (err) {
      console.error("Error loading images: ", err);
    } finally {
      setImagesLoading(false);
    }
  };

  const fetchMessages = async () => {
    setMessagesLoading(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const list = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setMessages(list);
    } catch (err) {
      console.error("Error loading messages: ", err);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
    } catch (error) {
      console.error(error);
      setLoginError('Invalid email or password. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  // Helper to generate slug
  const handleCatNameChange = (e) => {
    const val = e.target.value;
    setNewCatName(val);
    setNewCatSlug(
      val.toLowerCase()
         .replace(/[^a-z0-9]+/g, '-')
         .replace(/(^-|-$)/g, '')
    );
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setCatError('');

    const isEditing = !!editingCatId;

    if (!newCatName || !newCatSlug || (!isEditing && !newCatFile)) {
      setCatError('All fields (including cover image file) are required.');
      return;
    }

    setCatUploading(true);
    setCatUploadProgress(0);
    try {
      let coverImageUrl = null;
      if (newCatFile) {
        coverImageUrl = await fileToCompressedBase64(newCatFile);
      }
      setCatUploadProgress(70);

      if (isEditing) {
        const updateData = {
          name: newCatName,
          slug: newCatSlug,
          order: parseInt(newCatOrder, 10) || 0
        };
        if (coverImageUrl) {
          updateData.coverImageUrl = coverImageUrl;
        }
        await updateDoc(doc(db, 'categories', editingCatId), updateData);
      } else {
        await addDoc(collection(db, 'categories'), {
          name: newCatName,
          slug: newCatSlug,
          order: parseInt(newCatOrder, 10) || 0,
          coverImageUrl: coverImageUrl
        });
      }
      setCatUploadProgress(100);

      setNewCatName('');
      setNewCatSlug('');
      setNewCatOrder('0');
      setNewCatFile(null);
      setEditingCatId(null);
      setCatUploadProgress(0);
      setCatUploading(false);

      fetchCategories();
    } catch (err) {
      console.error(err);
      setCatError(err.message || 'Error saving category.');
      setCatUploading(false);
      setCatUploadProgress(0);
    }
  };
const handleEditCategoryClick = (cat) => {
    setEditingCatId(cat.id);
    setNewCatName(cat.name);
    setNewCatSlug(cat.slug);
    setNewCatOrder(String(cat.order));
    setNewCatFile(null);
    setCatError('');
  };

  const handleCancelEditCategory = () => {
    setEditingCatId(null);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatOrder('0');
    setNewCatFile(null);
    setCatError('');
  };


  const handleDeleteCategory = async (catId, catSlug) => {
    if (!window.confirm(`Are you sure you want to delete this category? (Note: images associated with it in Firestore will not be automatically deleted).`)) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'categories', catId));
      fetchCategories();
    } catch (err) {
      console.error("Delete category error: ", err);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    setImageError('');
    setImageSuccess(false);

    if (!uploadCategory || !uploadTitle || !uploadFile) {
      setImageError('Title, Category, and Image File are required.');
      return;
    }

   setImageUploading(true);
    setImageUploadProgress(0);
    try {
      const base64Image = await fileToCompressedBase64(uploadFile);
      setImageUploadProgress(70);

      await addDoc(collection(db, 'images'), {
        categorySlug: uploadCategory,
        imageUrl: base64Image,
        title: uploadTitle,
        year: uploadYear,
        note: uploadNote,
        order: parseInt(uploadOrder, 10) || 0,
        size: uploadSize
      });
      setImageUploadProgress(100);

      setUploadTitle('');
      setUploadYear('');
      setUploadNote('');
      setUploadOrder('0');
      setUploadSize('1080x1350');
      setUploadFile(null);
      setImageUploadProgress(0);
      setImageUploading(false);
      setImageSuccess(true);

      setTimeout(() => setImageSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setImageError(err.message || 'Error creating database record.');
      setImageUploading(false);
      setImageUploadProgress(0);
    }
  };
  const handleDeleteImage = async (imageId) => {
    if (!window.confirm('Delete this image from this gallery?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'images', imageId));
      fetchCategoryImages(selectedCategoryFilter);
    } catch (err) {
      console.error("Delete image error: ", err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Delete this client message?')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'messages', messageId));
      fetchMessages();
    } catch (err) {
      console.error("Delete message error: ", err);
    }
  };

  if (authLoading) {
    return <LoadingSpinner />;
  }

  // --- BACKEND NOT CONFIGURED ---
  if (!db || !auth) {
    return (
      <>
        <SEO title="Studio Admin" description="Sign in to manage the studio's galleries." />
        <div className="max-w-md mx-auto my-12 bg-white border border-neutral-200/80 p-8 sm:p-10 select-none animate-fade-in text-center space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h1 className="text-sm font-semibold tracking-[0.25em] uppercase text-neutral-800">
              Studio Admin
            </h1>
            <p className="text-[10px] text-neutral-400 mt-2 font-light tracking-wide">
              SETUP REQUIRED
            </p>
          </div>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Sign-in is unavailable until the backend is connected.
          </p>
          <div className="bg-amber-50/50 border border-amber-200 text-amber-800 text-[10px] p-5 text-left font-light leading-relaxed space-y-2">
            <strong className="font-semibold block uppercase tracking-wider">To activate Admin operations:</strong>
            <ol className="list-decimal pl-4 space-y-1.5">
              <li>Create a Firebase Project in the Google console.</li>
              <li>Add your API keys to a <code>.env.local</code> file at the project root.</li>
              <li>Restart the dev server to load the keys.</li>
            </ol>
          </div>
        </div>
      </>
    );
  }

  // --- UNAUTHENTICATED: LOGIN VIEW ---
  if (!user) {
    return (
      <>
        <SEO title="Studio Admin" description="Sign in to manage galleries." />
        <div className="max-w-md mx-auto my-12 bg-white border border-neutral-200/80 p-8 sm:p-10 select-none animate-fade-in">
          <div className="text-center mb-8 border-b border-neutral-100 pb-4">
            <h1 className="text-sm font-semibold tracking-[0.25em] uppercase text-neutral-800">
              Studio Admin
            </h1>
            <p className="text-[10px] text-neutral-400 mt-2 font-light tracking-wide">
              AUTHORIZED ACCESS ONLY
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {loginError && (
              <div className="bg-red-50/50 border border-red-200 text-red-600 text-xs px-4 py-3 font-light">
                {loginError}
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="email" className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-2.5 transition-colors duration-300"
                placeholder="admin@domain.com"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="pass" className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                Password
              </label>
              <input
                type="password"
                id="pass"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-2.5 transition-colors duration-300"
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full text-center text-[10px] font-bold tracking-[0.25em] uppercase text-white bg-neutral-950 hover:bg-accent transition-colors duration-300 py-4 border border-neutral-950 disabled:bg-neutral-300 disabled:border-neutral-300"
            >
              {loginLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </>
    );
  }

  // --- AUTHENTICATED: DASHBOARD VIEW ---
  return (
    <>
      <SEO title="Studio Admin" description="Configure categories, upload pictures, and read client messages." />
      
      <div className="space-y-8 animate-fade-in select-none">
        {/* Dashboard Title Header */}
        <div className="border-b border-neutral-200 pb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <h1 className="text-xl md:text-2xl font-light tracking-tight text-neutral-900">
              Studio Admin
            </h1>
            <p className="text-[10px] text-neutral-400 mt-1 font-light tracking-widest uppercase">
              Signed in as: {user.email}
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-neutral-900 border border-neutral-200 px-4 py-2 hover:bg-neutral-50 transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-neutral-200 overflow-x-auto space-x-6 pb-px">
          {[
            { id: 'categories', label: 'Categories' },
            { id: 'upload', label: 'Upload Images' },
            { id: 'manage', label: 'Manage Images' },
            { id: 'messages', label: 'Inbox Messages' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[10px] font-bold tracking-widest uppercase pb-3 transition-all relative border-b-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-accent text-accent' 
                  : 'border-transparent text-neutral-400 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- TAB CONTENT 1: CATEGORIES --- */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Create Category Form */}
            <div className="lg:col-span-1 bg-white border border-neutral-200/60 p-6">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-6 border-b border-neutral-100 pb-2">
                {editingCatId ? 'Edit Category' : 'New Category'}
              </h3>
              <form onSubmit={handleCreateCategory} className="space-y-5">
                {catError && (
                  <div className="bg-red-50 text-red-600 text-xs px-3 py-2 font-light border border-red-200">
                    {catError}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">Name</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={handleCatNameChange}
                    className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-1.5 transition-colors duration-300"
                    placeholder="Fine Art"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">URL Slug</label>
                  <input
                    type="text"
                    required
                    value={newCatSlug}
                    onChange={(e) => setNewCatSlug(e.target.value)}
                    className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-1.5 transition-colors duration-300"
                    placeholder="fine-art"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">Sort Order</label>
                  <input
                    type="number"
                    value={newCatOrder}
                    onChange={(e) => setNewCatOrder(e.target.value)}
                    className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-1.5 transition-colors duration-300"
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 block">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setNewCatFile(e.target.files[0])}
                    className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-200 file:text-[10px] file:font-semibold file:tracking-widest file:uppercase file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100 cursor-pointer"
                  />
                </div>

                {catUploading && (
                  <div className="space-y-1">
                    <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-accent h-full transition-all duration-300" style={{ width: `${catUploadProgress}%` }} />
                    </div>
                    <span className="text-[9px] text-neutral-400 tracking-wider">Uploading cover: {catUploadProgress}%</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={catUploading}
                    className="flex-1 text-center text-[10px] font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-accent transition-colors duration-300 py-3 disabled:bg-neutral-200"
                  >
                    {catUploading ? 'Saving...' : editingCatId ? 'Update Category' : 'Add Category'}
                  </button>
                  {editingCatId && (
                    <button
                      type="button"
                      onClick={handleCancelEditCategory}
                      className="text-[10px] font-bold tracking-widest uppercase text-neutral-500 border border-neutral-300 hover:bg-neutral-50 transition-colors duration-300 px-4 py-3"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List Categories */}
            <div className="lg:col-span-2">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-6 border-b border-neutral-100 pb-2">
                Existing Categories ({categories.length})
              </h3>
              
              {categories.length === 0 ? (
                <p className="text-xs text-neutral-400 font-light italic">No categories created yet. Create one on the left.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat) => (
                    <div key={cat.id} className="bg-white border border-neutral-200/50 p-4 flex gap-4 items-center justify-between">
                      <div className="flex gap-4 items-center">
                        <img 
                          src={cat.coverImageUrl} 
                          alt={cat.name} 
                          className="w-12 h-12 object-cover bg-neutral-100 border border-neutral-200"
                        />
                        <div>
                          <h4 className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">{cat.name}</h4>
                          <p className="text-[10px] text-neutral-400 font-light mt-0.5">Slug: {cat.slug} &bull; Order: {cat.order}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditCategoryClick(cat)}
                          className="text-[9px] text-neutral-500 hover:text-neutral-800 tracking-widest font-semibold uppercase border border-neutral-200 hover:border-neutral-500 px-2 py-1 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.slug)}
                          className="text-[9px] text-red-500 hover:text-red-700 tracking-widest font-semibold uppercase border border-red-200 hover:border-red-500 px-2 py-1 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT 2: UPLOAD IMAGE --- */}
        {activeTab === 'upload' && (
          <div className="max-w-xl mx-auto bg-white border border-neutral-200/60 p-8">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-6 border-b border-neutral-100 pb-2">
              Upload Image to Gallery
            </h3>
            
            {categories.length === 0 ? (
              <p className="text-xs text-neutral-400 font-light text-center py-6">
                You must create a category first before uploading images.
              </p>
            ) : (
              <form onSubmit={handleImageUpload} className="space-y-6">
                {imageError && (
                  <div className="bg-red-50 text-red-600 text-xs px-3 py-2 font-light border border-red-200">
                    {imageError}
                  </div>
                )}
                {imageSuccess && (
                  <div className="bg-green-50 text-green-600 text-xs px-3 py-2 font-light border border-green-200">
                    Image successfully uploaded and added to database!
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">Target Gallery</label>
                    <select
                      value={uploadCategory}
                      onChange={(e) => setUploadCategory(e.target.value)}
                      className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-xs font-light text-neutral-700 outline-none py-2 transition-colors cursor-pointer"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">Title</label>
                    <input
                      type="text"
                      required
                      value={uploadTitle}
                      onChange={(e) => setUploadTitle(e.target.value)}
                      className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-1.5 transition-colors duration-300"
                      placeholder="e.g. Shadows in Berlin"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">Year</label>
                    <input
                      type="text"
                      value={uploadYear}
                      onChange={(e) => setUploadYear(e.target.value)}
                      className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-1.5 transition-colors duration-300"
                      placeholder="e.g. 2025"
                    />
                  </div>
                  
                  <div className="space-y-1 col-span-2">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">Note / Dimensions / Print Type</label>
                    <input
                      type="text"
                      value={uploadNote}
                      onChange={(e) => setUploadNote(e.target.value)}
                      className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-1.5 transition-colors duration-300"
                      placeholder="e.g. Archival pigment print, Edition of 5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">Sorting Order</label>
                    <input
                      type="number"
                      value={uploadOrder}
                      onChange={(e) => setUploadOrder(e.target.value)}
                      className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-sm font-light text-neutral-800 outline-none py-1.5 transition-colors duration-300"
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">Display Size</label>
                    <select
                      value={uploadSize}
                      onChange={(e) => setUploadSize(e.target.value)}
                      className="w-full bg-transparent border-b border-neutral-200 focus:border-accent text-xs font-light text-neutral-700 outline-none py-2 transition-colors cursor-pointer"
                    >
                      <option value="1080x1080">Square (1080x1080)</option>
                      <option value="1080x1350">Portrait (1080x1350)</option>
                      <option value="1920x1080">Landscape (1920x1080)</option>
                      <option value="1080x1920">Story (1080x1920)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-bold tracking-widest uppercase text-neutral-400 block">Image File</label>
                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border file:border-neutral-200 file:text-[10px] file:font-semibold file:tracking-widest file:uppercase file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100 cursor-pointer"
                  />
                </div>

                {imageUploading && (
                  <div className="space-y-1">
                    <div className="w-full bg-neutral-100 h-1 rounded-full overflow-hidden">
                      <div className="bg-accent h-full transition-all duration-300" style={{ width: `${imageUploadProgress}%` }} />
                    </div>
                    <span className="text-[9px] text-neutral-400 tracking-wider">Uploading asset: {imageUploadProgress}%</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={imageUploading}
                  className="w-full text-center text-[10px] font-bold tracking-widest uppercase text-white bg-neutral-900 hover:bg-accent transition-colors duration-300 py-4 border border-neutral-950 disabled:bg-neutral-200 disabled:border-neutral-200"
                >
                  {imageUploading ? 'Uploading Image...' : 'Upload Image'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* --- TAB CONTENT 3: MANAGE IMAGES --- */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                Filter Images by Gallery
              </h3>
              
              {categories.length > 0 && (
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-white border border-neutral-200 text-xs font-semibold uppercase tracking-wider text-neutral-700 outline-none px-4 py-2 cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>

            {imagesLoading ? (
              <LoadingSpinner />
            ) : filteredImages.length === 0 ? (
              <p className="text-xs text-neutral-400 font-light italic">No images in this category. Go to the "Upload Images" tab to add some.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {filteredImages.map((img) => (
                  <div key={img.id} className="bg-white border border-neutral-200/50 p-2.5 flex flex-col justify-between group">
                    <div>
                      <div className="aspect-[4/5] overflow-hidden bg-neutral-50 relative">
                        <img 
                          src={img.imageUrl} 
                          alt={img.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="text-[10px] font-semibold tracking-wider text-neutral-800 uppercase mt-2.5 truncate">{img.title}</h4>
                      <p className="text-[8px] text-neutral-400 tracking-wider font-light mt-0.5">Order: {img.order} {img.year ? `• ${img.year}` : ''}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="text-[9px] text-red-500 hover:text-red-700 tracking-widest font-semibold uppercase border border-red-100 hover:border-red-400 py-1.5 mt-3 transition-colors"
                    >
                      Delete Image
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- TAB CONTENT 4: INBOX MESSAGES --- */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 border-b border-neutral-100 pb-2">
              Client Messages ({messages.length})
            </h3>

            {messagesLoading ? (
              <LoadingSpinner />
            ) : messages.length === 0 ? (
              <p className="text-xs text-neutral-400 font-light italic">Inbox is empty. Messages submitted from the contact page will appear here.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const dateStr = msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleString() : 'Just now';
                  return (
                    <div key={msg.id} className="bg-white border border-neutral-200/50 p-6 flex flex-col md:flex-row gap-6 justify-between items-start">
                      <div className="space-y-3 flex-1">
                        <div className="flex flex-wrap gap-x-4 gap-y-1 items-baseline">
                          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-xs text-accent hover:underline">{msg.email}</a>
                          <span className="text-[9px] text-neutral-400 font-light">{dateStr}</span>
                        </div>
                        {msg.subject && (
                          <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Subject: {msg.subject}</p>
                        )}
                        <p className="text-xs text-neutral-600 font-light leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="text-[9px] text-red-500 hover:text-red-700 tracking-widest font-semibold uppercase border border-red-100 hover:border-red-400 px-3 py-2 transition-colors whitespace-nowrap self-end md:self-start"
                      >
                        Delete Message
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
