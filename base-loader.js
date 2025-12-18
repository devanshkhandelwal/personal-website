// Load base content from base.html
async function loadBase() {
  try {
    const response = await fetch('base.html');
    const html = await response.text();
    
    // Parse the HTML
    const parser = new DOMParser();
    const baseDoc = parser.parseFromString(html, 'text/html');
    
    // Get head elements we need to inject
    const headElements = baseDoc.head.querySelectorAll('link, style');
    const currentHead = document.head;
    
    // Inject fonts and styles (only if not already present)
    headElements.forEach(el => {
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'link') {
        const rel = el.getAttribute('rel');
        const href = el.getAttribute('href');
        // Check if link already exists
        const exists = Array.from(currentHead.querySelectorAll('link')).some(
          link => link.getAttribute('rel') === rel && link.getAttribute('href') === href
        );
        if (!exists) {
          currentHead.appendChild(el.cloneNode(true));
        }
      } else if (tagName === 'style') {
        // Check if style already exists by checking if we already have the font-family style
        const existingStyle = currentHead.querySelector('style');
        if (!existingStyle || !existingStyle.textContent.includes('Space Grotesk')) {
          currentHead.appendChild(el.cloneNode(true));
        }
      }
    });
    
    // Get and inject navigation
    const nav = baseDoc.body.querySelector('nav');
    if (nav && !document.body.querySelector('nav')) {
      // Insert nav at the beginning of body
      document.body.insertBefore(nav.cloneNode(true), document.body.firstChild);
    }
  } catch (error) {
    console.error('Error loading base.html:', error);
  }
}

// Load base content when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadBase);
} else {
  loadBase();
}

