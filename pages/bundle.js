import { withRouter } from 'next/router'
import Layout from '../components/Layout'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import { Grid, Image, Card, Icon, Popup, Pagination } from 'semantic-ui-react'

const Bundle = withRouter((props) => (
    <div>
        <Link href="/"><a>Home</a></Link>
        <Layout title="Bundle Topics">
            <Grid container>
                <Grid.Row>
                    {props.itemList.map((topic, index) =>(
                        <Grid.Column mobile={16} tablet={8} computer={4} key={topic.id} >
                            <div className="topic-card" key={topic.id}>
                                <div className="topic-image">
                                    <div className="topic-transparent-layer">
                                        <div className="show-this-layer">
                                            <span><Popup trigger={<Icon className="icon-class" link name='pin' size="large"/>} content="Pin it" /></span>
                                            <span><a href={topic.url} target="_blank"><Popup trigger={<Icon className="icon-class" link name='external alternate' size="large" />} content="Open in new tab" /></a></span>
                                        </div>
                                    </div>
                                    <Image src={topic.preview_picture} />
                                </div>
                                <Link href={`/leaves/?id=${topic.id}`} as={`/leaves/${topic.id}`}><a><div className="topic-content">{topic.title}</div></a></Link>
                            </div>
                        </Grid.Column>
                    ))}
                </Grid.Row>
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
		</Layout>
    </div>
))

Bundle.getInitialProps = async function(context) {
    const idsString = context.query.ids;
    const idsArray = idsString.split(',')

    let items = []

    for (const id of idsArray) {
        const res = await fetch('http://leaves.anant.us:82/api/entries/'+id+'?access_token=N2Y1YmFlNzY4OTM3ZjE2OGMwODExODQ1ZDhiYmQ5OWYzMjhkZjhiMDgzZWU2Y2YyYzNkYzA5MDQ2NWRhNDIxYw')
        const itemJsonObject = await res.json();
        items.push(itemJsonObject)
    }
    
    return {
        itemList: items
    }
  }

export default Bundle