// === GPCQM 2025 - Instagram Feed Integration ===

// Instagram configuration
const INSTAGRAM_CONFIG = {
    username: 'grandsprixcyclistes',
    accessToken: 'YOUR_INSTAGRAM_ACCESS_TOKEN', // Replace with actual token
    userId: 'YOUR_USER_ID', // Replace with actual user ID
    maxPosts: 3,
    cacheKey: 'gpcqm_instagram_cache',
    cacheExpiry: 3600000, // Cache for 1 hour
    updateInterval: 1800000 // Update every 30 minutes
};

// Initialize Instagram feed on DOM load
document.addEventListener('DOMContentLoaded', function() {
    if (navigator.onLine) {
        loadInstagramFeed();
        // Schedule periodic updates
        setInterval(loadInstagramFeed, INSTAGRAM_CONFIG.updateInterval);
    }
});

// Load Instagram feed
async function loadInstagramFeed() {
    const feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer) return;
    
    try {
        // Check cache first
        const cachedPosts = getCachedPosts();
        if (cachedPosts) {
            displayPosts(cachedPosts);
            return;
        }
        
        // If token is not set, show demo posts
        if (INSTAGRAM_CONFIG.accessToken === 'YOUR_INSTAGRAM_ACCESS_TOKEN') {
            displayDemoPosts();
            return;
        }
        
        // Fetch posts from Instagram API
        const posts = await fetchInstagramPosts();
        
        // Cache the posts
        cachePosts(posts);
        
        // Display posts
        displayPosts(posts);
        
    } catch (error) {
        console.error('Error loading Instagram feed:', error);
        displayInstagramError();
    }
}

// Fetch Instagram posts
async function fetchInstagramPosts() {
    const url = `https://graph.instagram.com/${INSTAGRAM_CONFIG.userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${INSTAGRAM_CONFIG.accessToken}&limit=${INSTAGRAM_CONFIG.maxPosts}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Instagram API error');
    
    const data = await response.json();
    return data.data;
}

// Display Instagram posts
function displayPosts(posts) {
    const feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer) return;
    
    const postsHTML = posts.map(post => createPostHTML(post)).join('');
    feedContainer.innerHTML = postsHTML;
    
    // Add click handlers
    const postElements = feedContainer.querySelectorAll('.instagram-post');
    postElements.forEach((element, index) => {
        element.addEventListener('click', () => {
            window.open(posts[index].permalink || `https://instagram.com/${INSTAGRAM_CONFIG.username}`, '_blank');
            
            // Track Instagram post click
            if (typeof gtag !== 'undefined') {
                gtag('event', 'instagram_post_click', {
                    post_id: posts[index].id || index
                });
            }
        });
    });
}

// Create HTML for a single post
function createPostHTML(post) {
    const imageUrl = post.media_type === 'VIDEO' ? post.thumbnail_url : post.media_url;
    const caption = post.caption ? truncateText(post.caption, 100) : '';
    const likes = post.like_count || 0;
    const comments = post.comments_count || 0;
    
    return `
        <div class="instagram-post">
            <div class="instagram-image-container">
                <img src="${imageUrl}" alt="Instagram post" class="instagram-image" loading="lazy">
                ${post.media_type === 'VIDEO' ? '<div class="video-indicator">▶️</div>' : ''}
            </div>
            <div class="instagram-content">
                <p class="instagram-caption">${caption}</p>
                <div class="instagram-meta">
                    <span>❤️ ${formatNumber(likes)}</span>
                    <span>💬 ${formatNumber(comments)}</span>
                </div>
            </div>
        </div>
    `;
}

