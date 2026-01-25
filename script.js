// --- DATABASE & INITIAL DATA ---
const defaultCatalog = [
    { 
        id: 1, name: "Padi Sawah", cat: "Pangan", days: 120, price: 12000, icon: "🌾",
        desc: "Tanaman pangan utama Indonesia, membutuhkan genangan air di fase awal.",
        schedule: [
            {hst: 0, task: "Tanam Benih"}, {hst: 15, task: "Pemupukan I (Urea)"}, 
            {hst: 30, task: "Pemupukan II (NPK)"}, {hst: 45, task: "Pemupukan III (KCl)"}, 
            {hst: 120, task: "Panen"}
        ], 
        seeds: 200, npk: {n: 150, p: 50, k: 100}, pupuk: {u: 0.1, tsp: 0.05, kcl: 0.05}
    },
    { 
        id: 2, name: "Jagung Manis", cat: "Pangan", days: 75, price: 8000, icon: "🌽",
        desc: "Tanaman serealia cepat panen, membutuhkan sinar matahari penuh.",
        schedule: [
            {hst: 0, task: "Tanam Benih"}, {hst: 20, task: "Pemupukan (NPK)"}, 
            {hst: 40, task: "Pemupukan Susulan (Urea)"}, {hst: 75, task: "Panen"}
        ], 
        seeds: 0.2, npk: {n: 200, p: 70, k: 100}, pupuk: {u: 0.15, tsp: 0.05, kcl: 0.1}
    },
    { 
        id: 3, name: "Cabai Rawit", cat: "Sayur", days: 90, price: 45000, icon: "🌶️",
        desc: "Komoditas hortik bernilai tinggi, rentan terhadap penyakit busuk buah.",
        schedule: [
            {hst: 0, task: "Tanam Bibit"}, {hst: 15, task: "Pemupukan Dasar"}, 
            {hst: 30, task: "Perawatan & Semprot Hama"}, {hst: 60, task: "Pembungaan"}, 
            {hst: 90, task: "Panen"}
        ], 
        seeds: 0.1, npk: {n: 250, p: 80, k: 150}, pupuk: {u: 0.1, tsp: 0.05, kcl: 0.15}
    },
    { 
        id: 4, name: "Tomat", cat: "Sayur", days: 100, price: 10000, icon: "🍅",
        desc: "Sayuran buah kaya vitamin, butuh ajir penyangga agar batang tidak patah.",
        schedule: [
            {hst: 0, task: "Tanam & Pasang Ajir"}, {hst: 20, task: "Pemupukan & Sulur"}, 
            {hst: 50, task: "Pemupukan Bunga"}, {hst: 100, task: "Panen Merah"}
        ], 
        seeds: 0.1, npk: {n: 200, p: 60, k: 120}, pupuk: {u: 0.1, tsp: 0.05, kcl: 0.12}
    },
    { 
        id: 5, name: "Sawi Sendok", cat: "Sayur", days: 35, price: 15000, icon: "🥬",
        desc: "Sayuran daun cepat panen, cocok untuk dataran tinggi.",
        schedule: [
            {hst: 0, task: "Tabur Benih"}, {hst: 10, task: "Penjarangan"}, 
            {hst: 20, task: "Pemupukan N"}, {hst: 35, task: "Panen"}
        ], 
        seeds: 0.15, npk: {n: 120, p: 40, k: 80}, pupuk: {u: 0.08, tsp: 0.03, kcl: 0.05}
    },
    { 
        id: 6, name: "Wortel", cat: "Sayur", days: 90, price: 12000, icon: "🥕",
        desc: "Akar umbi sehat, tanah harus gembur dan bebas batu.",
        schedule: [
            {hst: 0, task: "Tabur Benih (Halus)"}, {hst: 15, task: "Penjarangan"}, 
            {hst: 30, task: "Pemupukan N"}, {hst: 90, task: "Cubit Umbi"}
        ], 
        seeds: 0.2, npk: {n: 150, p: 50, k: 100}, pupuk: {u: 0.08, tsp: 0.05, kcl: 0.08}
    }
];

