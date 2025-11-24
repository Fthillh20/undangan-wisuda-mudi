// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Smooth Scroll Function
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// Countdown Timer
function updateCountdown() {
    const eventDate = new Date('2025-11-29T14:00:00+09:00').getTime();
    const now = new Date().getTime();
    const distance = eventDate - now;
    
    if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Carousel Gallery
let currentSlide = 0;
const totalSlides = 7;

function createIndicators() {
    const container = document.getElementById('indicators');
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = 'indicator' + (i === 0 ? ' active' : '');
        indicator.onclick = () => goToSlide(i);
        container.appendChild(indicator);
    }
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((ind, idx) => {
        ind.classList.toggle('active', idx === currentSlide);
    });
}

function moveSlide(direction) {
    currentSlide += direction;
    if (currentSlide < 0) currentSlide = totalSlides - 1;
    if (currentSlide >= totalSlides) currentSlide = 0;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateIndicators();
}

createIndicators();

// Auto-play carousel
setInterval(() => {
    moveSlide(1);
}, 5000);

// Confetti Animation
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const confettiPieces = [];
const colors = ['#d4af37', '#f4d03f', '#1e88e5', '#0b1f3a', '#ffffff'];

class Confetti {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.w = Math.random() * 8 + 4;
        this.h = Math.random() * 8 + 4;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.speed = Math.random() * 3 + 2;
        this.angle = Math.random() * Math.PI * 2;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 10 - 5;
    }
    
    update() {
        this.y += this.speed;
        this.x += Math.sin(this.angle) * 2;
        this.rotation += this.rotationSpeed;
        
        if (this.y > canvas.height) {
            this.reset();
        }
    }
    
    draw() {
        ctx.save();
        ctx.translate(this.x + this.w / 2, this.y + this.h / 2);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
        ctx.restore();
    }
}

for (let i = 0; i < 150; i++) {
    confettiPieces.push(new Confetti());
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiPieces.forEach(piece => {
        piece.update();
        piece.draw();
    });
    requestAnimationFrame(animateConfetti);
}

animateConfetti();

// Show confetti on closing section and keep it permanent once shown
let confettiActive = false;
let confettiPermanent = false; // Flag untuk keep confetti permanent

window.addEventListener('scroll', () => {
    const closingSection = document.querySelector('.closing-section');
    const rect = closingSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    // Jika closing section terlihat dan belum aktif permanent
    if (isVisible && !confettiPermanent) {
        canvas.style.opacity = '1';
        confettiActive = true;
        confettiPermanent = true; // Set permanent setelah pertama kali muncul
    }
    
    // Tidak hide confetti lagi setelah permanent
    // else if (!isVisible && confettiActive && !confettiPermanent) {
    //     canvas.style.opacity = '0';
    //     confettiActive = false;
    // }
});

// ===== MUSIC PLAYER =====

// Ambil elemen audio dan button
const backgroundMusic = document.getElementById('backgroundMusic');
const musicBtn = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');

// Set volume default (0.0 - 1.0)
backgroundMusic.volume = 0.3; // 30% volume

// State musik
let isMusicPlaying = false;

// Function toggle musik
function toggleMusic() {
    if (isMusicPlaying) {
        // Pause musik
        backgroundMusic.pause();
        musicIcon.className = 'fas fa-volume-mute';
        musicBtn.style.background = '#666';
        isMusicPlaying = false;
    } else {
        // Play musik
        backgroundMusic.play().then(() => {
            musicIcon.className = 'fas fa-volume-up';
            musicBtn.style.background = '#d4af37';
            isMusicPlaying = true;
        }).catch(error => {
            console.log('Autoplay prevented:', error);
            // Browser block autoplay
            showMusicNotification();
        });
    }
}

// Auto-play saat halaman dimuat (might be blocked by browser)
window.addEventListener('DOMContentLoaded', function() {
    // Coba auto-play setelah user interact
    document.body.addEventListener('click', function autoPlay() {
        if (!isMusicPlaying) {
            backgroundMusic.play().then(() => {
                musicIcon.className = 'fas fa-volume-up';
                musicBtn.style.background = '#d4af37';
                isMusicPlaying = true;
            }).catch(error => {
                console.log('Autoplay blocked:', error);
            });
        }
        // Remove listener setelah first click
        document.body.removeEventListener('click', autoPlay);
    }, { once: true });
});

// Notification jika autoplay di-block
function showMusicNotification() {
    // Buat notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: #d4af37;
        color: #0b1f3a;
        padding: 15px 25px;
        border-radius: 50px;
        box-shadow: 0 5px 20px rgba(212, 175, 55, 0.5);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = '🎵 Klik tombol musik untuk memutar';
    document.body.appendChild(notification);
    
    // Hapus setelah 3 detik
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Fade in/out saat pause/play
function fadeIn(audio) {
    audio.volume = 0;
    audio.play();
    let vol = 0;
    const fadeInInterval = setInterval(() => {
        if (vol < 0.3) {
            vol += 0.05;
            audio.volume = Math.min(vol, 0.3);
        } else {
            clearInterval(fadeInInterval);
        }
    }, 100);
}

function fadeOut(audio) {
    let vol = audio.volume;
    const fadeOutInterval = setInterval(() => {
        if (vol > 0) {
            vol -= 0.05;
            audio.volume = Math.max(vol, 0);
        } else {
            audio.pause();
            clearInterval(fadeOutInterval);
        }
    }, 100);
}

// Optional: Pause musik saat tab tidak aktif
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        if (isMusicPlaying) {
            backgroundMusic.pause();
        }
    } else {
        if (isMusicPlaying) {
            backgroundMusic.play();
        }
    }
});

