document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('nav-leaves-btn');
    if (!toggleBtn) return;

    // Get the wrap container where we will insert leaves (behind content, in front of header)
    const wrapContainer = document.getElementById('wrap') || document.body;

    // Initial state based on localStorage
    let isLeavesEnabled = localStorage.getItem('leaves-enabled') === 'true';
    let leafInterval = null;
    let activeLeaves = [];

    // Colors matching "秋之森" (autumn colors)
    const leafColors = [
        '#f8d363', // Golden
        '#ffb347', // Orange
        '#e25822', // Red-Orange
        '#8b4513', // Brown
        '#d2691e', // Chocolate
        '#cd5c5c'  // Indian Red
    ];

    const createLeaf = () => {
        const leaf = document.createElement('div');
        leaf.className = 'falling-leaf';
        
        // Randomize leaf properties for density (size 8px to 22px)
        const size = Math.random() * 14 + 8;
        leaf.style.width = `${size}px`;
        leaf.style.height = `${size}px`;
        
        // Pick random autumn color
        leaf.style.backgroundColor = leafColors[Math.floor(Math.random() * leafColors.length)];
        
        // Random start horizontal position
        leaf.style.left = `${Math.random() * 100}vw`;
        
        // Fall speed: 3s to 8s (faster, more dynamic)
        const fallDuration = Math.random() * 5 + 3;
        // Sway speed: 1.5s to 3s
        const swayDuration = Math.random() * 1.5 + 1.5;
        
        // Apply animations
        leaf.style.animation = `fall ${fallDuration}s linear forwards, sway ${swayDuration}s ease-in-out infinite alternate`;
        
        wrapContainer.appendChild(leaf);
        activeLeaves.push(leaf);
        
        // Remove leaf after it finishes falling
        setTimeout(() => {
            if (leaf.parentNode) {
                leaf.parentNode.removeChild(leaf);
            }
            activeLeaves = activeLeaves.filter(l => l !== leaf);
        }, fallDuration * 1000);
    };

    const toggleLeaves = () => {
        toggleBtn.hidden = !document.querySelector('.forest-home-title');
        toggleBtn.setAttribute('aria-pressed', String(isLeavesEnabled));
        if (isLeavesEnabled && !toggleBtn.hidden) {
            if (!leafInterval) {
                // Generate a leaf every 150ms for a dense forest effect
                leafInterval = setInterval(createLeaf, 150);
            }
        } else {
            if (leafInterval) {
                clearInterval(leafInterval);
                leafInterval = null;
            }
            // Clear current falling leaves instantly
            activeLeaves.forEach(leaf => {
                if (leaf.parentNode) {
                    leaf.parentNode.removeChild(leaf);
                }
            });
            activeLeaves = [];
        }
    };

    // Toggle click event
    toggleBtn.addEventListener('click', () => {
        isLeavesEnabled = !isLeavesEnabled;
        localStorage.setItem('leaves-enabled', isLeavesEnabled);
        toggleLeaves();
    });

    window.addEventListener('pjax:complete', toggleLeaves);
    toggleLeaves();
});