let data = JSON.parse(localStorage.getItem('agriMasterPro_v6_topnav')) || {
    wallet: 0,
    catalog: defaultCatalog,
    fields: [],
    harvests: [],
    expenses: 0,
    theme: 'dark',
    blogUrl: '', // Fitur Baru Blog
    blogKeywords: 'pertanian, tani, sawah, panen' // Fitur Baru Filter
};

let currentFieldId = null;

// --- SAVE FUNCTION ---
function save() { localStorage.setItem('agriMasterPro_v6_topnav', JSON.stringify(data)); }

// --- NAVIGATION ---
const nav = {
    to: (view) => {
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const targetView = document.getElementById('view-' + view);
        const targetNav = document.getElementById('nav-' + view);
        
        if(targetView) targetView.classList.add('active');
        if(targetNav) targetNav.classList.add('active');

        if(view === 'dashboard') app.renderDashboard();
        if(view === 'alat') tools.init();
        if(view === 'blog') blog.fetch(); // Panggil blog saat masuk menu blog
    }
};

const modal = {
    open: (id) => document.getElementById(id).classList.add('active'),
    close: () => document.querySelectorAll('.modal').forEach(el => el.classList.remove('active'))
};

// --- APP LOGIC ---
const app = {
    init: () => {
        // 1. Setup Dasar (Setiap Kali Load)
        document.documentElement.setAttribute('data-theme', data.theme || 'dark');
        tools.init();
        app.refresh();
        document.getElementById('f-date').valueAsDate = new Date();

        // 2. Setup Input Blog (Anti-Duplikat Event)
        const blogUrlInput = document.getElementById('setting-blog-url');
        if(blogUrlInput) {
            blogUrlInput.value = data.blogUrl || '';
            blogUrlInput.onclick = function() {
                data.blogUrl = this.value;
                save();
            };
        }

        const blogKeyInput = document.getElementById('setting-blog-keywords');
        if(blogKeyInput) {
            blogKeyInput.value = data.blogKeywords || '';
            blogKeyInput.onclick = function() {
                data.blogKeywords = this.value;
                save();
            };
        }

        // 3. Cek First Run (Hanya Sekali)
        if (!localStorage.getItem('agri_master_v6_first_run')) {
            // Anda bisa menambahkan alert("Selamat Datang...") di sini jika mau
            console.log("App first run detected.");
            localStorage.setItem('agri_master_v6_first_run', 'true');
        }
    },

    toggleTheme: () => {
        data.theme = data.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', data.theme);
        save();
    },

    refresh: () => {
        app.renderDashboard();
        app.renderFields();
        catalog.render();
        document.getElementById('wallet-balance').innerText = data.wallet.toLocaleString('id-ID');
    },

    renderDashboard: () => {
        const activeFields = data.fields.filter(f => f.status === 'active').length;
        document.getElementById('dash-fields').innerText = activeFields;
        document.getElementById('dash-harvests').innerText = data.harvests.length;
        
        let totalExpense = 0;
        data.fields.forEach(f => totalExpense += (f.cost || 0));
        document.getElementById('dash-expense').innerText = 'Rp ' + totalExpense.toLocaleString('id-ID');

        // Active Fields List (Top 3)
        const dashFields = document.getElementById('dashboard-fields');
        dashFields.innerHTML = '';
        const active = data.fields.filter(f => f.status === 'active').slice(0, 3);
        
        if(active.length === 0) {
            dashFields.innerHTML = '<p style="text-align:center; color:#999; padding:10px;">Belum ada lahan aktif</p>';
        } else {
            active.forEach(f => {
                const start = new Date(f.datePlanted);
                const now = new Date();
                const diff = Math.ceil(Math.abs(now - start) / (1000 * 60 * 60 * 24));
                const pct = Math.min(100, Math.round((diff / f.days) * 100));
                
                dashFields.innerHTML += `
                    <div class="list-row" onclick="app.openDetail(${f.id})">
                        <div class="icon-box">${f.plantIcon}</div>
                        <div class="text-box">
                            <div class="title">${f.name}</div>
                            <div class="sub">${f.plantName} • ${diff} HST</div>
                            <div class="progress-track">
                                <div class="progress-fill" style="width: ${pct}%"></div>
                            </div>
                        </div>
                        <span class="badge ${pct >= 90 ? 'warning' : 'active'}">${pct}%</span>
                    </div>
                `;
            });
        }

        // Activity Feed
        const feed = document.getElementById('activity-feed');
        feed.innerHTML = '';
        const recentActivities = [
            ...data.harvests.map(h => ({...h, type: 'harvest'})),
            ...data.fields.filter(f => f.status === 'active').map(f => ({type: 'field', name: f.name, date: f.datePlanted}))
        ]
        .sort((a,b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

        if(recentActivities.length === 0) {
            feed.innerHTML = '<p style="text-align:center; color:#999; font-size:0.8rem;">Belum ada aktivitas.</p>';
        } else {
            recentActivities.forEach(act => {
                if(act.type === 'harvest') {
                    feed.innerHTML += `
                        <div class="list-row">
                            <div class="icon-box" style="background:rgba(39, 174, 96, 0.1);">💰</div>
                            <div class="text-box">
                                <div class="title">Panen ${act.plant}</div>
                                <div class="sub">${act.date} • ${act.amount} Kg</div>
                            </div>
                            <span style="font-size:0.8rem; font-weight:bold; color:var(--success);">+${act.income}</span>
                        </div>`;
                } else {
                    feed.innerHTML += `
                        <div class="list-row">
                            <div class="icon-box" style="background:rgba(46, 125, 50, 0.1);">🌱</div>
                            <div class="text-box">
                                <div class="title">Lahan ${act.name} dibuat</div>
                                <div class="sub">${act.date}</div>
                            </div>
                        </div>`;
                }
            });
        }
    },

    renderFields: () => {
        const list = document.getElementById('fields-list');
        list.innerHTML = '';
        const active = data.fields.filter(f => f.status === 'active');

        if(active.length === 0) {
            list.innerHTML = '<p style="text-align:center; padding:20px; color:#999;">Tidak ada lahan aktif. Buat lahan baru untuk memulai.</p>';
            return;
        }

        active.forEach(f => {
            const start = new Date(f.datePlanted);
            const now = new Date();
            const diff = Math.ceil(Math.abs(now - start) / (1000 * 60 * 60 * 24));
            const pct = Math.min(100, Math.round((diff / f.days) * 100));

            list.innerHTML += `
                <div class="card" onclick="app.openDetail(${f.id})">
                    <div class="card-title">
                        <span>${f.plantIcon} ${f.name}</span>
                        <span class="badge ${pct >= 90 ? 'warning' : 'active'}">${pct}%</span>
                    </div>
                    <div class="sub">${f.plantName} • ${f.area} m² • ${diff} HST</div>
                    <div class="sub">Biaya: Rp ${(f.cost || 0).toLocaleString('id-ID')}</div>
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${pct}%"></div>
                    </div>
                </div>
            `;
        });
    },

    populatePlantSelect: () => {
        const sel = document.getElementById('f-plant');
        sel.innerHTML = '';
        data.catalog.forEach(p => sel.innerHTML += `<option value="${p.id}">${p.name}</option>`);
    },

    addField: () => {
        const name = document.getElementById('f-name').value;
        const pid = document.getElementById('f-plant').value;
        const date = document.getElementById('f-date').value;
        const area = document.getElementById('f-area').value;
        const type = document.getElementById('f-type').value;
        const cost = document.getElementById('f-cost').value;
        
        if(!name || !date || !area) return;
        const p = data.catalog.find(x=>x.id==pid);
        
        data.fields.push({
            id: Date.now(),
            name,
            plantId: pid,
            plantName: p.name,
            plantIcon: p.icon,
            days: p.days,
            price: p.price,
            datePlanted: date,
            area,
            type,
            cost: parseInt(cost || 0),
            status: 'active',
            tasks: [
                { id: 1, text: 'Penyiapan lahan dan pengolahan tanah', done: false },
                { id: 2, text: 'Penanaman bibit/benih', done: true },
                { id: 3, text: 'Penyiraman rutin', done: false },
                { id: 4, text: 'Pemupukan pertama', done: false }
            ]
        });

        data.expenses += parseInt(cost) || 0;
        save();
        modal.close();
        app.refresh();
    },

    addPlant: () => {
        const name = document.getElementById('p-name').value;
        const price = document.getElementById('p-price').value;
        const days = document.getElementById('p-days').value;
        const seeds = document.getElementById('p-seeds').value;
        const cat = document.getElementById('p-cat').value;

        if(!name || !price) { alert('Lengkapi data!'); return; }

        data.catalog.push({
            id: Date.now(),
            name,
            price: parseInt(price),
            days: parseInt(days),
            seeds: parseFloat(seeds) || 0.1,
            cat,
            icon: cat === 'Pohon' ? '🌳' : cat === 'Buah' ? '🍎' : cat === 'Sayur' ? '🥬' : '🌾',
            desc: "Tanaman custom yang ditambahkan pengguna",
            schedule: [
                {hst: 0, task: "Persiapan Lahan & Tanam"},
                {hst: Math.floor(parseInt(days)/3), task: "Pemupukan Pertama"},
                {hst: Math.floor(parseInt(days)*2/3), task: "Perawatan & Pengendalian Hama"},
                {hst: parseInt(days), task: "Panen"}
            ],
            npk: {n: 150, p: 50, k: 100},
            pupuk: {u: 0.1, tsp: 0.05, kcl: 0.05}
        });

        save();
        modal.close();
        catalog.render();
        alert('Tanaman berhasil ditambahkan!');
    },

    openDetail: (fid) => {
        currentFieldId = fid;
        const f = data.fields.find(x=>x.id===fid);
        const p = data.catalog.find(x=>x.id==f.plantId);
        
        const start = new Date(f.datePlanted);
        const now = new Date();
        const age = Math.ceil(Math.abs(now - start) / (1000 * 60 * 60 * 24));

        document.getElementById('detail-header').innerHTML = `
            <h2>${f.plantIcon} ${f.name}</h2>
            <p class="sub">${f.plantName} - ${f.area} m²</p>
            <p class="sub">Tanggal Tanam: ${f.datePlanted} • Umur: <strong style="color:var(--primary); font-size:1.1rem;">${age} HST</strong></p>
        `;

        const tlContainer = document.getElementById('d-timeline');
        tlContainer.innerHTML = '';
        if(p.schedule) {
            p.schedule.forEach((item, idx) => {
                let statusClass = 'future';
                if(age >= item.hst) statusClass = 'done';
                else if(idx > 0 && age < item.hst && age >= p.schedule[idx-1].hst) statusClass = 'active';
                
                const el = document.createElement('div');
                el.className = `timeline-item ${statusClass}`;
                el.innerHTML = `
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="t-title">${item.task}</div>
                        <div class="t-hst">${item.hst} HST</div>
                    </div>
                `;
                tlContainer.appendChild(el);
            });
        } else {
            tlContainer.innerHTML = '<p style="font-size:0.8rem; color:#999;">Tidak ada jadwal bawaan.</p>';
        }

        app.renderTasks(f.tasks);
        modal.open('modal-detail');
    },

    renderTasks: (tasks) => {
        const container = document.getElementById('task-list');
        container.innerHTML = '';
        tasks.forEach((t, idx) => {
            container.innerHTML += `
                <div class="task-item ${t.done ? 'done' : ''}" onclick="app.toggleTask(${idx})">
                    <div class="checkbox ${t.done ? 'checked' : ''}"></div>
                    <span>${t.text}</span>
                </div>
            `;
        });
    },

    addTask: () => {
        const input = document.getElementById('new-task-input');
        if(!input.value) return;
        const f = data.fields.find(x=>x.id===currentFieldId);
        f.tasks.push({ id: Date.now(), text: input.value, done: false });
        input.value = '';
        save();
        app.openDetail(currentFieldId);
    },

    toggleTask: (idx) => {
        const f = data.fields.find(x=>x.id===currentFieldId);
        f.tasks[idx].done = !f.tasks[idx].done;
        save();
        app.openDetail(currentFieldId);
    },

    initHarvest: () => {
        const f = data.fields.find(x=>x.id===currentFieldId);
        const amount = prompt(`Masukkan jumlah hasil panen ${f.plantName} (Kg):`, "100");
        if(!amount || isNaN(amount)) return;
        
        const income = amount * f.price;
        
        if(confirm(`Estimasi Pendapatan: Rp ${income.toLocaleString('id-ID')}\nLanjutkan panen?`)) {
            f.status = 'harvested';
            data.wallet += parseInt(income);
            
            data.harvests.unshift({
                id: Date.now(),
                date: new Date().toISOString().split('T')[0],
                plant: f.plantName,
                amount: parseFloat(amount),
                income: income,
                fieldId: f.id
            });

            save();
            modal.close();
            alert("✅ Panen Tercatat! Saldo bertambah.");
        }
    },

    resetApp: () => {
        if(confirm("⚠️ PERINGATAN: Semua data akan dihapus permanen!\n\nData lahan, panen, dan kustomisasi akan hilang.\nYakin ingin reset?")) {
            localStorage.clear();
            location.reload();
        }
    }
};

// --- CATALOG LOGIC ---
const catalog = {
    render: () => {
        const term = document.getElementById('search-catalog').value.toLowerCase();
        const list = document.getElementById('catalog-list');
        list.innerHTML = '';
        
        const filtered = data.catalog.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.cat.toLowerCase().includes(term)
        );

        if(filtered.length === 0) {
            list.innerHTML = '<p style="text-align:center; padding:20px; color:#999;">Tanaman tidak ditemukan</p>';
            return;
        }

        filtered.forEach(p => {
            list.innerHTML += `
                <div class="card" onclick="catalog.showInfo(${p.id})">
                    <div class="list-row">
                        <div class="icon-box">${p.icon}</div>
                        <div class="text-box">
                            <div class="title">${p.name}</div>
                            <div class="sub">${p.desc}</div>
                            <div class="sub" style="color:var(--primary); margin-top:5px;">Umur: ${p.days} Hari • Rp ${p.price}/kg</div>
                        </div>
                    </div>
                </div>
            `;
        });
    },

    showInfo: (id) => {
        const p = data.catalog.find(x=>x.id===id);
        document.getElementById('pi-name').innerText = p.name;
        document.getElementById('pi-desc').innerText = p.desc || "Tidak ada deskripsi.";
        
        const tl = document.getElementById('pi-timeline');
        if(p.schedule) {
            tl.innerHTML = `<h4 style="margin-bottom:10px;">Jadwal Referensi:</h4>` + 
            p.schedule.map(s => `<div style="margin-bottom:5px; font-size:0.9rem; padding:5px; background:var(--glass); border-radius:5px;">• <b>${s.hst} HST:</b> ${s.task}</div>`).join('');
        } else {
            tl.innerHTML = '';
        }
        modal.open('modal-plant-info');
    }
};

// --- TOOLS LOGIC ---
const tools = {
    init: () => {
        const opts = data.catalog.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        ['cb-t','cp-t','cn-t'].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.innerHTML = opts;
        });
    },
    setTab: (i) => {
        document.querySelectorAll('.tool-chip').forEach((e,x)=>e.classList.toggle('active',x===i));
        [0,1,2,3].forEach(x => {
            const el = document.getElementById(`tool-${x}`);
            if(el) el.style.display = x===i?'block':'none';
        });
    },
    calcBenih: () => {
        const p = data.catalog.find(x=>x.id==document.getElementById('cb-t').value);
        const l = document.getElementById('cb-l').value;
        if(!l || !p) return;
        
        const totalSeeds = (l * p.seeds).toFixed(0);
        const msg = `<strong>${totalSeeds} ${p.seeds < 1 ? 'Kg' : 'Bibit'}</strong><br>Untuk ${l} m² lahan ${p.name}<br><small>Rasio: ${p.seeds} ${p.seeds < 1 ? 'Kg' : 'bibit'} per m²</small>`;
        tools.showResult('res-benih', msg);
    },
    calcPupuk: () => {
        const p = data.catalog.find(x=>x.id==document.getElementById('cp-t').value);
        const l = document.getElementById('cp-l').value;
        if(!l || !p) return;
        
        const u = (l * p.pupuk.u).toFixed(1);
        const tsp = (l * p.pupuk.tsp).toFixed(1);
        const kcl = (l * p.pupuk.kcl).toFixed(1);
        
        const msg = `<strong>Estimasi Kebutuhan Pupuk:</strong><br>• Urea: ${u} kg<br>• TSP: ${tsp} kg<br>• KCl: ${kcl} kg<br><small>Untuk ${l} m² lahan ${p.name}</small>`;
        tools.showResult('res-pupuk', msg);
    },
    calcHPT: () => {
        const t = document.getElementById('ch-t').value;
        const d = document.getElementById('ch-d').value;
        if(!t || !d) return;
        
        const total = (t * d).toFixed(1);
        const msg = `<strong>${total} ml obat</strong><br>Campur dengan ${t} Liter air.<br><small>Dosis: ${d} ml per Liter air</small>`;
        tools.showResult('res-hpt', msg);
    },
    calcNPK: () => {
        const p = data.catalog.find(x=>x.id==document.getElementById('cn-t').value);
        const l = document.getElementById('cn-l').value;
        if(!l || !p) return;
        
        const ha = l * 10000; // m2
        const n = (ha * p.npk.n / 1000).toFixed(1);
        const p2 = (ha * p.npk.p / 1000).toFixed(1);
        const k = (ha * p.npk.k / 1000).toFixed(1);
        
        const msg = `<strong>Kebutuhan NPK per ${l} hektar:</strong><br>• Nitrogen (N): ${n} kg<br>• Fosfor (P₂O₅): ${p2} kg<br>• Kalium (K₂O): ${k} kg<br><small>Rekomendasi untuk ${p.name}</small>`;
        tools.showResult('res-npk', msg);
    },
    showResult: (id, html) => {
        const el = document.getElementById(id);
        el.innerHTML = html;
        el.style.display = 'block';
    }
};