// Guestbook Submit
function submitMessage(e) {
    e.preventDefault();
    
    const name = document.getElementById('guestName').value;
    const message = document.getElementById('guestMessage').value;
    
    if (!name || !message) return;
    
    // Create message card
    const messageCard = document.createElement('div');
    messageCard.className = 'message-card';
    messageCard.setAttribute('data-aos', 'fade-up');
    messageCard.innerHTML = `
        <div class="message-author">
            <i class="fas fa-user-circle" style="color: #d4af37;"></i>
            ${name}
        </div>
        <div class="message-text">${message}</div>
    `;
    
    // Add to list
    const messagesList = document.getElementById('messagesList');
    messagesList.insertBefore(messageCard, messagesList.firstChild);
    
    // Mini confetti effect
    triggerMiniConfetti();
    
    // Reset form
    document.getElementById('guestbookForm').reset();
    
    // Success alert
    alert('✅ Terima kasih atas ucapan Anda!');
    
    // Refresh AOS
    AOS.refresh();
    
    // Save to localStorage (optional)
    saveMessage(name, message);
}

// Mini confetti on message submit
function triggerMiniConfetti() {
    canvas.style.opacity = '1';
    confettiPermanent = true; // Set permanent juga
    
    // Tidak perlu timeout lagi karena sudah permanent
    // setTimeout(() => {
    //     if (!confettiActive) {
    //         canvas.style.opacity = '0';
    //     }
    // }, 3000);
}

// Save message to localStorage
function saveMessage(name, message) {
    try {
        let messages = JSON.parse(localStorage.getItem('guestMessages') || '[]');
        messages.unshift({ name, message, date: new Date().toISOString() });
        localStorage.setItem('guestMessages', JSON.stringify(messages));
    } catch (e) {
        console.log('LocalStorage not available');
    }
}

// Load messages from localStorage
function loadMessages() {
    try {
        const messages = JSON.parse(localStorage.getItem('guestMessages') || '[]');
        const messagesList = document.getElementById('messagesList');
        
        messages.forEach(msg => {
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card';
            messageCard.innerHTML = `
                <div class="message-author">
                    <i class="fas fa-user-circle" style="color: #d4af37;"></i>
                    ${msg.name}
                </div>
                <div class="message-text">${msg.message}</div>
            `;
            messagesList.appendChild(messageCard);
        });
    } catch (e) {
        console.log('Could not load messages');
    }
}

// Load saved messages on page load
loadMessages();

// Resize canvas
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Copy Account Number Function
function copyAccountNumber() {
    // Ambil nomor rekening
    const accountNumber = document.getElementById('accountNumber').textContent;
    
    // Hapus spasi untuk copy
    const cleanNumber = accountNumber.replace(/\s/g, '');
    
    // Copy ke clipboard
    navigator.clipboard.writeText(cleanNumber).then(() => {
        // Tampilkan success message
        const successMsg = document.getElementById('copySuccess');
        const copyBtn = document.querySelector('.copy-btn');
        
        successMsg.classList.add('show');
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Berhasil Disalin!';
        copyBtn.style.background = '#28a745';
        
        // Trigger confetti
        triggerMiniConfetti();
        
        // Reset setelah 3 detik
        setTimeout(() => {
            successMsg.classList.remove('show');
            copyBtn.innerHTML = '<i class="fas fa-copy"></i> Salin Nomor Rekening';
            copyBtn.style.background = 'linear-gradient(135deg, #d4af37, #f4d03f)';
        }, 3000);
    }).catch(err => {
        // Fallback jika clipboard API tidak didukung
        alert('Nomor Rekening: ' + cleanNumber);
        console.error('Copy failed:', err);
    });
}

document.getElementById('formUcapan').addEventListener('submit', function(e){
    e.preventDefault();

    const nama = document.getElementById('namaPengirim').value;
    const ucapan = document.getElementById('isiUcapan').value;

    const box = document.createElement('div');
    box.classList.add('ucapan-box');
    box.innerHTML = `<strong>${nama}</strong><p>${ucapan}</p>`;

    document.getElementById('listUcapan').prepend(box);

    document.getElementById('formUcapan').reset();
});

// ===== MAPS INTERAKTIF FUNCTIONS =====

// Function untuk aktivasi maps (hapus overlay)
function activateMap() {
    const overlay = document.getElementById('mapOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        // Hapus overlay setelah animasi selesai
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

// Function untuk buka Google Maps dengan directions
function openGoogleMaps() {
    // GANTI dengan koordinat atau alamat lokasi Anda
    const destination = 'Auditorium Universitas XYZ, Baubau, Sulawesi Tenggara';
    
    // Encode alamat untuk URL
    const encodedDestination = encodeURIComponent(destination);
    
    // URL Google Maps dengan directions
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedDestination}`;
    
    // Buka di tab baru
    window.open(mapsUrl, '_blank');
    
    // Trigger confetti
    triggerMiniConfetti();
}

// Function untuk copy alamat
function copyAddress() {
    // GANTI dengan alamat lengkap Anda
    const address = 'Auditorium Universitas XYZ, Jl. Contoh No. 123, Baubau, Sulawesi Tenggara';
    
    // Copy ke clipboard
    navigator.clipboard.writeText(address).then(() => {
        // Show notification
        showNotification('✅ Alamat berhasil disalin!', 'success');
        
        // Trigger confetti
        triggerMiniConfetti();
    }).catch(err => {
        // Fallback
        alert('Alamat: ' + address);
        console.error('Copy failed:', err);
    });
}