import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import CardList from '../components/CardList/'
import TopicNavbar from '../components/Navbar/'
import Link from 'next/link'
import React, { Component } from 'react'


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
	const queryTag = context.query.tag.split('-').join('.')
	const seoTitle = context.query.tag.split('-').join(' ').replace(/\b\w/g, l => l.toUpperCase())
	const res = await fetch('http://leaves.anant.us:82/api/entries?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw&perPage=20&order=desc&page='+page_no+'&sort=created&tags=' + queryTag)

	const data = await res.json();

	var links = data._embedded.items

	for (var i = 0; i < links.length; i++) {
		if(links[i].domain_name === "www.youtube.com"){
			links[i].url = links[i].url.split("&url=")[1]
		}
	}

	return {
		list: links,
		tag: context.query.tag,
		seoTitle: seoTitle,
		seoDesc: 'Resources list of the '+seoTitle,
		linksCunt: data.total,
		activePage: data.page,
		queryTag: queryTag,
		paginationURL: 'topic/'+context.query.tag,
		type: 'topic'
	}
  }


  render(props) {
    return (
     <div>
		<TopicNavbar />
		<Layout title={this.props.seoTitle} description={this.props.seoDesc}>
			<CardList data={this.props} />
		</Layout>
	</div>
    )
  }
}

export default Topic