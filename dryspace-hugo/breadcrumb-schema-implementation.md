# BreadcrumbList Schema Implementation Guide

## Overview
I've created a breadcrumb schema partial that can be integrated into your Hugo theme to add BreadcrumbList structured data to all pages.

## Files Created

### 1. `/layouts/partials/breadcrumb-schema.html`
This partial generates BreadcrumbList schema markup dynamically based on the current page URL.

## Implementation Instructions

### Option 1: Add to Existing Base Template
If you have a `baseof.html` or similar base template, add this line in the `<head>` section:

```html
{{ partial "breadcrumb-schema.html" . }}
```

### Option 2: Add to Individual Templates
For page templates like `single.html`, `list.html`, etc., add the partial call in the `<head>` section:

```html
<head>
  <!-- existing head content -->
  {{ partial "breadcrumb-schema.html" . }}
</head>
```

### Option 3: Create a Base Template
Create `/layouts/_default/baseof.html`:

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{ .Title }} | {{ .Site.Title }}</title>
  
  <!-- Breadcrumb Schema -->
  {{ partial "breadcrumb-schema.html" . }}
  
  {{ block "head" . }}{{ end }}
</head>
<body>
  {{ block "main" . }}{{ end }}
</body>
</html>
```

## How It Works

The breadcrumb schema partial:
1. Parses the current page URL
2. Creates a breadcrumb trail from Home to the current page
3. Humanizes URL segments for display names
4. Generates proper JSON-LD structured data

## Example Output

For a page at `/services/basement-waterproofing/`, it generates:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://dryspacewaterproofing.ca/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Services",
      "item": "https://dryspacewaterproofing.ca/services/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Basement Waterproofing",
      "item": "https://dryspacewaterproofing.ca/services/basement-waterproofing/"
    }
  ]
}
```

## Benefits

1. **SEO Enhancement**: Helps search engines understand site structure
2. **Rich Snippets**: May display breadcrumbs in search results
3. **Voice Search**: Improves context for voice assistants
4. **User Experience**: Provides clear navigation context

## Testing

After implementation, test using:
1. Google's Rich Results Test: https://search.google.com/test/rich-results
2. Schema.org validator: https://validator.schema.org/
3. View page source to verify JSON-LD output

## Customization

To customize breadcrumb names, you can modify the partial to:
- Use page `.Title` instead of humanized URL segments
- Add custom name mappings for specific paths
- Exclude certain pages from breadcrumbs