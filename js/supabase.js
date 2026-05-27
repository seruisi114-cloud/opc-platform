// supabase.js - Supabase Auth + Database Client
const SUPABASE_URL = 'https://oajxwvtkvxgijxchypkq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ2Mjc1MTMzLCJleHAiOjE5NjE4MzY1MzN9.8RHl0rVi65M55wAAMUrz3vCYxcnmj9q6aAAqp3SyD6s';

const { createClient } = window.supabase || { createClient: () => { throw new Error('supabase.js not loaded'); } };

let supabase = null;

function initSupabase() {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
}

function getSupabase() {
  if (!supabase) initSupabase();
  return supabase;
}

// ===== AUTH =====
async function signUp(email, password, username) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({ email, password });
  if (error) return { error };

  const user = data.user;
  if (user) {
    // Auto-create profile
    const { error: profileError } = await sb.from('profiles').insert({
      id: user.id,
      username: username || email.split('@')[0],
      account_type: 'personal'
    });
    if (profileError) console.warn('Profile auto-create failed:', profileError.message);
  }
  return { data, error };
}

async function signIn(email, password) {
  const sb = getSupabase();
  return sb.auth.signInWithPassword({ email, password });
}

async function signOut() {
  const sb = getSupabase();
  const { error } = await sb.auth.signOut();
  if (!error) updateNav();
  return { error };
}

async function isLoggedIn() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  return !!session;
}

async function getCurrentUser() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getSession();
  return user;
}

async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    if (confirm('登录后可用，是否前往登录？')) {
      location.href = 'login.html';
    }
    return null;
  }
  return user;
}

// ===== DATABASE =====
async function getProfile(userId) {
  const sb = getSupabase();
  const { data, error } = await sb.from('profiles').select('*').eq('id', userId).single();
  return { data, error };
}

async function updateProfile(userId, updates) {
  const sb = getSupabase();
  return sb.from('profiles').update(updates).eq('id', userId);
}

async function fetchTasks(filters = {}) {
  const sb = getSupabase();
  let q = sb.from('tasks').select('*').order('created_at', { ascending: false });
  if (filters.category) q = q.eq('category', filters.category);
  if (filters.status) q = q.eq('status', filters.status);
  if (filters.client_id) q = q.eq('client_id', filters.client_id);
  const { data, error } = await q;
  return { data: data || [], error };
}

async function fetchOPCs(filters = {}) {
  const sb = getSupabase();
  let q = sb.from('profiles').select('*');
  if (filters.account_type) q = q.eq('account_type', 'enterprise');
  const { data, error } = await sb.from('profiles').select('*');
  return { data: data || [], error };
}

async function insertTask(taskData) {
  const sb = getSupabase();
  const user = await getCurrentUser();
  if (!user) return { error: { message: 'Not logged in' } };
  return sb.from('tasks').insert({ ...taskData, client_id: user.id });
}

async function fetchBids(taskId) {
  const sb = getSupabase();
  const { data, error } = await sb.from('bids').select('*').eq('task_id', taskId);
  return { data: data || [], error };
}

async function insertBid(bidData) {
  const sb = getSupabase();
  const user = await getCurrentUser();
  if (!user) return { error: { message: 'Not logged in' } };
  return sb.from('bids').insert({ ...bidData, opc_id: user.id });
}

async function fetchMessages(taskId) {
  const sb = getSupabase();
  const { data, error } = await sb.from('messages').select('*').eq('task_id', taskId).order('created_at');
  return { data: data || [], error };
}

async function insertMessage(taskId, content) {
  const sb = getSupabase();
  const user = await getCurrentUser();
  if (!user) return { error: { message: 'Not logged in' } };
  return sb.from('messages').insert({ task_id: taskId, sender_id: user.id, content });
}

// ===== NAV UPDATE =====
async function updateNav() {
  const sb = getSupabase();
  const { data: { session } } = await sb.auth.getSession();
  const user = session?.user;
  const navUser = document.querySelector('.nav-user');
  if (!navUser) return;

  if (user) {
    const { data: profile } = await sb.from('profiles').select('username').eq('id', user.id).single();
    const name = profile?.username || user.email?.split('@')[0] || '我';
    navUser.innerHTML = `
      <div class="nav-username">${name}</div>
      <div class="avatar" style="background:var(--primary);cursor:pointer;" onclick="handleAvatarClick()">${name[0].toUpperCase()}</div>
    `;
    window.CURRENT_USER = user;
    window.CURRENT_PROFILE = profile;
  } else {
    navUser.innerHTML = `<div class="avatar" onclick="location.href='login.html'" style="cursor:pointer;">访</div>`;
    window.CURRENT_USER = null;
    window.CURRENT_PROFILE = null;
  }
}

function handleAvatarClick() {
  if (confirm('是否退出登录？')) {
    signOut();
  }
}

// ===== AUTH STATE LISTENER =====
function initAuthListener() {
  const sb = getSupabase();
  sb.auth.onAuthStateChange((event, session) => {
    updateNav();
  });
}

// ===== INIT ON LOAD =====
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  initAuthListener();
  updateNav();
});