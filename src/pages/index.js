import React from 'react'
import Layout from '../components/Layout'
import Button from 'antd/lib/button'
import 'antd/lib/button/style/css'
import { Link, StaticQuery, graphql } from "gatsby"
import '../styles/home.css'

const IndexPage = () => {
  return (
    <StaticQuery
      query={graphql`
        query FirstPostQuery {
          contentfulItem(order:{eq:1}, section:{order:{eq:1}}) {
            slug
            section {
              order
              slug
            }
            order
            title
          }
        }
      `}
      render={data => {
        const { slug, section } = data.contentfulItem
        return (
          <Layout>
            <div style={{display: 'flex', height: '70vh', justifyContent: 'center'}}>
              <div align="center" style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <h1 style={{color: "#099", fontSize: 50, fontWeight: 'bold'}}>
                  Metodologia de Gestão de Projetos
                </h1>
                <h2>Gestão da Tecnologia da Informação</h2>
                <br/>
                <Link to={`/docs/${section.slug}/${slug}`}>
                  <Button type="primary" size="large" style={{marginRight: 10}}>Ir para Documentação</Button>
                </Link>
                <p style={{color: "#ccc", fontSize: 11, marginTop: '1rem', letterSpacing: 1}}>ÚLTIMA ATUALIZAÇÃO: ABRIL 2019</p>
              </div>
            </div>
          </Layout>
        )
      }}
    />
  )
}

export default IndexPage
