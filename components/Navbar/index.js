import Link from 'next/link';
import React, { Component } from 'react'
import { Input, Menu } from 'semantic-ui-react';


class TopicNavbar extends Component {
	state = { activeItem: 'home' }

	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	render() {
		const { activeItem } = this.state

		return (
			<div className="topic-navbar">
				<div className="nav">
				<div className="nav-header">
					<div className="nav-title">
						<Link href="/"><a>Topic Pages</a></Link>
					</div>
					<div className="tag-title">
						Tags
					</div>
				</div>
				<div className="nav-btn">
					<label for="nav-check">
						<span></span>
						<span></span>
						<span></span>
					</label>
				</div>
				<input type="checkbox" id="nav-check"/>
				<div className="nav-links">
					<a href="#" target="_blank">Add Leaf</a>
					<a href="#" target="_blank">Login</a>
					<a href="#" target="_blank">Logout</a>
				</div>
				</div>
				<style jsx>{`
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

					.nav > .nav-header > .tag-title {
						display: inline-block;
						font-size: 16px;
						padding: 10px 10px 10px 10px;
						cursor: pointer;		
						margin-left: 30px;				
					}

					.nav > .nav-header > .tag-title:after {
						width: 0;
						height: 0;
						content: '';
						border-top: 4px solid currentColor;
						border-left: 4px solid transparent;
						border-right: 4px solid transparent;
						border-bottom: 0;
						margin-left: 0.5rem;
						display: inline-block;
						color: inherit;
						height: 0;
						width: 0;
						vertical-align: middle;
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
							top: 70px;
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