import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/Layout";
import { connect } from 'react-redux'
import { onSidebarContentExpand } from '../actions/layout'
import "katex/dist/katex.min.css"
import { getSidebarExpandedKey } from "../store/selectors";
import "./postTemplate.css";
import { BLOCKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

function Template({
  data, // this prop will be injected by the GraphQL query below.
  onSidebarContentExpand,
  expandedKey,
}) {
  const { contentfulItem } = data
  const { slug, body } = contentfulItem
  if (expandedKey !== slug) {
    onSidebarContentExpand(slug)
  }

  const options = {
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: (node, children) => {
        console.log(node)
        const { fields } = node.data.target
        return (
          <img src={fields.file['en-US'].url} alt={fields.title} />
        )
      },
    }
  }

  return (
    <Layout sidebarRoot={'/docs'}>
    <div className="blog-post-container">
      <div className="blog-post">
        {/* <h1>{frontmatter.title}</h1>
        <h5>{frontmatter.date}</h5> */}
        <div className="blog-post-content">
          {documentToReactComponents(body.json, options)}
        </div>
      </div>
    </div>
    </Layout>
  )
}

const mapStateToProps = (state) => {
  return {
    expandedKey : getSidebarExpandedKey(state)
  }
}

const mapDispatchToProps = {
  onSidebarContentExpand,
}

export default connect(mapStateToProps, mapDispatchToProps) (Template)

export const pageQuery = graphql`
  query($slug:String!) {
    contentfulItem(slug:{eq: $slug}) {
      slug
      body {
        json
      }
    }
  }
`
