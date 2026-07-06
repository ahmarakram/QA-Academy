'use client';

import { useState } from 'react';
import { Bug } from '@/lib/capstone-scenarios';

interface Props {
  hiddenBugs: Bug[];
  foundBugIds: Set<string>;
  onBugFound: (bugId: string) => void;
}

const products = [
  { id: 1, name: 'Wireless Headphones Pro', price: 79.99, image: '🎧', stock: 10 },
  { id: 2, name: 'Mechanical Keyboard RGB', price: 129.99, image: '⌨️', stock: 5 },
  { id: 3, name: 'USB-C Hub 7-Port', price: 49.99, image: '🔌', stock: 8 },
  { id: 4, name: 'Webcam 4K Ultra', price: 89.99, image: '📷', stock: 3 },
];

interface CartItem { productId: number; qty: number; }

export function EcommerceApp({ hiddenBugs, foundBugIds, onBugFound }: Props) {
  const [page, setPage] = useState<'shop' | 'cart' | 'checkout' | 'success'>('shop');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({ name: '', email: '', address: '', promo: '', promoApplied: false, promoDiscount: 0 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notification, setNotification] = useState<{ msg: string; type: 'bug' | 'info' } | null>(null);

  const notify = (msg: string, type: 'bug' | 'info' = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const addToCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === productId);
      if (existing) return prev.map(i => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId, qty: 1 }];
    });
    notify('Added to cart ✓', 'info');
  };

  const updateQty = (productId: number, qty: number) => {
    // BUG: negative quantity accepted (bug2)
    if (qty < 0) {
      onBugFound('bug2');
      notify('🐛 Bug found: Negative quantity accepted!', 'bug');
    }
    // BUG: quantity > 10 accepted (bug5)
    if (qty > 10) {
      onBugFound('bug5');
      notify('🐛 Bug found: Quantity exceeding stock limit accepted!', 'bug');
    }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i).filter(i => i.qty !== 0));
  };

  const subtotal = cart.reduce((sum, item) => {
    const p = products.find(p => p.id === item.productId);
    return sum + (p?.price || 0) * item.qty;
  }, 0);

  // BUG: tax label says 8% but calculation is 10% (bug6)
  const tax = subtotal * 0.10;
  const discount = form.promoDiscount;
  const total = subtotal + tax - discount;

  const applyPromo = () => {
    // BUG: any promo code works (bug4)
    const validCodes = ['SAVE10', 'WELCOME20'];
    if (!validCodes.includes(form.promo.toUpperCase()) && form.promo.length > 0) {
      onBugFound('bug4');
      notify('🐛 Bug found: Invalid promo code accepted!', 'bug');
      setForm(p => ({ ...p, promoApplied: true, promoDiscount: subtotal * 0.10 }));
    } else if (validCodes.includes(form.promo.toUpperCase())) {
      setForm(p => ({ ...p, promoApplied: true, promoDiscount: subtotal * 0.10 }));
      notify('Promo code applied ✓', 'info');
    } else {
      notify('Enter a promo code first', 'info');
    }
  };

  const checkout = () => {
    // BUG: empty cart checkout (bug1)
    if (cart.length === 0) {
      onBugFound('bug1');
      notify('🐛 Bug found: Checkout with empty cart allowed!', 'bug');
      setPage('checkout');
      return;
    }
    setPage('checkout');
  };

  const placeOrder = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = 'Required';
    if (!form.address.trim()) newErrors.address = 'Required';

    // BUG: invalid email accepted (bug3)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!form.email.trim()) {
      newErrors.email = 'Required';
    } else if (!emailValid) {
      // Bug: no validation, proceed anyway
      onBugFound('bug3');
      notify('🐛 Bug found: Invalid email format accepted!', 'bug');
    }

    if (Object.keys(newErrors).length > 0 && form.email.trim() && !emailValid) {
      // still proceed due to the bug
      setPage('success');
    } else if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setPage('success');
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: 600, background: '#fff', color: '#111', position: 'relative' }}>

      {/* Notification toast */}
      {notification && (
        <div style={{
          position: 'absolute', top: 12, right: 12, zIndex: 100,
          padding: '10px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
          background: notification.type === 'bug' ? '#dc2626' : '#16a34a',
          color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          animation: 'fadeIn 0.2s ease',
          maxWidth: 320,
        }}>{notification.msg}</div>
      )}

      {/* Header */}
      <div style={{ background: '#1e40af', color: '#fff', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontWeight: 800, fontSize: 18 }}>🛒 ShopNow</div>
        <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
          <button onClick={() => setPage('shop')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: page === 'shop' ? 700 : 400 }}>Shop</button>
          <button onClick={() => setPage('cart')} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: page === 'cart' ? 700 : 400, position: 'relative' }}>
            Cart {cart.length > 0 && <span style={{ background: '#ef4444', borderRadius: '50%', padding: '1px 5px', fontSize: 10, marginLeft: 4 }}>{cart.reduce((s, i) => s + i.qty, 0)}</span>}
          </button>
        </div>
      </div>

      {/* Shop page */}
      {page === 'shop' && (
        <div style={{ padding: 20 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: '#1e293b' }}>Featured Products</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {products.map(p => (
              <div key={p.id} style={{ border: '1px solid #e2e8f0', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{ background: '#f8fafc', padding: '20px', textAlign: 'center', fontSize: 40 }}>{p.image}</div>
                <div style={{ padding: '12px 14px' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1e293b', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>In stock: {p.stock}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#1e40af' }}>${p.price}</span>
                    <button onClick={() => addToCart(p.id)} style={{
                      background: '#1e40af', color: '#fff', border: 'none', borderRadius: 6,
                      padding: '6px 12px', fontSize: 12, cursor: 'pointer', fontWeight: 600,
                    }}>Add to Cart</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <button onClick={() => setPage('cart')} style={{
              background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8,
              padding: '10px 24px', fontSize: 14, cursor: 'pointer', fontWeight: 600,
            }}>View Cart ({cart.reduce((s, i) => s + i.qty, 0)} items)</button>
          </div>
        </div>
      )}

      {/* Cart page */}
      {page === 'cart' && (
        <div style={{ padding: 20 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: '#1e293b' }}>Shopping Cart</h2>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🛒</div>
              <p>Your cart is empty</p>
              <button onClick={() => setPage('shop')} style={{ background: '#1e40af', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', cursor: 'pointer', fontSize: 13 }}>Continue Shopping</button>
            </div>
          ) : (
            <>
              {cart.map(item => {
                const p = products.find(pr => pr.id === item.productId)!;
                return (
                  <div key={item.productId} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 32 }}>{p.image}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>${p.price} each</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateQty(item.productId, item.qty - 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 16 }}>-</button>
                      <input
                        type="number" value={item.qty}
                        onChange={e => updateQty(item.productId, parseInt(e.target.value) || 0)}
                        style={{ width: 50, textAlign: 'center', border: '1px solid #e2e8f0', borderRadius: 6, padding: '4px', fontSize: 13 }}
                      />
                      <button onClick={() => updateQty(item.productId, item.qty + 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', fontSize: 16 }}>+</button>
                    </div>
                    <div style={{ fontWeight: 700, color: '#1e40af', minWidth: 60, textAlign: 'right' }}>${(p.price * item.qty).toFixed(2)}</div>
                  </div>
                );
              })}
              <div style={{ marginTop: 16, background: '#f8fafc', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: '#64748b' }}>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                {/* BUG: label says 8% but code calculates 10% */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: '#64748b' }}>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, color: '#1e40af', borderTop: '1px solid #e2e8f0', paddingTop: 8, marginTop: 4 }}>
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
          <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
            <button onClick={() => setPage('shop')} style={{ flex: 1, padding: '10px', border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer', fontSize: 13 }}>← Continue Shopping</button>
            {/* BUG bug1: checkout button works even with empty cart */}
            <button onClick={checkout} style={{ flex: 1, padding: '10px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Checkout →</button>
          </div>
        </div>
      )}

      {/* Checkout page */}
      {page === 'checkout' && (
        <div style={{ padding: 20 }}>
          <h2 style={{ fontSize: 18, marginBottom: 16, color: '#1e293b' }}>Checkout</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#334155' }}>Shipping Information</h3>
              {[
                { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Jane Smith' },
                { key: 'email', label: 'Email Address', type: 'text', placeholder: 'jane@example.com' },
                { key: 'address', label: 'Delivery Address', type: 'text', placeholder: '123 Main St, City' },
              ].map(f => (
                <div key={f.key} style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={(form as Record<string, string>)[f.key]}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '9px 12px',
                      border: `1px solid ${errors[f.key] ? '#ef4444' : '#e2e8f0'}`, borderRadius: 8, fontSize: 13,
                    }}
                  />
                  {errors[f.key] && <div style={{ color: '#ef4444', fontSize: 11, marginTop: 3 }}>{errors[f.key]}</div>}
                </div>
              ))}

              <div style={{ marginTop: 8 }}>
                <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 4 }}>Promo Code</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    placeholder="Enter promo code"
                    value={form.promo}
                    onChange={e => setForm(p => ({ ...p, promo: e.target.value }))}
                    style={{ flex: 1, padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 13 }}
                  />
                  <button onClick={applyPromo} style={{ padding: '9px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Apply</button>
                </div>
                {form.promoApplied && <div style={{ color: '#16a34a', fontSize: 11, marginTop: 4 }}>✓ Promo applied: -${discount.toFixed(2)}</div>}
              </div>
            </div>

            <div>
              <div style={{ background: '#f8fafc', borderRadius: 10, padding: '16px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: '#334155' }}>Order Summary</h3>
                {cart.map(item => {
                  const p = products.find(pr => pr.id === item.productId);
                  if (!p) return null;
                  return (
                    <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: '#64748b' }}>{p.name} × {item.qty}</span>
                      <span>${(p.price * item.qty).toFixed(2)}</span>
                    </div>
                  );
                })}
                {cart.length === 0 && <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8 }}>No items in cart</div>}
                <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: '#64748b' }}>Tax (8%)</span><span>${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4, color: '#16a34a' }}>
                      <span>Promo Discount</span><span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 800, color: '#1e40af', marginTop: 4 }}>
                    <span>Total</span><span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={placeOrder} style={{
                  width: '100%', marginTop: 14, padding: '11px', background: '#1e40af', color: '#fff',
                  border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Place Order →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success page */}
      {page === 'success' && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
          <h2 style={{ color: '#16a34a', marginBottom: 8 }}>Order Confirmed!</h2>
          <p style={{ color: '#64748b', fontSize: 13 }}>Order #SN-{Math.floor(Math.random() * 90000) + 10000} has been placed.</p>
          <button onClick={() => { setPage('shop'); setCart([]); setForm({ name: '', email: '', address: '', promo: '', promoApplied: false, promoDiscount: 0 }); setErrors({}); }} style={{
            marginTop: 16, padding: '10px 24px', background: '#1e40af', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, cursor: 'pointer',
          }}>Continue Shopping</button>
        </div>
      )}
    </div>
  );
}
