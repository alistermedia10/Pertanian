const defaultCatalog = [
    { id: 1, name: "Padi Sawah", cat: "Pangan", days: 120, price: 12000, icon: "🌾", desc: "Tanaman pangan utama Indonesia.", schedule: [{hst: 0, task: "Tanam Benih"}, {hst: 15, task: "Pemupukan I"}, {hst: 30, task: "Pemupukan II"}, {hst: 120, task: "Panen"}], seeds: 200, npk: {n: 150, p: 50, k: 100}, pupuk: {u: 0.1, tsp: 0.05, kcl: 0.05} },
    { id: 2, name: "Jagung Manis", cat: "Pangan", days: 75, price: 8000, icon: "🌽", desc: "Tanaman serealia cepat panen.", schedule: [{hst: 0, task: "Tanam"}, {hst: 20, task: "Pemupukan"}, {hst: 75, task: "Panen"}], seeds: 0.2, npk: {n: 200, p: 70, k: 100}, pupuk: {u: 0.15, tsp: 0.05, kcl: 0.1} },
    { id: 3, name: "Cabai Rawit", cat: "Sayur", days: 90, price: 45000, icon: "🌶️", desc: "Komoditas bernilai tinggi.", schedule: [{hst: 0, task: "Tanam"}, {hst: 30, task: "Perawatan"}, {hst: 90, task: "Panen"}], seeds: 0.1, npk: {n: 250, p: 80, k: 150}, pupuk: {u: 0.1, tsp: 0.05, kcl: 0.15} },
    { id: 4, name: "Tomat", cat: "Sayur", days: 100, price: 10000, icon: "🍅", desc: "Sayuran buah kaya vitamin.", schedule: [{hst: 0, task: "Tanam"}, {hst: 50, task: "Bunga"}, {hst: 100, task: "Panen"}], seeds: 0.1, npk: {n: 200, p: 60, k: 120}, pupuk: {u: 0.1, tsp: 0.05, kcl: 0.12} },
    { id: 5, name: "Sawi", cat: "Sayur", days: 35, price: 15000, icon: "🥬", desc: "Sayuran daun cepat panen.", schedule: [{hst: 0, task: "Tabur"}, {hst: 20, task: "Pupuk"}, {hst: 35, task: "Panen"}], seeds: 0.15, npk: {n: 120, p: 40, k: 80}, pupuk: {u: 0.08, tsp: 0.03, kcl: 0.05} },
    { id: 6, name: "Wortel", cat: "Sayur", days: 90, price: 12000, icon: "🥕", desc: "Akar umbi sehat.", schedule: [{hst: 0, task: "Tabur"}, {hst: 30, task: "Pupuk"}, {hst: 90, task: "Cubit"}], seeds: 0.2, npk: {n: 150, p: 50, k: 100}, pupuk: {u: 0.08, tsp: 0.05, kcl: 0.08} }
];

let data = JSON.parse(localStorage.getItem('alisterAgriPro_v1')) || {
    wallet: 0, catalog: defaultCatalog, fields: [], harvests: [], expenses: 0, theme: 'dark',
    blogUrl: 'https://alister10.blogspot.com/feeds/posts/default', // Default URL
    blogKeywords: 'teknik, sipil, pertanian, alister' 
};

let currentFieldId = null;

function save() { localStorage.setItem('alisterAgriPro_v1', JSON.stringify(data)); }

const nav = {
    to: (view) => {
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
        const v = document.getElementById('view-'+view); const n = document.getElementById('nav-'+view);
        if(v)v.classList.add('active'); if(n)n.classList.add('active');
        if(view==='dashboard') app.renderDashboard();
        if(view==='alat') tools.init();
        if(view==='blog') blog.fetch();
    }
};

const modal = { open: (id)=>document.getElementById(id).classList.add('active'), close: ()=>document.querySelectorAll('.modal').forEach(e=>e.classList.remove('active')) };

