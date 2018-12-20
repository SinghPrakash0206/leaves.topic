import React from 'react'
import App, {Container} from 'next/app'
import Link from 'next/link'
import Router from 'next/router'
import routerEvents from 'next-router-events'


export default class MyApp extends App {

  constructor(props){
    super(props)

    this.state = {
      progress: false,
      isCancelled: false
    }

    routerEvents.on('routeChangeStart', (url) => {
      !this.isCancelled && this.setState({progress: true})
    })
    routerEvents.on('routeChangeComplete', () => {
          !this.isCancelled && this.setState({progress: false})
    })
    routerEvents.on('routeChangeError', () => {
      console.log('error')
    })
  }

  componentWillUnmount() {
      this.isCancelled = true;
  }

  static async getInitialProps ({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render () {
    const {Component, pageProps} = this.props
    return (
      <Container>
          {this.state.progress ? <div style={{position: 'absolute', height: '100vh', width: '100%', 'backgroundColor': 'rgba(0,0,0,0.5)', 'zIndex': 99999, top: 0, fontFamily: '"Questrial", sans-serif', fontSize: 24, textAlign: 'center', padding: 40, color: '#fff'}}>loading...</div> : ''}

        <Component {...pageProps} />
      </Container>
    )
  }
}