import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import * as R from 'ramda'
import Pagination from "./pagination/pageit";
import PageModal from "./modal/modal";
const mapIndexed = R.addIndex(R.map);
const groupsOf = R.curry(function group(n, list) {
	return R.isEmpty(list) ? [] : R.prepend(R.take(n, list), group(n, R.drop(n, list)));
});


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			header: [],
			currentIndex: 0,
			filtereddata: [],
			responseData: [],
			globalSearch: "",
			headerMain: ["exam_no", "first_name", "last_name", "list_agency_desc", "list_no", "adj_fa"]
		}
	}
	componentDidMount() {
		const self = this;
		const Url = "https://data.cityofnewyork.us/resource/5scm-b38n.json";
		axios
			.get(Url)
			.then(response => self.setData(response.data))
			.catch(response => console.log("API failed"));

	}

	changeCurrentIndex(index) {
		this.setState({
			currentIndex: index,
			data: this.state.filtereddata[index]
		})
	}

	setData(response) {
		const header = response.length > 0 ? Object.keys(response[0]) : [];
		const filtereddata = groupsOf(10, response);
		this.setState({
			responseData: response,
			filtereddata: filtereddata,
			data: filtereddata[this.state.currentIndex],
			header: header
		})
	}
	applyFilter(filters) {
		let responseDataFilter = this.state.responseData;
		R.map(filter=> {
			if (filter.selectedValue) {
				responseDataFilter = responseDataFilter.length > 1 ? responseDataFilter.filter(vertical => {
					return (
						(vertical[filter.selectedValue]
							.toLowerCase()
							.indexOf(filter.inputValue.toLowerCase()) > -1)
					);
				}) : [];
			}
		}, filters);

		if (responseDataFilter.length > 0) {
			const filteredDataArray = groupsOf(10, responseDataFilter);
			this.setState({
				filtereddata: filteredDataArray,
				data: filteredDataArray[0],
				currentIndex: 0
			})
		} else {
			this.setState({
				filtereddata: [],
				data: [],
			})
		}
	}

	resetData(isMainPage) {
		this.setData(this.state.responseData);
		if (isMainPage) {
			const element = document.getElementById("closeModal");
            element.click();
		}
	}

	changeSearchInput(e) {
		let filtereddata = this.state.responseData.filter(vertical => {
            return (
                (vertical.first_name
                    .toLowerCase()
					.indexOf(e.target.value.toLowerCase()) > -1)
					||
				(vertical.last_name
					.toLowerCase()
					.indexOf(e.target.value.toLowerCase()) > -1)
					||
				(vertical.exam_no
					.toLowerCase()
					.indexOf(e.target.value.toLowerCase()) > -1)
					||
				(vertical.list_agency_desc
					.toLowerCase()
					.indexOf(e.target.value.toLowerCase()) > -1)
					
            );
		});
		const filteredDataArray = filtereddata.length > 1 ? groupsOf(10, filtereddata) : [];
		const data = filtereddata.length > 1 ? filteredDataArray[0] : [];
		this.setState({
			filtereddata: filteredDataArray,
			data: data,
			globalSearch: e.target.value,
			currentIndex: 0
		})
		
	}

	renderHeadings() {
		const {
			headerMain
		} = this.state;
		const headings = headerMain.length > 0 ? headerMain : [];

		const headersListing = mapIndexed((header, index) => {
			return (
				<th key={"head" + index}>
					{header}
				</th>
			);
		}, headings);
		return headersListing;
	}

	renderData() {
		const data = this.state.data;
		const headersListing = mapIndexed((row, index) => {
			return (
				<tr key={"row" + index}>
					{this.renderValues(row)}
				</tr>)
		}, data);
		return headersListing;
	}
	renderValues(row) {
		const retunrIt = mapIndexed((header, index) => {
			const value = row[header];
			return <td key={"cell" + index}> {value} </td>;
		}, this.state.headerMain);
		return retunrIt;
	}

	render() {
		const { header, filterCount, } = this.state;
		if (this.state.responseData.length < 1) {
			return(
				<div class="loader"></div>
			)
		}
		const filterParams = {
			header: ["first_name", "last_name"],
			filterCount: filterCount,
			applyFilter: e => {
                this.applyFilter(e)
			},
			resetData: e => {
				this.resetData(e)
			}
		};
		return (
			<div className="App">
				<header className="App-header">
					<h1> Data Analysis</h1>
				</header>
				<div className="container">
					<div className="customFilter">
						<div className="customFilter-search">
						<input 
							className="inputSearch"
							value={this.state.globalSearch}
							placeholder="Search"
							onChange={(e)=>this.changeSearchInput(e)}
						/>
						</div>
						<div className="customFilter-filter">
							<button type="button" className="btn btn-info btn-lg filter-button" data-toggle="modal" data-target="#myModal">Filter</button>
							<button onClick={(e) =>this.resetData(false)} type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#myReset">Reset</button>
							<PageModal 
								header={["first_name", "last_name"]}
								filterParams={filterParams}
								filterCount={filterCount}
							/>
						</div>
					</div>
					<table className="table table-condensed">
						<thead>
							<tr>
								{this.renderHeadings()}
							</tr>
						</thead>
						{this.state.filtereddata.length > 0 ? 
						<tbody>
							{this.renderData()}
						</tbody>
						:
						null}
					</table>
					{this.state.filtereddata.length > 0 ? 		

					<Pagination 
					currentIndex={this.state.currentIndex}
					changeCurrentIndex={(e)=>this.changeCurrentIndex(e)}
					totalPages={this.state.filtereddata.length}
				/>
				:
					<img src="http://massets.bonzai.ad/internalAssets/2019/02/13/nodata.png.png" alt="NoData" />}
				</div>
			</div>
		);
	}
}

export default App;
