// ===== SHARED DATA & LOGIC =====

const OPC_DATA_KEY = 'opc_platform_data';

function getDefaultData() {
  return {
    opcs: [
      {
        id: 1, name: '张明', title: '资深品牌设计师', category: '设计',
        avatarClass: 'design', online: true,
        rating: 4.9, orders: 47, rate: 0.94,
        avgDeal: 2100, minDeal: 500,
        bio: '8年品牌设计经验，擅长Logo、VI系统、UI界面设计。曾服务过10+知名品牌，客户满意率94%。',
        services: ['Logo设计', 'VI系统', 'UI设计', '海报包装'],
        tags: ['可海外合作', '可加急'],
        reviews: '“非常专业，交付快，沟通顺畅，下次还合作！”'
      },
      {
        id: 2, name: '王浩', title: '全栈工程师', category: '开发',
        avatarClass: 'dev', online: true,
        rating: 4.7, orders: 32, rate: 0.91,
        avgDeal: 4500, minDeal: 1000,
        bio: '专注Web全栈开发，React/Vue/Node.js均可。擅长REST API、数据库设计、前端优化。',
        services: ['网站开发', '小程序', 'REST API', '数据库'],
        tags: ['可团队协作', '可长期'],
        reviews: '技术扎实，能独立思考，代码质量很高。'
      },
      {
        id: 3, name: '陈思', title: '资深文案策划', category: '文案',
        avatarClass: 'copywriting', online: false,
        rating: 4.8, orders: 63, rate: 0.97,
        avgDeal: 800, minDeal: 200,
        bio: '5年品牌文案经验，擅长公众号、产品文案、品牌故事。洞察用户心理，文字有温度。',
        services: ['公众号文案', '品牌故事', '产品介绍', '营销文案'],
        tags: ['可出系列', '可加急'],
        reviews: '文字功底深厚，完全超出预期！'
      },
      {
        id: 4, name: '刘洋', title: '视频动画制作人', category: '视频动画',
        avatarClass: 'video', online: true,
        rating: 4.6, orders: 21, rate: 0.88,
        avgDeal: 3500, minDeal: 1500,
        bio: '专注短视频、动画、广告片制作。熟练使用AE/PR/达芬奇，为多个品牌制作过年销千万的短视频。',
        services: ['短视频', '宣传片', '动画', '剪辑调色'],
        tags: ['可团队协作'],
        reviews: '创意足，执行力强，画面质感很好。'
      },
      {
        id: 5, name: '周婷', title: '数字营销专家', category: '营销',
        avatarClass: 'marketing', online: true,
        rating: 4.9, orders: 38, rate: 0.95,
        avgDeal: 3000, minDeal: 800,
        bio: '擅长SEO/SEM/信息流广告投放，ROI平均1:5以上。同时提供私域流量搭建和运营方案。',
        services: ['广告投放', '私域运营', 'SEO优化', '营销策划'],
        tags: ['可数据驱动', '可长期'],
        reviews: '投放思路清晰，数据说话，值得信赖。'
      },
      {
        id: 6, name: '林晓峰', title: '音频制作人', category: '音频配音',
        avatarClass: 'voice', online: false,
        rating: 4.5, orders: 15, rate: 0.93,
        avgDeal: 1200, minDeal: 300,
        bio: '专业配音演员出身，音色温暖有磁性。同时提供背景音乐制作、音频后期混音服务。',
        services: ['配音', '音频后期', '背景音乐', '音效设计'],
        tags: ['可加急', '可多角色'],
        reviews: '声音很有感染力，合作很愉快！'
      }
    ],
    tasks: [
      {
        id: 1, title: '帮我设计一个简约风格的App图标',
        desc: '需要简约现代风格，用于一款健身App，主要颜色希望是橙色和深灰。要求提供多尺寸源文件。',
        category: '设计', type: 'short', price: 800, deposit: 40,
        time: '10分钟前', views: 23,
        standards: '1. 1024x1024 PNG源文件\n2. 提供3个不同配色版本\n3. 含扁平化和拟物化两个方向\n4. 附设计说明',
        escrowStep: 1, status: 'published', delivery: null
      },
      {
        id: 2, title: '写一篇关于AI时代的公众号推文',
        desc: '需要一篇1500字左右的深度推文，主题是AI时代年轻人的职业选择，有深度有温度。',
        category: '文案', type: 'short', price: 500, deposit: 25,
        time: '1小时前', views: 45,
        standards: '1. 1500字左右\n2. 标题吸引人\n3. 有3个以上小标题\n4. 结尾有互动引导',
        escrowStep: 1, status: 'published', delivery: null
      },
      {
        id: 3, title: '搭建一个Node.js REST API',
        desc: '需要搭建用户管理REST API，包含注册、登录、信息查询、修改功能。使用Express+MongoDB。',
        category: '开发', type: 'long', price: 3500, deposit: 100,
        time: '2小时前', views: 67,
        standards: '1. API完整可运行\n2. 完整接口文档\n3. 含JWT鉴权\n4. 含基本单元测试',
        escrowStep: 0, status: 'published', delivery: null
      },
      {
        id: 4, title: '制作一条30秒产品宣传动画',
        desc: '为智能手表产品制作30秒宣传动画，风格偏科技感，用于社交媒体投放。',
        category: '视频动画', type: 'short', price: 2000, deposit: 100,
        time: '3小时前', views: 89,
        standards: '1. 30秒成片\n2. 1920x1080 MP4格式\n3. 提供原始工程文件\n4. 配乐需有版权',
        escrowStep: 3, status: 'in_progress', delivery: 'video_final.mp4'
      }
    ],
    myPublished: [],
    myAccepted: [],
    chatMessages: [
      { role: 'user', text: '你好，看了你之前的Logo作品，很感兴趣，能聊聊吗？', time: '14:30' },
      { role: 'opc', text: '你好！谢谢认可，完全可以聊。请问你有什么具体需求吗？', time: '14:32' },
      { role: 'user', text: '想做一个健身App的图标，橙深灰配色，简约现代风格。', time: '14:35' },
      { role: 'opc', text: '收到！简约健身风格我很擅长。我先出3个方向概念稿，确认后深入。报价800元，含3版方案+源文件，诚意金40元。', time: '14:37' },
      { role: 'opc', text: '平台托管交易，满意再付款，资金安全有保障。什么时候方便开始？', time: '14:38' }
    ],
    evalScores: {}
  };
}

