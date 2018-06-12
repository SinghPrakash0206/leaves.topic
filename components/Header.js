import Link from 'next/link'

const hrefStyle = {
	padding: 10
}

const Header = () => (
	<div>
		<Link href="/"><a style={hrefStyle}>Home</a></Link>
		<Link href="/topic"><a style={hrefStyle}>Topic</a></Link>
		<Link href="/about"><a style={hrefStyle}>About</a></Link>
	</div>
)

export default Header