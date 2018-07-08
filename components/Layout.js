import Header from './Header'
import Head from 'next/head'

const Layout = (props) => (
	<div>	
	    <Head>
		<title>{ props.title }</title>
		<meta charSet="utf-8"/>
		<meta name="author" content="Anant team | anant.us"/>
		<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
		<link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700|Roboto+Mono:400,500" rel="stylesheet"/>
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"/>
		  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css"/>
	    </Head>
		<Header/>
			{props.children}
		<style jsx>{`
			body {
				background-color: #fafafa;
			}
		`}</style>
	</div>
)

export default Layout