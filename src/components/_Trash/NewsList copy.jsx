import React, { Component } from "react";
import { sortBy } from "lodash";
import "font-awesome/css/font-awesome.min.css";
import ModalWindow from "../News/ModalWindow";

const DEFAULT_QUERY = "";
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = 20;
const PATH_BASE = "https://hn.algolia.com/api/v1";
const PATH_SEARCH = "/search";
const PARAM_SEARCH = "query=";
const PARAM_PAGE = "page=";
const PARAM_HPP = "hitsPerPage=";

const SORTS = {
  NONE: (list) => list,
  TITLE: (list) => sortBy(list, "title"),
  AUTHOR: (list) => sortBy(list, "author"),
  COMMENTS: (list) => sortBy(list, "num_comments").reverse(),
  POINTS: (list) => sortBy(list, "points").reverse(),
};

class NewsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: null,
      query: DEFAULT_QUERY,
      page: DEFAULT_PAGE,
      searchKey: "",
      // isLoading decides if the Loading... div is shown or not
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
    // The ES6 expression ` ` concatenates the strings.
    // Example: https://hn.algolia.com/api/v1/search?query=redux&page=0&hitsPerPage=100
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
      if (defaultQuery && this.needsToSearchTopStories(defaultQuery)) {
        this.setState({ searchKey: defaultQuery });
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

const Loading = () => {
  return (
    <div>
      <i className="fa fa-spinner" aria-hidden="true"></i>
    </div>
  );
};

const Search = (props) => {
  const { value, onChange, onSubmit, searchKey } = props;
  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search Here"
      />
      <button type="submit">
        <i className="fa fa-search" aria-hidden="true"></i>
      </button>
      &nbsp;
      <span className="rightSearch">
        {searchKey ? (
          <span>
            Showing stories about <span className="subject">{searchKey}</span>
          </span>
        ) : (
          <span>
            Showing <span className="subject">all</span> stories
          </span>
        )}
      </span>
    </form>
  );
};

const Table = (props) => {
  const { list, sortKey, onSort, isSortReverse, searchKey, onSave } = props;

  const sortedList = SORTS[sortKey](list);

  const reverseSortedList = isSortReverse
    ? SORTS[sortKey](list).reverse()
    : sortedList;
  return (
    <div className="table">
      <div className="table-header">
        <span style={{ width: "30%" }}>
          <Sort sortKey={"TITLE"} onSort={onSort} activeSortKey={sortKey}>
            Title
          </Sort>
        </span>
        <span style={{ width: "30%" }}>
          <Sort sortKey={"AUTHOR"} onSort={onSort} activeSortKey={sortKey}>
            Author
          </Sort>
        </span>
        <span style={{ width: "15%" }}>
          <Sort sortKey={"COMMENTS"} onSort={onSort} activeSortKey={sortKey}>
            Comments
          </Sort>
        </span>
        <span style={{ width: "15%" }}>
          <Sort sortKey={"POINTS"} onSort={onSort} activeSortKey={sortKey}>
            Points
          </Sort>
        </span>
        <span style={{ width: "10%" }}>
          <Sort sortKey={"POINTS"} onSort={onSort} activeSortKey={sortKey}>
            Points
          </Sort>
        </span>
      </div>
      {reverseSortedList
        .map((item) => (
          <div key={item.objectID} className="table-row">
            <span style={{ width: "30%" }}>
              <a href={item.url} className="subject">
                {item.title}
              </a>
            </span>
            <span style={{ width: "30%" }}>{item.author}</span>
            <span style={{ width: "15%" }}>{item.num_comments}</span>
            <span style={{ width: "15%" }}>{item.points}</span>
            <span style={{ width: "10%" }}>
              <ModalWindow
                onSave={onSave}
                searchKey={searchKey}
                resultQuery={item}
              />
            </span>
          </div>
        ))}
    </div>
  );
};

const Sort = (props) => {
  const { sortKey, onSort, children, activeSortKey } = props;
  const sortClass = ["button-inline"];
  if (sortKey === activeSortKey) {
    sortClass.push("button-active");
  }
  return (
    // className doesn't get applied to a component. It only gets applied to html elements. Pass it as a prop
    <Button className={sortClass.join(" ")} onClick={() => onSort(sortKey)}>
      {children}
    </Button>
  );
};

const Button = (props) => {
  const { onClick, children, className } = props;
  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
};

const withLoading =
  (Component) =>
  ({ isLoading, ...props }) => {
    return isLoading ? <Loading /> : <Component {...props} />;
  };

// This is a Higher Order Component (A component that does something to another and returns it)
// It renders <Loading /> or <Component /> based on the 'isLoading' state (see the withLoading() function)
const ButtonWithLoading = withLoading(Button);

export default NewsList;

export { Button, Search, Table, ModalWindow };