// --- DATA MANAGER (Updated for Compatibility) ---
const dataMgr = {
    backup: () => {
        const jsonString = JSON.stringify(data, null, 2); 
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = "backup_agrimaster.json"; 
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    },
    restore: (input) => {
        const file = input.files[0];
        if(!file) return;
        
        if(!confirm('Data saat ini akan diganti dengan data dari file. Lanjutkan?')) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                data = json;
                save();
                alert("✅ Data berhasil dipulihkan!");
                location.reload();
            } catch(err) {
                alert("❌ File rusak atau tidak valid.");
            }
        };
        reader.readAsText(file);
    }
};

// --- BLOG LOGIC (New) ---
const blog = {
    fetch: () => {
        const url = data.blogUrl;
        const keywords = data.blogKeywords || ''; 
        
        const list = document.getElementById('blog-list');
        const loader = document.getElementById('blog-loader');
        const errorMsg = document.getElementById('blog-error');
        
        list.innerHTML = '';
        
        const keywordArray = keywords.toLowerCase().split(',').map(k => k.trim()).filter(k => k !== '');
        
        if(!url) {
            list.innerHTML = `<div style="text-align:center; padding:20px; color:#888;"><div style="font-size:2rem;">📝</div><p>Belum ada blog yang diatur.</p><small>Masukkan URL Feed di menu Pengaturan.</small></div>`;
            return;
        }

        document.getElementById('blog-status').style.display = 'block';
        loader.style.display = 'inline';
        errorMsg.style.display = 'none';

        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;

        fetch(proxyUrl)
            .then(res => res.json())
            .then(response => {
                loader.style.display = 'none';
                
                if(response.status === 'ok') {
                    const items = response.items;
                    
                    if(items.length === 0) {
                        list.innerHTML = '<p style="text-align:center;">Tidak ada artikel ditemukan.</p>';
                        return;
                    }

                    let count = 0;
                    
                    items.forEach(item => {
                        const itemTitle = item.title.toLowerCase();
                        const itemCategories = item.categories ? item.categories.join(" ").toLowerCase() : "";
                        const combinedText = itemTitle + " " + itemCategories;

                        const isMatch = keywordArray.length === 0 || keywordArray.some(keyword => combinedText.includes(keyword));

                        if (isMatch) {
                            if(count >= 5) return; 

                            let imgUrl = 'https://picsum.photos/seed/agri/100/100'; 
                            if(item.thumbnail) imgUrl = item.thumbnail;
                            else if(item.enclosure && item.enclosure.link) imgUrl = item.enclosure.link;

                            const date = new Date(item.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

                            list.innerHTML += `
                                <a href="${item.link}" target="_blank" class="blog-card">
                                    <img src="${imgUrl}" class="blog-thumb" onerror="this.src='https://picsum.photos/seed/agri/100/100'">
                                    <div class="blog-info">
                                        <div class="blog-title">${item.title}</div>
                                        <div class="blog-desc">${item.description.replace(/<[^>]*>?/gm, '').substring(0, 60)}...</div>
                                        <div class="blog-meta">
                                            <span>📅 ${date}</span>
                                            <span>👁️ Baca</span>
                                        </div>
                                    </div>
                                </a>
                            `;
                            count++;
                        }
                    });

                    if(count === 0) {
                        list.innerHTML = '<p style="text-align:center; color:#888;">Tidak ada artikel yang cocok dengan kata kunci.</p>';
                    }

                } else {
                    throw new Error('Feed tidak valid');
                }
            })
            .catch(err => {
                loader.style.display = 'none';
                errorMsg.style.display = 'inline';
                console.error(err);
            });
    }
};

// --- INIT APP ---
app.init();

document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => { if(e.target === m) modal.close(); });
});
app.init = () => {
    // --- 1. KODE YANG DIJALANKAN SETIAP KALI REFRESH (WAJIB) ---
    // Ini wajib jalan setiap kali buka aplikasi agar tampilan update
    document.documentElement.setAttribute('data-theme', data.theme || 'dark');
    tools.init();
    app.refresh();
    document.getElementById('f-date').valueAsDate = new Date();

    // Load & Simpan URL Blog
    if(document.getElementById('setting-blog-url')) {
        document.getElementById('setting-blog-url').value = data.blogUrl || '';
        document.getElementById('setting-blog-url').addEventListener('change', function(e) {
            data.blogUrl = e.target.value;
            save();
        });
    }

    // Load & Simpan Kata Kunci Blog
    if(document.getElementById('setting-blog-keywords')) {
        document.getElementById('setting-blog-keywords').value = data.blogKeywords || '';
        document.getElementById('setting-blog-keywords').addEventListener('change', function(e) {
            data.blogKeywords = e.target.value;
            save();
        });
    }

    // --- 2. KODE YANG HANYA DIJALANKAN SEKALI SAJA (PERTAMA KALI) ---
    const firstRunKey = 'agri_master_v6_first_run';
    
    if (!localStorage.getItem(firstRunKey)) {
        // Tulis kode khusus untuk pertama kali buka di sini
        // Contoh: Alert Selamat Datang
        console.log("Ini adalah kali pertama aplikasi dibuka!");
        
        // Anda bisa menambahkan logika lain, misal:
        // modal.open('modal-welcome'); // Jika Anda punya modal tutorial
        
        // SIMPAN TANDA bahwa aplikasi sudah pernah dibuka
        localStorage.setItem(firstRunKey, 'true');
    }
};