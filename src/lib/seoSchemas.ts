// Common schema generators for SEO pages

export const createBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url
    }))
});

export const createFAQSchema = (faqs: { question: string; answer: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
});

export const createOrganizationSchema = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Meghdoot Textiles",
    "url": "https://meghdoottextiles.com",
    "logo": "https://meghdoottextiles.com/logo.png",
    "description": "Wholesale sarees, kurtis, and lehengas manufacturer with 25+ years experience in Bengaluru.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "No.82, J M Road, Avenue Road Cross",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560002",
        "addressCountry": "IN"
    },
    "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "sales",
        "telephone": "+91-9342503401",
        "email": "wholesale@meghdoottextiles.com"
    },
    "sameAs": [
        "https://instagram.com/meghdoottextiles",
        "https://facebook.com/meghdoottextiles"
    ]
});

export const createLocalBusinessSchema = (city: string) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": `Meghdoot Textiles - Wholesale ${city}`,
    "description": `Wholesale sarees supplier serving retailers in ${city}. 25+ years experience, GST invoicing, fast dispatch.`,
    "url": `https://meghdoottextiles.com/wholesale-sarees-${city.toLowerCase()}`,
    "telephone": "+91-9342503401",
    "email": "wholesale@meghdoottextiles.com",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "No.82, J M Road, Avenue Road Cross",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560002",
        "addressCountry": "IN"
    },
    "areaServed": {
        "@type": "City",
        "name": city
    },
    "priceRange": "₹₹",
    "openingHours": "Mo-Sa 09:00-18:00"
});

export const createProductSchema = (product: {
    name: string;
    description: string;
    image?: string;
    priceRange: string;
    category: string;
    lowPrice?: number;
    highPrice?: number;
}) => {
    // Parse price range like "₹200-₹1,200" or "₹200 - ₹10,000"
    const priceMatch = product.priceRange.match(/₹([\d,]+)\s*[-–]\s*₹([\d,]+)/);
    const lowPrice = product.lowPrice || (priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : 200);
    const highPrice = product.highPrice || (priceMatch ? parseInt(priceMatch[2].replace(/,/g, '')) : 10000);

    return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image || "https://meghdoottextiles.com/og-image.jpg",
        "brand": {
            "@type": "Brand",
            "name": "Meghdoot Textiles"
        },
        "category": product.category,
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "INR",
            "lowPrice": lowPrice,
            "highPrice": highPrice,
            "offerCount": "500+",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@type": "Organization",
                "name": "Meghdoot Textiles"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "127",
            "bestRating": "5",
            "worstRating": "1"
        }
    };
};

export const createBlogPostSchema = (post: {
    title: string;
    description: string;
    datePublished: string;
    dateModified?: string;
    author?: string;
    image?: string;
    url: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "datePublished": post.datePublished,
    "dateModified": post.dateModified || post.datePublished,
    "author": {
        "@type": "Organization",
        "name": post.author || "Meghdoot Textiles"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Meghdoot Textiles",
        "logo": {
            "@type": "ImageObject",
            "url": "https://meghdoottextiles.com/logo.png"
        }
    },
    "image": post.image || "https://meghdoottextiles.com/og-image.jpg",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": post.url
    }
});
