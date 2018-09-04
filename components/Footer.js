import Link from 'next/link'
import { Icon } from 'semantic-ui-react'


const Footer = () => (
	<div className="footer">
		<div className="container">
			<div className="copyright">© 2018 <a href="https://www.anant.us" target="_blank">Anant Corporation</a>. All rights reserved.</div>
			<div className="links">
				<ul>
					<li><a href="https://www.linkedin.com/company/anant" target="_blank"><Icon className="icon-class" link name='linkedin' size="large"/></a></li>
					<li><a href="https://twitter.com/anantcorp" target="_blank"><Icon className="icon-class" link name='twitter square' size="large"/></a></li>
					<li><a href="https://www.facebook.com/AnantCorp/" target="_blank"><Icon className="icon-class" link name='facebook square' size="large"/></a></li>
				</ul>
			</div>
		</div>
		<style jsx>{`
			.footer {
				background: #263238;
				color: #fff;
				padding: 20px;
			}
			.footer .container {
				width: 90%;
				margin: 0 auto;
			}
			.href-link {
				padding: 10px;
			}
			.copyright, .links{
				display: inline-block;
				width: 50%;
			}
			.links {
				text-align: right;
			}
			.links ul {
				list-style: none;
			}
			.links ul li{
				display: inline-block;
				padding: 0px 15px;
			}
			.links ul li a {
				color: #fff;
			}
		`}</style>
	</div>
)

export default Footer