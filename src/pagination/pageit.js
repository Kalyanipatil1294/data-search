import React, { Component } from 'react';
import * as R from 'ramda'
const increment = x =>  x+1;
const decrement = x =>  x-1;


class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activePageIndexs: [1, 2, 3]
        };
    }
    changecurrentIndexActive(index, clickedButton) {
        if (index > -1 && index < this.props.totalPages) {
            if (clickedButton === "first" && this.props.currentIndex !==0) {
                this.setState({
                    activePageIndexs: [1, 2, 3]
                })
            } else if (clickedButton === "last") {
                this.setState({
                    activePageIndexs: [index-1 ,index , index+1]
                })
            } else if (clickedButton === "prev" && !this.state.activePageIndexs.includes(index+1)) {
                this.setState({
                    activePageIndexs: R.map(decrement, this.state.activePageIndexs)
                })
            } else if (clickedButton === "next" && !this.state.activePageIndexs.includes(index+1)) {
                this.setState({
                    activePageIndexs: R.map(increment, this.state.activePageIndexs)
                })
            }
            this.props.changeCurrentIndex(index)

        }
    }

    componentWillReceiveProps(nextProps) {
        console.log("here");
        if (nextProps.currentIndex === 0) {
            this.setState({activePageIndexs: [1, 2, 3]})
        }      
    }

    render() {
        let { activePageIndexs } = this.state;
        const {
            currentIndex,
            totalPages
        } = this.props;
        if (totalPages === 1) {
            return null;
        }
        const isActiveOne = currentIndex+1 === activePageIndexs[0] ? "active": ""
        const isActiveTwo = currentIndex+1 === activePageIndexs[1] ? "active": ""
        const isActiveThree = currentIndex+1 === activePageIndexs[2] ? "active": ""

        return (
            <div className="container-page">
					<ul className="pagination">
						{totalPages > 3 ? <li onClick={(e) =>this.changecurrentIndexActive(0, "first")} ><a href="#">first</a></li> : null }
						{totalPages > 3 ? <li onClick={(e) =>this.changecurrentIndexActive(currentIndex-1, "prev")} ><a href="#">prev</a></li> : null}
						<li className={isActiveOne} onClick={(e) =>this.changecurrentIndexActive(activePageIndexs[0]-1)} ><a href="#">{activePageIndexs[0]}</a></li>
						<li className={isActiveTwo} onClick={(e) =>this.changecurrentIndexActive(activePageIndexs[1]-1)}><a href="#">{activePageIndexs[1]}</a></li>
						{totalPages > 2 ?<li className={isActiveThree} onClick={(e) =>this.changecurrentIndexActive(activePageIndexs[2]-1)}><a href="#">{activePageIndexs[2]}</a></li>: null}
						{totalPages > 3 ? <li onClick={(e) =>this.changecurrentIndexActive(currentIndex+1, "next")}><a href="#">next</a></li> : null}
						{totalPages > 3 ? <li onClick={(e) =>this.changecurrentIndexActive(totalPages-1, "last")}><a href="#">last</a></li>: null}
					</ul>
				</div>
        );
    }
}

export default Pagination;
