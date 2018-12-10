import React, { Component } from 'react'
import Link from 'next/link'
import { Search, Grid, Header } from 'semantic-ui-react'
import _ from 'lodash'
import Router from 'next/router'


class Homepage extends Component {

	constructor(props){
		super(props)
		this.state = {
			results: this.props.tags,
			isLoading: false
		}

	}

	componentWillMount() {
		this.resetComponent()
	}

	resetComponent = () => this.setState({ isLoading: false, results: [], value: '' })

	handleResultSelect = (e, { result }) => {
		this.setState({ value: result.title })
		Router.push(`/topic/${result.tagslug}`)
	}

	handleSearchChange = (e, { value }) => {
		this.setState({ isLoading: true, value })

		setTimeout(() => {
			if (this.state.value.length < 1) return this.resetComponent()

			const re = new RegExp(_.escapeRegExp(this.state.value), 'i')
			const isMatch = result => re.test(result.title)

			this.setState({
				isLoading: false,
				results: _.filter(this.props.tags, isMatch),
			})
		}, 300)
	}


	render(props){
		const { isLoading, value, results } = this.state
		return(
			<div className="home-container">
				<div className="home-label"><i className="fa fa-leaf"></i>Leaves</div>
				<div className="home-search-input">
					<Search loading={isLoading} selectFirstResult={true} size="huge" onResultSelect={this.handleResultSelect} onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })} placeholder="search a tag" results={results} value={value} {...this.props} />
				</div>
				<div className="search-example">Ex: "node", "big data", "business", "artificial intelligence", "kubernetes", "docker" etc</div>	
				<Link href="/latest-leaves"><a>view all latest leaves</a></Link>

				<style jsx>{`
					.home-container {
				  		text-align: center;	
				  		padding: 100px 0px;	
				  		height: 100vh;				
					}
					.tag-list{
						margin: 0;
						padding: 0;
					}
					.tag-list li{
						list-style-type: none;
						display: inline-block;
						padding: 4px;
					}
					.home-search-input {
						display: inline-block;
					}
					.home-search-input {
				  		text-align: center;
				  		position: relative;
					}
					.search-example {
						font-family: 'Montserrat', sans-serif;
						font-size: 12px;
						padding: 10px;
						font-weight: 500;
					}
					.or-divider span {
						background-color: #eee;
						border-radius: 50%;
					}
					.home-label {
						font-family: 'Montserrat', sans-serif;
						font-size: 40px;
						font-weight: 700;
						display: block;
 						line-height: 2em;
					}
				`}</style>
			</div>
		)
	}

}

export default Homepage;