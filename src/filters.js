import React, { Component } from 'react';
import * as R from 'ramda'
const mapIndexed = R.addIndex(R.map);


class filters extends Component {
    constructor(props) {
        super(props);
        this.state = {
            header: [],
            filters: [{
                selectedValue: "first_name",
                inputValue: ""
            },
            {
                selectedValue: "last_name",
                inputValue: ""
            }]
        };
    }
    removeFilter(index) {
        const { filters } = this.state;
            filters[index].inputValue = "";

        this.setState({
            filters: filters
        })

    }
    selectFilterValue(value, indexGlobal) {
        let  { filters, selectedValueList } = this.state;
        filters[indexGlobal].selectedValue=value;
        selectedValueList[indexGlobal] = value;
        this.setState({
            filters: filters,
            selectedValueList: selectedValueList
        })
    }

    updateInputValue(e, index) {
        let newFilter= this.state.filters;
        newFilter[index].inputValue = e.target.value
        this.setState({
            filters: newFilter        
        })
    }
    addFilter() {
        let  { filters, selectedValueList } = this.state;
        let header = this.state.header;
        R.map((selectedValue)=>{
            if(header.indexOf(selectedValue) > -1) {
                header.splice( header.indexOf(selectedValue), 1)
            }
        }, selectedValueList)
        filters.push({
                selectedValue: "",
                inputValue: ""
        })
        this.setState({
            filters: filters,
            header: header
        })
    }

    applyFilter() {
        if (this.state.filters.length > 1 || this.state.filters[0].selectedValue) {
            this.props.applyFilter(this.state.filters);
            const element = document.getElementById("closeModal");
            element.click(); 
        }
    }

    resetData() {
        this.setState ({
            filters: [{
                selectedValue: "first_name",
                inputValue: ""
            },
            {
                selectedValue: "last_name",
                inputValue: ""
            }]
        })
        this.props.resetData(true)
    }

    componentWillMount() {
        this.setState({
            header: this.props.header
        })
    }

    renderFilters() {
        const headersListing = mapIndexed((filter, index) => {
            const selectedValue = filter.selectedValue !== "" ? filter.selectedValue : "Select Field";

			return (
				<div className="Filter" key={"filter"+ index}>
                    <div className="dropdown">
                        <button
                            className="btn btn-default dropdown-toggle"
                            type="button"
                            data-toggle="dropdown">
                            {selectedValue}
                        </button>
                    </div>
                    {
                        filter.selectedValue !== "" ?
                            <div className="searchname">
                                <input
                                className="def btn btn-default"
                                    value={filter.inputValue}
                                    onChange={(e) => this.updateInputValue(e, index)}
                                    placeholder="Search for Fields" />
                                <button className="btn btn-default clear" onClick={(e) => this.removeFilter(index)}>Clear</button>
                            </div>
                            :
                            null
                    }
                </div>
			);
        }, this.state.filters);
        return headersListing;
    }
    render() {
        return (
            <div>
                {this.renderFilters()}
                <hr />
                <div className="flexit">
                    <button
                        className="btn btn-default apply"
                        type="button"
                        data-toggle="dropdown"
                        onClick={(e)=> this.applyFilter()}>
                        APPLY
                    </button>
                    <button
                        className="btn btn-default"
                        type="button"
                        data-toggle="dropdown"
                        onClick={(e)=> this.resetData()}>
                        Reset
                    </button>
                </div>
            </div>
        );
    }
}

export default filters;
