import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Grid, Image, Card, Icon, Popup, Pagination, Dropdown, Input, Form } from 'semantic-ui-react'
import Router from 'next/router'
import Link from 'next/link'
import TopicPagination from '../Pagination'
import axios from 'axios'


class CardList extends React.Component {

	constructor(props){
		super(props)
		console.log(this.props.data.linksCunt)
		this.state = {
			topicList: this.props.data.list,
			activeTag: this.props.data.tag,
			queryTag: this.props.data.queryTag,
			activePage: this.props.data.activePage,
			linksCunt: this.props.data.linksCunt,
			type: this.props.data.type,
			paginationURL: this.props.data.paginationURL,
			pageCount: Math.ceil(this.props.data.linksCunt/20),
			sharingLinks: [],
			linksIdsString: "",
			modalBoxOpen: false,
			hostUrl: ''
		}

	}

	componentDidMount() {
		this.setState({hostUrl: window.location.host})
		var ids = localStorage.getItem('linksIds')
		var links = localStorage.getItem('sharingLinks')
		if(ids) {
			this.setState({linksIdsString: JSON.parse(ids).linksIds})
		}

		if(links) {
			this.setState({sharingLinks: JSON.parse(links).sharingLinks})
		}
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
		Router.push(`/${this.state.paginationURL}/page/${activePage}`)
	}

	addToBundle(topicData, e){
		var linksArray = this.state.sharingLinks
		var linksIdsString = this.state.linksIdsString
		var stringIdArray = linksIdsString.split(',')
		var stringIdIndex = stringIdArray.indexOf(String(topicData.id))
		if(stringIdIndex < 0){
			linksArray.push(topicData)
			if(linksIdsString === "") {
				linksIdsString = linksIdsString + String(topicData.id)
			}else{
				linksIdsString = linksIdsString +','+ String(topicData.id)
			}
			this.setState({sharingLinks:linksArray,linksIdsString:linksIdsString})	
			localStorage.setItem('linksIds', JSON.stringify({"linksIds":linksIdsString}));
			localStorage.setItem('sharingLinks', JSON.stringify({"sharingLinks":linksArray}));	
		}else{
			alert('Already in the bundle')
		}
	}

	copyBundleLink() {
		var copyText = document.getElementById("bundleLink");
        copyText.select();
        document.execCommand("Copy");
		document.getElementById("copyMsg").innerHTML = "Copied!"
	}

	cleanModalBox(e) {
		var sharingLinks = this.state.sharingLinks
		var linksIdsString = this.state.linksIdsString
		linksIdsString = ""
		sharingLinks = []
		this.setState({sharingLinks:sharingLinks, linksIdsString:linksIdsString})
		localStorage.setItem('linksIds', JSON.stringify({"linksIds":linksIdsString}));
		localStorage.setItem('sharingLinks', JSON.stringify({"sharingLinks":sharingLinks}));	
		this.closeModalBox()
	}

	removeLink(id, e){
		var sharingLinks = this.state.sharingLinks
		var linksIdsString = this.state.linksIdsString
		var stringIdArray = linksIdsString.split(',')
		var stringIdIndex = stringIdArray.indexOf(String(id))
		var linkObjectIndex = sharingLinks.findIndex(i => i.id === id);
		stringIdArray.splice(stringIdIndex, 1)
		sharingLinks.splice(linkObjectIndex, 1)
		this.setState({linksIdsString:stringIdArray.join(','), sharingLinks:sharingLinks})
		localStorage.setItem('linksIds', JSON.stringify({"linksIds":stringIdArray.join(',')}));
		localStorage.setItem('sharingLinks', JSON.stringify({"sharingLinks":sharingLinks}));	
		if(stringIdArray.length === 0) {
			this.closeModalBox()
		}
	}

	render(props){
		const { topicList, activeTag, activePage, linksCunt, pageCount, queryTag, paginationURL, sharingLinks, modalBoxOpen, linksIdsString, hostUrl, type } = this.state
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
							<div className="share-modal-title">Share This Bundle</div>
							<div className="share-link-list">
								{sharingLinks.map((link, index) => (
									<div className="link-list" key={link.id} value={link.id}><div>{link.title}</div><span onClick={this.removeLink.bind(this, link.id)} className="remove-link">x</span></div>
								))}
							</div>
							<br/>
							<Input id="bundleLink" fluid icon={<Icon name='copy' onClick={this.copyBundleLink} inverted circular link />} value={`${hostUrl}/bundle/${linksIdsString}`} />
							<div id="copyMsg"></div>
							<div className="share-modal-btn" onClick={this.closeModalBox}><Icon className="icon-class" link name='window close' size="small" /> close</div>
							<div className="share-modal-btn" onClick={this.cleanModalBox.bind(this)}><Icon className="icon-class" link name='erase' size="small" /> clear</div>
						</div>
					</div>
				: ''}

				<Grid container>
				<h2 className="topic-label">{activeTag} topics</h2>
					<Grid.Row>
						{topicList.map((topic, index) =>(
							<Grid.Column mobile={16} tablet={8} computer={16} key={topic.id} >
								<div className="topic-card">
									<div className="topic-image">
										<div className="topic-transparent-layer">
											<div className="show-this-layer">
												<span><Popup trigger={<Icon onClick={this.addToBundle.bind(this, topic)} value={topic.url} className="icon-class" link name='pin' size="large"/>} content="Add to bundle & share" /></span>
												<span><a href={topic.url} target="_blank"><Popup trigger={<Icon className="icon-class" link name='external alternate' size="large" />} content="Original Resource" /></a></span>
											</div>
										</div>
										<Image src={topic.preview_picture} />
									</div>
									<a href={`/leaves/${topic.id}`} target="_blank" rel="noopener noreferrer"><div className="topic-content">{topic.title}</div></a>
								</div>
							</Grid.Column>
						))}
					</Grid.Row>
					<div className="pagination" ><TopicPagination defaultActivePage={activePage} totalPages={pageCount} tag={queryTag} type={type}/></div>
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

					.share-link-list {
						max-height: 400px;
						overflow-y: scroll;
					}

					.share-modal-title {
						font-size: 20px;
						font-weight: 700;
						margin-bottom: 20px;
						font-family: 'Roboto Mono', monospace;
					}

					.share-modal-btn {
						font-size: 16px;
						background-color: #eee;
						padding: 3px 10px;
						display: inline-block;
						border-radius: 3px;
						margin-top: 20px;
						cursor: pointer;
						margin-right: 10px;
					}

					.link-list {
						padding: 5px;
						background-color: #eee;
						margin: 3px;
					}

					.remove-link {
						float: right;
						background-color: #8d8d8e;
						color: #fff;
						padding: 1px 7px;
						border-radius: 50%;
						font-weight: 700;
						font-size: 14px;
						cursor: pointer;
					}

					.copy-bundle-link {
						width: 100%;
						margin-top: 20px;
						padding: 6px;
						border: 2px solid #333;
					}

					.topic-label {
						font-size: 30px;
						font-weight: 700;
						font-family: 'Roboto Mono', monospace;
						color: #2d2c2c;
						opacity: 0.8;
						width: 100%;
						padding: 20px 0px 10px 10px;
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

					.search-box {
						padding-top: 20px;
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