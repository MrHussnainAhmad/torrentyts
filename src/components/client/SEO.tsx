import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    imageAlt?: string;
    canonical?: string;
    schema?: any;
    robots?: string;
    themeColor?: string;
    siteName?: string;
    ogType?: string;
    locale?: string;
    twitterSite?: string;
    twitterCreator?: string;
}

export default function SEO({
    title,
    description,
    keywords,
    image,
    imageAlt,
    canonical,
    schema,
    robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    themeColor = "#171717",
    siteName,
    ogType = "website",
    locale = "en_US",
    twitterSite,
    twitterCreator
}: SEOProps) {
    const router = useRouter();
    const resolvedSiteName = siteName || process.env.NEXT_PUBLIC_SITE_NAME || "YTS";
    const defaultDescription = "Stream and download high-quality movies with fast, clean listings.";

    const fullTitle = title ? `${title} - ${resolvedSiteName}` : resolvedSiteName;
    const metaDescription = description || defaultDescription;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://torrentyts.vercel.app';
    const fullCanonical = canonical || `${siteUrl}${router.asPath === '/' ? '' : router.asPath.split('?')[0]}`;
    const metaImage = image || `${siteUrl}/favicon.ico`; // Fallback image
    const metaKeywords = keywords || "movies, torrent, yts, yts 2, stream, watch movies, hd movies, movie torrents";
    const metaImageAlt = imageAlt || fullTitle;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={metaKeywords} />
            <meta name="robots" content={robots} />
            <meta name="theme-color" content={themeColor} />
            <link rel="canonical" href={fullCanonical} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:site_name" content={resolvedSiteName} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:alt" content={metaImageAlt} />
            <meta property="og:locale" content={locale} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullCanonical} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />
            <meta property="twitter:image:alt" content={metaImageAlt} />
            {twitterSite && <meta name="twitter:site" content={twitterSite} />}
            {twitterCreator && <meta name="twitter:creator" content={twitterCreator} />}

            {/* Structured Data */}
            {schema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
                />
            )}
        </Head>
    );
}
