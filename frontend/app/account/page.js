'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/useAuth';

export default function AccountPage() {
  const [needsLogin, setNeedsLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ name: '', phone: '' });
  const [profileStatus, setProfileStatus] = useState('idle');

  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ label: 'Home', street: '', city: '', state: '', pincode: '' });
  const [addressStatus, setAddressStatus] = useState('idle');

  useEffect(() => {
    if (!getToken()) {
      setNeedsLogin(true);
      return;
    }
    api
      .get('/auth/me')
      .then(({ data }) => {
        setUser(data.user);
        setProfile({ name: data.user.name || '', phone: data.user.phone || '' });
        setAddresses(data.user.addresses || []);
      })
      .catch(() => setNeedsLogin(true));
  }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setProfileStatus('saving');
    try {
      await api.patch('/auth/me', profile);
      setProfileStatus('saved');
    } catch {
      setProfileStatus('error');
    }
  }

  async function addAddress(e) {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.pincode) return;
    setAddressStatus('saving');
    try {
      const { data } = await api.post('/auth/me/addresses', newAddress);
      setAddresses(data.addresses);
      setNewAddress({ label: 'Home', street: '', city: '', state: '', pincode: '' });
      setAddressStatus('idle');
    } catch {
      setAddressStatus('error');
    }
  }

  async function makeDefault(id) {
    const { data } = await api.patch(`/auth/me/addresses/${id}`);
    setAddresses(data.addresses);
  }

  async function removeAddress(id) {
    const { data } = await api.delete(`/auth/me/addresses/${id}`);
    setAddresses(data.addresses);
  }

  if (needsLogin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-serif text-2xl text-ink">Log in to manage your account</h1>
        <a href="/login" className="mt-6 inline-block h-11 rounded-full bg-cta px-6 leading-[44px] text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep">
          Log in
        </a>
      </div>
    );
  }

  if (!user) {
    return <div className="mx-auto max-w-2xl px-4 py-20 text-center text-muted">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 md:px-8">
      <h1 className="font-serif text-3xl text-ink">Your account</h1>

      <section className="mt-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Update Profile</h2>
        <form onSubmit={saveProfile} className="mt-4 space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Name</label>
            <input className="input-underline" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Email</label>
            <input className="input-underline text-muted" value={user.email} disabled />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Phone</label>
            <input
              className="input-underline"
              maxLength={10}
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
            />
          </div>
          <button className="h-11 rounded-full bg-cta px-6 text-sm font-bold uppercase tracking-wide text-ink hover:bg-cta-deep">
            {profileStatus === 'saving' ? 'Saving…' : 'Save changes'}
          </button>
          {profileStatus === 'saved' && <p className="text-sm text-success">Saved.</p>}
        </form>
      </section>

      <section id="addresses" className="mt-14 border-t border-line pt-10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Saved Addresses</h2>

        <div className="mt-4 space-y-3">
          {addresses.map((a) => (
            <div key={a._id} className={`rounded-xl border p-4 ${a.isDefault ? 'border-emerald' : 'border-line'}`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-ink">
                  {a.label || 'Address'} {a.isDefault && <span className="ml-2 rounded-full bg-emerald/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald">Default</span>}
                </span>
                <div className="flex gap-3 text-xs font-semibold">
                  {!a.isDefault && (
                    <button onClick={() => makeDefault(a._id)} className="text-emerald underline">Set default</button>
                  )}
                  <button onClick={() => removeAddress(a._id)} className="text-sale underline">Remove</button>
                </div>
              </div>
              <p className="mt-1 text-sm text-muted">{a.street}, {a.city}, {a.state} — {a.pincode}</p>
            </div>
          ))}
          {addresses.length === 0 && <p className="text-sm text-muted">No saved addresses yet.</p>}
        </div>

        <form onSubmit={addAddress} className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-line p-5">
          <div className="col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Label</label>
            <input className="input-underline" value={newAddress.label} onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Street</label>
            <input className="input-underline" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">City</label>
            <input className="input-underline" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted">Pincode</label>
            <input className="input-underline" maxLength={6} value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })} />
          </div>
          <div className="col-span-2">
            <label className="text-xs font-bold uppercase tracking-widest text-muted">State</label>
            <input className="input-underline" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
          </div>
          <button className="col-span-2 mt-2 h-11 rounded-full border border-ink text-sm font-bold uppercase tracking-wide text-ink">
            {addressStatus === 'saving' ? 'Adding…' : '+ Add address'}
          </button>
        </form>
      </section>
    </div>
  );
}
