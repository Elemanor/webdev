/**
 * Performance Monitoring - Marcus Rodriguez
 * Track Core Web Vitals and HEAD optimization metrics
 */

(function() {
  'use strict';

  // Only run in production
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Performance monitoring disabled in development');
    return;
  }

  // Performance API feature detection
  if (!('performance' in window) || !('PerformanceObserver' in window)) {
    console.warn('Performance API not supported');
    return;
  }

  const metrics = {
    FCP: 0,
    LCP: 0,
    FID: 0,
    CLS: 0,
    TTFB: 0,
    INP: 0,
    headParseTime: 0,
    renderBlockingCSS: 0,
    renderBlockingJS: 0,
    totalBlockingTime: 0
  };

  /**
   * Calculate HEAD parse time
   */
  function measureHeadPerformance() {
    const headMarks = performance.getEntriesByName('head-parse', 'measure');
    if (headMarks.length > 0) {
      metrics.headParseTime = Math.round(headMarks[0].duration);
      console.log('HEAD parse time:', metrics.headParseTime + 'ms');
    }

    // Count render-blocking resources
    const resources = performance.getEntriesByType('resource');
    resources.forEach(resource => {
      if (resource.renderBlockingStatus === 'blocking') {
        if (resource.name.includes('.css')) {
          metrics.renderBlockingCSS++;
        } else if (resource.name.includes('.js')) {
          metrics.renderBlockingJS++;
        }
      }
    });
  }

  /**
   * First Contentful Paint
   */
  function measureFCP() {
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          metrics.FCP = Math.round(entries[0].startTime);
          console.log('FCP:', metrics.FCP + 'ms');
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.error('FCP measurement failed:', e);
    }
  }

  /**
   * Largest Contentful Paint
   */
  function measureLCP() {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.LCP = Math.round(lastEntry.startTime);
        console.log('LCP:', metrics.LCP + 'ms');
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.error('LCP measurement failed:', e);
    }
  }

  /**
   * First Input Delay
   */
  function measureFID() {
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        if (entries.length > 0) {
          const firstInput = entries[0];
          metrics.FID = Math.round(firstInput.processingStart - firstInput.startTime);
          console.log('FID:', metrics.FID + 'ms');
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.error('FID measurement failed:', e);
    }
  }

  /**
   * Cumulative Layout Shift
   */
  function measureCLS() {
    let clsValue = 0;
    let clsEntries = [];

    try {
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push({
              value: entry.value,
              sources: entry.sources
            });
          }
        }
        metrics.CLS = Math.round(clsValue * 1000) / 1000;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.error('CLS measurement failed:', e);
    }
  }

  /**
   * Time to First Byte
   */
  function measureTTFB() {
    const navigation = performance.getEntriesByType('navigation')[0];
    if (navigation) {
      metrics.TTFB = Math.round(navigation.responseStart - navigation.fetchStart);
      console.log('TTFB:', metrics.TTFB + 'ms');
    }
  }

  /**
   * Total Blocking Time
   */
  function measureTBT() {
    let totalBlockingTime = 0;
    
    try {
      const tbtObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 50) {
            totalBlockingTime += (entry.duration - 50);
          }
        }
        metrics.totalBlockingTime = Math.round(totalBlockingTime);
      });
      tbtObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.error('TBT measurement failed:', e);
    }
  }

  /**
   * Send metrics to analytics
   */
  function reportMetrics() {
    // Log metrics
    console.log('=== Core Web Vitals ===');
    console.log('LCP:', metrics.LCP + 'ms (target: <2500ms)');
    console.log('FID:', metrics.FID + 'ms (target: <100ms)');
    console.log('CLS:', metrics.CLS + ' (target: <0.1)');
    console.log('=== Additional Metrics ===');
    console.log('FCP:', metrics.FCP + 'ms');
    console.log('TTFB:', metrics.TTFB + 'ms (target: <800ms)');
    console.log('TBT:', metrics.totalBlockingTime + 'ms');
    console.log('HEAD parse:', metrics.headParseTime + 'ms');
    console.log('Render-blocking CSS:', metrics.renderBlockingCSS);
    console.log('Render-blocking JS:', metrics.renderBlockingJS);

    // Send to Google Analytics if available
    if (window.gtag) {
      // Core Web Vitals
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        lcp: metrics.LCP,
        fid: metrics.FID,
        cls: metrics.CLS,
        fcp: metrics.FCP,
        ttfb: metrics.TTFB
      });

      // HEAD optimization metrics
      gtag('event', 'head_optimization', {
        event_category: 'Performance',
        head_parse_time: metrics.headParseTime,
        render_blocking_css: metrics.renderBlockingCSS,
        render_blocking_js: metrics.renderBlockingJS,
        total_blocking_time: metrics.totalBlockingTime
      });
    }

    // Check against thresholds
    checkPerformanceThresholds();
  }

  /**
   * Check performance against targets
   */
  function checkPerformanceThresholds() {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 },
      headParseTime: { good: 50, poor: 200 }
    };

    let status = 'good';

    // Check each metric
    Object.keys(thresholds).forEach(metric => {
      if (metrics[metric] > thresholds[metric].poor) {
        status = 'poor';
        console.warn(`⚠️ ${metric} is poor: ${metrics[metric]}`);
      } else if (metrics[metric] > thresholds[metric].good) {
        if (status !== 'poor') status = 'needs-improvement';
        console.warn(`⚠️ ${metric} needs improvement: ${metrics[metric]}`);
      }
    });

    // Add performance class to body
    document.body.classList.add(`performance-${status}`);

    // Show warning if performance is poor
    if (status === 'poor' && window.location.hostname !== 'localhost') {
      console.error('🚨 Poor performance detected! Check Core Web Vitals.');
    }
  }

  /**
   * Initialize all measurements
   */
  function init() {
    // Measure HEAD performance
    if (document.readyState === 'complete') {
      measureHeadPerformance();
    } else {
      window.addEventListener('load', measureHeadPerformance);
    }

    // Core Web Vitals
    measureFCP();
    measureLCP();
    measureFID();
    measureCLS();
    measureTTFB();
    measureTBT();

    // Report metrics after page load
    if (document.readyState === 'complete') {
      setTimeout(reportMetrics, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(reportMetrics, 1000);
      });
    }
  }

  // Start monitoring
  init();

  // Expose API for debugging
  window.PerformanceMonitor = {
    getMetrics: () => metrics,
    reportMetrics: reportMetrics,
    checkThresholds: checkPerformanceThresholds
  };
})();