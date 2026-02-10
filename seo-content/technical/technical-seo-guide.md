# Technical SEO Guide for Meghdoot Textiles

## robots.txt Configuration

```
# robots.txt for meghdoottextiles.com

User-agent: *
Allow: /

# Block admin areas
Disallow: /admin/
Disallow: /wp-admin/
Disallow: /login/
Disallow: /cart/
Disallow: /checkout/
Disallow: /account/

# Block duplicate/utility pages
Disallow: /search/
Disallow: /*?*sort=
Disallow: /*?*filter=
Disallow: /*?*page=
Disallow: /tag/

# Sitemap location
Sitemap: https://meghdoottextiles.com/sitemap.xml
```

---

## XML Sitemap Structure

### Main Sitemap Index (sitemap.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://meghdoottextiles.com/sitemap-pages.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://meghdoottextiles.com/sitemap-blogs.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://meghdoottextiles.com/sitemap-products.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
</sitemapindex>
```

### Priority Guidelines

| Page Type | Priority | Change Frequency |
|-----------|----------|------------------|
| Homepage | 1.0 | weekly |
| Pillar pages | 0.9 | weekly |
| Category pages | 0.8 | weekly |
| City pages | 0.7 | monthly |
| Brand defense | 0.7 | monthly |
| Blog posts | 0.6 | monthly |
| Products | 0.5 | weekly |

---

## Canonical URL Rules

### Guidelines

1. **All pages must have canonical tags**
2. **Self-referential canonical on unique pages**
3. **Avoid duplicate content issues**

### Implementation

```html
<!-- Homepage -->
<link rel="canonical" href="https://meghdoottextiles.com/" />

<!-- Pillar pages -->
<link rel="canonical" href="https://meghdoottextiles.com/wholesale-sarees/" />

<!-- Category pages -->
<link rel="canonical" href="https://meghdoottextiles.com/wholesale-sarees/cotton/" />

<!-- City pages -->
<link rel="canonical" href="https://meghdoottextiles.com/wholesale-sarees-bengaluru/" />

<!-- Blog posts -->
<link rel="canonical" href="https://meghdoottextiles.com/blog/start-saree-business/" />
```

### Pagination Handling

For paginated collections:
- Canonical to first page OR
- Unique canonicals per page + rel="next/prev"

```html
<!-- Page 2 of category -->
<link rel="canonical" href="https://meghdoottextiles.com/wholesale-sarees/?page=2" />
<link rel="prev" href="https://meghdoottextiles.com/wholesale-sarees/" />
<link rel="next" href="https://meghdoottextiles.com/wholesale-sarees/?page=3" />
```

---

## Title Tag Templates

### Format by Page Type

| Page Type | Title Template |
|-----------|---------------|
| Homepage | Meghdoot Textiles | Wholesale Sarees, Kurtis, Lehengas | 25+ Years |
| Pillar | {Product} Wholesale | Bulk Catalog | MOQ {X} | GST Invoice |
| Category | {Product} {Type} Wholesale | {Benefit} | MOQ {X} |
| City | Wholesale {Product} in {City} | {Benefit} | {City} Supplier |
| Blog | {Title} | {Benefit Hook} | Expert Guide |
| Brand | {Brand} {Product} | {Type} | Official Page |

### Title Length

- Target: 50-60 characters
- Maximum: 70 characters (truncation happens)

---

## Meta Description Templates

### Format by Page Type

| Page Type | Length | Key Elements |
|-----------|--------|--------------|
| Pillar | 150-160 chars | Product + USP + MOQ + CTA |
| Category | 150-160 chars | Specific product + price hint + trust signal |
| City | 150-160 chars | City + product + local benefit |
| Blog | 150-160 chars | Value promise + outcome + audience |

### CTA Words to Use

- "Buy now"
- "Shop"
- "Order today"
- "WhatsApp for catalog"
- "MOQ from X pcs"

---

## Heading Structure (H1-H6)

### Rules

1. **One H1 per page** (matches page purpose)
2. **H2 for main sections**
3. **H3 for subsections**
4. **Keyword placement matters in H1, H2**

### Example Structure

```
H1: Wholesale Sarees in Bengaluru – Your Local Supplier

  H2: Why Choose a Bengaluru-Based Wholesaler?
  
  H2: Our Wholesale Saree Range
    H3: Cotton Sarees
    H3: Silk Sarees
    H3: Designer Sarees
    
  H2: Bengaluru Areas We Serve
  
  H2: How to Order
  
  H2: FAQs
    H3: Question 1
    H3: Question 2
```

---

## Schema Markup Guide

### Required Schema Types

| Page Type | Schema Types |
|-----------|-------------|
| Homepage | Organization, LocalBusiness |
| Pillar | BreadcrumbList, FAQPage, Product (aggregate) |
| Category | BreadcrumbList, FAQPage, ItemList |
| City | LocalBusiness, BreadcrumbList |
| Blog | BlogPosting, BreadcrumbList |
| Product | Product, Offer, AggregateRating |

### Organization Schema (Sitewide)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Meghdoot Textiles",
  "url": "https://meghdoottextiles.com",
  "logo": "https://meghdoottextiles.com/logo.png",
  "description": "Wholesale sarees, kurtis, and lehengas manufacturer with 25+ years experience.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Bengaluru",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "telephone": "+91-XXXXXXXXXX"
  },
  "sameAs": [
    "https://instagram.com/meghdoottextiles",
    "https://facebook.com/meghdoottextiles"
  ]
}
```

---

## Internal Linking Rules

### Link Anchor Text Guidelines

**Do:**
- Use descriptive anchor text
- Include keywords naturally
- Link to relevant pages
- Use variations (not exact match every time)

**Don't:**
- Over-optimize with exact match anchors
- Use "click here" or "read more"
- Link to same page multiple times with same anchor
- Force unnatural links

### Link Structure

1. **Pillar → Category pages** (and vice versa)
2. **City pages → Pillar pages**
3. **Blog → Pillar and Category pages**
4. **Related blog → blog**
5. **Category ↔ Category** (related products)

---

## Page Speed Optimization Checklist

- [ ] Compress images (WebP format)
- [ ] Lazy load images below fold
- [ ] Minify CSS and JavaScript
- [ ] Enable browser caching
- [ ] Use CDN for assets
- [ ] Optimize server response time
- [ ] Reduce third-party scripts
- [ ] Preload critical fonts

---

## Mobile SEO Checklist

- [ ] Responsive design
- [ ] Touch-friendly buttons (48px minimum)
- [ ] Readable font sizes (16px minimum)
- [ ] No horizontal scrolling
- [ ] Fast mobile page speed
- [ ] Mobile-friendly navigation
- [ ] Click-to-call phone numbers
- [ ] Mobile-friendly forms
