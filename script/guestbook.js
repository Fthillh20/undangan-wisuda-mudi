// GANTI DENGAN URL WEB APP ANDA!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSXF3b0xLjs8gnx1Lb3HzTezVzM1jB2XZQhFxlc3Mf7sTVKi6pKR4TmACgZZYlsIHn/exec';

// Load ucapan saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    loadUcapan();
    
    // Character counter untuk textarea
    const ucapanTextarea = document.getElementById('ucapan');
    const charCounter = document.querySelector('.char-counter');
    
    if (ucapanTextarea && charCounter) {
        ucapanTextarea.addEventListener('input', function() {
            const length = this.value.length;
            charCounter.textContent = `${length}/500`;
            
            if (length > 450) {
                charCounter.style.color = '#e74c3c';
            } else {
                charCounter.style.color = '#999';
            }
        });
    }
});

// Function untuk load ucapan dari Google Sheets
async function loadUcapan() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const ucapanList = document.getElementById('ucapanList');
    
    if (!ucapanList) return;
    
    // Show loading
    if (loadingIndicator) loadingIndicator.style.display = 'block';
    ucapanList.innerHTML = '';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL);
        const result = await response.json();
        
        // Hide loading
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        
        if (result.status === 'success' && result.data.length > 0) {
            result.data.forEach(item => {
                const card = createUcapanCard(item);
                ucapanList.appendChild(card);
            });
            
            // Animate cards
            AOS.refresh();
        } else {
            // Empty state
            ucapanList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <p>Belum ada ucapan. Jadilah yang pertama!</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading ucapan:', error);
        if (loadingIndicator) loadingIndicator.style.display = 'none';
        
        ucapanList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-exclamation-circle"></i>
                <p>Gagal memuat ucapan. Silakan refresh halaman.</p>
            </div>
        `;
    }
}

// Function untuk membuat card ucapan
function createUcapanCard(data) {
    const card = document.createElement('div');
    card.className = 'ucapan-card';
    card.setAttribute('data-aos', 'fade-up');
    
    // Get initial dari nama
    const initial = data.nama.charAt(0).toUpperCase();
    
    // Format timestamp
    const timestamp = formatTimestamp(data.timestamp);
    
    card.innerHTML = `
        <div class="ucapan-header">
            <div class="ucapan-avatar">${initial}</div>
            <div class="ucapan-info">
                <div class="ucapan-nama">${escapeHtml(data.nama)}</div>
                <div class="ucapan-timestamp">${timestamp}</div>
            </div>
        </div>
        <div class="ucapan-text">${escapeHtml(data.ucapan)}</div>
    `;
    
    return card;
}

// Function untuk submit ucapan
async function submitUcapan(event) {
    event.preventDefault();
    
    const form = document.getElementById('guestbookForm');
    const submitBtn = form.querySelector('.submit-btn');
    const namaInput = document.getElementById('nama');
    const ucapanInput = document.getElementById('ucapan');
    
    // Validasi
    if (!namaInput.value.trim() || !ucapanInput.value.trim()) {
        alert('⚠️ Mohon isi semua field!');
        return;
    }
    
    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    
    try {
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                nama: namaInput.value.trim(),
                ucapan: ucapanInput.value.trim()
            })
        });
        
        // Success
        alert('✅ Terima kasih! Ucapan Anda berhasil dikirim.');
        
        // Reset form
        form.reset();
        document.querySelector('.char-counter').textContent = '0/500';
        
        // Reload ucapan setelah 1 detik
        setTimeout(() => {
            loadUcapan();
        }, 1000);
        
        // Trigger confetti
        if (typeof triggerMiniConfetti === 'function') {
            triggerMiniConfetti();
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('✅ Ucapan Anda telah dikirim!');
        
        // Reset form
        form.reset();
        
        // Reload ucapan
        setTimeout(() => {
            loadUcapan();
        }, 1000);
    } finally {
        // Enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Ucapan';
    }
}

// Helper function untuk format timestamp
function formatTimestamp(timestamp) {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit yang lalu`;
    if (hours < 24) return `${hours} jam yang lalu`;
    if (days < 7) return `${days} hari yang lalu`;
    
    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

// Helper function untuk escape HTML (mencegah XSS)
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}