import Header from './Header'
import Head from 'next/head'

const layoutStyle = {
	margin: 20,
	padding: 20,
	border: '1px solid #eee'
}

const Layout = (props) => (
	<div style={layoutStyle}>	
	    <Head>
		<title>{ props.title }</title>
		<meta charSet="utf-8"/>
		<meta name="author" content="Mohd Danish Yusuf"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	    </Head>
		<Header/>
		{props.children}
	</div>
)

export default Layout