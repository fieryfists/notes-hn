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

export default Search;