// Display demo posts (when API token not set)
function displayDemoPosts() {
    const feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer) return;
    
    const currentLang = localStorage.getItem('language') || 'fr';
    
    // Demo posts data
    const demoPosts = [
        {
            media_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            caption: currentLang === 'fr' ? 
                '🚴‍♂️ Les équipes arrivent à Québec! Prêts pour le Grand Prix! #GPCQM2025' :
                '🚴‍♂️ Teams arriving in Quebec City! Ready for the Grand Prix! #GPCQM2025',
            like_count: 342,
            comments_count: 28,
            permalink: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
        },
        {
            media_url: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400',
            caption: currentLang === 'fr' ? 
                '📍 Le parcours est prêt! 17 tours autour du Mont-Royal 🏔️' :
                '📍 The course is ready! 17 laps around Mount Royal 🏔️',
            like_count: 567,
            comments_count: 45,
            permalink: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
        },
        {
            media_url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400',
            caption: currentLang === 'fr' ? 
                '🎉 Les Zones animées ouvrent demain à 9h! Venez nombreux!' :
                '🎉 Fan Zones open tomorrow at 9 AM! See you there!',
            like_count: 423,
            comments_count: 31,
            permalink: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
        },
        {
            media_url: 'https://images.unsplash.com/photo-1544986581-efac024faf62?w=400',
            caption: currentLang === 'fr' ? 
                '🏆 Qui remportera le titre cette année? Vos pronostics?' :
                '🏆 Who will win this year? Your predictions?',
            like_count: 892,
            comments_count: 127,
            permalink: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
        },
        {
            media_url: 'https://images.unsplash.com/photo-1552306062-29a5560e1c31?w=400',
            caption: currentLang === 'fr' ? 
                '☀️ Météo parfaite annoncée pour dimanche! 18°C et ensoleillé!' :
                '☀️ Perfect weather forecast for Sunday! 18°C and sunny!',
            like_count: 234,
            comments_count: 19,
            permalink: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
        },
        {
            media_url: 'https://images.unsplash.com/photo-1517654443271-11c621d19e60?w=400',
            caption: currentLang === 'fr' ? 
                '🚴‍♀️ Les champions sont en ville! Reconnaissez-vous ces coureurs?' :
                '🚴‍♀️ Champions are in town! Can you recognize these riders?',
            like_count: 678,
            comments_count: 89,
            permalink: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
        },
        {
            media_url: 'https://images.unsplash.com/photo-1557275357-e4b9d6c65a0a?w=400',
            caption: currentLang === 'fr' ? 
                '📺 Diffusion en direct sur TVA Sports dimanche dès 10h!' :
                '📺 Live broadcast on CBC Gem Sunday from 10 AM!',
            like_count: 156,
            comments_count: 12,
            permalink: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
        },
        {
            media_url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400',
            caption: currentLang === 'fr' ? 
                '🎯 Concours Edika! Gagnez un vélo signé par les coureurs!' :
                '🎯 Edika Contest! Win a bike signed by the riders!',
            like_count: 934,
            comments_count: 201,
            permalink: `https://instagram.com/${INSTAGRAM_CONFIG.username}`
        }
    ];
    
    // Limit to 3 posts
    displayPosts(demoPosts.slice(0, 3));
}

// Display Instagram error
function displayInstagramError() {
    const feedContainer = document.getElementById('instagramFeed');
    if (!feedContainer) return;
    
    const currentLang = localStorage.getItem('language') || 'fr';
    
    feedContainer.innerHTML = `
        <div class="instagram-error">
            <p>${currentLang === 'fr' ? 'Impossible de charger les publications' : 'Unable to load posts'}</p>
            <a href="https://instagram.com/${INSTAGRAM_CONFIG.username}" target="_blank" class="instagram-link">
                ${currentLang === 'fr' ? 'Voir sur Instagram' : 'View on Instagram'}
            </a>
        </div>
    `;
}

// Cache posts
function cachePosts(posts) {
    try {
        const cacheData = {
            posts: posts,
            expiry: Date.now() + INSTAGRAM_CONFIG.cacheExpiry
        };
        localStorage.setItem(INSTAGRAM_CONFIG.cacheKey, JSON.stringify(cacheData));
    } catch (e) {
        console.error('Failed to cache Instagram posts:', e);
    }
}

// Get cached posts
function getCachedPosts() {
    try {
        const cached = localStorage.getItem(INSTAGRAM_CONFIG.cacheKey);
        if (!cached) return null;
        
        const cacheData = JSON.parse(cached);
        
        // Check if cache is expired
        if (Date.now() > cacheData.expiry) {
            localStorage.removeItem(INSTAGRAM_CONFIG.cacheKey);
            return null;
        }
        
        return cacheData.posts;
    } catch (e) {
        console.error('Failed to get cached posts:', e);
        return null;
    }
}

// Truncate text
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Format number
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// Refresh Instagram token (for long-lived tokens)
async function refreshInstagramToken() {
    // This would be implemented on the server side
    // Instagram long-lived tokens last 60 days
    console.log('Token refresh would be handled server-side');
}

// Export function
window.loadInstagramFeed = loadInstagramFeed;