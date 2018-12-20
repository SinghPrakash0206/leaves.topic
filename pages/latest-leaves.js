import React, { Component } from 'react'
import { withRouter } from 'next/router'
import Layout from '../components/Layout'
import CardList from '../components/CardList/'
import TopicNavbar from '../components/Navbar/'
import Link from 'next/link'


class LatestTopics extends Component {

  constructor(props){
    super(props)
    this.state = {

    }
  }

  componentDidMount(){
  }

  static async getInitialProps(context) {
 	var page_no;
	if(context.query.page_no === undefined) {
		page_no = 1
	}else{
		page_no = context.query.page_no
	}
	const queryTag = 'Latest Leaves'
	const seoTitle = 'Latest Leaves | Ananr.us - Anant Leaves'
	const res = await fetch(process.env.LEAVES_API_URL + 'api/entries?access_token='+process.env.LEAVES_API_ACCESSTOKEN+'&order=desc&page=1&sort=created&perPage=20&page='+page_no)

	const data = await res.json();


  const tagRes = await fetch(process.env.LEAVES_API_URL + 'api/tags?access_token='+process.env.LEAVES_API_ACCESSTOKEN)
  const tagData = await tagRes.json()
  for (var i = 0; i < tagData.length; i++) {
    tagData[i]['tagslug'] = encodeURI(tagData[i].label.split('.').join('-'))
    tagData[i]['title'] = tagData[i].label.split('.').join(' ')
  }


  var links = data._embedded.items

  for (var i = 0; i < links.length; i++) {
    if(links[i].domain_name === "www.youtube.com"){
      links[i].url = links[i].url.split("&url=")[1]
    }
  }
	return {
		list: links,
		tag: queryTag,
		seoTitle: seoTitle,
		seoDesc: 'Resources list of the '+seoTitle,
		linksCunt: data.total,
		activePage: data.page,
		queryTag: queryTag,
		queryURL: 'topic'+queryTag,
		paginationURL: 'latest-leaves',
		type: 'latest-leaves',
  	tagsList: tagData
	}
  }


  render(props) {
    return (
     <div>
		<TopicNavbar {...this.props}/>
		<Layout title={this.props.seoTitle} description={this.props.seoDesc}>
			<CardList data={this.props}/>
		</Layout>
	</div>
    )
  }
}

export default LatestTopics