const app = {
    init: () => {
        document.documentElement.setAttribute('data-theme', data.theme || 'dark');
        tools.init(); app.refresh(); document.getElementById('f-date').valueAsDate = new Date();
        
        // Input Blog URL
        const urlIn = document.getElementById('setting-blog-url');
        if(urlIn) {
            urlIn.value = data.blogUrl || '';
            urlIn.onkeydown = (e)=>{ if(e.key==='Enter'){ data.blogUrl=urlIn.value; save(); urlIn.blur(); }};
            urlIn.onchange = ()=>{ data.blogUrl=urlIn.value; save(); };
        }
        const keyIn = document.getElementById('setting-blog-keywords');
        if(keyIn) {
            keyIn.value = data.blogKeywords || '';
            keyIn.onkeydown = (e)=>{ if(e.key==='Enter'){ data.blogKeywords=keyIn.value; save(); keyIn.blur(); }};
            keyIn.onchange = ()=>{ data.blogKeywords=keyIn.value; save(); };
        }
    },
    toggleTheme: () => { data.theme = data.theme==='light'?'dark':'light'; document.documentElement.setAttribute('data-theme', data.theme); save(); },
    refresh: () => {
        app.renderDashboard(); app.renderFields(); catalog.render();
        document.getElementById('wallet-balance').innerText = data.wallet.toLocaleString('id-ID');
    },
    renderDashboard: () => {
        const active = data.fields.filter(f=>f.status==='active');
        document.getElementById('dash-fields').innerText = active.length;
        document.getElementById('dash-harvests').innerText = data.harvests.length;
        let total = 0; data.fields.forEach(f=>total+=(f.cost||0));
        document.getElementById('dash-expense').innerText = 'Rp '+total.toLocaleString('id-ID');
        const df = document.getElementById('dashboard-fields'); df.innerHTML='';
        active.slice(0,3).forEach(f=>{
            const age = Math.ceil(Math.abs(new Date()-new Date(f.datePlanted))/86400000);
            const pct = Math.min(100, Math.round((age/f.days)*100));
            df.innerHTML += `<div class="list-row" onclick="app.openDetail(${f.id})"><div class="icon-box">${f.plantIcon}</div><div class="text-box"><div class="title">${f.name}</div><div class="sub">${f.plantName} • ${age} HST</div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div><span class="badge ${pct>=90?'warning':'active'}">${pct}%</span></div>`;
        });
        const feed = document.getElementById('activity-feed'); feed.innerHTML='';
        [...data.harvests.map(h=>({...h,type:'harvest'})), ...active.map(f=>({type:'field',name:f.name,date:f.datePlanted}))]
        .sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5).forEach(act=>{
            feed.innerHTML += act.type==='harvest' ? `<div class="list-row"><div class="icon-box" style="background:rgba(39,174,96,0.1);">💰</div><div class="text-box"><div class="title">Panen ${act.plant}</div><div class="sub">${act.date}</div></div><span style="font-size:0.8rem;font-weight:bold;color:var(--success);">+${act.income}</span></div>` : `<div class="list-row"><div class="icon-box" style="background:rgba(46,125,50,0.1);">🌱</div><div class="text-box"><div class="title">Lahan ${act.name}</div><div class="sub">${act.date}</div></div></div>`;
        });
    },
    renderFields: () => {
        const l = document.getElementById('fields-list'); l.innerHTML='';
        const active = data.fields.filter(f=>f.status==='active');
        if(!active.length){ l.innerHTML='<p style="text-align:center;padding:20px;color:#999;">Kosong</p>'; return; }
        active.forEach(f=>{
            const age = Math.ceil(Math.abs(new Date()-new Date(f.datePlanted))/86400000);
            const pct = Math.min(100, Math.round((age/f.days)*100));
            l.innerHTML += `<div class="card" onclick="app.openDetail(${f.id})"><div class="card-title"><span>${f.plantIcon} ${f.name}</span><span class="badge ${pct>=90?'warning':'active'}">${pct}%</span></div><div class="sub">${f.plantName} • ${f.area}m² • ${age}HST</div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div></div>`;
        });
    },
    addField: () => {
        const n = document.getElementById('f-name').value, pid = document.getElementById('f-plant').value, d = document.getElementById('f-date').value, a = document.getElementById('f-area').value, t = document.getElementById('f-type').value, c = document.getElementById('f-cost').value;
        if(!n||!d||!a) return;
        const p = data.catalog.find(x=>x.id==pid);
        data.fields.push({id:Date.now(), name:n, plantId:pid, plantName:p.name, plantIcon:p.icon, days:p.days, price:p.price, datePlanted:d, area:a, type:t, cost:parseInt(c||0), status:'active', tasks:[{id:1,text:'Siapkan Lahan',done:false},{id:2,text:'Tanam Benih',done:true}]});
        save(); modal.close(); app.refresh();
    },
    addPlant: () => {
        const n = document.getElementById('p-name').value, p = parseInt(document.getElementById('p-price').value), d = parseInt(document.getElementById('p-days').value), s = parseFloat(document.getElementById('p-seeds').value)||0.1, c = document.getElementById('p-cat').value;
        if(!n||!p){ alert('Lengkapi!'); return; }
        data.catalog.push({id:Date.now(), name:n, price:p, days:d, seeds:s, cat:c, icon:c=='Pohon'?'🌳':c=='Buah'?'🍎':c=='Sayur'?'🥬':'🌾', desc:'Custom', schedule:[{hst:0,task:'Tanam'},{hst:Math.floor(d/3),task:'Pupuk 1'},{hst:Math.floor(d*2/3),task:'Pupuk 2'},{hst:d,task:'Panen'}], npk:{n:150,p:50,k:100}, pupuk:{u:0.1,tsp:0.05,kcl:0.05}});
        save(); modal.close(); catalog.render(); alert('Ok');
    },
    openDetail: (id) => {
        currentFieldId = id; const f = data.fields.find(x=>x.id===id), p = data.catalog.find(x=>x.id==f.plantId), age = Math.ceil(Math.abs(new Date()-new Date(f.datePlanted))/86400000);
        document.getElementById('detail-header').innerHTML = `<h2>${f.plantIcon} ${f.name}</h2><p class="sub">${f.plantName} - ${f.area}m²</p><p class="sub">${age} HST</p>`;
        const tl = document.getElementById('d-timeline'); tl.innerHTML='';
        if(p.schedule) p.schedule.forEach((item,idx)=>{
            let cls='future'; if(age>=item.hst) cls='done'; else if(idx>0 && age<item.hst && age>=p.schedule[idx-1].hst) cls='active';
            tl.innerHTML += `<div class="timeline-item ${cls}"><div class="timeline-dot"></div><div class="timeline-content"><div class="t-title">${item.task}</div><div class="t-hst">${item.hst} HST</div></div></div>`;
        });
        const t = document.getElementById('task-list'); t.innerHTML=''; f.tasks.forEach((x,i)=>t.innerHTML+=`<div class="task-item ${x.done?'done':''}" onclick="app.toggleTask(${i})"><div class="checkbox ${x.done?'checked':''}"></div><span>${x.text}</span></div>`);
        modal.open('modal-detail');
    },
    addTask: () => { const i = document.getElementById('new-task-input'); if(!i.value)return; data.fields.find(x=>x.id===currentFieldId).tasks.push({id:Date.now(),text:i.value,done:false}); i.value=''; save(); app.openDetail(currentFieldId); },
    toggleTask: (i) => { const f = data.fields.find(x=>x.id===currentFieldId); f.tasks[i].done=!f.tasks[i].done; save(); app.openDetail(currentFieldId); },
    initHarvest: () => {
        const f = data.fields.find(x=>x.id===currentFieldId);
        const amt = prompt(`Hasil Panen (Kg):`,"100"); if(!amt||isNaN(amt))return;
        const inc = amt*f.price;
        if(confirm(`Estimasi: Rp ${inc.toLocaleString()}. Lanjut?`)){ f.status='harvested'; data.wallet+=parseInt(inc); data.harvests.unshift({id:Date.now(),date:new Date().toISOString().split('T')[0],plant:f.plantName,amount:parseFloat(amt),income:inc}); save(); modal.close(); alert("Tersimpan!"); }
    },
    resetApp: ()=>{ if(confirm('Hapus semua?')){ localStorage.clear(); location.reload(); }}
};