function getData() {
  try {
    const raw = localStorage.getItem(OPC_DATA_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  const d = getDefaultData();
  saveData(d);
  return d;
}

function saveData(data) {
  try {
    localStorage.setItem(OPC_DATA_KEY, JSON.stringify(data));
  } catch(e) {}
}

function resetData() {
  localStorage.removeItem(OPC_DATA_KEY);
  location.reload();
}

// ===== NOTIF =====
function showNotif(msg, type) {
  let el = document.getElementById('notif');
  if (!el) {
    el = document.createElement('div');
    el.id = 'notif';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.className = 'notif show ' + (type || '');
  setTimeout(() => el.classList.remove('show'), 3000);
}

// ===== FILTER TAG TOGGLE =====
function toggleTag(el) { el.classList.toggle('selected'); }

// ===== ESCROW STEP RENDERING =====
function renderEscrowStatus(containerId, step) {
  const steps = [
    '需求方付款托管',
    'OPC 开始工作',
    '提交交付物',
    '验收确认',
    '资金释放给 OPC'
  ];
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = steps.map((label, i) => {
    let cls = 'escrow-step';
    if (i < step) cls += ' done';
    else if (i === step) cls += ' active';
    const icon = i < step ? '✓' : (i + 1);
    return `<div class="${cls}"><div class="icon">${icon}</div><span>${label}</span></div>`;
  }).join('');
}

// ===== TASK CARD HTML =====
function taskCardHTML(t) {
  return `
    <div class="task-card" onclick="location.href='task-detail.html?id=${t.id}'">
      <div class="task-top">
        <div class="task-title">${t.title}</div>
        <div class="task-price">¥${t.price}</div>
      </div>
      <div class="task-desc">${t.desc}</div>
      <div class="task-meta">
        <span>📁 ${t.category}</span><span>👁 ${t.views}</span><span>⏰ ${t.time}</span>
      </div>
      <div class="task-tags">
        <span class="tag ${t.type==='short'?'tag-blue':'tag-green'}">${t.type==='short'?'短期':'长期'}</span>
        <span class="tag tag-blue">${t.status==='published'?'可承接':'进行中'}</span>
      </div>
    </div>
  `;
}

// ===== OPC CARD HTML =====
function opcCardHTML(o) {
  return `
    <div class="opc-card" onclick="location.href='opc-detail.html?id=${o.id}'">
      <div class="opc-header">
        <div class="opc-avatar ${o.avatarClass}">${o.name[0]}</div>
        <div>
          <div class="opc-name">${o.name}</div>
          <div class="opc-title">${o.title}</div>
          <div style="margin-top:4px;" class="opc-stars">${'★'.repeat(Math.round(o.rating))}${o.rating}</div>
        </div>
      </div>
      <div class="opc-stats">
        <div class="opc-stat"><div class="opc-stat-val">${o.orders}</div><div class="opc-stat-label">成交次数</div></div>
        <div class="opc-stat"><div class="opc-stat-val" style="color:var(--success);">${Math.round(o.rate*100)}%</div><div class="opc-stat-label">成交率</div></div>
        <div class="opc-stat"><div class="opc-stat-val">¥${o.avgDeal}</div><div class="opc-stat-label">平均成交</div></div>
      </div>
      <div class="opc-tags">
        ${o.tags.map(t => `<span class="tag tag-blue">${t}</span>`).join('')}
        ${o.online
          ? `<span class="tag" style="background:#DCFCE7;color:#166534;">● 在线</span>`
          : `<span class="tag" style="background:#F3F4F6;color:#6B7280;">● 离线</span>`}
      </div>
      <div class="opc-card-actions">
        <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); location.href='chat.html'">💬 发起合作</button>
        <button class="btn btn-outline btn-sm" onclick="event.stopPropagation(); location.href='opc-detail.html?id=${o.id}'">查看主页</button>
      </div>
    </div>
  `;
}

// ===== STARS =====
function setStar(el, field, score) {
  el.parentElement.querySelectorAll('span').forEach((s, i) => s.classList.toggle('active', i < score));
  const data = getData();
  data.evalScores[field] = score;
  saveData(data);
}

// ===== PUBLISH MODAL =====
function openPublishModal() {
  document.getElementById('publish-modal').classList.remove('hidden');
}
function closePublishModal() {
  document.getElementById('publish-modal').classList.add('hidden');
}
function publishTask() {
  const title = document.getElementById('pub-title').value.trim();
  if (!title) { showNotif('请填写任务标题', 'error'); return; }
  const data = getData();
  const price = parseInt(document.getElementById('pub-price').value) || 0;
  const newTask = {
    id: Date.now(),
    title,
    desc: document.getElementById('pub-desc').value,
    category: document.getElementById('pub-category').value,
    type: document.getElementById('pub-type').value,
    price,
    deposit: Math.min(100, Math.round(price * 0.05)),
    time: '刚刚', views: 0,
    standards: document.getElementById('pub-standards').value,
    escrowStep: 0, status: 'published', delivery: null
  };
  data.tasks.unshift(newTask);
  data.myPublished.unshift(newTask);
  saveData(data);
  closePublishModal();
  showNotif('任务发布成功！等待 OPC 承接', 'success');
  setTimeout(() => location.reload(), 1500);
}

// ===== GET URL PARAMS =====
function getParam(name) {
  const params = new URLSearchParams(location.search);
  return params.get(name);
}
