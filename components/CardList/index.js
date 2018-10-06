import React from 'react'
import fetch from 'isomorphic-unfetch'
import { Grid, Image, Card, Icon, Popup, Pagination, Dropdown, Input, Form } from 'semantic-ui-react'
import Router from 'next/router'
import Link from 'next/link'
import TopicPagination from '../Pagination'
import axios from 'axios'
import Parser from 'html-react-parser';
import Highlight from 'react-highlight'


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
			hostUrl: '',
			gridRowClass: '',
			isReaderActive: false,
			activeTabs: [],
			fixedReader: false,
			activeRead: null,
			startTabIndex: 0,
			endTabIndex: 0,
			activeTabId: 1
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

		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
	    window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = (event) => {
	    let scrollTop = event.srcElement.body.scrollTop
        if(this.state.isReaderActive && window.scrollY > 150){
        	this.setState({fixedReader: true})
        }else{
        	this.setState({fixedReader: false})
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

	addToReader = (topic) => {	
		this.setState({isReaderActive: true})
		this.setState({activeTabId: topic.id})
		topic['activeTab'] = true
		this.setState({activeRead: topic})
		const activeTabs = this.state.activeTabs
		activeTabs.push(topic)
		const tabLength = activeTabs.length
		let startTabIndex = 0;
		let endTabIndex = 0;
		if(tabLength > 5){
			startTabIndex = tabLength - 5
			endTabIndex = tabLength	

			for (var i = 0; i < activeTabs.length; i++) {
				activeTabs[i]['activeTab'] = false
			}

			for (var i = startTabIndex; i < endTabIndex; i++) {
				activeTabs[i]['activeTab'] = true
			}
		}else{
			startTabIndex = 1
			endTabIndex = tabLength			
		}
		this.setState({startTabIndex:startTabIndex, endTabIndex:endTabIndex})

		this.setState({activeTabs})
	}

	changeTab = (topic) => {
		this.setState({activeTabId: topic.id})
		this.setState({activeRead: topic})		
	}

	render(props){
		const { topicList, activeTag, activePage, linksCunt, pageCount, queryTag, paginationURL, sharingLinks, modalBoxOpen, linksIdsString, hostUrl, type, activeRead, activeTabId } = this.state
		const { activeTabs } = this.state
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

				<div className="card-section">
				<h2 className="topic-label">{activeTag} topics</h2>
					<div className={this.state.isReaderActive ? 'card-container-reader' : 'card-container'}>
						<div className="cards">
						{topicList.map((topic, index) =>(
							<div className="card-list" key={topic.id}>
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
									<div className="topic-content" onClick={this.addToReader.bind(null, topic)}>{topic.title}</div>
									{/*<a href={`/leaves/${topic.id}`} target="_blank" rel="noopener noreferrer"><div className="topic-content">{topic.title}</div></a>*/}  
								</div>
							</div>
						))}
						</div>
						<div className={this.state.isReaderActive ? 'reader reader-block' : 'reader'}>
						<div className={this.state.fixedReader ? 'reader-inner-fixed' : 'reader-inner'}>
							<div className="reader-tabs">
								<div className="tab-name">
									<div className="tab-title">&lt;</div>
									<div className="close-tab"></div>
								</div>
							{activeTabs.map((tab, index) => {
								if(tab.activeTab){
									return (
									<div onClick={this.changeTab.bind(null, tab)} className={ tab.id === activeTabId ? 'tab-name active-tab' : 'tab-name'} key={tab.id}>
										<div className="tab-title">{tab.title}</div>
										<div className="close-tab">x</div>
									</div>
									)
								}
							})}
							{activeTabs.length > 5 ? 
								(<div className="tab-name">
									<div className="tab-title">&gt;</div>
									<div className="close-tab"></div>
								</div>): ''
							}
								
							</div>
							<div className="reader-content">
								{activeRead == null ? '' : Parser(activeRead.content,{
										replace: function(domNode) {
											if (domNode.attribs && domNode.name === 'img') {
												return <img src={domNode.attribs.src} style={{maxWidth:'100%',display:'block'}}/>
											}
											if (domNode.attribs && domNode.name === 'pre') {
												console.log(domNode)
												return <Highlight><pre>{domNode.children[0].data}</pre></Highlight>
											}
										}
									}
								)}
							</div>
							</div>
						</div>
					</div>
					<div className="pagination" ><TopicPagination defaultActivePage={activePage} totalPages={pageCount} tag={queryTag} type={type}/></div>
				</div>	
				<style jsx>{`
					.card-section {
						max-width: 80%;
						margin: 0px auto;
					}

					.card-container .cards{
						display: grid;
						grid-gap: 20px;
						grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
					}

					.card-container-reader {
						display: grid;
						grid-template-columns: 25% 75%;
					}

					.reader {						
						display: none;
						margin: 0px 10px;
						position: relative;
					}

					.reader-block {
						display: block;
					}

					.reader-inner {
					}

					.reader-inner-fixed {
						position: fixed;
						width: 58.5%;
						top: 5px;
					}

					.reader .reader-tabs {
						display: grid;
						grid-gap: 0px;
						grid-template-columns: 30px repeat(5, 1fr) 30px;
						cursor: pointer;
					}

					.reader-tabs .tab-name {
						padding: 5px;
						border: 1.5px solid #707070;
						font-family: 'Questrial', sans-serif;
						display: grid;
						grid-template-columns: 80% 20%;
					}

					.reader-tabs .tab-name .tab-title {
						white-space: nowrap;
						overflow: hidden;
					}

					.reader-tabs .tab-name .close-tab {
						text-align: center;
					}

					.reader-content {
						font-family: 'Questrial', sans-serif;
						padding: 20px;
						height: 100vh;
						overflow-y: scroll;
						border: 2px solid #707070;
					}

					.active-tab {
						background-color: #645F5F;
						color: #fff;
					}

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
						cursor: pointer;
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