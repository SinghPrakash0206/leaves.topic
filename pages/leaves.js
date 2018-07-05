import Layout from '../components/Layout'
import { withRouter } from 'next/router'
import { Grid, Image, Card, Icon, Popup, Pagination } from 'semantic-ui-react'
import fetch from 'isomorphic-unfetch'
import Parser from 'html-react-parser';
import Link from 'next/link'


const Leaves = withRouter((props) => (
	<div>
		<Link href="/"><a>Home</a></Link>
		<Layout title={props.leaves.title}>
				<Grid container>
					<Grid.Row>
						<Grid.Column>
							<h2>{props.leaves.title}</h2>
							<div className="leaves-content">
								{Parser(props.leaves.content,{
										replace: function(domNode) {
											if (domNode.attribs && domNode.attribs.src) {
												return <img src={domNode.attribs.src} style={{maxWidth:'100%'}}/>
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
					.leaves-content p{
						font-size: 17px !important;
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
		leaves: data
	}
}

export default Leaves