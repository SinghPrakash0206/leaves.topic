import Header from './Header'
import Head from 'next/head'

const Layout = (props) => (
	<div>	
	    <Head>
		<title>{ props.title }</title>
		<meta charSet="utf-8"/>
		<meta name="author" content="Anant team | anant.us"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	    </Head>
		<Header/>
		{props.children}
	</div>
)

export default Layout