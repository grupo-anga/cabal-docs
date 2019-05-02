import React, { Component } from 'react'
import { graphql, StaticQuery, Link } from "gatsby"
import { connect } from "react-redux"
import { getSidebarState } from '../../store/selectors';
import { onSetSidebarOpen } from '../../actions/layout'
import Menu from 'antd/lib/menu'
import 'antd/lib/menu/style/css'
import './SidebarContents.css'
import { pathPrefix } from '../../../gatsby-config'

const SubMenu = Menu.SubMenu

const convertToTree = (data, root) => {
  const list = data.map(edge => {
      const { section } = edge.node
      return ({
        path: `${root}/${edge.node.section.slug}/${edge.node.slug}`,
        key: edge.node.slug,
        title: `${edge.node.order}. ${edge.node.title}`,
        parents: [section],
        order: edge.node.order
      })
    })
  return constructTree(list)
}

const constructTree = (list) => {
  let tree = []
  let dir = []
  list.forEach(item => {
    if (item.parents === [] || item.parents === null) tree.push(item)
    else {
      let subtree = tree
      for (let i = 0; i < item.parents.length; i++) {
        if (subtree
          .filter(node => node.title === item.parents[i].title && node.children)
          .length === 0) {
          const newNode = {
            key: "tree/" + item.parents[i].slug,
            title: item.parents[i].title,
            children: [],
            order: item.parents[i].order
          }
          subtree.push(newNode)
          dir.push(newNode)
        }
        subtree = subtree.find(node => node.title === item.parents[i].title && node.children).children
      }
      subtree.push(item)
    }
  })
  return [tree, dir]
}

const sortTree = tree => {
  tree.sort((a,b)=> {
    return a.order - b.order
  })
}

class SidebarContents extends Component {
  onSetSidebarOpen = () => {
    this.props.onSetSidebarOpen(false)
  }

  render() {
    const { expandedKey } = this.props.sidebar
    const { root } = this.props
    return (
      <StaticQuery
        query={graphql`
          query sidebarContentQuery {
            allContentfulItem(sort: { order:ASC, fields: [section___order, order] }) {
              edges {
                node {
                  slug
                  section {
                    order
                    title
                    slug
                  }
                  order
                  title
                }
              }
            }
          }
        `}
        render={data => {
          const [tree, dir] = convertToTree(data.allContentfulItem.edges, root)
          sortTree(tree)
          const loop = data => data.map((item) => {
            if (item.children) {
              sortTree(item.children)
              return (
                <SubMenu key={item.key} title={<span style={{fontWeight:900}}>{item.title}</span>}>
                  {loop(item.children)}
                </SubMenu>
              )
            }
            return (
              <Menu.Item key={item.key}>
                <Link to={item.path} onClick={this.onSetSidebarOpen}>{item.title}</Link>
              </Menu.Item>
            )
          })
          const path = window.location.pathname.replace(pathPrefix.slice(0,-1),"").split('/').reverse()
          const selectedKeys = data.allContentfulItem.edges
            .filter(item => path[1] === item.node.section.slug && (
              path[0] === item.node.slug ||(path[0].slice(0,-1) === item.node.slug && path.slice(-1) === '/'))
            ).length > 0 ? [expandedKey] : []
          const defaultOpenKeys = dir.map(item => item.key)
          return (
              <Menu
                mode="inline"
                defaultOpenKeys={defaultOpenKeys}
                selectedKeys={selectedKeys}
                inlineIndent={12}
              >
                {loop(tree)}
              </Menu>
          )
        }}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    sidebar: getSidebarState(state)
  }
}

const mapDispatchToProps = {
  onSetSidebarOpen
}

export default connect(mapStateToProps, mapDispatchToProps) (SidebarContents)
