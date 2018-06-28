import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import TagList from '../components/TagList/'
import Link from 'next/link'


const Topic = withRouter((props) => (
	<div>
		<Link href="/"><a>Home</a></Link>
		<Layout title={`${props.seoTitle} topics`}>
			<TagList list={props.tagList} tag={props.tagName} linksCunt={props.totalLinks} activePage={props.activePage}/>
		</Layout>
	</div>
))

Topic.getInitialProps = async function(context) {
	const queryTag = context.query.tag.split('-').join('.')
	const seoTitle = context.query.tag.split('-').join(' ')
	const res = await fetch('http://leaves.anant.us:82/api/entries?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw&perPage=20&order=asc&page=1&sort=created&tags=' + queryTag)

	const data = await res.json();
	return {
		tagList: data._embedded.items,
		tagName: context.query.tag,
		seoTitle: seoTitle,
		totalLinks: data.total,
		activePage: data.page
	}
}

export default Topic