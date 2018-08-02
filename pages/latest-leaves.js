import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import CardList from '../components/CardList/'
import TopicNavbar from '../components/Navbar/'
import Link from 'next/link'


const Topic = withRouter((props) => (
	<div>
		<TopicNavbar/>
		<Layout title={`${props.seoTitle}`} description={props.seoDesc}>
			<CardList data={props}/>
		</Layout>
	</div>
))

Topic.getInitialProps = async function(context) {
	var page_no;
	if(context.query.page_no === undefined) {
		page_no = 1
	}else{
		page_no = context.query.page_no
	}
	const queryTag = 'Latest Leaves'
	const seoTitle = 'Latest Leaves | Ananr.us - Anant Leaves'
	const res = await fetch('http://leaves.anant.us:82/api/entries?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw&order=desc&page=1&sort=created&perPage=20&page='+page_no)

	const data = await res.json();
	return {
		list: data._embedded.items,
		tag: queryTag,
		seoTitle: seoTitle,
		seoDesc: 'Resources list of the '+seoTitle,
		linksCunt: data.total,
		activePage: data.page,
		queryTag: queryTag,
		queryURL: 'topic'+queryTag,
		paginationURL: 'latest-leaves'
	}
}

export default Topic