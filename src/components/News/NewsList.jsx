import React, { Component } from "react";
import "font-awesome/css/font-awesome.min.css";
import Search from "./Search";
import Table from "./Table";
import { ButtonWithLoading } from "./Button";

const DEFAULT_QUERY = "";
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 20;
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

class NewsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      page: DEFAULT_PAGE,
      searchKey: "",
      isLoading: false,
      sortKey: "NONE",
      isSortReverse: false,
    };

    this.onSave = this.props.onSave;
    this.afterSearch = this.props.afterSearch;

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.onSort = this.onSort.bind(this);
  }

  setSearchTopStories(result) {
    const { hits, page, nbHits } = result;
    const { searchKey } = this.state;
    const oldHits = page === 0 ? [] : this.state.results[searchKey].hits;
    const updatedHits = [...oldHits, ...hits];

    if (searchKey.length > 0) this.afterSearch(searchKey, nbHits);

    this.setState({
      results: {
        ...this.state.results,
        [searchKey]: { hits: updatedHits, page },
      },
      isLoading: false,
    });
  }

  fetchSearchTopStories(query, page) {
    this.setState({ isLoading: true });
    fetch(
      `${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${query}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`
    )
      .then((response) => response.json())
      .then((result) => this.setSearchTopStories(result));
  }

  onSearchChange(event) {
    this.setState({ query: event.target.value, page: 0 });
  }

  onSearchSubmit(event) {
    const { query, page } = this.state;
    this.setState({ searchKey: query });
    if (this.needsToSearchTopStories(query)) {
      this.fetchSearchTopStories(query, page);
    }
    event.preventDefault();
  }

  needsToSearchTopStories(query) {
    return !this.state.results[query];
  }

  onSort(sortKey) {
    const isSortReverse = sortKey === this.state.sortKey ? true : false;
    this.setState({ sortKey: sortKey, isSortReverse: isSortReverse });
  }

  componentDidMount() {
    const { query, page } = this.state;
    this.setState({ searchKey: query });
    this.fetchSearchTopStories(query, page);
  }

  componentDidUpdate(prevProps) {
    const { defaultQuery } = this.props;
    if (prevProps.defaultQuery !== defaultQuery) {
      if (defaultQuery) {
        this.setState({ searchKey: defaultQuery, query: defaultQuery, page: 0, results: {} });
        this.fetchSearchTopStories(defaultQuery, DEFAULT_PAGE);
      }
    }
  }

  render() {
    const { results, query, searchKey, isLoading, sortKey, isSortReverse } =
      this.state;
    const page = results && results[searchKey] ? results[searchKey].page : 0;
    const list = results && results[searchKey] ? results[searchKey].hits : [];

    const { isVisible } = this.props;
    return (
      <div className={`page ${isVisible ? "visible" : "hidden"}`}>
        <div className="interactions">
          <Search
            value={query}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
            afterSearch={this.afterSearch}
            searchKey={searchKey}
          />
        </div>
        <Table
          list={list}
          sortKey={sortKey}
          onSort={this.onSort}
          isSortReverse={isSortReverse}
          searchKey={searchKey}
          onSave={this.onSave}
        />
        <div className="interactions">
          <ButtonWithLoading
            isLoading={isLoading}
            onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}
          >
            More
          </ButtonWithLoading>
        </div>
      </div>
    );
  }
}

export default NewsList;
