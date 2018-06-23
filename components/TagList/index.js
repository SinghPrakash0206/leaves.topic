import fetch from 'isomorphic-unfetch'
import { Grid, Image, Card, Icon } from 'semantic-ui-react'

const TagList = (props) => (
	<div>
		<Grid container>
		<div className="topic-label">{props.tag} topics</div>
			<Grid.Row>
				{props.list.map((topic, index) =>(
					<Grid.Column mobile={16} tablet={8} computer={4} key={topic.id} >
						<div className="topic-card">
							<div className="topic-image">
								<div className="topic-transparent-layer"></div>
								<Image src={topic.preview_picture} />
							</div>
							<div className="topic-content">{topic.title}</div>
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
		`}</style>
	</div>
)

export default TagList