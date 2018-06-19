import Layout from '../components/Layout'
import Homepage from '../components/Homepage/'
import fetch from 'isomorphic-unfetch'

const Index = (props) => (
	<div>
		<Layout title="Leaves Topic | Home">
		<div className="homepage">
			<Homepage tags={props.tags}/>
		</div>

		<style jsx>{`
			.homepage{						
				margin: 20px;
				padding: 20px;
			}
		`}</style>
		</Layout>
	</div>
)

Index.getInitialProps = async function() {
  const res = await fetch('http://leaves.anant.us:82/api/tags?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw')
  const data = await res.json()
  console.log(data)
  return {
    tags: data
  }
}

export default Index