// Web Vitals monitoring for 2025 performance standards

// Only load in production
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // Lazy load the web-vitals library
    window.addEventListener('load', function() {
        setTimeout(function() {
            import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({onCLS, onFID, onFCP, onLCP, onTTFB, onINP}) => {
                // Log metrics to console in development
                function logMetric(metric) {
                    console.log(`${metric.name}: ${metric.value}`);
                    
                    // Send to analytics if available
                    if (window.gtag) {
                        gtag('event', metric.name, {
                            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                            metric_id: metric.id,
                            metric_value: metric.value,
                            metric_delta: metric.delta,
                        });
                    }
                }
                
                // Track all Core Web Vitals
                onCLS(logMetric);      // Cumulative Layout Shift
                onFID(logMetric);      // First Input Delay (legacy)
                onFCP(logMetric);      // First Contentful Paint
                onLCP(logMetric);      // Largest Contentful Paint
                onTTFB(logMetric);     // Time to First Byte
                onINP(logMetric);      // Interaction to Next Paint (new standard)
            });
        }, 3000); // Delay to not impact initial load
    });
}