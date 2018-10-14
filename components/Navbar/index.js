import Link from 'next/link';
import _ from 'lodash'
import React, { Component } from 'react'
import { Input, Menu, Grid, Button, Header, Image, Modal, Form, Icon, Popup } from 'semantic-ui-react';
import fetch from 'isomorphic-unfetch'
import axios from 'axios';
import Router from 'next/router'


class TopicNavbar extends Component {
	state = { 
		activeItem: 'home',
		isTagBoxOpen: false,
		frezzArray: [],
		tagArray: [],
		modalBoxOpen: false,
		urlToAdd: '',
		searchQuery: null
	}

	show = dimmer => () => this.setState({ dimmer, open: true })

	openModalBox = () => {
		console.log(this.state.isTagBoxOpen)
		if(this.state.isTagBoxOpen){
			this.state.isTagBoxOpen = false;
			this.setState({ modalBoxOpen: true })
		}
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

	handleTagBox = async () => {
		let body_dom = document.body.style
		const condition = this.state.isTagBoxOpen
		this.setState({isTagBoxOpen: condition ? false : true})
		if(condition){
			body_dom.overflow = 'scroll'
		}else{
			body_dom.overflow = 'hidden'
		}

		const response = await axios.get('http://leaves.anant.us:82/api/tags?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw')
		const data = response.data
		for (var i = 0; i < data.length; i++) {
		  	data[i]['tagslug'] = data[i].label.split('.').join('-')
		  	data[i]['title'] = data[i].label.split('.').join(' ')
		}

		this.setState({tagArray: data, frezzArray:data})
		console.log(data)
	}

	closeTagBox = () => {
		let body_dom = document.body.style
		console.log(body_dom)
		const condition = this.state.isTagBoxOpen
		this.setState({isTagBoxOpen: condition ? false : true})
		if(condition){
			body_dom.overflow = 'scroll'
		}else{
			body_dom.overflow = 'hidden'
		}

	}

	setURLToState = (e) => {
		this.setState({urlToAdd:e.target.value})
	}

	closeModalBoxAwait = () => {
		setTimeout(this.setState({ modalBoxOpen: false }), 2000)
	}

	addLeafToDB = async () => {
		const url = this.state.urlToAdd

		var data = {
		"url": url
		}

		var xhttp = new XMLHttpRequest();

		xhttp.open("POST", "http://leaves.anant.us:82/api/entries?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw", true);
		xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		await xhttp.send("url="+url); 

		setTimeout(this.closeModalBoxAwait(), 2000)
		
		// xhttp.onreadystatechange = function() {
		// console.log(this.status)

		// this.closeMod();
			
		// // if (this.readyState == 4 && this.status == 200) {
		 
		// // }
		// };
	}

	searchTag = (e) => {
		// this.setState({tagArray:this.state.frezzArray})
		console.log(e.target.value)
		let list = this.state.frezzArray
		let val = e.target.value
		let matches = list.filter(v => v.title.toLowerCase().includes(val));
		console.log(matches);
		this.setState({tagArray:matches})
		console.log(typeof(val))
		console.log(val.length)
		if(val.length == 0) {
			this.setState({tagArray:this.state.frezzArray})
		}
	}

	makeSearch(e){
		this.setState({searchQuery: e.target.value})
	}

	searchThisQuery(e){
		e.preventDefault()
		Router.push(`/search/${this.state.searchQuery}`)
	}

	render() {
		const { activeItem, modalBoxOpen } = this.state
		let tagListBoxClass = this.state.isTagBoxOpen ? 'open-tag-box' : 'close-tag-box'
		console.log(tagListBoxClass)
		return (
			<div className="topic-navbar">

			{modalBoxOpen ? 
				<div className="add-leaf-outer" onClick={this.clickOutModalBox.bind(this)} id="outer">
					<div className="add-leaf-modal">
						<Form >
							<Form.Field>
							<label>URL</label>
								<input type="url" onChange={this.setURLToState.bind(this)} placeholder='Paste the URL' />
							</Form.Field>
							<Button type='submit' onClick={this.addLeafToDB}>Add</Button>
							<Button type='submit' onClick={this.closeModalBox}>Close</Button>
						</Form>
					</div>
				</div>
			: ''}
				<div className="nav">
				<div className="nav-header">
					<div className="tag-title hamburgur" id="hamburgur" onClick={this.handleTagBox}>
						<Icon name='bars' size="large"/>
					</div>
					<div className="nav-title">
						<i className="fa fa-leaf"></i><Link href="/"><a>Leaves</a></Link>
					</div>
				</div>
				<div className="nav-btn">
					<label htmlFor="nav-check">
						<span></span>
						<span></span>
						<span></span>
					</label>
				</div>
				<input type="checkbox" id="nav-check"/>
				<div className="nav-links">
					<a className="search-menu">

						<Form onSubmit={this.searchThisQuery.bind(this)}>
							<Form.Field>
								<Input onChange={this.makeSearch.bind(this)} icon placeholder='Search...'>
									<input />
									<Icon name='search' />
								</Input>
							</Form.Field>
							<input type='submit' hidden />
						</Form>
					</a>
					<a className="navbar-links" onClick={this.openModalBox}>Add</a>
					<a href="#" target="_blank">Login</a>
				</div>
				</div>

				<div className={'tag-lists ' + tagListBoxClass}>
					<div className="close-tag-box" onClick={this.closeTagBox}>X</div>
						<Input size='mini' type="url" required icon='search' onChange={this.searchTag.bind(this)} placeholder='Search...' />
					<br/><br/>

					<div className="mobile-tags-view">

						{this.state.tagArray.length > 0 ? this.state.tagArray.map((tag, index)=> (
								<div key={index}>
									<Link href={`/topic/${tag.tagslug}`}><a>{tag.label}</a></Link>
								</div>
							)): ''}
					</div>
					<div className="space-divider"></div>
				</div>	
				<style jsx>{`
.mobile-tags-view {

display: grid;
grid-gap: 20px;
grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

					@media only screen and (max-width: 800px) {
						.nav-links a.search-menu {
							display: none !important;
						}		
					}

					@media screen and (min-width: 1100px) {
					   #hamburgur {
					     display: none;
					   }
					}

					.topic-navbar {
						background-color: #fafafa;
						border-bottom: 1px solid #ebebeb;
					}
					.nav {
						width: 100%;
						position: relative;
						font-family: 'Questrial', sans-serif;
						color: #000;
						padding: 15px 50px;
					}

					.nav > .nav-header {
						display: inline;
					}

					.nav > .nav-header > .nav-title {
						display: inline-block;
						font-size: 22px;
						padding: 10px 10px 10px 10px;
						font-weight: 700;
						cursor: pointer;
					}

					.hamburgur {
						display: inline-block;
						font-size: 16px;
						cursor: pointer;		
						margin-left: 0px;				
					}

					.nav > .nav-header > .nav-title a {
						color: #2d2c2c;
					}

					.nav > .nav-btn {
						display: none;
					}

					.nav > .nav-links {
						display: inline;
						float: right;
						font-size: 16px;
					}

					.nav > .nav-links > a {
						display: inline-block;
						padding: 10px 15px;
						text-decoration: none;
						color: #2d2c2c;
					}

					.nav > #nav-check {
						display: none;
					}

					.tag-lists {
						position: absolute;
						height: 100vh;
						width: 100%;
						background-color: #fff;
						z-index: 99;
						overflow-y: scroll;
						font-size: 16px;
						text-transform: capitalize;
						padding: 50px;
					}

					.tag-lists .ui .row .column {
						padding: 5px !important;
					}

					.tag-lists a {
						color: #000;
						font-family: 'Questrial', sans-serif;
					}

					.tag-lists.open-tag-box {
						display: block;						
					}

					.tag-lists.close-tag-box {
						display: none;						
					}

					.close-tag-box {
						font-size: 20px;
						font-weight: 700;
						position: absolute;
						top: 0;
						right: 0;
						padding: 20px;
						cursor: pointer;
					}

					.space-divider {
						height: 100px;
						width: 100%;
					}

					.navbar-links {
						cursor: pointer;
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

					@media (max-width:600px) {
						.nav {
							padding: 15px;
						}
						.nav > .nav-btn {
							display: inline-block;
							position: absolute;
							right: 0px;
							top: 0px;
						}
						.nav > .nav-btn > label {
							display: inline-block;
							width: 50px;
							height: 50px;
							padding: 20px;
							color: #000;
							margin-right: 20px;
							cursor: pointer;
						}

						.nav > .nav-btn > label > span {
							display: block;
							width: 25px;
							height: 10px;
							border-top: 2px solid #000;
						}
						.nav > .nav-links {
							position: absolute;
							display: block;
							width: 100%;
							background-color: #fff;
							height: 0px;
							transition: all 0.3s ease-in;
							overflow-y: hidden;
							top: 60px;
							left: 0px;
							z-index: 999;
							padding: 15px;
						}
						.nav > .nav-links > a {
							display: block;
							width: 100%;
						}
						.nav > #nav-check:not(:checked) + .nav-links {
							height: 0px;
						}
						.nav > #nav-check:checked + .nav-links {
							height: auto;
							overflow-y: auto;
						}
					}
				`}</style>
			</div>
		)
	}
}

export default TopicNavbar