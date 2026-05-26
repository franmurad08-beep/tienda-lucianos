// ============================================================
// 🛒 E-COMMERCE APP — React Vanilla (un solo archivo JSX)
// ============================================================
// Tecnología: React + Tailwind CDN + Hooks + Firebase Firestore
// Estructura de roles: "usuario" y "admin"
// Credencial admin hardcodeada en CONFIG (ver abajo)
// ============================================================

import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// 🔥 FIREBASE — Configuración e inicialización
// Los productos y cupones se guardan en Firestore y persisten
// entre sesiones. Reemplaza los valores con los de tu proyecto.
// ============================================================
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBnqdbnzpyXp_7AXPjwYInmVzbmRtyCStI",
  authDomain: "stock-lucianos.firebaseapp.com",
  projectId: "stock-lucianos",
  storageBucket: "stock-lucianos.firebasestorage.app",
  messagingSenderId: "678325987232",
  appId: "1:678325987232:web:d609866cea49e5413be6c5",
  measurementId: "G-KN7TM1SDEC",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Colecciones en Firestore
const PRODUCTS_COLLECTION = "products";
const COUPONS_COLLECTION = "coupons";

// ============================================================
// ⚙️ CONFIGURACIÓN GLOBAL — Edita aquí tus datos de marca
// ============================================================
const CONFIG = {
  // 🎨 NOMBRE DE LA MARCA — CAMBIAR AQUÍ
  brandName: "Tienda Aurora",
  brandTagline: "Piezas únicas con alma",

  // 🔐 CREDENCIAL ADMIN — CAMBIAR ESTA CLAVE
  adminPassword: "admin2025",

  // 💳 INFO DE PAGO — CONFIGURAR AQUÍ
  payment: {
    bank: "Banco Nación",
    accountHolder: "Tu Nombre Completo",
    cbu: "0000000000000000000000",
    alias: "TIENDA.AURORA.MP",
    cuit: "20-00000000-0",
    notes: "Enviar comprobante por WhatsApp o email tras transferir.",
  },

  // 📞 CONTACTO — CONFIGURAR AQUÍ
  contact: {
    email: "contacto@tiendaaurora.com",
    whatsapp: "+54 9 11 0000-0000",
    instagram: "@tiendaaurora",
    facebook: "facebook.com/tiendaaurora",
  },

  // 🎫 CUPONES DE DESCUENTO — Agrega o modifica los que quieras
  coupons: {
    DESCUENTO10: { discount: 10, type: "percent", active: true, label: "10% OFF" },
    PROMO20: { discount: 20, type: "percent", active: true, label: "20% OFF" },
    OFF500: { discount: 500, type: "fixed", active: false, label: "$500 fijo" },
  },
};

// ============================================================
// 🗂️ DATOS DE PRODUCTOS INICIALES — Puedes agregar más aquí
// Estructura: { id, name, price, category, description, image, stock }
// ============================================================
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Collar Amanecer",
    price: 3500,
    category: "Joyería",
    description: "Plata 925 con piedra labradorita. Pieza artesanal única.",
    image: "", // 👈 REEMPLAZAR con ruta de imagen: "/images/collar-amanecer.jpg"
    stock: 8,
  },
  {
    id: 2,
    name: "Aretes Luna Llena",
    price: 2200,
    category: "Joyería",
    description: "Aros colgantes en plata con luna grabada a mano.",
    image: "",
    stock: 12,
  },
  {
    id: 3,
    name: "Bolso Artesanal Tierra",
    price: 8900,
    category: "Accesorios",
    description: "Cuero vacuno curtido natural, costura a mano, interior forrado.",
    image: "",
    stock: 3,
  },
  {
    id: 4,
    name: "Pulsera Trenzada",
    price: 1800,
    category: "Joyería",
    description: "Hilo de seda natural con cierre de plata. Varios colores.",
    image: "",
    stock: 20,
  },
  {
    id: 5,
    name: "Vela Aromática Bosque",
    price: 1200,
    category: "Hogar",
    description: "Cera de soja con esencias naturales de cedro y pino.",
    image: "",
    stock: 15,
  },
  {
    id: 6,
    name: "Set de Tazas Pintadas",
    price: 4500,
    category: "Hogar",
    description: "Set de 4 tazas de cerámica con ilustraciones de flora nativa.",
    image: "",
    stock: 5,
  },
  {
    id: 7,
    name: "Cuaderno Encuadernado",
    price: 2800,
    category: "Papelería",
    description: "Encuadernación japonesa en lino. 120 hojas papel ahuesado.",
    image: "",
    stock: 10,
  },
  {
    id: 8,
    name: "Lámina Acuarela #1",
    price: 1500,
    category: "Arte",
    description: "Impresión fine-art de ilustración original. 30x40cm.",
    image: "",
    stock: 30,
  },
];

// ============================================================
// SLIDES DEL CARRUSEL — Historia del emprendimiento
// Reemplaza los placeholders con tus rutas de imagen reales
// ============================================================
const CAROUSEL_SLIDES = [
  {
    id: 1,
    image: "", // 👈 Ej: "/images/historia-1.jpg"
    title: "Nuestros Comienzos",
    text: "Todo comenzó en un pequeño taller con una gran pasión por lo artesanal.",
  },
  {
    id: 2,
    image: "",
    title: "Manos que Crean",
    text: "Cada pieza es elaborada a mano, con materiales naturales y mucho amor.",
  },
  {
    id: 3,
    image: "",
    title: "Para Vos y Tu Mundo",
    text: "Creamos objetos que cuenten historias y llenen de belleza tu cotidiano.",
  },
];

// ============================================================
// 🎨 PALETA DE COLORES — Modifica las variables CSS aquí
// ============================================================
const BRAND_STYLES = `
  :root {
    /* 🎨 COLORES DE MARCA — CAMBIAR AQUÍ */
    --brand-primary: #8B5E3C;
    --brand-secondary: #D4A96A;
    --brand-accent: #E8D5B7;
    --brand-dark: #2C1A0E;
    --brand-light: #FBF7F2;
    --brand-text: #3D2B1F;
    --brand-muted: #9C7B65;
  }
`;

// ============================================================
// UTILIDADES
// ============================================================

// Formatea precios en pesos argentinos
const formatPrice = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);

