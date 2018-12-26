import Layout from '../components/Layout'
import TopicNavbar from '../components/Navbar/'
import axios from 'axios'
import CardList from '../components/CardList/'

class Search extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			showSearchBox: false,
			listA: null
		}
	}


	static async getInitialProps(context) {

		var page_no;
		if(context.query.page_no === undefined) {
			page_no = 1
		}else{
			page_no = context.query.page_no
		}

		const activePage = 1
		const searchingQuery = context.query.search_query
		const url = 'http://stage.leaves.anant.us/solr/?q='+searchingQuery+'&rows=20&start='+ (page_no-1)*20
		console.log(url)
		const res = await fetch(url)

		const data = await res.json();

		const tagRes = await fetch(process.env.LEAVES_API_URL + 'api/tags?access_token='+process.env.LEAVES_API_ACCESSTOKEN)
		const tagData = await tagRes.json()

		for (var i = 0; i < tagData.length; i++) {
			tagData[i]['tagslug'] = tagData[i].label.split('.').join('-')
			tagData[i]['title'] = tagData[i].label.split('.').join(' ')
		}


		var links = data.response.docs



		for (var i = 0; i < links.length; i++) {
			if(links[i].domain_name === "www.youtube.com"){
				links[i].url = links[i].url.split("&url=")[1]
			}
		}

	return {
		list: links,
		tag: searchingQuery,
		seoTitle: searchingQuery,
		seoDesc: 'Resources list of the '+searchingQuery,
		linksCunt: parseInt(data.response.numFound),
		activePage: parseInt(page_no),
		queryTag: searchingQuery,
		type: 'searching',
		tagsList: tagData
	}
  }

	render(){
		return(
			<div>
				<TopicNavbar {...this.props}/>				
				<Layout title="Searching">
					<CardList data={this.props} />				
				</Layout>
			</div>
		)
	}
}

export default Search