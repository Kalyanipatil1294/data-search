import React, { Component } from 'react';
import Filter from "../filters";

class PageModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    changecurrentIndexActive(index) {
        this.props.changeCurrentIndex(index)
    }

    render() {
        const {
            header,
            filterParams
        } = this.props;

        return (
            <div className="modal fade" id="myModal" role="dialog">
                <div className="modal-dialog">

                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                            <h4 className="modal-title">Add Filter</h4>
                        </div>
                        <div className="modal-body">
                        {
                        header.length > 0 ? 
						<Filter {...filterParams} key= "filter"/>
						:
						null
					}
                        </div>
                        <div className="modal-footer">
                            <button id="closeModal"type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                        </div>
                    </div>

                </div>
            </div>);
    }
}

export default PageModal;
