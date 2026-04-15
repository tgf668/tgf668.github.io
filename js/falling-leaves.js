document.addEventListener('DOMContentLoaded', () => {
    // Only apply effect to home page (index)
    if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
        return;
    }

    // Create the toggle button UI matching Reimu's circular sidebar buttons
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'leaf-toggle-container';
    toggleBtn.title = '切换落叶效果';
    toggleBtn.innerHTML = '🍂';
    document.body.appendChild(toggleBtn);

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
        if (isLeavesEnabled) {
            toggleBtn.style.opacity = '1';
            toggleBtn.style.filter = 'grayscale(0%)';
            if (!leafInterval) {
                // Generate a leaf every 150ms for a dense forest effect
                leafInterval = setInterval(createLeaf, 150);
            }
        } else {
            toggleBtn.style.opacity = '0.7';
            toggleBtn.style.filter = 'grayscale(100%)';
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

    // Initialize the effect based on user's saved preference
    toggleLeaves();
});
