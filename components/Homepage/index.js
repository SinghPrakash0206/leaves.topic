import React from 'react'
import Link from 'next/link'

class Homepage extends React.Component {

	constructor(props){
		super(props)
		// this.handleSubmit = this.handleChange.bind(this);
	}

	// handleChange(e){
	// 	console.log(e.target.value);
	// 	console.log('hi');
	// }

	render(props){
		return(
			<div>
				<ul className="tag-list">
					{this.props.tags.map((tag, index) => (
						<li key={tag.id}><Link href={`/topic?tag=${tag.slug}`}><a>{tag.label}</a></Link></li>
					))}
				</ul>

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