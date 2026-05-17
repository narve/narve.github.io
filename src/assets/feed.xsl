<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title>RSS feed — <xsl:value-of select="/atom:feed/atom:title"/></title>
        <link rel="stylesheet" href="/assets/css/style.css"/>
        <style>
          .feed-banner {
            background: #fffbe6;
            border: 1px solid #f0d97a;
            padding: 0.75rem 1rem;
            border-radius: 4px;
            margin-bottom: 2rem;
            font-size: 0.95rem;
          }
          .feed-banner code {
            background: #fff3bf;
          }
          .entry {
            padding: 1rem 0;
            border-bottom: 1px solid var(--rule);
          }
          .entry h2 {
            margin: 0 0 0.25rem;
            font-size: 1.1rem;
          }
          .entry time {
            color: var(--muted);
            font-size: 0.875rem;
          }
          .entry .summary {
            margin-top: 0.5rem;
            color: #333;
          }
        </style>
      </head>
      <body>
        <header class="site-header">
          <a class="site-title" href="/"><xsl:value-of select="/atom:feed/atom:title"/></a>
          <nav>
            <a href="/">Home</a>
            <a href="/about/">About</a>
            <a href="/tags/">Tags</a>
            <a href="/search/">Search</a>
          </nav>
        </header>
        <main>
          <div class="feed-banner">
            <strong>This is a web feed.</strong> It's meant to be read by a feed reader (e.g. NetNewsWire, Feedly, Miniflux).
            Copy this page's URL into your reader, or visit the <a href="/">site itself</a>.
          </div>

          <h1><xsl:value-of select="/atom:feed/atom:title"/></h1>
          <p><xsl:value-of select="/atom:feed/atom:subtitle"/></p>

          <section>
            <xsl:for-each select="/atom:feed/atom:entry">
              <article class="entry">
                <h2>
                  <a>
                    <xsl:attribute name="href"><xsl:value-of select="atom:link/@href"/></xsl:attribute>
                    <xsl:value-of select="atom:title"/>
                  </a>
                </h2>
                <time>
                  <xsl:attribute name="datetime"><xsl:value-of select="atom:updated"/></xsl:attribute>
                  <xsl:value-of select="substring(atom:updated, 1, 10)"/>
                </time>
                <xsl:if test="atom:summary">
                  <p class="summary"><xsl:value-of select="atom:summary"/></p>
                </xsl:if>
              </article>
            </xsl:for-each>
          </section>
        </main>
        <footer class="site-footer">
          <p>Atom feed · viewed via stylesheet</p>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
