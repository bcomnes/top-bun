import markdownItContainer from 'markdown-it-container'

/**
 * Customize the markdown-it instance with additional plugins
 * @param {import('markdown-it')} md - The markdown-it instance
 * @returns {import('markdown-it')} - The modified markdown-it instance
 */
export default async function markdownItSettingsOverride (md) {
  // Add custom container for warnings
  md.use(markdownItContainer, 'warning', {
    validate: function (params) {
      return params.trim().match(/^warning\s*(.*)$/)
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^warning\s*(.*)$/)
      if (tokens[idx].nesting === 1) {
        const title = (m && m.length > 1) ? m[1] : 'Warning'
        return '<div class="custom-warning">\n<div class="warning-title">' + md.utils.escapeHtml(title) + '</div>\n<div class="warning-content">\n'
      } else {
        return '</div>\n</div>\n'
      }
    }
  })

  // Add custom container for info boxes
  md.use(markdownItContainer, 'info', {
    validate: function (params) {
      return params.trim().match(/^info\s*(.*)$/)
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^info\s*(.*)$/)
      if (tokens[idx].nesting === 1) {
        const title = (m && m.length > 1) ? m[1] : 'Info'
        return '<div class="custom-info">\n<div class="info-title">' + md.utils.escapeHtml(title) + '</div>\n<div class="info-content">\n'
      } else {
        return '</div>\n</div>\n'
      }
    }
  })

  // Add custom container for collapsible sections
  md.use(markdownItContainer, 'details', {
    validate: function (params) {
      return params.trim().match(/^details\s+(.*)$/)
    },
    render: function (tokens, idx) {
      const m = tokens[idx].info.trim().match(/^details\s+(.*)$/)
      if (tokens[idx].nesting === 1) {
        return '<details>\n<summary>' + md.utils.escapeHtml(m[1]) + '</summary>\n<div class="details-content">\n'
      } else {
        return '</div>\n</details>\n'
      }
    }
  })

  // Customize existing renderer - add custom classes to code blocks
  md.renderer.rules.code_block = function (tokens, idx, options, env, renderer) {
    const token = tokens[idx]
    const content = token.content
    const langName = token.info || ''

    return `<pre class="custom-code-block"><code class="language-${langName}">${md.utils.escapeHtml(content)}</code></pre>\n`
  }

  return md
}
