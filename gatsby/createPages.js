const replacePath = require('./utils')
const path = require("path")

module.exports = exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  const postTemplate = path.resolve(`src/templates/postTemplate.js`)

  return graphql(`
    {
      allContentfulItem(sort: { order:ASC, fields: [section___order, order] }) {
        edges {
          node {
            slug
            section {
              order
              slug
            }
            order
            title
          }
        }
      }
    }
  `).then(result => {
    if (result.errors) {
      return Promise.reject(result.errors)
    }
    const root = '/docs'
    const items = result.data.allContentfulItem.edges
    items.sort((a, b) => a.node.section.order === b.node.section.order ? a.node.order - b.node.order : a.node.section.order - b.node.section.order)
    items.forEach(({ node }) => {
      createPage({
        path: replacePath(`${root}/${node.section.slug}/${node.slug}`),
        component: postTemplate,
        context: { // additional data can be passed via context
          slug: node.slug
        },
      })
    })
  })
}
