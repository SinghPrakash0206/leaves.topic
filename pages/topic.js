import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import TagList from '../components/TagList/'


const Topic = withRouter((props) => (
	<div>
		<Layout title={`${props.router.query.tag} Topics`}>
			<TagList list={props.tagList} />
		</Layout>
	</div>
))

Topic.getInitialProps = async function(context) {
	const res = await fetch('http://leaves.anant.us:82/api/entries?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw&limit=12&order=asc&page=1&sort=created&tags='+context.query.tag)

	const data = await res.json();
	return {
		tagList: data._embedded.items
	}
}

export default Topic