// Genera un ID único
const genId = () => Date.now() + Math.random();

// ============================================================
// COMPONENTE PRINCIPAL — App
// ============================================================
export default function App() {
  // --- Estado de autenticación ---
  const [authState, setAuthState] = useState("login"); // "login" | "register" | "loggedIn"
  const [currentUser, setCurrentUser] = useState(null); // { name, email, role }
  // Almacenamos usuarios registrados en memoria (en producción usarías backend)
  const [users, setUsers] = useState([
    { id: 1, name: "Admin", email: "admin@aurora.com", password: "admin123", role: "admin" },
    { id: 2, name: "Cliente Demo", email: "cliente@demo.com", password: "123456", role: "user" },
  ]);

  // --- Estado de productos y categorías ---
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  // --- Estado del carrito ---
  const [cart, setCart] = useState([]); // [{ ...product, qty }]
  const [cartOpen, setCartOpen] = useState(false);

  // --- Estado de cupones ---
  const [coupons, setCoupons] = useState(CONFIG.coupons);

  // ============================================================
  // 🔥 FIREBASE — Sincronización en tiempo real
  // Carga productos y cupones desde Firestore al iniciar.
  // Si la colección está vacía, sube los productos iniciales.
  // ============================================================
  useEffect(() => {
    // Suscripción en tiempo real a la colección de productos
    const unsubscribeProducts = onSnapshot(
      collection(db, PRODUCTS_COLLECTION),
      (snapshot) => {
        if (snapshot.empty) {
          // Primera vez: guardar los productos iniciales en Firestore
          const uploadInitial = async () => {
            for (const product of INITIAL_PRODUCTS) {
              await setDoc(doc(db, PRODUCTS_COLLECTION, String(product.id)), product);
            }
          };
          uploadInitial();
        } else {
          const loadedProducts = snapshot.docs.map((d) => d.data());
          setProducts(loadedProducts);
        }
        setProductsLoading(false);
      },
      (error) => {
        console.error("Error cargando productos:", error);
        setProducts(INITIAL_PRODUCTS);
        setProductsLoading(false);
      }
    );

    // Suscripción en tiempo real a la colección de cupones
    const unsubscribeCoupons = onSnapshot(
      collection(db, COUPONS_COLLECTION),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedCoupons = {};
          snapshot.docs.forEach((d) => {
            loadedCoupons[d.id] = d.data();
          });
          setCoupons(loadedCoupons);
        } else {
          // Primera vez: guardar los cupones iniciales
          const uploadCoupons = async () => {
            for (const [code, data] of Object.entries(CONFIG.coupons)) {
              await setDoc(doc(db, COUPONS_COLLECTION, code), data);
            }
          };
          uploadCoupons();
        }
      },
      (error) => {
        console.error("Error cargando cupones:", error);
      }
    );

    return () => {
      unsubscribeProducts();
      unsubscribeCoupons();
    };
  }, []);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, ...couponData }
  const [couponMsg, setCouponMsg] = useState("");

  // --- Estado de checkout ---
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderDone, setOrderDone] = useState(false);

  // --- Estado de admin ---
  const [adminSection, setAdminSection] = useState("products"); // "products" | "coupons"
  const [editingProduct, setEditingProduct] = useState(null);
  const [adminMsg, setAdminMsg] = useState("");

  // --- Navegación ---
  const [page, setPage] = useState("home"); // "home" | "shop" | "admin" | "contact"

  // ============================================================
  // LÓGICA DE AUTENTICACIÓN
  // ============================================================

  /**
   * handleLogin — Valida credenciales y asigna rol
   * El rol "admin" se activa si el email corresponde a un admin
   * O si se ingresa la contraseña maestra de CONFIG.adminPassword
   */
  const handleLogin = (email, password, isAdminLogin) => {
    // Caso 1: Login con credencial de admin maestra
    if (isAdminLogin && password === CONFIG.adminPassword) {
      const adminUser = users.find((u) => u.role === "admin");
      if (adminUser) {
        setCurrentUser({ ...adminUser, role: "admin" });
        setAuthState("loggedIn");
        setPage("home");
        return { ok: true };
      }
    }
    // Caso 2: Login normal
    const user = users.find((u) => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      setAuthState("loggedIn");
      setPage("home");
      return { ok: true };
    }
    return { ok: false, msg: "Email o contraseña incorrectos." };
  };

  const handleRegister = (name, email, password) => {
    if (users.find((u) => u.email === email))
      return { ok: false, msg: "Ya existe una cuenta con ese email." };
    const newUser = { id: genId(), name, email, password, role: "user" };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    setAuthState("loggedIn");
    setPage("home");
    return { ok: true };
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthState("login");
    setCart([]);
    setAppliedCoupon(null);
    setPage("home");
  };

  // ============================================================
  // LÓGICA DEL CARRITO
  // ============================================================

  /**
   * addToCart — Agrega producto o incrementa cantidad si ya existe
   */
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  /**
   * updateQty — Modifica cantidad de un item; si qty <= 0, lo elimina
   */
  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i.id !== id));

  // Subtotal antes del descuento
  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  /**
   * discount — Calcula el descuento según tipo (porcentaje o monto fijo)
   */
  const discount = appliedCoupon
    ? appliedCoupon.type === "percent"
      ? Math.round((subtotal * appliedCoupon.discount) / 100)
      : appliedCoupon.discount
    : 0;

  const total = subtotal - discount;

  // ============================================================
  // LÓGICA DE CUPONES
  // ============================================================

  /**
   * applyCoupon — Valida el cupón ingresado contra la lista CONFIG.coupons
   * Verifica que esté activo y que no haya uno ya aplicado
   */
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    if (appliedCoupon) {
      setCouponMsg("Ya hay un cupón aplicado. Quitalo primero.");
      return;
    }
    const coupon = coupons[code];
    if (!coupon) {
      setCouponMsg("❌ Cupón no válido.");
    } else if (!coupon.active) {
      setCouponMsg("❌ Este cupón está desactivado.");
    } else {
      setAppliedCoupon({ code, ...coupon });
      setCouponMsg(`✅ Cupón "${code}" aplicado: ${coupon.label}`);
    }
    setTimeout(() => setCouponMsg(""), 3000);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  // ============================================================
  // LÓGICA DEL PANEL ADMIN
  // ============================================================

  const saveProduct = async (productData) => {
    try {
      const isEdit = productData.id && products.find((p) => p.id === productData.id);
      const finalProduct = isEdit
        ? productData
        : { ...productData, id: genId() };
      // Guardar en Firestore (el onSnapshot actualizará el estado local automáticamente)
      await setDoc(doc(db, PRODUCTS_COLLECTION, String(finalProduct.id)), finalProduct);
      setAdminMsg(isEdit ? "✅ Producto actualizado." : "✅ Producto agregado.");
    } catch (error) {
      console.error("Error guardando producto:", error);
      setAdminMsg("❌ Error al guardar. Revisá la conexión.");
    }
    setEditingProduct(null);
    setTimeout(() => setAdminMsg(""), 2500);
  };

  const deleteProduct = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      try {
        await deleteDoc(doc(db, PRODUCTS_COLLECTION, String(id)));
        setAdminMsg("🗑️ Producto eliminado.");
      } catch (error) {
        console.error("Error eliminando producto:", error);
        setAdminMsg("❌ Error al eliminar.");
      }
      setTimeout(() => setAdminMsg(""), 2500);
    }
  };

  const toggleCoupon = async (code) => {
    const updated = { ...coupons[code], active: !coupons[code].active };
    try {
      await setDoc(doc(db, COUPONS_COLLECTION, code), updated);
      // El onSnapshot actualizará el estado local automáticamente
    } catch (error) {
      console.error("Error actualizando cupón:", error);
    }
  };

  // --- Categorías dinámicas desde los productos ---
  const categories = ["Todos", ...Array.from(new Set(products.map((p) => p.category)))];

  // --- Productos filtrados por categoría ---
  const filteredProducts =
    selectedCategory === "Todos"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  // ============================================================
  // RENDER PRINCIPAL
  // ============================================================

  // Si no está logueado, mostrar pantalla de auth
  if (authState !== "loggedIn") {
    return (
      <>
        <style>{BRAND_STYLES}</style>
        <AuthScreen
          mode={authState}
          setMode={setAuthState}
          onLogin={handleLogin}
          onRegister={handleRegister}
          brandName={CONFIG.brandName}
          brandTagline={CONFIG.brandTagline}
        />
      </>
    );
  }

  // Pantalla de carga mientras Firebase trae los datos
  if (productsLoading) {
    return (
      <>
        <style>{BRAND_STYLES}</style>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--brand-light)", gap: 16 }}>
          <div style={{ fontSize: 40 }}>🌿</div>
          <div style={{ fontSize: 18, color: "var(--brand-primary)", fontFamily: "Georgia, serif", fontWeight: 600 }}>{CONFIG.brandName}</div>
          <div style={{ fontSize: 14, color: "var(--brand-muted)" }}>Cargando tienda...</div>
          <div style={{ width: 40, height: 40, border: "3px solid var(--brand-accent)", borderTopColor: "var(--brand-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{BRAND_STYLES}</style>
      <div style={{ minHeight: "100vh", background: "var(--brand-light)", color: "var(--brand-text)", fontFamily: "'Georgia', serif" }}>

        {/* ===================== NAVBAR ===================== */}
        <Navbar
          brandName={CONFIG.brandName}
          user={currentUser}
          cartCount={cart.reduce((a, i) => a + i.qty, 0)}
          onCartClick={() => setCartOpen(true)}
          onLogout={handleLogout}
          page={page}
          setPage={setPage}
        />

        {/* ===================== CONTENIDO SEGÚN PÁGINA ===================== */}
        {page === "home" && (
          <HomePage
            slides={CAROUSEL_SLIDES}
            brandName={CONFIG.brandName}
            brandTagline={CONFIG.brandTagline}
            products={products.slice(0, 4)} // Muestra 4 productos destacados
            onAddToCart={addToCart}
            setPage={setPage}
          />
        )}

        {page === "shop" && (
          <ShopPage
            products={filteredProducts}
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onAddToCart={addToCart}
          />
        )}

        {page === "admin" && currentUser?.role === "admin" && (
          <AdminPage
            products={products}
            coupons={coupons}
            section={adminSection}
            setSection={setAdminSection}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            onSaveProduct={saveProduct}
            onDeleteProduct={deleteProduct}
            onToggleCoupon={toggleCoupon}
            adminMsg={adminMsg}
          />
        )}

        {page === "contact" && <ContactPage contact={CONFIG.contact} />}

        {/* ===================== CARRITO (SIDEBAR) ===================== */}
        {cartOpen && (
          <CartSidebar
            cart={cart}
            onClose={() => setCartOpen(false)}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            subtotal={subtotal}
            discount={discount}
            total={total}
            couponInput={couponInput}
            setCouponInput={setCouponInput}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
            appliedCoupon={appliedCoupon}
            couponMsg={couponMsg}
            onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
          />
        )}

        {/* ===================== CHECKOUT (MODAL) ===================== */}
        {checkoutOpen && (
          <CheckoutModal
            cart={cart}
            subtotal={subtotal}
            discount={discount}
            total={total}
            appliedCoupon={appliedCoupon}
            payment={CONFIG.payment}
            contact={CONFIG.contact}
            onClose={() => setCheckoutOpen(false)}
            onConfirm={() => {
              setCart([]);
              setAppliedCoupon(null);
              setCheckoutOpen(false);
              setOrderDone(true);
              setTimeout(() => setOrderDone(false), 5000);
            }}
          />
        )}

        {/* Toast de orden confirmada */}
        {orderDone && (
          <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "var(--brand-primary)", color: "#fff", padding: "14px 28px", borderRadius: 8, fontWeight: 600, zIndex: 9999, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
            ✅ ¡Orden registrada! Te contactaremos pronto.
          </div>
        )}

        {/* ===================== FOOTER ===================== */}
        <Footer brandName={CONFIG.brandName} contact={CONFIG.contact} setPage={setPage} />
      </div>
    </>
  );
}

// ============================================================
// COMPONENTE: AuthScreen
// Pantalla de login / registro con diseño estético
// ============================================================
function AuthScreen({ mode, setMode, onLogin, onRegister, brandName, brandTagline }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (mode === "login") {
        const result = onLogin(email, password, isAdminLogin ? true : false, adminKey);
        if (!result.ok) setError(result.msg);
      } else {
        if (!name || !email || !password) {
          setError("Completá todos los campos.");
          setLoading(false);
          return;
        }
        const result = onRegister(name, email, password);
        if (!result.ok) setError(result.msg);
      }
      setLoading(false);
    }, 400);
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    border: "1.5px solid #D4A96A44",
    borderRadius: 8,
    background: "#fff",
    color: "var(--brand-text)",
    fontSize: 15,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "linear-gradient(135deg, var(--brand-dark) 0%, #5C3D2E 50%, var(--brand-primary) 100%)" }}>
      {/* Panel izquierdo — Marca */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 48, color: "#fff", display: window.innerWidth < 768 ? "none" : "flex" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🌿</div>
        <h1 style={{ fontSize: 36, fontWeight: 700, margin: "0 0 12px", letterSpacing: 1 }}>{brandName}</h1>
        <p style={{ fontSize: 18, opacity: 0.8, textAlign: "center", maxWidth: 300 }}>{brandTagline}</p>
        <div style={{ marginTop: 48, opacity: 0.4 }}>
          <div style={{ width: 60, height: 2, background: "#D4A96A", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 13, textAlign: "center" }}>Arte hecho con amor, para tu vida cotidiana.</p>
        </div>
      </div>

      {/* Panel derecho — Formulario */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ background: "#fff", borderRadius: 16, padding: 40, width: "100%", maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>
          {/* Mobile: mostrar nombre de marca */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--brand-primary)", margin: 0 }}>
              {mode === "login" ? "Bienvenido/a" : "Crear cuenta"}
            </h2>
            <p style={{ fontSize: 13, color: "var(--brand-muted)", marginTop: 4 }}>
              {mode === "login" ? `Ingresá a ${brandName}` : "Únete a nuestra comunidad"}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mode === "register" && (
              <input style={inputStyle} placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input style={inputStyle} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={inputStyle} type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSubmit()} />

            {mode === "login" && (
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--brand-muted)", cursor: "pointer" }}>
                  <input type="checkbox" checked={isAdminLogin} onChange={(e) => setIsAdminLogin(e.target.checked)} />
                  Ingresar como Administrador
                </label>
                {isAdminLogin && (
                  <input style={{ ...inputStyle, marginTop: 10 }} type="password" placeholder="Clave de administrador" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} />
                )}
              </div>
            )}

            {error && (
              <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "10px 14px", borderRadius: 6, fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ padding: "14px", background: "var(--brand-primary)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 4, opacity: loading ? 0.7 : 1 }}>
              {loading ? "..." : mode === "login" ? "Ingresar" : "Registrarme"}
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--brand-muted)" }}>
            {mode === "login" ? (
              <>¿No tenés cuenta?{" "}
                <button onClick={() => { setMode("register"); setError(""); }} style={{ background: "none", border: "none", color: "var(--brand-primary)", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  Registrate
                </button>
              </>
            ) : (
              <>¿Ya tenés cuenta?{" "}
                <button onClick={() => { setMode("login"); setError(""); }} style={{ background: "none", border: "none", color: "var(--brand-primary)", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                  Iniciar sesión
                </button>
              </>
            )}
          </div>

          {/* Credenciales demo */}
          <div style={{ marginTop: 20, padding: 12, background: "#FBF7F2", borderRadius: 8, fontSize: 11, color: "#9C7B65" }}>
            <strong>Demo:</strong> cliente@demo.com / 123456 | Admin: usar checkbox + clave "admin2025"
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: Navbar
// ============================================================
function Navbar({ brandName, user, cartCount, onCartClick, onLogout, page, setPage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: "home", label: "Inicio" },
    { id: "shop", label: "Tienda" },
    { id: "contact", label: "Contacto" },
    ...(user?.role === "admin" ? [{ id: "admin", label: "⚙ Admin" }] : []),
  ];

  const linkStyle = (id) => ({
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    padding: "6px 14px",
    borderRadius: 6,
    color: page === id ? "var(--brand-primary)" : "var(--brand-text)",
    background: page === id ? "var(--brand-accent)" : "transparent",
    letterSpacing: 0.3,
  });

  return (
    <nav style={{ background: "#fff", borderBottom: "1px solid #E8D5B7", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", height: 64, gap: 16 }}>

        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span style={{ fontSize: 22 }}>🌿</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-primary)", fontFamily: "Georgia, serif" }}>{brandName}</span>
        </button>

        {/* Links desktop */}
        <div style={{ flex: 1, display: "flex", gap: 4, marginLeft: 24, display: window.innerWidth < 640 ? "none" : "flex" }}>
          {navLinks.map((l) => (
            <button key={l.id} onClick={() => setPage(l.id)} style={linkStyle(l.id)}>{l.label}</button>
          ))}
        </div>

        {/* Acciones derecha */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
          {/* Carrito */}
          <button onClick={onCartClick} style={{ background: "none", border: "1.5px solid var(--brand-secondary)", borderRadius: 8, padding: "7px 14px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--brand-primary)", fontWeight: 600, fontSize: 14 }}>
            🛒 <span style={{ background: "var(--brand-primary)", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>{cartCount}</span>
          </button>

          {/* Usuario */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 13, color: "var(--brand-muted)", display: window.innerWidth < 768 ? "none" : "block" }}>
              👤 {user?.name}
              {user?.role === "admin" && <span style={{ marginLeft: 4, background: "var(--brand-accent)", color: "var(--brand-primary)", padding: "2px 6px", borderRadius: 4, fontSize: 10, fontWeight: 700 }}>ADMIN</span>}
            </span>
            <button onClick={onLogout} style={{ background: "none", border: "1px solid #ddd", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontSize: 12, color: "#666" }}>
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Nav mobile secundaria */}
      <div style={{ display: "flex", gap: 4, padding: "0 24px 10px", overflowX: "auto", display: window.innerWidth >= 640 ? "none" : "flex" }}>
        {navLinks.map((l) => (
          <button key={l.id} onClick={() => setPage(l.id)} style={{ ...linkStyle(l.id), fontSize: 12, whiteSpace: "nowrap" }}>{l.label}</button>
        ))}
      </div>
    </nav>
  );
}

// ============================================================
// COMPONENTE: HomePage
// Incluye Hero, Carrusel y Productos Destacados
// ============================================================
function HomePage({ slides, brandName, brandTagline, products, onAddToCart, setPage }) {
  return (
    <div>
      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-primary) 100%)", color: "#fff", padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <p style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: "var(--brand-secondary)", marginBottom: 16 }}>
            {/* EDITAR SLOGAN DE BIENVENIDA AQUÍ */}
            Bienvenido/a a nuestra tienda
          </p>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 700, margin: "0 0 20px", lineHeight: 1.2 }}>
            {brandName}
          </h1>
          <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.7 }}>
            {brandTagline} — Objetos únicos creados con pasión, para quienes aprecian lo auténtico.
          </p>
          <button onClick={() => setPage("shop")} style={{ background: "var(--brand-secondary)", color: "var(--brand-dark)", border: "none", padding: "16px 40px", borderRadius: 8, fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5 }}>
            Explorar Tienda →
          </button>
        </div>
      </div>

      {/* CARRUSEL — Historia */}
      <div style={{ maxWidth: 1100, margin: "60px auto", padding: "0 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 28, color: "var(--brand-primary)", marginBottom: 8 }}>Nuestra Historia</h2>
        <p style={{ textAlign: "center", color: "var(--brand-muted)", marginBottom: 36 }}>Conoce el alma detrás de cada pieza</p>
        <Carousel slides={slides} />
      </div>

      {/* PRODUCTOS DESTACADOS */}
      <div style={{ maxWidth: 1100, margin: "0 auto 60px", padding: "0 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, color: "var(--brand-primary)", margin: 0 }}>Destacados</h2>
          <button onClick={() => setPage("shop")} style={{ background: "none", border: "1.5px solid var(--brand-secondary)", color: "var(--brand-primary)", padding: "8px 20px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
            Ver todo →
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 24 }}>
          {products.map((p) => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: Carousel
// Carrusel manual con flechas y dots
// ============================================================
function Carousel({ slides }) {
  const [current, setCurrent] = useState(0);

  // Avanza automáticamente cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: "var(--brand-dark)", minHeight: 320 }}>
      {/* Imagen o placeholder */}
      <div style={{
        width: "100%",
        minHeight: 320,
        background: slide.image
          ? `url(${slide.image}) center/cover no-repeat`
          : "linear-gradient(135deg, #3D2B1F 0%, #8B5E3C 100%)",
        display: "flex",
        alignItems: "flex-end",
      }}>
        {/* Si no hay imagen, mostrar placeholder visual */}
        {!slide.image && (
          <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
            <div style={{ textAlign: "center", color: "#D4A96A88" }}>
              <div style={{ fontSize: 48, marginBottom: 8 }}>🖼️</div>
              <div style={{ fontSize: 12, fontFamily: "monospace" }}>
                {/* Indica dónde poner la imagen */}
                Agregar imagen en CAROUSEL_SLIDES[{current}].image
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay con texto */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(transparent, rgba(0,0,0,0.75))", padding: "40px 32px 24px" }}>
        <h3 style={{ color: "#fff", fontSize: 22, margin: "0 0 6px", fontFamily: "Georgia, serif" }}>{slide.title}</h3>
        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, margin: 0 }}>{slide.text}</p>
      </div>

      {/* Flecha anterior */}
      <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16, backdropFilter: "blur(4px)" }}>
        ‹
      </button>

      {/* Flecha siguiente */}
      <button onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 16, backdropFilter: "blur(4px)" }}>
        ›
      </button>

      {/* Dots de navegación */}
      <div style={{ position: "absolute", bottom: 12, right: 24, display: "flex", gap: 6 }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? 20 : 8, height: 8, borderRadius: 4, background: i === current ? "var(--brand-secondary)" : "rgba(255,255,255,0.4)", border: "none", cursor: "pointer", transition: "width 0.3s, background 0.3s", padding: 0 }} />
        ))}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: ShopPage — Catálogo completo con filtros
// ============================================================
function ShopPage({ products, categories, selectedCategory, onSelectCategory, onAddToCart }) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: 30, color: "var(--brand-primary)", marginBottom: 8 }}>Nuestra Tienda</h1>
      <p style={{ color: "var(--brand-muted)", marginBottom: 32 }}>{products.length} producto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}</p>

      {/* ---- Filtros de categoría ---- */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            style={{
              padding: "8px 20px",
              borderRadius: 20,
              border: "1.5px solid",
              borderColor: selectedCategory === cat ? "var(--brand-primary)" : "#D4A96A55",
              background: selectedCategory === cat ? "var(--brand-primary)" : "#fff",
              color: selectedCategory === cat ? "#fff" : "var(--brand-text)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: selectedCategory === cat ? 600 : 400,
              transition: "all 0.2s",
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* ---- Grid de productos ---- */}
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: 80, color: "var(--brand-muted)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <p>No hay productos en esta categoría.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 28 }}>
          {products.map((p) => <ProductCard key={p.id} product={p} onAddToCart={onAddToCart} />)}
        </div>
      )}
    </div>
  );
}

