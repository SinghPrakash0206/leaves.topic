import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import CardList from '../components/CardList/'
import TopicNavbar from '../components/Navbar/'
import Link from 'next/link'
import React, { Component } from 'react'
import axios from "axios";



const getTopics = async (page_no, queryTag) => {
    try {
    const response = await axios.get(process.env.LEAVES_API_URL + 'api/entries?access_token='+process.env.LEAVES_API_ACCESSTOKEN+'&perPage=20&order=desc&page='+page_no+'&sort=created&tags=' + queryTag);
    return response.data
  } catch (error) {
    console.error(error);
  }
}

class Topic extends Component {

  constructor(props){
    super(props)
    this.state = {

    }
  }

  static async getInitialProps(context) {
    var page_no;
  if(context.query.page_no === undefined) {
    page_no = 1
  }else{
    page_no = context.query.page_no
  }

  const seoTitle = context.query.tags.split('-').join(' ').replace(/\b\w/g, l => l.toUpperCase())
  console.log(context.query.tags)

  var multiTags = context.query.tags.split(',')

  const queryTag = context.query.tags.split('-').join('.')
  var data = []

  for (var i = 0; i < multiTags.length; i++) {
    const dataRes = await getTopics(page_no, multiTags[i])
    data = [...data, ...dataRes._embedded.items]
  }


  const tagRes = await fetch(process.env.LEAVES_API_URL + 'api/tags?access_token='+process.env.LEAVES_API_ACCESSTOKEN)
  const tagData = await tagRes.json()
  for (var i = 0; i < tagData.length; i++) {
    tagData[i]['tagslug'] = encodeURI(tagData[i].label.split('.').join('-'))
    tagData[i]['title'] = tagData[i].label.split('.').join(' ')
  }

  var links = data

  for (var i = 0; i < links.length; i++) {
    if(links[i].domain_name === "www.youtube.com"){
      links[i].url = links[i].url.split("&url=")[1]
    }
  }

  return {
    list: links,
    tag: context.query.tags,
    seoTitle: seoTitle,
    seoDesc: 'Resources list of the '+seoTitle,
    linksCunt: data.total,
    activePage: data.page,
    queryTag: queryTag,
    paginationURL: 'topic/'+context.query.tags,
    type: 'topic',
    tagsList: tagData
  }
  }


  render(props) {
    return (
     <div>
    <TopicNavbar {...this.props}/>
    <Layout title={this.props.seoTitle} description={this.props.seoDesc}>
      <CardList data={this.props} />
    </Layout>
  </div>
    )
  }
}

export default Topic