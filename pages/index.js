import Layout from '../components/Layout'
import Homepage from '../components/Homepage/'
import fetch from 'isomorphic-unfetch'

const Index = (props) => (
	<div>
		<Layout title="Leaves Topic">
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
  const res = await fetch(process.env.LEAVES_API_URL+'api/tags?access_token='+process.env.LEAVES_API_ACCESSTOKEN)
  const data = await res.json()
  for (var i = 0; i < data.length; i++) {
  	data[i]['tagslug'] = data[i].label.split('.').join('-')
  	data[i]['title'] = data[i].label.split('.').join(' ')
  }
  return {
    tags: data
  }
}

export default Index