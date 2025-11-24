// Guest Name Personalization
// Ambil nama tamu dari URL parameter

function getGuestNameFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to') || urlParams.get('nama') || urlParams.get('guest');
    return guestName ? decodeURIComponent(guestName) : null;
}

function setGuestName() {
    const guestName = getGuestNameFromURL();
    const guestNameElement = document.getElementById('guestNameDisplay');
    
    if (guestName && guestNameElement) {
        // Kapitalisasi setiap kata
        const formattedName = guestName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        
        guestNameElement.textContent = formattedName;
    } else if (guestNameElement) {
        // Default jika tidak ada nama
        guestNameElement.textContent = 'Bapak/Ibu/Saudara/i';
    }
}

// Jalankan saat DOM ready
document.addEventListener('DOMContentLoaded', function() {
    setGuestName();
});

/* 
CARA PENGGUNAAN:
==============

1. SHARE LINK DENGAN NAMA TAMU:
   https://yourdomain.com/?to=Ahmad Hidayat
   https://yourdomain.com/?nama=Siti Aminah
   https://yourdomain.com/?guest=Dr. Budi Santoso

2. MULTIPLE WORDS (gunakan %20 atau +):
   https://yourdomain.com/?to=Ahmad+Rizki+Pratama
   https://yourdomain.com/?to=Ahmad%20Rizki%20Pratama

3. GENERATE LINK OTOMATIS:
   Gunakan function di bawah ini untuk generate link

*/

// Function untuk generate personalized link
function generatePersonalizedLink(guestName) {
    const baseURL = window.location.origin + window.location.pathname;
    const encodedName = encodeURIComponent(guestName);
    return `${baseURL}?to=${encodedName}`;
}

// Function untuk copy link ke clipboard
function copyPersonalizedLink(guestName) {
    const link = generatePersonalizedLink(guestName);
    
    navigator.clipboard.writeText(link).then(() => {
        console.log('Link copied:', link);
        return true;
    }).catch(err => {
        console.error('Failed to copy:', err);
        return false;
    });
}

// Example usage:
// copyPersonalizedLink('Ahmad Hidayat');
// Output: https://yourdomain.com/?to=Ahmad%20Hidayat