// ============================================================
// COMPONENTE: ProductCard — Tarjeta individual de producto
// ============================================================
function ProductCard({ product, onAddToCart }) {
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    setAdding(true);
    onAddToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #E8D5B7", transition: "box-shadow 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"}>

      {/* Imagen del producto */}
      <div style={{
        height: 200,
        background: product.image
          ? `url(${product.image}) center/cover no-repeat`
          : "linear-gradient(135deg, var(--brand-accent) 0%, #E8D5B7 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        {!product.image && (
          <div style={{ textAlign: "center", color: "var(--brand-muted)" }}>
            <div style={{ fontSize: 32, marginBottom: 4 }}>📦</div>
            {/* Placeholder: reemplazar image en los datos del producto */}
            <div style={{ fontSize: 10, fontFamily: "monospace", opacity: 0.5 }}>sin imagen</div>
          </div>
        )}
        {/* Badge de categoría */}
        <span style={{ position: "absolute", top: 10, left: 10, background: "var(--brand-primary)", color: "#fff", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
          {product.category}
        </span>
        {/* Stock bajo */}
        {product.stock <= 3 && (
          <span style={{ position: "absolute", top: 10, right: 10, background: "#FEE2E2", color: "#991B1B", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 600 }}>
            ¡Últimas unidades!
          </span>
        )}
      </div>

      {/* Info del producto */}
      <div style={{ padding: "16px" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px", color: "var(--brand-text)" }}>{product.name}</h3>
        <p style={{ fontSize: 13, color: "var(--brand-muted)", margin: "0 0 12px", lineHeight: 1.5, minHeight: 36 }}>{product.description}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "var(--brand-primary)" }}>{formatPrice(product.price)}</span>
          <button
            onClick={handleAdd}
            style={{
              background: adding ? "#10B981" : "var(--brand-primary)",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              transition: "background 0.3s",
            }}>
            {adding ? "✓ Añadido" : "+ Añadir"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: CartSidebar — Carrito lateral deslizable
// ============================================================
function CartSidebar({ cart, onClose, onUpdateQty, onRemove, subtotal, discount, total, couponInput, setCouponInput, onApplyCoupon, onRemoveCoupon, appliedCoupon, couponMsg, onCheckout }) {
  return (
    <>
      {/* Overlay oscuro */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} />

      {/* Panel lateral */}
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(420px, 100vw)", background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", boxShadow: "-8px 0 40px rgba(0,0,0,0.2)" }}>

        {/* Header del carrito */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #E8D5B7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, fontSize: 20, color: "var(--brand-primary)" }}>🛒 Tu carrito</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "var(--brand-muted)" }}>✕</button>
        </div>

        {/* Lista de items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "var(--brand-muted)" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🛍️</div>
              <p>Tu carrito está vacío.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: "1px solid #F3EDE5" }}>
                {/* Miniatura del producto */}
                <div style={{ width: 60, height: 60, borderRadius: 8, background: item.image ? `url(${item.image}) center/cover` : "var(--brand-accent)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {!item.image && <span>📦</span>}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-text)" }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: "var(--brand-muted)", marginTop: 2 }}>{formatPrice(item.price)} c/u</div>

                  {/* Controles de cantidad */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                    <button onClick={() => onUpdateQty(item.id, -1)} style={{ width: 28, height: 28, border: "1px solid #D4A96A", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14 }}>−</button>
                    <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{item.qty}</span>
                    <button onClick={() => onUpdateQty(item.id, 1)} style={{ width: 28, height: 28, border: "1px solid #D4A96A", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 14 }}>+</button>
                    <span style={{ marginLeft: "auto", fontWeight: 700, color: "var(--brand-primary)" }}>{formatPrice(item.price * item.qty)}</span>
                    <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#EF4444", fontSize: 14 }}>🗑</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con cupón y totales */}
        {cart.length > 0 && (
          <div style={{ padding: "16px 24px", borderTop: "1px solid #E8D5B7" }}>

            {/* ---- SECCIÓN CUPÓN ---- */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--brand-text)", marginBottom: 8 }}>
                🎫 Cupón de descuento
              </div>
              {appliedCoupon ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#DCFCE7", padding: "8px 12px", borderRadius: 6 }}>
                  <span style={{ flex: 1, fontSize: 13, color: "#166534" }}>✅ "{appliedCoupon.code}" — {appliedCoupon.label}</span>
                  <button onClick={onRemoveCoupon} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", fontSize: 12 }}>Quitar</button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                    placeholder="Ej: DESCUENTO10"
                    style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #D4A96A55", borderRadius: 6, fontSize: 13 }}
                  />
                  <button onClick={onApplyCoupon} style={{ background: "var(--brand-secondary)", color: "var(--brand-dark)", border: "none", padding: "8px 16px", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                    Aplicar
                  </button>
                </div>
              )}
              {couponMsg && <div style={{ fontSize: 12, marginTop: 6, color: couponMsg.startsWith("✅") ? "#166534" : "#991B1B" }}>{couponMsg}</div>}
            </div>

            {/* ---- TOTALES ---- */}
            <div style={{ fontSize: 14, color: "var(--brand-muted)", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div style={{ fontSize: 14, color: "#166534", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
                <span>Descuento</span><span>− {formatPrice(discount)}</span>
              </div>
            )}
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--brand-primary)", display: "flex", justifyContent: "space-between", borderTop: "1px solid #E8D5B7", paddingTop: 12, marginTop: 8, marginBottom: 16 }}>
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>

            <button onClick={onCheckout} style={{ width: "100%", padding: 14, background: "var(--brand-primary)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              Finalizar compra →
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ============================================================
// COMPONENTE: CheckoutModal — Modal de finalización de compra
// ============================================================
function CheckoutModal({ cart, subtotal, discount, total, appliedCoupon, payment, contact, onClose, onConfirm }) {
  const [reporterName, setReporterName] = useState("");
  const [reporterEmail, setReporterEmail] = useState("");
  const [reporterNote, setReporterNote] = useState("");

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 300 }} />
      <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 301, padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 16, maxWidth: 560, width: "100%", maxHeight: "90vh", overflowY: "auto", padding: 32, boxShadow: "0 24px 80px rgba(0,0,0,0.3)" }}>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 22, color: "var(--brand-primary)" }}>Finalizar Compra</h2>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}>✕</button>
          </div>

          {/* Resumen del pedido */}
          <div style={{ background: "#FBF7F2", borderRadius: 10, padding: 20, marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "var(--brand-muted)", textTransform: "uppercase", letterSpacing: 1 }}>Resumen del pedido</h3>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                <span>{item.name} × {item.qty}</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#166534", marginTop: 8 }}>
                <span>Descuento ({appliedCoupon?.code})</span>
                <span>− {formatPrice(discount)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, color: "var(--brand-primary)", borderTop: "1px solid #E8D5B7", paddingTop: 12, marginTop: 10 }}>
              <span>Total a pagar</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* ============================================================
              💳 DATOS DE TRANSFERENCIA — CONFIGURAR INFO DE PAGO AQUÍ
              Edita los valores en CONFIG.payment al inicio del archivo
              ============================================================ */}
          <div style={{ border: "2px solid var(--brand-accent)", borderRadius: 10, padding: 20, marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "var(--brand-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
              💳 Datos para transferir
            </h3>
            <div style={{ display: "grid", gap: 8, fontSize: 14 }}>
              {[
                ["Banco", payment.bank],
                ["Titular", payment.accountHolder],
                ["CBU", payment.cbu],
                ["Alias", payment.alias],
                ["CUIT/CUIL", payment.cuit],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: "var(--brand-muted)", minWidth: 70 }}>{label}:</span>
                  <span style={{ fontWeight: 600, color: "var(--brand-text)", userSelect: "all" }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "8px 12px", background: "#FEF9C3", borderRadius: 6, fontSize: 12, color: "#854D0E" }}>
              ⚠️ {payment.notes}
            </div>
          </div>

          {/* Datos del comprador para reporte de pago */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ margin: "0 0 14px", fontSize: 14, color: "var(--brand-muted)", textTransform: "uppercase", letterSpacing: 1 }}>Tus datos para confirmar pago</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input value={reporterName} onChange={(e) => setReporterName(e.target.value)} placeholder="Nombre completo" style={{ padding: "10px 14px", border: "1.5px solid #E8D5B7", borderRadius: 6, fontSize: 14 }} />
              <input value={reporterEmail} onChange={(e) => setReporterEmail(e.target.value)} placeholder="Email" type="email" style={{ padding: "10px 14px", border: "1.5px solid #E8D5B7", borderRadius: 6, fontSize: 14 }} />
              <textarea value={reporterNote} onChange={(e) => setReporterNote(e.target.value)} placeholder="Número de comprobante o nota adicional (opcional)" rows={2} style={{ padding: "10px 14px", border: "1.5px solid #E8D5B7", borderRadius: 6, fontSize: 14, resize: "vertical" }} />
            </div>
          </div>

          {/* Contacto para enviar comprobante */}
          <div style={{ fontSize: 13, color: "var(--brand-muted)", marginBottom: 20, textAlign: "center" }}>
            📩 Envianos el comprobante a: <strong>{contact.email}</strong> o por WhatsApp: <strong>{contact.whatsapp}</strong>
          </div>

          <button
            onClick={onConfirm}
            disabled={!reporterName || !reporterEmail}
            style={{ width: "100%", padding: 14, background: !reporterName || !reporterEmail ? "#ccc" : "var(--brand-primary)", color: "#fff", border: "none", borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: !reporterName || !reporterEmail ? "not-allowed" : "pointer" }}>
            ✅ Confirmar pedido — {formatPrice(total)}
          </button>
          <p style={{ textAlign: "center", fontSize: 11, color: "var(--brand-muted)", marginTop: 8 }}>
            Al confirmar, te comprometés a realizar la transferencia y enviar el comprobante.
          </p>
        </div>
      </div>
    </>
  );
}

// ============================================================
// COMPONENTE: AdminPage — Panel de administración
// ============================================================
function AdminPage({ products, coupons, section, setSection, editingProduct, setEditingProduct, onSaveProduct, onDeleteProduct, onToggleCoupon, adminMsg }) {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <span style={{ fontSize: 28 }}>⚙️</span>
        <div>
          <h1 style={{ fontSize: 26, color: "var(--brand-primary)", margin: 0 }}>Panel de Administrador</h1>
          <p style={{ color: "var(--brand-muted)", margin: "4px 0 0", fontSize: 13 }}>Gestión de productos y cupones</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28, borderBottom: "2px solid #E8D5B7", paddingBottom: 12 }}>
        {["products", "coupons"].map((s) => (
          <button key={s} onClick={() => setSection(s)} style={{ padding: "8px 24px", border: "none", borderRadius: "6px 6px 0 0", cursor: "pointer", fontWeight: 600, fontSize: 14, background: section === s ? "var(--brand-primary)" : "transparent", color: section === s ? "#fff" : "var(--brand-muted)" }}>
            {s === "products" ? "📦 Productos" : "🎫 Cupones"}
          </button>
        ))}
      </div>

      {adminMsg && (
        <div style={{ padding: "10px 16px", background: "#DCFCE7", color: "#166534", borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
          {adminMsg}
        </div>
      )}

      {/* Panel de Productos */}
      {section === "products" && (
        <AdminProducts
          products={products}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          onSave={onSaveProduct}
          onDelete={onDeleteProduct}
        />
      )}

      {/* Panel de Cupones */}
      {section === "coupons" && (
        <AdminCoupons coupons={coupons} onToggle={onToggleCoupon} />
      )}
    </div>
  );
}

