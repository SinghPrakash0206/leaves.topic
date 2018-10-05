import Header from './Header'
import Footer from './Footer'
import Head from 'next/head'

const Layout = (props) => (
	<div>	
	    <Head>
		<title>{ props.title } - Anant Leaves</title>
	    <meta httpEquiv="Content-Type" content="text/html; charset=utf-8"/>
	    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=contain"/>
		<meta name="author" content="Anant team | anant.us"/>
		<meta name="title" content={ props.title  + ' - Anant Leaves' }/>
		<meta name="description" content={ props.description }/>
		<meta property="og:title" content={ props.title  + ' - Anant Leaves' }/>
		<meta property="og:description" content={ props.description }/>
		<meta name="twitter:description" content={ props.description }/>

		<link href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
		<link href="https://fonts.googleapis.com/css?family=Montserrat:400,500,700|Roboto+Mono:400,500|Questrial" rel="stylesheet"/>
		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"/>
		<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/atom-one-light.min.css"/>
		<link rel="stylesheet" href="http://127.0.0.1:8080/style.css"/>
	    </Head>
		<Header/>
		<div className="content-inject">{props.children}</div>
		<Footer />
		<style jsx>{`
			body {
				background-color: #fafafa;
			}
			.content-inject {
				min-height: 100vh;
			}
		`}</style>
	</div>
)

export default Layout