const catalog = {
    render: () => {
        const t = document.getElementById('search-catalog').value.toLowerCase(); const l = document.getElementById('catalog-list'); l.innerHTML='';
        data.catalog.filter(p=>p.name.toLowerCase().includes(t)||p.cat.toLowerCase().includes(t)).forEach(p=>l.innerHTML+=`<div class="card" onclick="catalog.showInfo(${p.id})"><div class="list-row"><div class="icon-box">${p.icon}</div><div class="text-box"><div class="title">${p.name}</div><div class="sub">${p.desc}</div></div></div></div>`);
    },
    showInfo: (id) => { const p = data.catalog.find(x=>x.id===id); document.getElementById('pi-name').innerText=p.name; document.getElementById('pi-desc').innerText=p.desc||'-'; document.getElementById('pi-timeline').innerHTML=`<h4>Jadwal:</h4>`+p.schedule.map(s=>`<div style="margin-bottom:5px;font-size:0.9rem;">• <b>${s.hst} HST:</b> ${s.task}</div>`).join(''); modal.open('modal-plant-info'); }
};

const tools = {
    init: () => { const o = data.catalog.map(p=>`<option value="${p.id}">${p.name}</option>`).join(''); ['cb-t','cp-t','cn-t'].forEach(i=>{ const e=document.getElementById(i); if(e)e.innerHTML=o; }); },
    setTab: (i) => { document.querySelectorAll('.tool-chip').forEach((e,x)=>e.classList.toggle('active',x===i)); [0,1,2,3].forEach(x=>{ const e=document.getElementById(`tool-${x}`); if(e)e.style.display=x===i?'block':'none'; }); },
    calcBenih: () => { const p=data.catalog.find(x=>x.id==document.getElementById('cb-t').value), l=document.getElementById('cb-l').value; if(!l||!p)return; tools.showResult('res-benih',`<strong>${(l*p.seeds).toFixed(0)} ${p.seeds<1?'Kg':'Bibit'}</strong> untuk ${l}m²`); },
    calcPupuk: () => { const p=data.catalog.find(x=>x.id==document.getElementById('cp-t').value), l=document.getElementById('cp-l').value; if(!l||!p)return; tools.showResult('res-pupuk',`Urea:${(l*p.pupuk.u).toFixed(1)}kg, TSP:${(l*p.pupuk.tsp).toFixed(1)}kg`); },
    calcHPT: () => { const t=document.getElementById('ch-t').value, d=document.getElementById('ch-d').value; if(!t||!d)return; tools.showResult('res-hpt',`<strong>${(t*d).toFixed(1)}ml obat</strong> dalam ${t}L air`); },
    calcNPK: () => { const p=data.catalog.find(x=>x.id==document.getElementById('cn-t').value), l=document.getElementById('cn-l').value; if(!l||!p)return; const ha=l*10000; tools.showResult('res-npk',`N:${(ha*p.npk.n/1000).toFixed(1)}kg, P:${(ha*p.npk.p/1000).toFixed(1)}kg, K:${(ha*p.npk.k/1000).toFixed(1)}kg`); },
    showResult: (id, h)=>{ const e=document.getElementById(id); e.innerHTML=h; e.style.display='block'; }
};

