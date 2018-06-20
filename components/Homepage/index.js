import React from 'react'
import Link from 'next/link'
import { Search, Grid, Header } from 'semantic-ui-react'
import _ from 'lodash'
import Router from 'next/router'


class Homepage extends React.Component {

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
		Router.push(`/topic?tag=${result.tagslug}`)
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
			<div>
				<Search loading={isLoading} onResultSelect={this.handleResultSelect} onSearchChange={_.debounce(this.handleSearchChange, 500, { leading: true })} results={results} value={value} {...this.props} />

				<style jsx>{`
					.tag-list{
						margin: 0;
						padding: 0;
					}
					.tag-list li{
						list-style-type: none;
						display: inline-block;
						padding: 4px;
					}
				`}</style>
			</div>
		)
	}

}

export default Homepage;