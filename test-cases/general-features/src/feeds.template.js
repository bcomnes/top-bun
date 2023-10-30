/* eslint-disable dot-notation */
import pMap from 'p-map'
// @ts-ignore
import jsonfeedToAtom from 'jsonfeed-to-atom'

/**
 * @template T
 * @typedef {import('../../../index.js').TemplateAsyncIterator<T>} TemplateAsyncIterator
 */

/** @type {TemplateAsyncIterator<{
  *  title: string,
  *  layout: string,
  *  siteName: string,
  *  homePageUrl: string,
  *  authorName: string,
  *  authorUrl: string,
  *  authorImgUrl: string,
  *  publishDate: string
  * }>}
*/
export default async function * feedsTemplate ({
  vars: {
    siteName,
    homePageUrl,
    authorName,
    authorUrl,
    authorImgUrl
  },
  pages
}) {
  const blogPosts = pages
    // @ts-ignore
    .filter(page => page.pageInfo.path.startsWith('blog/') && page.vars['layout'] === 'blog')
    // @ts-ignore
    .sort((a, b) => new Date(b.vars.publishDate) - new Date(a.vars.publishDate))
    .slice(0, 10)

  const jsonFeed = {
    version: 'https://jsonfeed.org/version/1',
    title: siteName,
    home_page_url: homePageUrl,
    feed_url: `${homePageUrl}/feed.json`,
    description: 'A running log of announcements, projects and accomplishments.',
    author: {
      name: authorName,
      url: authorUrl,
      avatar: authorImgUrl
    },
    items: await pMap(blogPosts, async (page) => {
      return {
        // eslint-disable-next-line dot-notation
        date_published: page.vars['publishDate'],
        title: page.vars['title'],
        url: `${homePageUrl}/${page.pageInfo.path}/`,
        id: `${homePageUrl}/${page.pageInfo.path}/#${page.vars['publishDate']}`,
        content_html: await page.renderInnerPage({ pages })
      }
    }, { concurrency: 4 })
  }

  yield {
    content: JSON.stringify(jsonFeed, null, '  '),
    outputName: './feeds/feed.json'
  }

  yield {
    content: jsonfeedToAtom(jsonFeed),
    outputName: './feeds/feed.xml'
  }
}
