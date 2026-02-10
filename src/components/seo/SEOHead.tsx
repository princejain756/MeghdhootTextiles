import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title: string;
    description: string;
    canonical?: string;
    keywords?: string;
    ogType?: 'website' | 'article';
    ogImage?: string;
    schema?: Record<string, unknown> | Record<string, unknown>[];
    noindex?: boolean;
}

const SEOHead = ({
    title,
    description,
    canonical,
    keywords,
    ogType = 'website',
    ogImage = 'https://meghdoottextiles.com/og-image.jpg',
    schema,
    noindex = false,
}: SEOHeadProps) => {
    const fullTitle = title.includes('Meghdoot') ? title : `${title} | Meghdoot Textiles`;
    const canonicalUrl = canonical || (typeof window !== 'undefined' ? window.location.href : '');

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph */}
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Meghdoot Textiles" />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Robots */}
            {noindex && <meta name="robots" content="noindex, nofollow" />}

            {/* Schema.org JSON-LD */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(Array.isArray(schema) ? schema : [schema])}
                </script>
            )}
        </Helmet>
    );
};

export default SEOHead;
