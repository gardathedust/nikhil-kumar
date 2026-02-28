/**
 * seo.js — Shared SEO framework for nikhil-kumar.com
 * 
 * Auto-injects: canonical URL, JSON-LD structured data, OG URL,
 * and common meta tags. Each page only needs to set window.SEO_DATA
 * before loading this script for page-specific overrides.
 *
 * Usage in HTML (before </head>):
 *   <script>
 *     window.SEO_DATA = { type: 'article', datePublished: '2025-01-08' };
 *   </script>
 *   <script src="js/seo.js"></script>
 */

(function () {
  var SITE = 'https://nikhil-kumar.com';
  var AUTHOR = 'Nikhil Kumar';
  var DEFAULT_IMAGE = SITE + '/images/nikhil-kumar.jpg';
  var SOCIAL = {
    linkedin: 'https://www.linkedin.com/in/nikhil745',
    twitter: 'https://x.com/gardathedust'
  };

  // Page-specific overrides (set by each page before loading this script)
  var data = window.SEO_DATA || {};

  // --- Canonical URL ---
  var path = window.location.pathname;
  // Normalize: /index.html → /
  if (path === '/index.html') path = '/';
  var canonical = SITE + path;

  if (!document.querySelector('link[rel="canonical"]')) {
    var link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonical;
    document.head.appendChild(link);
  }

  // --- OG URL ---
  if (!document.querySelector('meta[property="og:url"]')) {
    var ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.content = canonical;
    document.head.appendChild(ogUrl);
  }

  // --- OG Image fallback ---
  var ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && ogImage.content.indexOf('placeholder.com') !== -1) {
    ogImage.content = DEFAULT_IMAGE;
  }
  if (!ogImage) {
    ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.content = data.image || DEFAULT_IMAGE;
    document.head.appendChild(ogImage);
  }

  // --- Twitter Image fallback ---
  var twImage = document.querySelector('meta[name="twitter:image"]');
  if (twImage && twImage.content.indexOf('placeholder.com') !== -1) {
    twImage.content = DEFAULT_IMAGE;
  }
  if (!twImage) {
    twImage = document.createElement('meta');
    twImage.name = 'twitter:image';
    twImage.content = data.image || DEFAULT_IMAGE;
    document.head.appendChild(twImage);
  }

  // --- OG site_name ---
  if (!document.querySelector('meta[property="og:site_name"]')) {
    var ogSite = document.createElement('meta');
    ogSite.setAttribute('property', 'og:site_name');
    ogSite.content = 'Nikhil Kumar';
    document.head.appendChild(ogSite);
  }

  // --- OG locale ---
  if (!document.querySelector('meta[property="og:locale"]')) {
    var ogLocale = document.createElement('meta');
    ogLocale.setAttribute('property', 'og:locale');
    ogLocale.content = 'en_US';
    document.head.appendChild(ogLocale);
  }

  // --- Twitter site handle ---
  if (!document.querySelector('meta[name="twitter:site"]')) {
    var twSite = document.createElement('meta');
    twSite.name = 'twitter:site';
    twSite.content = '@gardathedust';
    document.head.appendChild(twSite);
  }

  // --- JSON-LD Structured Data ---
  var pageType = data.type || 'WebPage'; // 'article', 'course', 'profile'
  var title = document.title;
  var descMeta = document.querySelector('meta[name="description"]');
  var description = descMeta ? descMeta.content : '';

  var jsonLd;

  if (pageType === 'article') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': title,
      'description': description,
      'url': canonical,
      'image': data.image || DEFAULT_IMAGE,
      'datePublished': data.datePublished || '2026-02-28',
      'dateModified': data.dateModified || data.datePublished || '2026-02-28',
      'author': {
        '@type': 'Person',
        'name': AUTHOR,
        'url': SITE,
        'sameAs': [SOCIAL.linkedin, SOCIAL.twitter]
      },
      'publisher': {
        '@type': 'Person',
        'name': AUTHOR,
        'url': SITE
      },
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonical
      }
    };
  } else if (pageType === 'course') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      'name': data.courseName || title,
      'description': description,
      'url': canonical,
      'provider': {
        '@type': 'Person',
        'name': AUTHOR,
        'url': SITE,
        'sameAs': [SOCIAL.linkedin, SOCIAL.twitter]
      },
      'isAccessibleForFree': true,
      'hasCourseInstance': {
        '@type': 'CourseInstance',
        'courseMode': 'online',
        'courseWorkload': data.courseWorkload || 'PT6H'
      }
    };
    if (data.sections) {
      jsonLd['numberOfCredits'] = data.sections;
    }
  } else if (pageType === 'profile') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      'mainEntity': {
        '@type': 'Person',
        'name': AUTHOR,
        'url': SITE,
        'jobTitle': 'Director of Product Management',
        'worksFor': {
          '@type': 'Organization',
          'name': 'Makemytrip'
        },
        'alumniOf': {
          '@type': 'CollegeOrUniversity',
          'name': 'Indian Institute of Technology Kharagpur'
        },
        'sameAs': [SOCIAL.linkedin, SOCIAL.twitter],
        'image': DEFAULT_IMAGE,
        'description': description
      }
    };
  } else {
    // Generic WebPage / WebSite
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': title,
      'description': description,
      'url': canonical,
      'author': {
        '@type': 'Person',
        'name': AUTHOR,
        'url': SITE,
        'sameAs': [SOCIAL.linkedin, SOCIAL.twitter]
      }
    };

    // Add WebSite schema on homepage for sitelinks search box
    if (path === '/' || path === '/index.html') {
      jsonLd = [
        jsonLd,
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'Nikhil Kumar',
          'url': SITE,
          'author': {
            '@type': 'Person',
            'name': AUTHOR
          }
        }
      ];
    }
  }

  var script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(jsonLd);
  document.head.appendChild(script);

})();
