import pMap from 'p-map'
import jsonfeedToAtom from 'jsonfeed-to-atom'

export default async function * feedsTemplate (args) {
  const {
    vars: {
      siteName,
      homePageUrl,
      authorName,
      authorUrl,
      authorImgUrl
    },
    pages
  } = args
  const blogPosts = pages
    .filter(page => page.page.path.startsWith('blog/') && page.vars.layout === 'blog')
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
        date_published: page.vars.publishDate,
        title: page.vars.title,
        url: `${homePageUrl}/${page.page.path}/`,
        id: `${homePageUrl}/${page.page.path}/#${page.vars.publishDate}`,
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
