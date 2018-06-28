import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Grid, Image, Card, Icon, Popup, Pagination } from 'semantic-ui-react'

class TagList extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			topicList: this.props.list,
			activeTag: this.props.tag,
			activePage: this.props.activePage,
			linksCunt: this.props.linksCunt
		}

	}

	handlePaginationChange = (e, { activePage }) => {
		this.setState({ activePage })
		console.log(activePage)
	}

	render(props){
		const { topicList, activeTag, activePage, linksCunt } = this.state
		return(
			<div>
				<Grid container>
				<div className="topic-label">{activeTag} topics</div>
					<Grid.Row>
						{topicList.map((topic, index) =>(
							<Grid.Column mobile={16} tablet={8} computer={4} key={topic.id} >
								<div className="topic-card">
									<div className="topic-image">
										<div className="topic-transparent-layer">
											<div className="show-this-layer">
												<span><Popup trigger={<Icon className="icon-class" link name='pin' size="large"/>} content="Pin it" /></span>
												<span><a href={topic.url} target="_blank"><Popup trigger={<Icon className="icon-class" link name='external alternate' size="large" />} content="Open in new tab" /></a></span>
											</div>
										</div>
										<Image src={topic.preview_picture} />
									</div>
									<a href={topic.url} target="_blank"><div className="topic-content">{topic.title}</div></a>
								</div>
							</Grid.Column>
						))}
					</Grid.Row>
					<div className="pagination">
						<Pagination defaultActivePage={activePage} totalPages={linksCunt} onPageChange={this.handlePaginationChange}/>
					</div>
				</Grid>	
				<style jsx>{`
					.topic-label {
						padding: 20px;
						font-size: 25px;
						font-weight: 700;
						font-family: 'Roboto Mono', monospace;
						color: #2d2c2c;
						opacity: 0.8
					}
					.topic-card {
						position: relative;
						height: 200px;
						margin-bottom: 10px;
						box-shadow: 0 1px 2px rgba(0,0,0,.1);
					}
					.topic-image img {
						vertical-align: middle;
					}
					.topic-image{
						height: 200px;
						overflow: hidden;
					}
					.topic-transparent-layer {
						position: absolute;
						width: 100%;
						height: 200px;
						border: 1px solid #000;
						background-color: rgba(0,0,0,0.3);
						z-index: 1;
					}
					.topic-transparent-layer .show-this-layer {
						color: #fff;
						display: none;
					}
					.show-this-layer a {
						color: #fff;
					}
					.show-this-layer span {
						background-color: #4d4d4d;
					    padding: 9px 2px 9px 5px;
					    border-radius: 50%;
					    margin: 5px;				
					}
					.show-this-layer {
						margin-top:60px;
						display: inline-block;
						text-align: center;
					}
					.show-this-layer .icon-class {
						background-color: rgba(0,0,0,0.5);
					}
					.topic-transparent-layer:hover .show-this-layer {
						display: block;
					}
					.topic-card .topic-content {
						position: absolute;
						bottom: 0;
						padding: 10px;
						width: 100%;
						background-color: rgba(0,0,0,0.5);
						font-family: 'Roboto Mono', monospace;
						color: #fff;
						font-size: 15px;
						z-index: 9;
					}
					.pagination {
						margin: 0px auto;
						padding: 80px;
					}
				`}</style>
			</div>
		)
	}
}


export default TagList