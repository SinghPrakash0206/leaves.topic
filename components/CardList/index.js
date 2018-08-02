import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Grid, Image, Card, Icon, Popup, Pagination, Dropdown } from 'semantic-ui-react'
import Router from 'next/router'
import Link from 'next/link'

class CardList extends React.Component {

	constructor(props){
		super(props)
		this.state = {
			topicList: this.props.data.list,
			activeTag: this.props.data.tag,
			queryTag: this.props.data.queryTag,
			activePage: this.props.data.activePage,
			linksCunt: this.props.data.linksCunt,
			paginationURL: this.props.data.paginationURL,
			pageCount: 1,
			sharingLinks: [],
			linksIdsString: "",
			modalBoxOpen: false
		}

	}

	componentWillMount() {
		this.setState({ pageCount: (Math.ceil(this.props.data.linksCunt/20)) })
	}

	openModalBox = () => {
		this.setState({ modalBoxOpen: true })
	}

	closeModalBox = () => {
		this.setState({ modalBoxOpen: false })
	}

	clickOutModalBox = (e) => {
		if(e.target.id === 'outer') {
			this.setState({ modalBoxOpen: false })			
		}
	}

	handlePaginationChange = (e, { activePage }) => {
		this.setState({ activePage })
		console.log(this.state.queryTag)
		Router.push(`/${this.state.paginationURL}/page/${activePage}`)
	}

	addToBundle(topicData, e){
		var linksArray = this.state.sharingLinks
		var linksIdsString = this.state.linksIdsString
		linksArray.push(topicData)
		if(linksIdsString === "") {
			linksIdsString = linksIdsString + String(topicData.id)
		}else{
			linksIdsString = linksIdsString +','+ String(topicData.id)
		}
		this.setState({sharingLinks:linksArray,linksIdsString:linksIdsString})
	}

	render(props){
		const { topicList, activeTag, activePage, linksCunt, pageCount, queryTag, paginationURL, sharingLinks, modalBoxOpen, linksIdsString } = this.state
		return(
			<div>
				{
					sharingLinks.length > 0 ?
					<div className="share-icon" onClick={this.openModalBox}>		
						<div className="sharing-link-count">{sharingLinks.length}</div>
						<Icon className="icon-class" link name='share alternate' size="large"/>
					</div>
					: ''			
				}

				{modalBoxOpen ? 
					<div className="add-leaf-outer" onClick={this.clickOutModalBox.bind(this)} id="outer">
						<div className="add-leaf-modal">
							{sharingLinks.map((link, index) => (
								<div className="link-list">{link.title}</div>
							))}
							<input className="copy-bundle-link" type="text" value={`http://localhost:3000/bundle/${linksIdsString}`} />
						</div>
					</div>
				: ''}

				<Grid container>
				<h2 className="topic-label">{activeTag} topics</h2>
					<Grid.Row>
						{topicList.map((topic, index) =>(
							<Grid.Column mobile={16} tablet={8} computer={4} key={topic.id} >
								<div className="topic-card">
									<div className="topic-image">
										<div className="topic-transparent-layer">
											<div className="show-this-layer">
												<span><Popup trigger={<Icon onClick={this.addToBundle.bind(this, topic)} value={topic.url} className="icon-class" link name='pin' size="large"/>} content="Pin It" /></span>
												<span><a href={topic.url} target="_blank"><Popup trigger={<Icon className="icon-class" link name='add' size="large" />} content="Add to bundle & share" /></a></span>
											</div>
										</div>
										<Image src={topic.preview_picture} />
									</div>
									<Link href={`/leaves/?id=${topic.id}`} as={`/leaves/${topic.id}`}><a target="_blank"><div className="topic-content">{topic.title}</div></a></Link>
								</div>
							</Grid.Column>
						))}
					</Grid.Row>
					{(() => {
						if(pageCount > 1) {
							return <div className="pagination" ><Pagination defaultActivePage={activePage} totalPages={pageCount} onPageChange={this.handlePaginationChange}/></div>
						}
					})()}
				</Grid>	
				<style jsx>{`

					.share-icon {
						position: fixed;
						right: 10px;
						top: 100px;
					}

					.sharing-link-count {
						background-color: #eee;
						border-radius: 4px;
						position: relative;
						right: 18px;
						padding: 5px;
						z-index: 0;
						cursor: pointer;
					}

					.link-list {
						padding: 5px;
						background-color: #eee;
						margin: 3px;
					}

					.copy-bundle-link {
						width: 100%;
						margin-top: 20px;
						padding: 6px;
					}

					.topic-label {
						font-size: 40px;
						font-weight: 700;
						font-family: 'Roboto Mono', monospace;
						color: #2d2c2c;
						opacity: 0.8;
						width: 100%;
						padding: 40px 0px 10px 10px;
						letter-spacing: -2px;
						word-spacing: -12px;
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

					.add-leaf-modal {
						border: 1px solid #eee;
						border-radius: 10px;
						max-width: 500px;
						margin: 0px auto;
						background-color: #fff;
						padding: 20px;
					}

					.add-leaf-outer {
						position: fixed; 
						z-index: 99;
						padding-top: 100px; 
						left: 0;
						top: 0;
						width: 100%; 
						height: 100%;
						overflow: auto;
						background-color: rgba(0,0,0,0.4);
					}
				`}</style>
			</div>
		)
	}
}


export default CardList