const dataMgr = {
    backup: () => {
        const j=JSON.stringify(data,null,2), b=new Blob([j],{type:"application/json"}), u=URL.createObjectURL(b);
        const a=document.createElement('a'); a.href=u; a.download="backup.json"; document.body.appendChild(a); a.click(); setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(u); },0);
    },
    restore: (i) => {
        const f=i.files[0]; if(!f)return;
        if(!confirm('Ganti data?'))return;
        const r=new FileReader(); r.onload=(e)=>{ try{ data=JSON.parse(e.target.result); save(); alert('Ok'); location.reload(); }catch(err){ alert('Rusak'); }}; r.readAsText(f);
    }
};

const blog = {
    fetch: () => {
        const u=data.blogUrl, k=data.blogKeywords||'', l=document.getElementById('blog-container'), lo=document.getElementById('blog-loading'), er=document.getElementById('blog-error');
        l.innerHTML=''; lo.classList.remove('hidden'); er.classList.add('hidden');
        const arr=k.toLowerCase().split(',').map(x=>x.trim()).filter(x=>x);
        if(!u){ l.innerHTML=`<p style="text-align:center;">URL belum diatur.</p>`; lo.classList.add('hidden'); return; }
        
        fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(u)}`).then(res=>res.json()).then(res=>{
            lo.classList.add('hidden');
            if(res.status==='ok'){
                let c=0;
                res.items.forEach(item=>{
                    const txt=item.title.toLowerCase()+" "+(item.categories||[]).join(" ").toLowerCase();
                    const match=arr.length===0||arr.some(k=>txt.includes(k));
                    if(match && c<6){
                        let img='https://picsum.photos/seed/alister/300/200'; 
                        if(item.thumbnail)img=item.thumbnail;
                        else if(item.enclosure)img=item.enclosure.link;
                        
                        const d=new Date(item.pubDate).toLocaleDateString('id-ID',{day:'numeric',month:'short'});
                        // GRID LAYOUT CARD
                        l.innerHTML+=`<a href="${item.link}" target="_blank" class="blog-item"><img src="${img}" class="blog-item-img" onerror="this.src='https://picsum.photos/seed/alister/300/200'"><div class="blog-item-content"><div class="blog-item-title">${item.title}</div><div class="blog-item-desc">${item.description.replace(/<[^>]*>?/gm,'').substring(0,80)}...</div><div class="blog-item-meta">📅 ${d} &nbsp; &nbsp; 👁️ Baca</div></div></a>`;
                        c++;
                    }
                });
                if(c===0) l.innerHTML='<p style="text-align:center;">Tidak ada artikel cocok.</p>';
            }
        }).catch(e=>{ lo.classList.add('hidden'); er.classList.remove('hidden'); });
    }
};

app.init();
document.querySelectorAll('.modal').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m)modal.close(); }));