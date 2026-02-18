import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    robots?: string;
    themeColor?: string;
}

export default function SEO({
    title,
    description,
    keywords,
    image,
    canonical,
    schema,
    robots = "index, follow",
    themeColor = "#171717"
}: SEOProps) {
    const router = useRouter();
    const siteName = "YTS"; // Matches updated branding
    const defaultDescription = "High-quality content, free to download via torrent. Fast and clean.";

    const fullTitle = title ? `${title} - ${siteName}` : siteName;
    const metaDescription = description || defaultDescription;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://torrentyts.vercel.app';
    const fullCanonical = canonical || `${siteUrl}${router.asPath === '/' ? '' : router.asPath.split('?')[0]}`;
    const metaImage = image || `${siteUrl}/favicon.ico`; // Fallback image
    const metaKeywords = keywords || "legal movies, public domain, open content, educational torrents, free downloads";

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
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:url" content={fullCanonical} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullCanonical} />
            <meta property="twitter:title" content={fullTitle} />
            <meta property="twitter:description" content={metaDescription} />
            <meta property="twitter:image" content={metaImage} />

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
