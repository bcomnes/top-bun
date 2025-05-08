import defaultRootLayout from './root.layout.js';
// @ts-ignore
import { html } from 'uhtml-isomorphic';
import type { LayoutFunction } from '../../../../index.js';

// Import SiteVars type from root layout
import type { SiteVars } from './root.layout.js';

type tsLayout = LayoutFunction<SiteVars>

export default function tsLayout(layoutVars: LayoutFunction<SiteVars>): string | HTMLElement {
  // @ts-ignore
  const { children: innerChildren, ...rest } = layoutVars;
  // @ts-ignore
  const vars = layoutVars.vars;

  const children = html`
    <article class="article-layout h-entry" itemscope itemtype="http://schema.org/NewsArticle">
      <header class="article-header">
        <h1 class="p-name article-title" itemprop="headline">${vars.title}</h1>
        <div class="metadata">
          <address class="author-info" itemprop="author" itemscope itemtype="http://schema.org/Person">
            ${vars.authorImgUrl
              ? html`<img height="40" width="40"  src="${vars.authorImgUrl}" alt="${vars.authorImgAlt}" class="u-photo" itemprop="image">`
              : null
            }
            ${vars.authorName && vars.authorUrl
              ? html`
                  <a href="${vars.authorUrl}" class="p-author h-card" itemprop="url">
                    <span itemprop="name">${vars.authorName}</span>
                  </a>`
              : null
            }
          </address>
          ${vars.publishDate
            ? html`
              <time class="dt-published" itemprop="datePublished" datetime="${vars.publishDate}">
                <a href="#" class="u-url">
                  ${(new Date(vars.publishDate)).toLocaleString()}
                </a>
              </time>`
            : null
          }
          ${vars.updatedDate
            ? html`<time class="dt-updated" itemprop="dateModified" datetime="${vars.updatedDate}">Updated ${(new Date(vars.updatedDate)).toLocaleString()}</time>`
            : null
          }
        </div>
      </header>

      <section class="e-content" itemprop="articleBody">
        ${typeof innerChildren === 'string'
          ? html([innerChildren])
          : innerChildren /* Support both uhtml and string children. Optional. */
        }
      </section>

      <!--
        <footer>
            <p>Footer notes or related info here...</p>
        </footer>
      -->
    </article>
  `;

  const rootArgs = { ...rest, children };
  // @ts-ignore
  return defaultRootLayout(rootArgs);
}
