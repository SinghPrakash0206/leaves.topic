import Link from 'next/link'



const makePaginationHref = (pages, tag, active) => {
    let table = []

    const paginationStyle = {
		padding: '8px 12px',
		border: '1px solid rgba(34,36,38,.15)',  
		WebkitBoxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
		boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
		fontSize: '1.2em',
		fontFamily: "'Roboto Mono', monospace"
	}

	const paginationActiveStyle = {
		padding: '8px 12px',
		border: '1px solid rgba(34,36,38,.15)',  
		WebkitBoxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
		boxShadow: '0 1px 2px 0 rgba(34,36,38,.15)',
		fontSize: '1.2em',
		fontFamily: "'Roboto Mono', monospace",
		backgroundColor: '#726969',
		color: '#fff'
	}
	var startIndex, endPage;
	 if (pages <= 10) {
            // less than 10 total pages so show all
            startIndex = 1;
            endPage = pages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (active <= 6) {
                startIndex = 1;
                endPage = 10;
            } else if (active + 4 >= pages) {
                startIndex = pages - 9;
                endPage = pages;
            } else {
                startIndex = active - 5;
                endPage = active + 4;
            }
        }


    // Outer loop to create parent
    for (let i = startIndex; i <= endPage; i++) {
    	if(tag === "Latest Leaves") {
	      table.push(<Link href={"/latest-leaves/page/" + i} key={i}><a style={ active === i ? paginationActiveStyle : paginationStyle}>{i}</a></Link>)
    	}else{
	      table.push(<Link href={"/topic/" + tag + "/page/" + i} key={i}><a style={ active === i ? paginationActiveStyle : paginationStyle}>{i}</a></Link>)
    	}
    }

    return table
  }


const TopicPagination = (props) => (
	<div className="page-link">
		{makePaginationHref(props.totalPages, props.tag, props.defaultActivePage)}
		<style jsx>{`
			.page-link a{
				padding: .92857143em 1.14285714em;
				text-transform: none;
				color: rgba(0,0,0,.87);
				font-weight: 400;
			}
			a {
				border: 1px solid red;
			}
		`}</style>
	</div>
)

export default TopicPagination