import Link from 'next/link'


const Header = () => (
	<div>
		<Link href="/"><a className="href-link">Home</a></Link>

		<style jsx>{`
			.href-link {
				padding: 10px;
			}
		`}</style>
	</div>
)

export default Header