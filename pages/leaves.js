import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import { Grid, Image, Card, Icon, Popup, Pagination } from 'semantic-ui-react'
import fetch from 'isomorphic-unfetch'
import Parser from 'html-react-parser';
import Link from 'next/link'
import Highlight from 'react-highlight'


const Leaves = withRouter((props) => (
	<div className="single-content">
		<Link href="/"><a>Home</a></Link>
		<Layout title={props.leaves.title} description={props.leaves.title}>
				<Grid container>
					<Grid.Row>
						<Grid.Column>
							<div className="content-title">{props.leaves.title}</div>
							<div className="leaves-content">
								{Parser(props.leaves.content,{
										replace: function(domNode) {
											if (domNode.attribs && domNode.attribs.src) {
												return <img src={domNode.attribs.src} style={{maxWidth:'100%'}}/>
											}
											if (domNode.attribs && domNode.name === 'pre') {
												console.log(domNode)
												return <Highlight><pre>{domNode.children[0].data}</pre></Highlight>
											}
										}
									}
								)}
							</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
		</Layout>
				<style jsx>{`
					.single-content {
						width: 800px;
						margin: 0px auto;
					}
					.single-content .content-title{
						font-family: 'Montserrat', sans-serif;
						font-size: 3rem;
						font-weight: 500;
						line-height: 1.2em;
						text-align: center;
						padding: 20px;
					}
					.leaves-content{
						font-size: 16px !important;
						font-family: 'Questrial', sans-serif;
						text-align: justify;
					}
				`}
				</style>
	</div>
))

Leaves.getInitialProps = async function(context){
	const leave_id = context.query.id;
	const res = await fetch('http://leaves.anant.us:82/api/entries/'+leave_id+'?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw')

	const data = await res.json()

	return {
		leaves: data,
	}
}

export default Leaves