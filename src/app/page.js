"use client"
import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, ShoppingCart, PlusSquare, MessageCircle, User, 
  Search, Bell, ChevronLeft, Send, Image as ImageIcon,
  MoreVertical, CheckCircle2, ShieldAlert, X, Star, MapPin, Edit3, Trash2, Camera, Crown, Info, LogOut, Mail, Lock, ChevronRight, CreditCard, Package, Users, Settings, Plus, Minus, LayoutGrid, ImagePlus, CheckCircle, Check, CheckCheck,
  Sun, Moon, TrendingUp, BarChart3, DollarSign
} from 'lucide-react';

// === KONEKSI DATABASE SUPABASE ===
const supabaseUrl = 'https://mkqbcignmxfqmggcqjaj.supabase.co';
const supabaseAnonKey = 'sb_publishable_simbwHYCVDyG1KJF1MvMqQ_LP_lR2A_';
let supabase = null;
// =================================

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]); 
  
  // NAVIGATION & UI STATES
  const [view, setView] = useState('main'); 
  const [activeTab, setActiveTab] = useState('home');
  const [toast, setToast] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotif, setUnreadNotif] = useState(false); 
  const [isDarkMode, setIsDarkMode] = useState(true); 
  const [showAbout, setShowAbout] = useState(false); 
  
  // DATA STATES
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]); 
  const [notifications, setNotifications] = useState([]);

  // SETTINGS STATES
  
  const [banners, setBanners] = useState([
     { id: 1, img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1000&auto=format&fit=crop", title: "PROMO GILA \nELVAN TECH!", subtitle: "Gajian Seru Up to 70% Off" },
     { id: 2, img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop", title: "GADGET TERBARU", subtitle: "Cicilan 0% Mulai Hari Ini" }
  ]);
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0); 
  const [categories, setCategories] = useState(['Semua', 'Handphone', 'Laptop', 'Aksesoris', 'Gaming']);
  const [activeCategory, setActiveCategory] = useState('Semua');

  // TOUCH SWIPE STATES
  const [touchStartXY, setTouchStartXY] = useState(null);
  const [touchEndXY, setTouchEndXY] = useState(null);

  // CHAT STATES
  const [activeChat, setActiveChat] = useState(null); 
  const [chatMessages, setChatMessages] = useState([]);
  const [newMsgText, setNewMsgText] = useState('');
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState(null);
  
  const chatEndRef = useRef(null);
  const chatIntervalRef = useRef(null);

  // SEARCH & PROFIL STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({ username: '', handle: '', bio: '', hobi: '', avatar: '' });

  // PRODUCT DETAIL, DELETE, & COMMENTS STATE
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null); 
  const [productComments, setProductComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [productRatingData, setProductRatingData] = useState({ average: '0.0', count: 0, userRating: 0 });

  // POST & CHECKOUT STATES
  const [postData, setPostData] = useState({ title: '', price: '', stock: '', description: '', img: '', category: 'Handphone' });
  
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', province: '', city: '', district: '', zipCode: '', address: '', method: 'QRIS' });

  // Form Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // CSS Custom
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes sparkle { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes gradient-x { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      .dev-text-glow { background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: sparkle 3s linear infinite; font-weight: 900; filter: drop-shadow(0 0 5px rgba(255,255,255,0.3)); }
      .text-rainbow-animated { background: linear-gradient(90deg, #ff0080, #ff8c00, #40e0d0, #00ff00, #0080ff, #8a2be2, #ff0080); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: gradient-x 3s linear infinite; }
      
      .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255, 255, 255, 0.08); }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .snap-x-mandatory { scroll-snap-type: x mandatory; }
      .snap-center { scroll-snap-align: center; }

      /* --- FITUR BARU: LIGHT MODE STYLES --- */
      .light-mode { background-color: #f8fafc !important; color: #0f172a !important; }
      .light-mode .bg-slate-950 { background-color: #f1f5f9 !important; }
      .light-mode .bg-slate-900 { background-color: #ffffff !important; border-color: #e2e8f0 !important; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important; }
      .light-mode .bg-slate-800 { background-color: #e2e8f0 !important; }
      .light-mode .text-slate-200, .light-mode .text-slate-300 { color: #334155 !important; }
      .light-mode .text-slate-400 { color: #475569 !important; }
      .light-mode .text-white { color: #0f172a !important; }
      .light-mode .glass { background: rgba(255, 255, 255, 0.8) !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; }
      .light-mode input, .light-mode textarea, .light-mode select { background-color: #ffffff !important; color: #0f172a !important; border-color: #cbd5e1 !important; }
      
      .light-mode .border-slate-800, .light-mode .border-slate-700 { border-color: #e2e8f0 !important; }
      .light-mode .bg-blue-600, .light-mode button.bg-blue-600, .light-mode .bg-red-500, .light-mode .bg-red-600, .light-mode .bg-gradient-to-r, .light-mode .bg-gradient-to-tr { color: #ffffff !important; }
      .light-mode .absolute h2, .light-mode .absolute p.text-white\\/70 { color: #ffffff !important; }
    `;
    document.head.appendChild(style);
  }, []);

  // --- ANIMASI SLIDE BANNER OTOMATIS ---
  useEffect(() => {
     if (banners.length <= 1) return;
     const interval = setInterval(() => {
        setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
     }, 3500);
     return () => clearInterval(interval);
  }, [banners.length, currentBannerIdx]);

  // --- LOGIKA SENSOR SENTUHAN ---
  const handleTouchStart = (e) => {
     setTouchEndXY(null);
     
     setTouchStartXY({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchMove = (e) => {
     setTouchEndXY({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
  };

  const handleTouchEnd = () => {
     if (!touchStartXY || !touchEndXY) return;
     const distanceX = touchStartXY.x - touchEndXY.x;
     const distanceY = touchStartXY.y - touchEndXY.y;
     
     if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > 50) {
        if (distanceX > 0) {
           setCurrentBannerIdx((prev) => (prev + 1) % banners.length);
        } else {
           setCurrentBannerIdx((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
        }
     }
  };
  
  // --- INIT SUPABASE & DETEKSI LOGIN ---
  useEffect(() => {
    const initApp = async () => {
      if (!window.supabase) return;
      supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
         await handleSessionUser(session.user);
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
         if (session && session.user && !isLoggedIn) {
            await handleSessionUser(session.user);
         }
      });

      fetchAllData();
      setTimeout(() => setIsLoaded(true), 1500);
    };
    
    if (!document.getElementById('supabase-script')) {
      const script = document.createElement('script');
      script.id = 'supabase-script';
      script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      script.onload = initApp;
      document.head.appendChild(script);
    } else {
      initApp();
    }
  }, []);

  const handleSessionUser = async (userAuth) => {
     try {
        const { data: existingUser } = await supabase.from('users').select('*').eq('email', userAuth.email).single();
        
        if (existingUser && existingUser.role === 'banned') {
           showToast("Akun Anda DIBLOKIR oleh Developer!", "error");
           await supabase.auth.signOut();
           return;
        }
        
        if (existingUser) {
           setCurrentUser(existingUser); setEditData(existingUser);
        } else {
           let role = userAuth.email === 'elvansinagacom@gmail.com' ? 'developer' : 'user';
           const uid = 'google-' + Math.random().toString(36).substr(2, 9);
           const uname = role === 'developer' ? 'Elvan Parlin Agustario Sinaga' : (userAuth.user_metadata?.full_name || userAuth.email.split('@')[0]);
           const generatedHandle = uname.toLowerCase().replace(/[^a-z0-9_]/g, '') + Math.floor(Math.random() * 1000);

           const newUser = { 
              id: uid, email: userAuth.email, username: uname, handle: generatedHandle, role: role, 
              bio: role === 'developer' ? 'Founder & CEO ElvanTechnoShop 👑' : 'Masuk via akun Google', 
              hobi: 'Belanja Online', avatar: userAuth.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${uname}`
           };

           await supabase.from('users').insert([newUser]);
           setCurrentUser(newUser); setEditData(newUser);
        }
        setIsLoggedIn(true);
        fetchAllData();
        fetchMyOrders();
        
     } catch (err) { console.error("Gagal sinkronisasi data Google:", err); }
  };

  const fetchAllData = async () => {
     if (!supabase) return;
     fetchUsersFromDatabase();
     fetchProducts();
  }

  const fetchUsersFromDatabase = async () => {
    try {
      const { data } = await supabase.from('users').select('*');
      if (data) setRegisteredUsers(data);
    } catch (err) { console.error(err); }
  };

  const fetchProducts = async () => {
     try {
        const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (data) setProducts(data);
     } catch (err) { console.error(err); }
  }
  
  const fetchMyOrders = async () => {
     if(!supabase || !currentUser) return;
     try {
        const { data } = await supabase.from('orders').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: false });
        if(data) setMyOrders(data);
     } catch(err) { console.error(err); }
  }

  const fetchAllOrdersAdmin = async () => {
     try {
        const { data } = await supabase.from('orders').select(`*, users (username, handle)`).order('created_at', { ascending: false });
        if(data) setAllOrders(data);
     } catch(err) { console.error(err); }
  }

  const addNotification = (title, message, type='info') => {
     const newNotif = { id: Date.now(), title, message, type, time: new Date().toLocaleTimeString() };
     setNotifications(prev => [newNotif, ...prev]);
     setUnreadNotif(true); 
  }
  
  // --- LOGIKA AUTHENTIKASI MANUAL ---
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!supabase) { showToast("Sistem Database belum siap!", "error"); setLoading(false); return; }

    try {
      if (password.length < 6 || !/\d/.test(password)) { showToast("Sandi min. 6 digit & angka!", "error"); setLoading(false); return; }

      const { data: existingUser } = await supabase.from('users').select('*').eq('email', email).single();

      if (isRegisterMode) {
        if (password !== confirmPassword) { showToast("Sandi tidak cocok!", "error"); setLoading(false); return; }
        if (existingUser) { showToast("Email terdaftar! Silakan Login.", "error"); setLoading(false); return; }

        let role = email === 'elvansinagacom@gmail.com' ? 'developer' : 'user';
        const uid = 'user-' + Math.random().toString(36).substr(2, 9);
        const uname = role === 'developer' ? 'Elvan Parlin Agustario Sinaga' : email.split('@')[0];
        
        const generatedHandle = uname.toLowerCase().replace(/[^a-z0-9_]/g, '') + Math.floor(Math.random() * 1000);

        const newUser = { 
           id: uid, email: email, username: uname, handle: generatedHandle, role: role, 
           bio: role === 'developer' ? 'Founder & CEO ElvanTechnoShop 👑' : 'Baru bergabung di El-Tech', 
           hobi: 'Teknologi, Gaming', avatar: '' 
        };

        const { error: insertError } = await supabase.from('users').insert([newUser]);
        if (insertError) throw insertError;

        setCurrentUser(newUser); setEditData(newUser);
        addNotification("Selamat Datang!", "Akun berhasil dibuat. Selamat berbelanja.");
        showToast(`Akun berhasil dibuat, ${uname}!`);

      } else {
        if (!existingUser) { showToast("Akun tidak ditemukan!", "error"); setLoading(false); return; }
        if (existingUser.role === 'banned') { showToast("Akun Anda DIBLOKIR!", "error"); setLoading(false); return; }

        setCurrentUser(existingUser); setEditData(existingUser);
        addNotification("Login Berhasil", `Selamat datang kembali, ${existingUser.username}!`);
        
        showToast(`Selamat datang, ${existingUser.username}!`);
      }

      setIsLoggedIn(true);
      fetchAllData();
      fetchMyOrders();
    } catch (err) { console.error(err); showToast("Gagal terhubung ke Database!", "error"); }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
     setLoading(true);
     try {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin }});
        if (error) throw error;
     } catch (err) { console.error(err); showToast("Gagal memuat Google Login!", "error"); setLoading(false); }
  };

  const handleSaveProfile = async () => {
    if(!editData.handle) return showToast("Nama Resmi Akun wajib diisi!", "error");
    setLoading(true);
    
    try {
       const { data: checkHandle } = await supabase.from('users').select('id').eq('handle', editData.handle).neq('id', currentUser.id);
       if (checkHandle && checkHandle.length > 0) { showToast("Handle sudah dipakai!", "error"); setLoading(false); return; }

       const { error } = await supabase.from('users').update({
             username: editData.username, handle: editData.handle, bio: editData.bio, hobi: editData.hobi, avatar: editData.avatar
          }).eq('id', currentUser.id);

       if (error) throw error;
       setCurrentUser({...currentUser, ...editData});
       setIsEditingProfile(false);
       fetchUsersFromDatabase();
       addNotification("Profil Diperbarui", "Perubahan profil telah disimpan di Cloud.");
       showToast("Profil tersimpan di Cloud! ☁️");
    } catch (err) { console.error(err); showToast("Gagal menyimpan profil!", "error"); }
    setLoading(false);
  };

  const handleLogout = async () => {
     await supabase.auth.signOut();
     setIsLoggedIn(false); 
     setCurrentUser(null);
  };
  
  // --- LOGIKA KERANJANG ---
  const handleAddToCart = (product) => {
     if(product.stock <= 0) return showToast("Stok barang habis!", "error");
     
     const existingItem = cart.find(item => item.id === product.id);
     if (existingItem) {
        if(existingItem.qty >= product.stock) return showToast("Maksimal stok tercapai!", "error");
        setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
     } else {
        setCart([...cart, { ...product, qty: 1 }]);
     }
     showToast("Berhasil masuk keranjang!");
  };

  const updateCartQty = (id, change) => {
     setCart(cart.map(item => {
        if (item.id === id) {
           const newQty = item.qty + change;
           if(newQty > item.stock) { showToast("Stok tidak mencukupi!", "error"); return item; }
           if(newQty < 1) return item;
           return { ...item, qty: newQty };
        }
        return item;
     }));
  };
  
  // --- LOGIKA POST & HAPUS PRODUK ---
  const handlePostProduct = async (e) => {
     e.preventDefault();
     if(!postData.title || !postData.price || !postData.img) return showToast("Judul, Harga, dan Gambar wajib diisi!", "error");
     setLoading(true);
     try {
        const newProd = {
           title: postData.title, price: parseFloat(postData.price), stock: parseInt(postData.stock) || 1,
           description: postData.description, seller_id: currentUser.id, seller_name: currentUser.username, category: postData.category, is_new: true,
           img: postData.img
        };
        const { error } = await supabase.from('products').insert([newProd]);
        if(error) throw error;
        showToast("Produk berhasil diposting!");
        addNotification("Produk Baru", `Produk "${postData.title}" berhasil ditambahkan ke pasar.`);
        setPostData({ title: '', price: '', stock: '', description: '', img: '', category: 'Handphone' });
        fetchProducts();
        setActiveTab('home');
     } catch(err) { console.error(err); showToast("Gagal memposting produk", "error"); }
     setLoading(false);
  }
  
  const handleDeleteProduct = async (id) => {
     setProductToDelete(null); 
     setLoading(true);
     try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if(error) throw error;
        showToast("Produk berhasil dihapus!");
        fetchProducts();
     } catch(err) { showToast("Gagal menghapus produk", "error"); }
     setLoading(false);
  }

  // --- LOGIKA KOMENTAR ---
  const fetchProductComments = async (productId) => {
     if (!supabase || !productId) return;
     try {
        const { data } = await supabase.from('product_comments').select(`id, text, created_at, users (username, avatar, role)`).eq('product_id', productId).order('created_at', { ascending: false });
        if (data) setProductComments(data);
     } catch (err) { console.error(err); }
  }
  
  // --- LOGIKA RATING BINTANG ---
  const fetchProductRatings = async (productId) => {
    
     if (!supabase || !productId) return;
     try {
        const { data } = await supabase.from('product_ratings').select('user_id, rating_value').eq('product_id', productId);
        if (data) {
           const count = data.length;
           const avg = count > 0 ? (data.reduce((acc, curr) => acc + curr.rating_value, 0) / count).toFixed(1) : '0.0';
           const userR = data.find(r => r.user_id === currentUser?.id)?.rating_value || 0;
           setProductRatingData({ average: avg, count, userRating: userR });
        }
     } catch (err) { console.error(err); }
  }

  const handleRateProduct = async (stars) => {
     if (!supabase || !selectedProduct || !currentUser) return;
     setLoading(true);
     try {
        const { data: existing } = await supabase.from('product_ratings').select('id').eq('product_id', selectedProduct.id).eq('user_id', currentUser.id).single();
        if (existing) {
           await supabase.from('product_ratings').update({ rating_value: stars }).eq('id', existing.id);
        } else {
           await supabase.from('product_ratings').insert([{ product_id: selectedProduct.id, user_id: currentUser.id, rating_value: stars }]);
        }
        
        const { data: allRatings } = await supabase.from('product_ratings').select('rating_value').eq('product_id', selectedProduct.id);
        const newCount = allRatings.length;
        const newAvg = (allRatings.reduce((acc, curr) => acc + curr.rating_value, 0) / newCount).toFixed(1);
        await supabase.from('products').update({ rating: newAvg, review_count: newCount }).eq('id', selectedProduct.id);
        showToast(`Berhasil memberi nilai ${stars} Bintang!`);
        fetchProductRatings(selectedProduct.id);
        fetchProducts(); 
     } catch(err) { console.error(err); showToast("Gagal memberi rating", "error"); }
     setLoading(false);
  }

  useEffect(() => {
     if (view === 'productDetail' && selectedProduct) {
        fetchProductComments(selectedProduct.id);
        fetchProductRatings(selectedProduct.id);
     }
  }, [view, selectedProduct]);

  const handlePostComment = async (e) => {
     e.preventDefault();
     if (!newCommentText.trim() || !supabase || !selectedProduct) return;
     const textToPost = newCommentText;
     
     setNewCommentText('');
     setLoading(true);
     try {
        const { error } = await supabase.from('product_comments').insert([{ product_id: selectedProduct.id, user_id: currentUser.id, text: textToPost }]);
        if(error) throw error;
        fetchProductComments(selectedProduct.id);
        showToast("Komentar berhasil diposting!");
     } catch(err) { console.error(err); showToast("Gagal mengirim komentar", "error"); }
     setLoading(false);
  }

  // --- LOGIKA CHECKOUT ---
  const handleCheckout = async () => {
     if(!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address || !shippingInfo.province || !shippingInfo.city) return showToast("Lengkapi semua data pengiriman!", "error");
     if(cart.length === 0) return showToast("Keranjang kosong!", "error");
     
     setLoading(true);
     try {
        const orderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const totalHarga = cart.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
        
        const newOrder = { id: orderId, user_id: currentUser.id, total: totalHarga, status: 'Diproses Admin', shipping_info: shippingInfo, items: cart };
        
        const { error: orderError } = await supabase.from('orders').insert([newOrder]);
        if(orderError) throw orderError;

        for(const item of cart) {
           const newStock = Math.max(0, item.stock - item.qty);
           await supabase.from('products').update({ stock: newStock }).eq('id', item.id);
        }

        addNotification("Pesanan Sukses!", `Pesanan ${orderId} sedang diproses. Total: ${formatIDR(totalHarga)}`, "success");
        showToast("Pesanan Berhasil! Stok telah dikurangi.");
        setCart([]); setShippingInfo({ name: '', phone: '', province: '', city: '', district: '', zipCode: '', address: '', method: 'QRIS' });
        setView('main'); fetchProducts(); fetchMyOrders(); setActiveTab('profile');
     } catch(err) { console.error(err); showToast("Gagal memproses pesanan", "error"); }
     setLoading(false);
  }

  // --- LOGIKA CHAT ---
  const getRoomId = () => {
     if(!activeChat) return null;
     if(activeChat.type === 'global') return 'global';
     const ids = [currentUser.id, activeChat.user.id].sort();
     return `${ids[0]}_${ids[1]}`;
  }
  
  const fetchChatMessages = async () => {
     const roomId = getRoomId();
     if(!supabase || !roomId) return;
     try {
        let clearedAt = null;
        const { data: clearData } = await supabase.from('chat_clears').select('cleared_at').eq('user_id', currentUser.id).eq('room_id', roomId).maybeSingle();
        if (clearData) clearedAt = clearData.cleared_at;

        const { data, error } = await supabase.from('messages').select(`id, text, created_at, sender_id, is_read, users (username, role, avatar)`).eq('room_id', roomId).order('created_at', { ascending: true });
        
        if (error) {
           const fallback = await supabase.from('messages').select(`id, text, created_at, sender_id, users (username, role, avatar)`).eq('room_id', roomId).order('created_at', { ascending: true });
           if(fallback.data) {
              const filteredFallback = clearedAt ? fallback.data.filter(m => new Date(m.created_at) > new Date(clearedAt)) : fallback.data;
              setChatMessages(filteredFallback.map(m => ({...m, is_read: false})));
              if(view === 'chatRoom') chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
           }
           return;
        }

        if (data) {
           const filteredData = clearedAt ? data.filter(m => new Date(m.created_at) > new Date(clearedAt)) : data;
           setChatMessages(filteredData);
           
           if(view === 'chatRoom') chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
           if (activeChat?.type === 'private') {
               const unreadIds = data.filter(m => !m.is_read && m.sender_id !== currentUser.id).map(m => m.id);
               if (unreadIds.length > 0) supabase.from('messages').update({ is_read: true }).in('id', unreadIds).then(() => {});
           }
        }
     } catch (err) { console.error(err); }
  }

  const openChatRoom = (chatType, user = null) => {
     setActiveChat({ type: chatType, user });
     setView('chatRoom');
     setChatMessages([]);
  }

  useEffect(() => {
  // Hanya pasang telinga kalau lagi di halaman chat
  if (view === 'chatRoom' && activeChat) {
    fetchChatMessages(); // Ambil pesan lama dulu

    // PASANG TELINGA SUPER DISINI 👂✨
    const channel = supabase
      .channel('realtime-chat')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages', // Sesuai baris 568 di layar Bos
          filter: `room_id=eq.${getRoomId()}` // Biar nggak dengerin chat orang lain
        },
        (payload) => {
          // Begitu ada pesan masuk, langsung tambah ke layar! 🚀
          setChatMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }
}, [view, activeChat]);
  
  const handleSendMessage = async (e) => {
     e.preventDefault();
     if(!newMsgText.trim() || !supabase || !activeChat) return;
     const textToSend = newMsgText;
     setNewMsgText('');
     try {
        const { error } = await supabase.from('messages').insert([{ room_id: getRoomId(), sender_id: currentUser.id, text: textToSend }]);
        if(error) throw error;
     } catch(err) { console.error(err); showToast("Gagal mengirim pesan", "error"); }
  }

  const handleClearChatHistory = async () => {
     const roomId = getRoomId();
     if(!roomId || !supabase) return;
     try {
        const { error } = await supabase.from('chat_clears').upsert({ user_id: currentUser.id, room_id: roomId, cleared_at: new Date().toISOString() }, { onConflict: 'user_id, room_id' });
        if(error) {
           const { error: delErr } = await supabase.from('messages').delete().eq('room_id', roomId);
           if(delErr) throw delErr;
        }
        showToast("Riwayat chat dihapus untuk Anda!");
        setChatMessages([]); setShowChatOptions(false);
     } catch(err) { console.error(err); showToast("Gagal menghapus chat", "error"); }
  }

  const confirmForceDeleteMsg = async (msgId) => {
     setMsgToDelete(null);
     if(!supabase) return;
     try {
        const { error } = await supabase.from('messages').delete().eq('id', msgId);
        if(error) throw error;
        showToast("Pesan dihapus paksa dari server!");
        fetchChatMessages();
     } catch(err) { console.error(err); showToast("Gagal menghapus pesan", "error"); }
  }

  // --- FITUR DEV / ADMIN ---
  const handleUpdateRole = async (uid, newRole) => {
     if(uid === currentUser.id) return showToast("Tidak bisa mengubah status diri sendiri!", "error");
     try {
        const { error } = await supabase.from('users').update({ role: newRole }).eq('id', uid);
        if(error) throw error;
        showToast(`Status akun diubah menjadi: ${newRole.toUpperCase()}`);
        fetchUsersFromDatabase();
     } catch(err) { console.error(err); showToast("Gagal mengubah status", "error"); }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    
     try {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if(error) throw error;
        showToast("Status pesanan diperbarui!");
        fetchAllOrdersAdmin();
     } catch(err) { showToast("Gagal update status", "error"); }
  }

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  const formatIDR = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const BadgeUser = ({ role, username, showCrown = true }) => {
    if (role === 'developer') return (<div className="flex items-center gap-1 font-bold"><span className="text-white">{username}</span>{showCrown && <Crown size={14} className="text-yellow-400" />}<span className="dev-text-glow text-[10px] ml-1 uppercase">Developer ElTech</span></div>);
    if (role === 'admin') return (<div className="flex items-center gap-1 font-bold"><span className="text-white">{username}</span><CheckCircle2 size={14} className="text-blue-400" /><span className="text-yellow-500 text-[10px] ml-1 uppercase font-black">Admin</span></div>);
    if (role === 'banned') return (<div className="flex items-center gap-1 font-bold"><span className="text-slate-500 line-through">{username}</span><ShieldAlert size={14} className="text-red-500" /><span className="text-red-500 text-[10px] ml-1 uppercase font-black">BANNED</span></div>);
    return <span className="font-bold text-white tracking-tight">{username}</span>;
  };

  // --- OVERLAY TENTANG APLIKASI ---
  const aboutOverlay = showAbout && (
     <div className="fixed inset-0 z-[200] bg-slate-950 animate-in slide-in-from-bottom duration-500 overflow-y-auto hide-scrollbar text-slate-300">
       
         <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md p-4 border-b border-slate-800 flex items-center gap-4 z-10">
            <button onClick={() => setShowAbout(false)} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-colors"><ChevronLeft size={24}/></button>
            <h2 className="text-lg font-black text-white">Tentang Web App</h2>
         </div>
         <div className="p-6 space-y-6 pb-20">
            <div className="text-center">
               <img src="icon-512.png" alt="ElvanTechnoShop Logo" className="h-24 w-auto object-contain mx-auto mb-4 drop-shadow-2xl rounded-3xl" />
               <h3 className="text-2xl font-black text-rainbow-animated">ElvanTechnoShop</h3>
               <p className="text-xs text-slate-400 mt-1 font-bold">Dibuat dengan dedikasi penuh 🔥</p>
            </div>
            <div className="glass p-5 rounded-3xl border border-blue-500/30 relative overflow-hidden shadow-2xl shadow-blue-500/10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
               <div className="flex items-center gap-2 mb-3 relative z-10">
                  <Crown size={24} className="text-yellow-400"/>
                  <h4 className="font-black text-white text-lg">Catatan Sang Founder Elvan Parlin Agustario Sinaga</h4>
               </div>
               <p className="text-sm text-slate-200 leading-relaxed italic relative z-10">
                  "Web App ini dibuat resmi oleh anak berusia 15 tahun yaitu aku <span className="text-yellow-400 font-bold">Elvan Parlin Agustario Sinaga</span> dari semua tampilan, fitur sampai kegunaannya, tanpa bantuan apapun, ada usaha yang tidak di ketahui oleh orang lain di balik pembuatan Web App ini jadi tolong hargain 🙏."
               </p>
            </div>

            <div className="glass p-6 rounded-3xl border border-purple-500/30 relative overflow-hidden shadow-2xl shadow-purple-500/10">
               <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
               <h4 className="font-black text-white mb-4 text-lg relative z-10">Ucapan Terima Kasih 💖</h4>
               <div className="text-xs text-slate-300 leading-relaxed text-justify space-y-4 relative z-10">
                  <p>Terimakasih kepada Tuhan, Terimakasih kepada Orang Tua, Terima kasih kepada Saudara-saudari terutama Abang anak pertama Bang Leny, Terima Kasih kepada Koko Sucipto yang mengenalkan saya dengan aplikasi VS Code untuk mengedit kode pemrograman seperti html, css, javascript, sql dan banyak lagi.</p>
                  <p>Terima kasih kepada semua Bapak/Ibu guru saya di <strong className="text-white">SMK NEGERI 1 SEI SUKA</strong> yang sudah memberi banyak Ilmu. Terima kasih kepada Ibu guru Wali Kelas sekaligus guru mata pelajaran Bahasa Inggris yaitu mis Maya. Terimakasih kepada Ibu guru mata pelajaran jurusan saya (DPK) yaitu Ibu Ummuyani Lubis yang mengajarkan saya tentang DKV (Desain Komunikasi Visual) dan mengenalkan saya tentang apa itu UI/UX atau web designer dan web developer. begitu juga kepada Ibu guru mata pelajaran Agama Kristen Ibu Nuryati Samosir yang mengajarkan saya tentang kasih Tuhan.</p>
                  <p>Terimakasih juga kepada semua teman teman saya dimanapun kalian berada yang telah mengajarkan saya apa arti pertemanan. Terimakasih kepada pengunjung/pelanggan yang mendownload aplikasi ini atau membeli produk yang ada disini.</p>
                  <p>Ini bukanlah web atau aplikasi yang pertama kali saya buat, tapi ini adalah web yang paling bagus yang pernah saya buat sampai saat ini, Saya <strong className="text-yellow-400">Elvan Parlin Agustario Sinaga</strong> mengucapkan Terima Kasih kepada semuanya.</p>
               </div>
            </div>
         </div>
     </div>
  );

  if (!isLoaded) return (
    
    <div className={`min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden ${isDarkMode ? '' : 'light-mode'}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent_50%)] animate-pulse"></div>
      <div className="relative z-10 flex flex-col items-center gap-6 animate-in zoom-in duration-700 group">
        <div className="w-32 h-32 bg-gradient-to-tr from-blue-600 to-indigo-600 p-2 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-600/40 rotate-12 group-hover:rotate-0 transition-transform duration-500 cursor-pointer">
          <img src="icon-192.png" alt="ElvanTechnoShop App Icon" className="w-full h-full object-cover rounded-[2rem] bg-white -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
        </div>
        <div className="text-center space-y-2 flex flex-col items-center">
          <img src="icon-512.png" alt="ElvanTechnoShop Logo" className="h-16 w-auto object-contain drop-shadow-2xl mb-2" />
          <p className="text-blue-400 font-bold tracking-[0.2em] text-[10px] uppercase bg-blue-500/10 py-1.5 px-4 rounded-full border border-blue-500/20">BY ELVAN PARLIN AGUSTARIO SINAGA</p>
        </div>
      </div>
    </div>
  );

  if (!isLoggedIn) return (
    <div className={`min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-200 relative overflow-hidden ${isDarkMode ? '' : 'light-mode'}`}>
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px]"></div>
      <button onClick={() => setShowAbout(true)} className="absolute top-6 right-6 z-50 p-3 bg-slate-900/50 backdrop-blur-md rounded-full text-white shadow-lg border border-white/10 hover:bg-slate-800 transition-colors">
         <Info size={24} />
      </button>
      
      {toast && (
        <div className={`absolute top-10 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl animate-in slide-in-from-top-5 fade-out duration-300 flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>
          {toast.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />} {toast.msg}
        </div>
      )}
      <div className="glass w-full max-w-sm p-8 rounded-[2.5rem] shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 duration-700">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-2xl shadow-xl shadow-blue-600/30">
          <img src="icon-192.png" alt="App Icon" className="w-12 h-12 object-cover rounded-[0.85rem] bg-white" />
        </div>
        <div className="text-center mt-6 mb-6 flex flex-col items-center">
          <img src="icon-512.png" alt="ElvanTechnoShop Logo" className="h-14 w-auto object-contain drop-shadow-xl" />
          <div className="mt-3 bg-blue-500/10 border border-blue-500/20 p-3 rounded-2xl">
             <p className="text-[10px] text-slate-300 leading-relaxed italic">
               Web app ini dibuat resmi oleh anak berusia 15 tahun yaitu aku <span className="font-bold text-yellow-400">Elvan Parlin Agustario Sinaga</span> <Crown size={12} className="inline text-yellow-400 -mt-0.5" /> dari semua tampilan, fitur, sampai kegunaannya.
             </p>
          </div>
        </div>
        <form onSubmit={handleAuth} className="space-y-4">
          
          <div className="space-y-1"><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 ring-blue-500 outline-none text-white text-sm" placeholder="name@email.com" /></div></div>
          <div className="space-y-1"><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 focus:ring-2 ring-blue-500 outline-none text-white text-sm" placeholder="Sandi min. 6 digit & angka" /></div></div>
          {isRegisterMode && (<div className="space-y-1 animate-in slide-in-from-top-2 duration-300"><input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 px-4 focus:ring-2 ring-blue-500 outline-none text-white text-sm" placeholder="Ulangi sandi" /></div>)}
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all mt-2 flex justify-center items-center">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : (isRegisterMode ? 'Daftar Sekarang' : 'Masuk Akun')}
          </button>
        </form>
        <button onClick={() => setIsRegisterMode(!isRegisterMode)} className="w-full text-center text-xs mt-6 text-slate-400 transition-colors">
          {isRegisterMode ? <span>Sudah punya akun? <span className="text-blue-500 font-bold">Masuk Akun</span></span> : <span>Belum punya akun? <span className="text-blue-500 font-bold">Daftar Akun</span></span>}
        </button>
        <div className="relative my-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div><div className="relative flex justify-center"><span className="bg-slate-900 px-4 text-[10px] text-slate-500 font-bold uppercase tracking-widest">atau masuk cepat</span></div></div>
        <button type="button" onClick={handleGoogleLogin} disabled={loading} className="w-full bg-white text-slate-900 font-black py-3.5 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all hover:bg-slate-100 shadow-lg shadow-white/10">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Lanjut dengan Google
        </button>
      </div>{aboutOverlay}</div>
  );

  const displayedProducts = products.filter(p => activeCategory === 'Semua' || p.category === activeCategory);
  
  return (
    <div className={`min-h-screen bg-slate-950 font-sans text-slate-300 flex justify-center overflow-x-hidden selection:bg-blue-500/30 transition-colors duration-500 ${isDarkMode ? '' : 'light-mode'}`}>
      {toast && (<div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl animate-in slide-in-from-top-5 fade-out duration-300 flex items-center gap-3 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'}`}>{toast.type === 'error' ? <ShieldAlert size={16} /> : <CheckCircle2 size={16} />} {toast.msg}</div>)}
      
      {showNotifications && (
         <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowNotifications(false)}>
            <div className="absolute top-16 right-4 w-80 max-h-96 bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
               <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50"><h3 className="font-black text-white flex items-center gap-2"><Bell size={16}/> Notifikasi</h3><button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-white"><X size={18}/></button></div>
               <div className="flex-1 overflow-y-auto p-2 hide-scrollbar">
                  {notifications.length === 0 ? (<p className="text-center text-xs text-slate-500 py-6">Belum ada notifikasi.</p>) : ( notifications.map(n => (<div key={n.id} className="p-3 mb-2 rounded-xl glass hover:bg-slate-800/50 transition-colors"><div className="flex justify-between items-start mb-1"><span className={`text-xs font-black ${n.type === 'success' ? 'text-green-400' : 'text-blue-400'}`}>{n.title}</span><span className="text-[9px] text-slate-500">{n.time}</span></div><p className="text-[10px] text-slate-300 leading-relaxed">{n.message}</p></div>)) )}
               </div>
            </div>
         </div>
      )}

      {productToDelete && (
         <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl animate-in zoom-in duration-200">
               <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
               <h3 className="text-lg font-black text-white mb-2">Hapus Produk?</h3>
               <p className="text-xs text-slate-400 mb-6 leading-relaxed">Tindakan ini tidak bisa dibatalkan.</p>
               
               <div className="flex gap-3"><button onClick={() => setProductToDelete(null)} className="flex-1 bg-slate-800 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-700 transition-colors text-xs uppercase tracking-widest">Batal</button><button onClick={() => handleDeleteProduct(productToDelete)} className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 text-xs uppercase tracking-widest">Ya, Hapus</button></div>
            </div>
         </div>
      )}

      {msgToDelete && (
         <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl w-full max-w-sm text-center shadow-2xl animate-in zoom-in duration-200">
               <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} /></div>
               <h3 className="text-lg font-black text-white mb-2">Tarik Pesan Permanen?</h3>
               <p className="text-xs text-slate-400 mb-6 leading-relaxed">Sebagai Admin/Dev, Anda akan menghapus pesan ini dari Database. Pesan akan hilang untuk semua orang.</p>
               <div className="flex gap-3"><button onClick={() => setMsgToDelete(null)} className="flex-1 bg-slate-800 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-700 transition-colors text-xs uppercase tracking-widest">Batal</button><button onClick={() => confirmForceDeleteMsg(msgToDelete)} className="flex-1 bg-red-600 text-white font-bold py-3.5 rounded-2xl hover:bg-red-500 transition-colors shadow-lg shadow-red-600/20 text-xs uppercase tracking-widest">Ya, Hapus</button></div>
            </div>
         </div>
      )}

      <div className="w-full max-w-md bg-slate-900 min-h-screen flex flex-col relative shadow-2xl">
        {view === 'main' && (
          <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center justify-between">
            <img src="icon-512.png" alt="ElvanTechnoShop Logo" className="h-8 w-auto object-contain" />
            <div className="flex gap-2">
              <div className="relative p-2 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setShowAbout(true)}><Info size={24} /></div>
              
              <div className="relative p-2 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? <Sun size={24} /> : <Moon size={24} />}</div>
              <div className="relative p-2 text-slate-400 hover:text-blue-400 cursor-pointer transition-colors" onClick={() => { setShowNotifications(!showNotifications); setUnreadNotif(false); }}><Bell size={24} />{unreadNotif && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>}{unreadNotif && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>}</div>
            </div>
          </header>
        )}
        <main className="flex-1 overflow-y-auto pb-24 hide-scrollbar">
          {view === 'main' && activeTab === 'home' && (
            <div className="animate-in fade-in duration-500">
              <div className="px-4 pt-4 pb-2">
                 <div className="w-full relative overflow-hidden rounded-3xl h-44 shadow-lg bg-slate-800 touch-pan-y" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
                    <div className="flex transition-transform duration-500 ease-in-out h-full w-full" style={{ transform: `translateX(-${currentBannerIdx * 100}%)` }}>
                       {banners.map((banner, idx) => (
                          <div key={banner.id || idx} className="w-full h-full shrink-0 relative group"><img src={banner.img} className="w-full h-full object-cover select-none pointer-events-none" alt="Banner" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div><div className="absolute bottom-6 left-6 z-10 w-3/4"><h2 className="text-2xl font-black text-white leading-tight mb-1 whitespace-pre-wrap">{banner.title}</h2><p className="text-white/70 text-[10px] font-bold uppercase tracking-widest line-clamp-1">{banner.subtitle}</p></div></div>
                       ))}
                    </div>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                       {banners.map((_, idx) => (<div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentBannerIdx === idx ? 'w-5 bg-blue-500' : 'w-1.5 bg-white/50'}`}/>))}
                    </div>
                 </div>
              </div>
              <div className="px-4 py-2 mb-2 flex gap-2 overflow-x-auto hide-scrollbar">
                 {categories.map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30' : 'glass border-slate-700 text-slate-400 hover:text-white'}`}>{cat}</button>))}
              </div>
              <div className="px-4 mb-4 flex items-center justify-between"><h3 className="font-black text-lg text-white">{activeCategory === 'Semua' ? 'Gadget Tersedia' : `Kategori: ${activeCategory}`}</h3></div>
              {displayedProducts.length === 0 ? (<div className="px-4 text-center py-10 text-slate-500 flex flex-col items-center"><Package size={48} className="mb-2 opacity-20" /><p className="text-sm font-bold">Produk kosong.</p></div>) : (
                 <div className="grid grid-cols-2 gap-4 px-4 pb-8">
                   {displayedProducts.map(p => (
                     <div key={p.id} className="glass rounded-3xl overflow-hidden flex flex-col group relative">
                       {p.is_new && (<div className="absolute top-3 left-3 bg-red-500 text-[8px] font-black text-white px-2 py-0.5 rounded-full z-10 shadow-lg shadow-red-500/50">BARU</div>)}
                       {p.stock <= 0 && (<div className="absolute inset-0 bg-slate-950/70 z-20 flex items-center justify-center backdrop-blur-[2px]"><span className="bg-red-600 text-white font-black px-4 py-2 rounded-xl text-xs uppercase transform -rotate-12 border-2 border-red-400">HABIS TERJUAL</span></div>)}
                       <div className="h-36 bg-slate-800 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => { setSelectedProduct(p); setView('productDetail'); }}><img src={p.img} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" alt={p.title} /></div>
                       <div className="p-3 flex-1 flex flex-col z-10 relative">
                         
                         <h4 className="text-sm font-bold text-slate-100 line-clamp-2 mb-1 leading-tight cursor-pointer hover:text-blue-400 transition-colors" onClick={() => { setSelectedProduct(p); setView('productDetail'); }}>{p.title}</h4>
                         <div className="flex items-center gap-1 mb-1.5"><Star size={10} className="fill-yellow-500 text-yellow-500" /><span className="text-[9px] font-bold text-slate-400">{p.rating || '0.0'} ({p.review_count || 0} ulasan)</span></div>
                         <div className="flex justify-between items-center mb-2"><p className="text-[9px] text-slate-500 truncate">Jual: {p.seller_name}</p><span className="text-[9px] font-black bg-slate-800 px-2 py-0.5 rounded-md text-blue-400">Sisa {p.stock}</span></div>
                         <div className="mt-auto">
                           <span className="text-blue-400 font-black text-sm">{formatIDR(p.price)}</span>
                           <div className="flex gap-2 mt-3"><button onClick={() => handleAddToCart(p)} disabled={p.stock <= 0} className="flex-1 bg-slate-800 hover:bg-slate-700 p-2 rounded-xl flex justify-center text-slate-300 transition-colors disabled:opacity-50"><ShoppingCart size={16} /></button><button onClick={() => { setSelectedProduct(p); setView('productDetail'); }} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black p-2 rounded-xl transition-colors">DETAIL</button></div>
                         </div>
                       </div>
                       {(currentUser.role === 'developer' || currentUser.id === p.seller_id) && (<div className="absolute top-3 right-3 z-30"><button onClick={(e) => { e.stopPropagation(); setProductToDelete(p.id); }} className="bg-red-500/80 backdrop-blur-md p-1.5 rounded-lg text-white hover:bg-red-600 transition-all shadow-lg"><Trash2 size={14} /></button></div>)}
                     </div>
                   ))}
                 </div>
              )}
            </div>
          )}

          {view === 'main' && activeTab === 'cart' && (
             <div className="p-6 animate-in fade-in duration-300">
                <h2 className="text-2xl font-black mb-6 flex items-center gap-2"><ShoppingCart className="text-blue-500"/> Keranjang Belanja</h2>
                {cart.length === 0 ? (<div className="text-center py-20 text-slate-500"><ShoppingCart size={64} className="mx-auto mb-4 opacity-20" /><p className="font-bold">Keranjang kosong</p><button onClick={()=>setActiveTab('home')} className="mt-4 bg-blue-600/10 text-blue-400 px-6 py-2 rounded-full text-xs font-bold">Cari Produk</button></div>) : (
                   <div className="space-y-4">
                      {cart.map((item) => (
                         <div key={item.id} className="glass p-3 rounded-2xl flex gap-4 items-center relative">
                            <img src={item.img} className="w-16 h-16 rounded-xl object-cover bg-slate-800 shrink-0" />
                            <div className="flex-1">
                               <h4 className="text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                               <p className="text-blue-400 font-black text-xs mt-1">{formatIDR(item.price)}</p>
                               <div className="flex items-center gap-3 mt-2">
                                  <button onClick={() => updateCartQty(item.id, -1)} className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-white hover:bg-slate-700"><Minus size={12}/></button><span className="text-xs font-bold w-4 text-center">{item.qty}</span><button onClick={() => updateCartQty(item.id, 1)} className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-white hover:bg-slate-700"><Plus size={12}/></button>
                               </div>
                            </div>
                            <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 size={16} /></button>
                         </div>
                      ))}
                      <div className="mt-8 pt-6 border-t border-slate-800">
                         <div className="flex justify-between items-center mb-6"><span className="text-sm font-bold text-slate-400">Total Pembayaran</span><span className="text-xl font-black text-blue-400">{formatIDR(cart.reduce((a, b) => a + (Number(b.price) * b.qty), 0))}</span></div>
                         <button onClick={() => setView('checkout')} className="w-full bg-blue-600 py-4 rounded-2xl text-white font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-transform">LANJUT CHECKOUT ({cart.length} Jenis)</button>
                      </div>
                   </div>
                )}
             </div>
          )}

          {view === 'main' && activeTab === 'post' && (
             <div className="p-6 animate-in fade-in duration-300 space-y-6">
                <h2 className="text-2xl font-black">Mulai Berjualan</h2>
                <form onSubmit={handlePostProduct} className="space-y-4">
                   <label className="w-full h-48 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:border-blue-500 transition-all relative overflow-hidden group">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setPostData({...postData, img: reader.result}); reader.readAsDataURL(file); } }} />
                      {postData.img ? (<><img src={postData.img} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center flex-col"><ImagePlus size={24} className="text-white mb-2"/><span className="text-xs font-bold text-white uppercase tracking-widest">Ganti Foto</span></div></>) : (<><ImagePlus size={48} className="mb-3 opacity-50 group-hover:text-blue-500 group-hover:scale-110 transition-all" /><span className="text-xs font-bold uppercase tracking-widest group-hover:text-blue-400">Pilih dari Galeri</span></>)}
                   </label>
                   <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Kategori Produk</label><input type="text" required value={postData.category} onChange={e=>setPostData({...postData, category: e.target.value})} placeholder="Ketik kategori..." className="w-full glass p-4 rounded-2xl text-sm outline-none text-white focus:border-blue-500" list="category-suggestions" /><datalist id="category-suggestions">{categories.filter(c => c !== 'Semua').map(c => <option key={c} value={c} />)}</datalist></div>
                   <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Nama Barang</label><input type="text" required value={postData.title} onChange={e=>setPostData({...postData, title: e.target.value})} placeholder="Contoh: iPhone 15" className="w-full glass p-4 rounded-2xl text-sm outline-none text-white focus:border-blue-500" /></div>
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Harga (Rp)</label><input type="number" required value={postData.price} onChange={e=>setPostData({...postData, price: e.target.value})} className="w-full glass p-4 rounded-2xl text-sm outline-none text-white focus:border-blue-500" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Jumlah Stok</label><input type="number" value={postData.stock} onChange={e=>setPostData({...postData, stock: e.target.value})} className="w-full glass p-4 rounded-2xl text-sm outline-none text-white focus:border-blue-500" /></div>
                   </div>
                   <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Deskripsi Produk</label><textarea value={postData.description} onChange={e=>setPostData({...postData, description: e.target.value})} rows="4" className="w-full glass p-4 rounded-2xl text-sm outline-none text-white focus:border-blue-500"></textarea></div>
                   <button type="submit" disabled={loading} className="w-full bg-blue-600 py-4 rounded-2xl text-white font-black shadow-lg shadow-blue-600/20 mt-4 flex justify-center">{loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'POSTING KE DATABASE'}</button>
                </form>
             </div>
          )}
          
          {view === 'main' && activeTab === 'chat' && (
             <div className="p-4 animate-in fade-in duration-300">
                <h2 className="text-2xl font-black mb-4">Pesan & Kontak</h2>
                <div className="relative mb-6"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Cari username..." className="w-full bg-slate-900 border border-slate-800 rounded-full py-3 pl-12 pr-4 text-sm outline-none focus:border-blue-500 text-white transition-colors"/></div>
                <div className="space-y-3">
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest">Grup Publik</h3>
                   <div onClick={() => openChatRoom('global')} className="glass p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"><div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center font-bold text-white shadow-lg">🌍</div><div className="flex-1"><span className="text-sm font-black text-white">Obrolan Global</span><p className="text-xs text-blue-300 mt-1">Chat dengan semua orang.</p></div></div>
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase ml-2 tracking-widest mt-6">Kontak Pengguna</h3>
                   {registeredUsers.filter(u => u.id !== currentUser.id).filter(u => u.username.toLowerCase().includes(searchQuery.toLowerCase()) || u.handle.toLowerCase().includes(searchQuery.toLowerCase())).map(user => (
                      <div key={user.id} className="glass p-3 rounded-3xl flex items-center justify-between hover:bg-slate-800/40 transition-colors">
                         <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setSelectedUser(user); setView('publicProfile'); }}><div className="w-10 h-10 bg-slate-800 rounded-full overflow-hidden shrink-0">{user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2 text-slate-500"/>}</div><div><div className="flex items-center gap-1"><span className="text-sm font-black text-slate-200">{user.username}</span>{user.role === 'developer' && <Crown size={12} className="text-yellow-500" />}{user.role === 'admin' && <CheckCircle2 size={12} className="text-blue-500" />}{user.role === 'banned' && <ShieldAlert size={12} className="text-red-500" />}</div><p className="text-[10px] text-slate-500">@{user.handle}</p></div></div>
                         <button onClick={() => { if(user.role === 'banned') return showToast("Pengguna ini sedang diblokir", "error"); openChatRoom('private', user) }} className="bg-blue-600/10 text-blue-400 p-2.5 rounded-xl hover:bg-blue-600/20 transition-colors mr-1"><MessageCircle size={18} /></button>
                      </div>
                   ))}
                </div>
             </div>
          )}

          {view === 'main' && activeTab === 'profile' && (
             <div className="p-8 animate-in fade-in duration-500 text-center">
                {isEditingProfile ? (
                   <div className="text-left space-y-4 glass p-6 rounded-[2rem]">
                      <h3 className="font-black text-lg mb-4 text-blue-400 flex items-center gap-2"><Edit3 size={18}/> Edit Profil</h3>
                      <label className="w-24 h-24 bg-slate-800 rounded-full mx-auto flex items-center justify-center relative cursor-pointer overflow-hidden group border-2 border-dashed border-slate-600 hover:border-blue-500 transition-colors"><input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setEditData({...editData, avatar: reader.result}); reader.readAsDataURL(file); } }} />{editData.avatar ? <img src={editData.avatar} className="w-full h-full object-cover" /> : <Camera size={28} className="text-slate-500" />}</label>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Nama</label><input type="text" value={editData.username} onChange={e => setEditData({...editData, username: e.target.value})} className="w-full bg-slate-900/50 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Handle (@)</label><input type="text" value={editData.handle || ''} onChange={e => setEditData({...editData, handle: e.target.value.replace(/\s/g, '').toLowerCase()})} className="w-full bg-slate-900/50 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500" /></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Bio</label><textarea value={editData.bio} onChange={e => setEditData({...editData, bio: e.target.value})} className="w-full bg-slate-900/50 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500" rows="2"></textarea></div>
                      <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase ml-2">Hobi</label><input type="text" value={editData.hobi} onChange={e => setEditData({...editData, hobi: e.target.value})} className="w-full bg-slate-900/50 rounded-2xl p-4 text-sm text-white outline-none focus:border-blue-500" /></div>
                      <div className="flex gap-3 mt-6"><button disabled={loading} onClick={() => setIsEditingProfile(false)} className="flex-1 bg-slate-800 text-slate-400 py-4 rounded-2xl font-black text-xs">BATAL</button><button disabled={loading} onClick={handleSaveProfile} className="flex-[1.5] bg-blue-600 text-white py-4 rounded-2xl font-black text-xs shadow-lg">{loading ? '...' : 'SIMPAN'}</button></div>
                   </div>
                ) : (
                   <>
                      <div className="relative w-32 h-32 mx-auto mb-6"><div className="w-full h-full bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.5rem] p-1.5 shadow-2xl"><div className="w-full h-full bg-slate-900 rounded-[2rem] flex items-center justify-center overflow-hidden">{currentUser.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover" /> : <User size={56} className="text-slate-600" />}</div></div></div>
                      <div className="mb-8"><div className="flex justify-center mb-1"><BadgeUser role={currentUser.role} username={currentUser.username} /></div><p className="text-[11px] font-black text-blue-400 mt-1 mb-2">@{currentUser.handle}</p><p className="text-xs text-slate-500 font-medium px-6 leading-relaxed mb-4">{currentUser.bio}</p><div className="flex justify-center gap-2"><span className="bg-slate-800/80 text-[9px] font-black uppercase px-4 py-1.5 rounded-full border border-slate-700">Hobi: {currentUser.hobi}</span></div></div>
                      <div className="space-y-3 px-2">
                         <button onClick={() => { setEditData(currentUser); setIsEditingProfile(true); }} className="w-full glass p-4 rounded-2xl flex items-center justify-between group hover:bg-slate-800/40 transition-all cursor-pointer"><div className="flex items-center gap-3"><div className="bg-blue-500/10 p-2 rounded-xl text-blue-400"><Edit3 size={20}/></div><span className="text-sm font-bold text-slate-300">Edit Profil</span></div><ChevronRight size={16} className="text-slate-600" /></button>
                         {(currentUser.role === 'developer' || currentUser.role === 'admin') && (<button onClick={() => { setView('adminPanel'); fetchAllOrdersAdmin(); }} className="w-full glass p-4 rounded-2xl flex items-center justify-between group bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 transition-all cursor-pointer"><div className="flex items-center gap-3"><div className="bg-blue-500/20 p-2 rounded-xl text-blue-400"><CheckCircle2 size={20}/></div><span className="text-sm font-black text-blue-400">Panel Admin</span></div><ChevronRight size={16} className="text-blue-500" /></button>)}
                         {currentUser.role === 'developer' && (<button onClick={() => setView('devPanel')} className="w-full glass p-4 rounded-2xl flex items-center justify-between group bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20 transition-all cursor-pointer"><div className="flex items-center gap-3"><div className="bg-yellow-500/20 p-2 rounded-xl text-yellow-500"><Settings size={20}/></div><span className="text-sm font-black text-yellow-500">Panel Developer</span></div><ChevronRight size={16} className="text-yellow-500" /></button>)}
                         <button onClick={handleLogout} className="w-full glass p-4 rounded-2xl flex items-center justify-between text-red-400 border-red-500/10 mt-6 hover:bg-red-500/10 transition-colors"><div className="flex items-center gap-3"><div className="bg-red-500/10 p-2 rounded-xl"><LogOut size={20}/></div><span className="text-sm font-bold">Keluar Akun</span></div></button>
                      </div>
                   </>
                )}
             </div>
          )}
          
          {view === 'productDetail' && selectedProduct && (
             <div className="fixed inset-0 z-50 bg-slate-950 animate-in slide-in-from-bottom duration-300 overflow-y-auto hide-scrollbar pb-24">
                <div className="sticky top-0 bg-transparent p-4 flex items-center justify-between z-10">
                   <button onClick={() => { setView('main'); setSelectedProduct(null); }} className="p-2 bg-slate-900/80 backdrop-blur-md rounded-full text-white hover:bg-slate-800 transition-colors shadow-lg"><ChevronLeft size={24}/></button>
                   <button onClick={() => { setView('main'); setActiveTab('cart'); setSelectedProduct(null); }} className="p-2 bg-slate-900/80 backdrop-blur-md rounded-full text-white shadow-lg relative"><ShoppingCart size={20}/>{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] text-white font-black px-1.5 py-0.5 rounded-full">{cart.reduce((sum, item) => sum + item.qty, 0)}</span>}</button>
                </div>
                <div className="-mt-16 relative">
                   <div className="w-full h-80 bg-slate-800 relative"><img src={selectedProduct.img} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50"></div></div>
                   <div className="px-6 -mt-10 relative z-10">
                      <h2 className="text-2xl font-black text-white leading-tight mb-2">{selectedProduct.title}</h2>
                      <div className="text-3xl font-black text-blue-400 mb-4">{formatIDR(selectedProduct.price)}</div>
                      <div className="flex items-center justify-between glass p-4 rounded-2xl mb-6"><div><p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Stok Tersedia</p><p className="text-lg font-black text-white">{selectedProduct.stock} Unit</p></div><div className="text-right"><p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Kategori</p><p className="text-sm font-bold text-white bg-blue-500/20 px-3 py-1 rounded-lg text-blue-400">{selectedProduct.category}</p></div></div>
                      <div className="mb-6 glass p-4 rounded-2xl">
                         <h3 className="text-sm font-black text-white mb-2 flex items-center gap-2"><Star size={16} className="text-yellow-400"/> Penilaian Produk</h3>
                         <div className="flex items-center gap-4 mb-3"><div className="text-4xl font-black text-yellow-400">{productRatingData.average}</div><div><div className="flex gap-1">{[1, 2, 3, 4, 5].map(star => (<button key={star} disabled={loading} onClick={() => handleRateProduct(star)} className="focus:outline-none transition-transform hover:scale-110 active:scale-95"><Star size={20} className={`${productRatingData.userRating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'} ${loading ? 'opacity-50' : ''}`} /></button>))}</div><p className="text-[10px] text-slate-400 mt-1">Berdasarkan {productRatingData.count} ulasan</p></div></div>
                      </div>
                      <div className="mb-6"><h3 className="text-sm font-black text-white mb-2 flex items-center gap-2"><Info size={16}/> Deskripsi Produk</h3><p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedProduct.description || "Tidak ada deskripsi."}</p></div>
                      <div className="mb-8">
                         <h3 className="text-sm font-black text-white mb-3 flex items-center gap-2"><MessageCircle size={16}/> Diskusi Produk</h3>
                         <form onSubmit={handlePostComment} className="flex gap-2 mb-4"><div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-slate-700">{currentUser?.avatar ? <img src={currentUser.avatar} className="w-full h-full object-cover"/> : <User className="w-full h-full p-1.5 text-slate-500"/>}</div><input type="text" value={newCommentText} onChange={e=>setNewCommentText(e.target.value)} placeholder="Tulis ulasan..." className="flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500 transition-all" /><button type="submit" disabled={!newCommentText.trim() || loading} className="bg-blue-600 px-3 rounded-xl flex items-center justify-center text-white disabled:opacity-50 shadow-lg shadow-blue-600/20 active:scale-95 transition-transform"><Send size={14} className="-ml-0.5 mt-0.5" /></button></form>
                         <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar pr-1">
                            {productComments.map(comment => (<div key={comment.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300"><div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden shrink-0 border border-slate-700">{comment.users?.avatar ? <img src={comment.users.avatar} className="w-full h-full object-cover"/> : <User className="w-full h-full p-1.5 text-slate-500"/>}</div><div className="flex-1 glass p-3 rounded-2xl rounded-tl-sm"><div className="flex justify-between items-start mb-1.5"><span className="text-[10px] font-black text-white">{comment.users?.username}</span><span className="text-[8px] text-slate-500 font-bold">{new Date(comment.created_at).toLocaleDateString('id-ID')}</span></div><p className="text-xs text-slate-300 leading-relaxed">{comment.text}</p></div></div>))}
                         </div>
                      </div>
                      <div className="glass p-4 rounded-2xl flex items-center justify-between mb-8 cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => { const seller = registeredUsers.find(u => u.id === selectedProduct.seller_id); if(seller) { setSelectedUser(seller); setView('publicProfile'); } }}>
                         <div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 overflow-hidden">{registeredUsers.find(u => u.id === selectedProduct.seller_id)?.avatar ? <img src={registeredUsers.find(u => u.id === selectedProduct.seller_id).avatar} className="w-full h-full object-cover"/> : <User size={20}/>}</div><div><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Dijual Oleh</p><p className="text-sm font-black text-white">{selectedProduct.seller_name}</p></div></div><ChevronRight size={20} className="text-slate-600"/>
                      </div>
                   </div>
                </div>
                <div className="fixed bottom-0 w-full max-w-md bg-slate-900 border-t border-slate-800 p-4 flex items-center gap-3 shadow-2xl z-20">
                   <button onClick={() => handleAddToCart(selectedProduct)} disabled={selectedProduct.stock <= 0} className="p-4 bg-slate-800 rounded-2xl text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-50"><ShoppingCart size={24}/></button>
                   <button onClick={() => { if(selectedProduct.stock > 0) { const existingItem = cart.find(item => item.id === selectedProduct.id); if(!existingItem) setCart([...cart, {...selectedProduct, qty: 1}]); setView('checkout'); } }} disabled={selectedProduct.stock <= 0} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-2xl text-white font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-all flex justify-center items-center">{selectedProduct.stock > 0 ? 'LANJUT CHECKOUT' : 'HABIS TERJUAL'}</button>
                </div>
             </div>
          )}

          {view === 'checkout' && (
             <div className="fixed inset-0 z-50 bg-slate-950 animate-in slide-in-from-right duration-500 overflow-y-auto hide-scrollbar pb-32">
                <div className="sticky top-0 bg-slate-950/80 backdrop-blur-md p-4 border-b border-slate-800 flex items-center gap-4 z-10"><button onClick={() => setView('main')} className="p-2 bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-colors"><ChevronLeft size={24}/></button><h2 className="text-lg font-black text-white">Lengkapi Checkout</h2></div>
                <div className="p-6 space-y-8">
                   <section className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest"><MapPin size={16}/> Tujuan Pengiriman</div>
                      <div className="space-y-4"><div className="grid grid-cols-1 gap-4"><input type="text" value={shippingInfo.name} onChange={e=>setShippingInfo({...shippingInfo, name: e.target.value})} placeholder="Nama Penerima Lengkap" className="w-full glass p-4 rounded-2xl text-sm text-white outline-none focus:border-blue-500" /><input type="number" value={shippingInfo.phone} onChange={e=>setShippingInfo({...shippingInfo, phone: e.target.value})} placeholder="No Handphone" className="w-full glass p-4 rounded-2xl text-sm text-white outline-none focus:border-blue-500" /></div><div className="grid grid-cols-2 gap-4"><input type="text" value={shippingInfo.province} onChange={e=>setShippingInfo({...shippingInfo, province: e.target.value})} placeholder="Provinsi" className="w-full glass p-4 rounded-2xl text-sm text-white outline-none focus:border-blue-500" /><input type="text" value={shippingInfo.city} onChange={e=>setShippingInfo({...shippingInfo, city: e.target.value})} placeholder="Kota" className="w-full glass p-4 rounded-2xl text-sm text-white outline-none focus:border-blue-500" /></div><div className="grid grid-cols-2 gap-4"><input type="text" value={shippingInfo.district} onChange={e=>setShippingInfo({...shippingInfo, district: e.target.value})} placeholder="Kecamatan" className="w-full glass p-4 rounded-2xl text-sm text-white outline-none focus:border-blue-500" /><input type="number" value={shippingInfo.zipCode} onChange={e=>setShippingInfo({...shippingInfo, zipCode: e.target.value})} placeholder="Kode Pos" className="w-full glass p-4 rounded-2xl text-sm text-white outline-none focus:border-blue-500" /></div><textarea value={shippingInfo.address} onChange={e=>setShippingInfo({...shippingInfo, address: e.target.value})} placeholder="Detail Alamat" rows="3" className="w-full glass p-4 rounded-2xl text-sm text-white outline-none focus:border-blue-500"></textarea></div>
                   </section>
                   <section className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-400 font-black text-xs uppercase tracking-widest"><CreditCard size={16}/> Metode Pembayaran</div>
                      <div className="grid grid-cols-3 gap-3">{['QRIS', 'Gopay', 'Dana'].map(m => (<button key={m} onClick={() => setShippingInfo({...shippingInfo, method: m})} className={`glass p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border-2 ${shippingInfo.method === m ? 'border-blue-500 bg-blue-500/10' : 'border-transparent'}`}><div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center font-black text-[10px] text-blue-400 uppercase">{m}</div><span className="text-[10px] font-bold text-slate-300">{m}</span></button>))}</div>
                   </section>
                </div>
                <div className="fixed bottom-0 w-full max-w-md bg-slate-900 border-t border-slate-800 p-6 flex items-center justify-between shadow-2xl z-20"><div className="flex flex-col"><span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Bayar</span><span className="text-xl font-black text-blue-400">{formatIDR(cart.reduce((a, b) => a + (Number(b.price) * b.qty), 0))}</span></div><button onClick={handleCheckout} disabled={loading} className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 rounded-2xl text-white font-black shadow-lg shadow-blue-600/20 active:scale-95 transition-all">BAYAR</button></div>
             </div>
          )}

          {view === 'publicProfile' && selectedUser && (
             <div className="fixed inset-0 z-50 bg-slate-950 animate-in slide-in-from-bottom duration-500 overflow-y-auto hide-scrollbar"><div className="absolute top-4 left-4 z-10"><button onClick={() => { setView('main'); setSelectedUser(null); }} className="bg-slate-900/80 p-2 rounded-full text-white backdrop-blur-md"><X size={24}/></button></div><div className="w-full h-40 bg-gradient-to-b from-blue-900/40 to-slate-950"></div><div className="px-8 -mt-16 text-center"><div className="w-32 h-32 bg-slate-900 rounded-[2rem] mx-auto border-4 border-slate-950 shadow-2xl overflow-hidden flex items-center justify-center relative">{selectedUser.avatar ? <img src={selectedUser.avatar} className="w-full h-full object-cover" /> : <User size={48} className="text-slate-600"/>}</div><div className="mt-4 mb-8"><div className="flex justify-center mb-1"><BadgeUser role={selectedUser.role} username={selectedUser.username} /></div><p className="text-[11px] font-black text-blue-400 mt-1 mb-2">@{selectedUser.handle}</p><p className="text-xs text-slate-400 px-6 mt-4">{selectedUser.bio}</p></div><button onClick={() => openChatRoom('private', selectedUser)} className="w-full bg-blue-600 py-4 rounded-3xl text-white font-black shadow-lg shadow-blue-600/30 flex justify-center items-center gap-2 active:scale-95 transition-transform"><MessageCircle size={18} /> Chat Pribadi</button></div></div>
          )}
          
          {view === 'chatRoom' && activeChat && (
             <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-10">
                   <div className="flex items-center gap-3"><button onClick={() => { setView('main'); setActiveChat(null); }} className="p-2 -ml-2 text-slate-400 hover:text-white"><ChevronLeft size={24}/></button>{activeChat.type === 'global' ? (<div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xl">🌍</div><div><h2 className="text-sm font-black text-white leading-tight">Grup Global</h2><p className="text-[10px] text-green-400 font-bold">{registeredUsers.length} Anggota</p></div></div>) : (<div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('publicProfile'); setSelectedUser(activeChat.user); }}><div className="w-10 h-10 bg-slate-800 rounded-full overflow-hidden">{activeChat.user.avatar ? <img src={activeChat.user.avatar} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2 text-slate-500"/>}</div><div><h2 className="text-sm font-black text-white leading-tight flex items-center gap-1">{activeChat.user.username} {activeChat.user.role === 'developer' && <Crown size={12} className="text-yellow-500"/>}</h2><p className="text-[10px] text-slate-400">@{activeChat.user.handle}</p></div></div>)}</div>
                   {activeChat.type === 'private' && (<div className="relative"><button onClick={() => setShowChatOptions(!showChatOptions)} className="p-2 text-slate-400 hover:text-white"><MoreVertical size={20}/></button>{showChatOptions && (<div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200"><button onClick={handleClearChatHistory} className="w-full px-4 py-3 text-left text-xs font-bold text-red-400 hover:bg-slate-700 flex items-center gap-2"><Trash2 size={14}/> Hapus Khusus Saya</button></div>)}</div>)}
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar" onClick={() => setShowChatOptions(false)}>
                   {chatMessages.length === 0 ? (<div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50"><MessageCircle size={48} className="mb-2" /><p className="text-xs font-bold">Belum ada obrolan.</p></div>) : (chatMessages.map((msg, idx) => {
                         const isMe = msg.sender_id === currentUser.id;
                         const canForceDelete = currentUser.role === 'developer' || (currentUser.role === 'admin' && msg.users?.role !== 'developer');
                         return (<div key={msg.id || idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}><div className="w-8 h-8 rounded-full bg-slate-800 overflow-hidden shrink-0">{msg.users?.avatar ? <img src={msg.users.avatar} className="w-full h-full object-cover"/> : <User className="w-full h-full p-1.5 text-slate-500"/>}</div><div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>{activeChat.type === 'global' && (<div className="flex items-center gap-1 mb-1"><span className="text-[10px] font-bold text-slate-400">{isMe ? 'Kamu' : msg.users?.username}</span>{msg.users?.role === 'developer' && <Crown size={10} className="text-yellow-500"/>}</div>)}<div className={`p-2.5 text-sm shadow-md flex flex-col min-w-[80px] ${isMe ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'glass text-slate-200 rounded-2xl rounded-tl-sm'}`}><span>{msg.text}</span><div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>{canForceDelete && (<button onClick={() => setMsgToDelete(msg.id)} className="mr-auto hover:text-red-400 p-0.5" title="Hapus Paksa"><Trash2 size={10} /></button>)}<span className="text-[9px]">{new Date(msg.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'})}</span>{isMe && activeChat.type === 'private' && (msg.is_read ? <CheckCheck size={14} className="text-blue-300" /> : <Check size={14} className="text-blue-200 opacity-70" />)}</div></div></div></div>)
                   }))}
                   <div ref={chatEndRef} />
                </div>
                <div className="p-4 bg-slate-900 border-t border-slate-800 pb-8"><form onSubmit={handleSendMessage} className="flex gap-2"><input type="text" value={newMsgText} onChange={e=>setNewMsgText(e.target.value)} placeholder="Ketik pesan..." className="flex-1 bg-slate-800 rounded-full px-5 py-3 text-sm text-white outline-none focus:border focus:border-blue-500 transition-all" /><button type="submit" disabled={!newMsgText.trim()} className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white disabled:opacity-50 shrink-0 shadow-lg shadow-blue-600/30"><Send size={18} className="-ml-0.5 mt-0.5" /></button></form></div>
             </div>
          )}

          {view === 'adminPanel' && (currentUser.role === 'admin' || currentUser.role === 'developer') && (
             <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-500">
                <div className="p-4 bg-blue-500/10 border-b border-blue-500/20 flex items-center justify-between z-10"><div className="flex items-center gap-3"><button onClick={() => setView('main')} className="p-2 text-blue-500 bg-blue-500/10 rounded-xl"><ChevronLeft size={24}/></button><h2 className="text-lg font-black text-blue-400">Panel Admin (Pesanan)</h2></div><CheckCircle2 size={24} className="text-blue-500"/></div>
                <div className="flex-1 overflow-y-auto p-4 hide-scrollbar">
                   <div className="mb-6 grid grid-cols-2 gap-3">
                      <div className="glass p-4 rounded-2xl border border-green-500/20 bg-green-500/5"><div className="flex items-center gap-2 text-green-500 mb-2"><DollarSign size={16}/><span className="text-[10px] font-black uppercase tracking-widest">Pendapatan</span></div><div className="text-sm font-black text-white">{formatIDR(allOrders.filter(o => o.status === 'Selesai').reduce((sum, o) => sum + Number(o.total), 0))}</div></div>
                      <div className="glass p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5"><div className="flex items-center gap-2 text-blue-500 mb-2"><BarChart3 size={16}/><span className="text-[10px] font-black uppercase tracking-widest">Total Pesanan</span></div><div className="text-xl font-black text-white">{allOrders.length}</div></div>
                   </div>
                   <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2"><Package size={16}/> Detail Pesanan Masuk</h3>
                   {allOrders.length === 0 ? (<div className="text-center text-slate-500 mt-10"><Package size={48} className="mx-auto mb-4 opacity-50"/><p className="font-bold">Belum ada pesanan.</p></div>) : (<div className="space-y-4">{allOrders.map(order => (<div key={order.id} className="glass p-4 rounded-2xl border border-blue-500/20 shadow-lg relative overflow-hidden"><div className="flex justify-between items-start border-b border-slate-800 pb-3 mb-3"><div><span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Order ID</span><p className="font-black text-white text-sm">{order.id}</p><p className="text-[10px] text-blue-400 mt-0.5">Oleh: @{order.users?.handle}</p></div><span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${order.status === 'Selesai' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>{order.status}</span></div><div className="space-y-2 mb-4">{order.items?.map((item, i) => (<div key={i} className="flex justify-between items-center bg-slate-800/50 p-2 rounded-lg"><span className="text-xs text-slate-300 line-clamp-1 flex-1 pr-2">{item.qty}x {item.title}</span><span className="text-xs font-bold text-white">{formatIDR(item.price * item.qty)}</span></div>))}</div><div className="bg-slate-900/50 p-3 rounded-xl mb-4 text-xs text-slate-400"><p className="font-bold text-white mb-1 flex items-center gap-1"><MapPin size={12}/> Pengiriman:</p><p>{order.shipping_info?.name} - {order.shipping_info?.phone}</p><p className="line-clamp-2 mt-0.5">{order.shipping_info?.address}</p></div><div className="flex items-center justify-between"><div className="text-blue-400 font-black text-lg">{formatIDR(order.total)}</div><select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="bg-blue-600 text-white text-xs font-bold px-3 py-2 rounded-xl outline-none"><option value="Diproses Admin">Diproses</option><option value="Sedang Dikirim">Dikirim</option><option value="Selesai">Selesai</option></select></div></div>))}</div>)}
                </div>
             </div>
          )}

          {view === 'devPanel' && currentUser.role === 'developer' && (
             <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in slide-in-from-bottom duration-500">
                <div className="p-4 bg-yellow-500/10 border-b border-yellow-500/20 flex items-center justify-between"><div className="flex items-center gap-3"><button onClick={() => setView('main')} className="p-2 text-yellow-500 bg-yellow-500/10 rounded-xl"><ChevronLeft size={24}/></button><h2 className="text-lg font-black text-yellow-500">Developer Control Panel</h2></div><Crown size={24} className="text-yellow-500"/></div>
                <div className="flex-1 overflow-y-auto p-4 hide-scrollbar space-y-8">
                   <div>
                      <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2"><ImageIcon size={16}/> Manajemen Banner Promo</h3>
                      <div className="space-y-3">
                         {banners.map((banner, i) => (<div key={banner.id || i} className="glass p-3 rounded-2xl flex flex-col gap-3 border border-yellow-500/10"><div className="flex items-center gap-3"><label className="relative w-16 h-16 shrink-0 cursor-pointer group rounded-xl overflow-hidden bg-slate-800 border border-slate-700"><img src={banner.img} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center"><Camera size={14} className="text-white"/></div><input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => { const newB = [...banners]; newB[i].img = reader.result; setBanners(newB); }; reader.readAsDataURL(file); } }} /></label><div className="flex-1 space-y-2"><input type="text" value={banner.title} onChange={(e) => { const newB = [...banners]; newB[i].title = e.target.value; setBanners(newB); }} className="w-full bg-transparent text-xs font-bold text-white outline-none border-b border-slate-700 focus:border-yellow-500 pb-1" /><input type="text" value={banner.subtitle} onChange={(e) => { const newB = [...banners]; newB[i].subtitle = e.target.value; setBanners(newB); }} className="w-full bg-transparent text-[10px] text-slate-400 outline-none border-b border-slate-700 focus:border-yellow-500 pb-1" /></div><button onClick={() => setBanners(banners.filter((_, idx) => idx !== i))} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl"><Trash2 size={16}/></button></div></div>))}
                         <label className="w-full border-2 border-dashed border-yellow-500/30 text-yellow-500 text-xs font-bold py-3 rounded-2xl flex justify-center items-center gap-2 hover:border-yellow-500 hover:bg-yellow-500/10 cursor-pointer transition-colors"><input type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onloadend = () => setBanners([...banners, { id: Date.now(), img: reader.result, title: "JUDUL BARU", subtitle: "Keterangan promo" }]); reader.readAsDataURL(file); } }} /><Plus size={14}/> Tambah Banner</label>
                      </div>
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-white mb-4 flex items-center gap-2"><Users size={16}/> Manajemen Pengguna</h3>
                      <div className="space-y-3">
                         {registeredUsers.map(u => (<div key={u.id} className="glass p-4 rounded-2xl border border-yellow-500/10"><div className="flex items-center gap-3 mb-3 border-b border-slate-800 pb-3"><div className="w-10 h-10 bg-slate-800 rounded-full overflow-hidden shrink-0">{u.avatar ? <img src={u.avatar} className="w-full h-full object-cover"/> : <User className="w-full h-full p-2 text-slate-500"/>}</div><div className="flex-1"><span className="text-xs font-black text-white flex items-center gap-1">{u.username} {u.role === 'admin' && <CheckCircle2 size={12} className="text-blue-500"/>}{u.role === 'banned' && <ShieldAlert size={12} className="text-red-500"/>}</span><p className="text-[10px] text-slate-400">{u.email}</p></div></div>{u.role !== 'developer' && (<div className="flex gap-2 flex-wrap justify-end">{u.role === 'user' && (<button onClick={() => handleUpdateRole(u.id, 'admin')} className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-blue-500 hover:text-white transition-colors">Jadikan Admin</button>)}{u.role === 'admin' && (<button onClick={() => handleUpdateRole(u.id, 'user')} className="bg-orange-500/10 text-orange-400 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-orange-500 hover:text-white transition-colors">Cabut Admin</button>)}{u.role !== 'banned' ? (<button onClick={() => handleUpdateRole(u.id, 'banned')} className="bg-red-500/10 text-red-500 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center gap-1"><ShieldAlert size={12}/> Blokir</button>) : (<button onClick={() => handleUpdateRole(u.id, 'user')} className="bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-green-500 hover:text-white transition-colors flex items-center gap-1"><CheckCircle size={12}/> Buka Blokir</button>)}</div>)}</div>))}
                      </div>
                   </div>
                </div>
             </div>
          )}
        </main>
        
        {view === 'main' && (
          <nav className="fixed bottom-0 w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border-t border-slate-800/50 px-2 py-3 z-50">
            <div className="flex justify-around items-center h-12">
              <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 w-full transition-all ${activeTab === 'home' ? 'text-blue-400' : 'text-slate-500'}`}><Home size={activeTab === 'home' ? 24 : 20} className={activeTab === 'home' ? 'fill-blue-400/20 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} /><span className="text-[8px] font-black uppercase tracking-tighter">Home</span></button>
              <button onClick={() => setActiveTab('cart')} className={`flex flex-col items-center gap-1 w-full transition-all ${activeTab === 'cart' ? 'text-blue-400' : 'text-slate-500'}`}><div className="relative"><ShoppingCart size={activeTab === 'cart' ? 24 : 20} className={activeTab === 'cart' ? 'fill-blue-400/20 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} />{cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] text-white font-black px-1 rounded-full">{cart.reduce((sum, item) => sum + item.qty, 0)}</span>}</div><span className="text-[8px] font-black uppercase tracking-tighter">Keranjang</span></button>
              <button onClick={() => setActiveTab('post')} className="flex flex-col items-center w-full group"><div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-3 rounded-[1.2rem] text-white shadow-xl shadow-blue-600/30 -translate-y-6 transform group-active:scale-90 transition-all border-4 border-slate-900"><PlusSquare size={24} /></div><span className="text-[8px] font-black uppercase tracking-tighter -mt-4 text-slate-500">Jual</span></button>
              <button onClick={() => setActiveTab('chat')} className={`flex flex-col items-center gap-1 w-full transition-all ${activeTab === 'chat' ? 'text-blue-400' : 'text-slate-500'}`}><div className="relative"><MessageCircle size={activeTab === 'chat' ? 24 : 20} className={activeTab === 'chat' ? 'fill-blue-400/20 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} /></div><span className="text-[8px] font-black uppercase tracking-tighter">Chat</span></button>
              <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1 w-full transition-all ${activeTab === 'profile' ? 'text-blue-400' : 'text-slate-500'}`}><User size={activeTab === 'profile' ? 24 : 20} className={activeTab === 'profile' ? 'fill-blue-400/20 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]' : ''} /><span className="text-[8px] font-black uppercase tracking-tighter">Profil</span></button>
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}