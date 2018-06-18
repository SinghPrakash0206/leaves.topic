import fetch from 'isomorphic-unfetch'

const TagList = (props) => (
	<div>
		{props.list.map((topic, index) =>(
			<div key={topic.id}>{topic.title}</div>
		))}
	</div>
)

export default TagList