// ---- Sub-componente Admin: Productos ----
function AdminProducts({ products, editingProduct, setEditingProduct, onSave, onDelete }) {
  const empty = { id: null, name: "", price: "", category: "", description: "", image: "", stock: "" };
  const form = editingProduct || null;

  const [localForm, setLocalForm] = useState(empty);

  useEffect(() => {
    setLocalForm(editingProduct || empty);
  }, [editingProduct]);

  const inputStyle = { padding: "9px 12px", border: "1.5px solid #E8D5B7", borderRadius: 6, fontSize: 13, width: "100%", boxSizing: "border-box" };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

      {/* Lista de productos */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, color: "var(--brand-text)" }}>Productos ({products.length})</h3>
          <button onClick={() => setLocalForm(empty)} style={{ background: "var(--brand-primary)", color: "#fff", border: "none", padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>
            + Nuevo
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {products.map((p) => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px", background: "#fff", border: "1px solid #E8D5B7", borderRadius: 8 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "var(--brand-muted)" }}>{p.category} — {formatPrice(p.price)}</div>
              </div>
              <button onClick={() => setLocalForm(p)} style={{ background: "#EFF6FF", color: "#1D4ED8", border: "none", padding: "5px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>✏️</button>
              <button onClick={() => onDelete(p.id)} style={{ background: "#FEF2F2", color: "#991B1B", border: "none", padding: "5px 10px", borderRadius: 4, cursor: "pointer", fontSize: 12 }}>🗑</button>
            </div>
          ))}
        </div>
      </div>

      {/* Formulario de edición */}
      <div style={{ background: "#FBF7F2", borderRadius: 12, padding: 24 }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 16, color: "var(--brand-primary)" }}>
          {localForm.id ? "✏️ Editar producto" : "➕ Nuevo producto"}
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { key: "name", label: "Nombre", type: "text" },
            { key: "price", label: "Precio ($)", type: "number" },
            { key: "category", label: "Categoría", type: "text" },
            { key: "stock", label: "Stock", type: "number" },
            { key: "image", label: "Ruta de imagen (ej: /images/prod.jpg)", type: "text" },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label style={{ fontSize: 12, color: "var(--brand-muted)", display: "block", marginBottom: 4 }}>{label}</label>
              <input type={type} value={localForm[key] || ""} onChange={(e) => setLocalForm((f) => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: "var(--brand-muted)", display: "block", marginBottom: 4 }}>Descripción</label>
            <textarea rows={3} value={localForm.description || ""} onChange={(e) => setLocalForm((f) => ({ ...f, description: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
          </div>
          <button
            onClick={() => onSave({ ...localForm, price: parseFloat(localForm.price), stock: parseInt(localForm.stock) })}
            disabled={!localForm.name || !localForm.price}
            style={{ padding: 12, background: "var(--brand-primary)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>
            💾 Guardar producto
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Sub-componente Admin: Cupones ----
function AdminCoupons({ coupons, onToggle }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>Cupones de descuento</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 500 }}>
        {Object.entries(coupons).map(([code, data]) => (
          <div key={code} style={{ display: "flex", alignItems: "center", gap: 12, padding: 16, background: "#fff", border: `1.5px solid ${data.active ? "#BBF7D0" : "#FEE2E2"}`, borderRadius: 10 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "monospace", color: "var(--brand-text)" }}>{code}</div>
              <div style={{ fontSize: 13, color: "var(--brand-muted)" }}>{data.label} — {data.type === "percent" ? `${data.discount}%` : formatPrice(data.discount)}</div>
            </div>
            <div style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: data.active ? "#DCFCE7" : "#FEE2E2", color: data.active ? "#166534" : "#991B1B" }}>
              {data.active ? "Activo" : "Inactivo"}
            </div>
            <button onClick={() => onToggle(code)} style={{ padding: "7px 14px", background: data.active ? "#FEF2F2" : "#DCFCE7", color: data.active ? "#991B1B" : "#166534", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 12 }}>
              {data.active ? "Desactivar" : "Activar"}
            </button>
          </div>
        ))}
      </div>
      <p style={{ color: "var(--brand-muted)", fontSize: 12, marginTop: 16 }}>
        💡 Para agregar nuevos cupones, edita el objeto <code>CONFIG.coupons</code> en el archivo.
      </p>
    </div>
  );
}

// ============================================================
// COMPONENTE: ContactPage — Soporte y contacto
// ============================================================
function ContactPage({ contact }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 24px", textAlign: "center" }}>
      <h1 style={{ fontSize: 30, color: "var(--brand-primary)", marginBottom: 8 }}>Contacto y Soporte</h1>
      <p style={{ color: "var(--brand-muted)", marginBottom: 48 }}>Estamos para ayudarte con lo que necesites.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 48 }}>
        {[
          { icon: "📧", label: "Email", value: contact.email, href: `mailto:${contact.email}` },
          { icon: "💬", label: "WhatsApp", value: contact.whatsapp, href: `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}` },
          { icon: "📸", label: "Instagram", value: contact.instagram, href: `https://instagram.com/${contact.instagram.replace("@", "")}` },
          { icon: "👍", label: "Facebook", value: contact.facebook, href: `https://${contact.facebook}` },
        ].map(({ icon, label, value, href }) => (
          <a key={label} href={href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
            <div style={{ background: "#fff", border: "1.5px solid #E8D5B7", borderRadius: 12, padding: "24px 20px", transition: "box-shadow 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
              <div style={{ fontSize: 12, color: "var(--brand-muted)", marginBottom: 4, textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--brand-primary)" }}>{value}</div>
            </div>
          </a>
        ))}
      </div>

      {/* Formulario de contacto (solo visual, sin backend) */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 40, textAlign: "left", maxWidth: 500, margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #E8D5B7" }}>
        <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "var(--brand-primary)" }}>Envianos un mensaje</h3>
        {["Tu nombre", "Tu email", "¿En qué te podemos ayudar?"].map((ph, i) => (
          i < 2
            ? <input key={i} placeholder={ph} style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E8D5B7", borderRadius: 6, marginBottom: 12, fontSize: 14, boxSizing: "border-box" }} />
            : <textarea key={i} placeholder={ph} rows={4} style={{ width: "100%", padding: "11px 14px", border: "1.5px solid #E8D5B7", borderRadius: 6, marginBottom: 12, fontSize: 14, resize: "vertical", boxSizing: "border-box" }} />
        ))}
        <button
          onClick={() => alert("¡Gracias! Redireccioná este formulario a tu backend o integra EmailJS.")}
          style={{ width: "100%", padding: 12, background: "var(--brand-primary)", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>
          Enviar mensaje
        </button>
        {/* NOTA: Para hacer funcional este formulario, integra EmailJS o un backend propio */}
        <p style={{ fontSize: 11, color: "var(--brand-muted)", textAlign: "center", marginTop: 8 }}>
          💡 Integra EmailJS o tu backend para recibir mensajes reales.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: Footer
// ============================================================
function Footer({ brandName, contact, setPage }) {
  return (
    <footer style={{ background: "var(--brand-dark)", color: "rgba(255,255,255,0.7)", padding: "48px 24px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <span style={{ fontSize: 20 }}>🌿</span>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{brandName}</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, margin: 0 }}>Piezas únicas creadas con pasión y dedicación para quienes valoran lo auténtico.</p>
          </div>
          <div>
            <h4 style={{ color: "var(--brand-secondary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Navegación</h4>
            {[["home", "Inicio"], ["shop", "Tienda"], ["contact", "Contacto"]].map(([id, label]) => (
              <button key={id} onClick={() => setPage(id)} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", fontSize: 14, marginBottom: 8, padding: 0 }}>{label}</button>
            ))}
          </div>
          <div>
            <h4 style={{ color: "var(--brand-secondary)", fontSize: 12, textTransform: "uppercase", letterSpacing: 2, marginBottom: 14 }}>Contacto</h4>
            <p style={{ fontSize: 13, margin: "0 0 6px" }}>{contact.email}</p>
            <p style={{ fontSize: 13, margin: "0 0 6px" }}>{contact.whatsapp}</p>
            <p style={{ fontSize: 13, margin: 0 }}>{contact.instagram}</p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 20, textAlign: "center", fontSize: 12 }}>
          © {new Date().getFullYear()} {brandName}. Hecho con ❤️ para emprendedores.
        </div>
      </div>
    </footer>
  );
}
