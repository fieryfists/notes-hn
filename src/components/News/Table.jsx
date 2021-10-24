import Sort from "./Sort";
import ModalWindow from "./ModalWindow";
import { sortBy } from "lodash";

const Table = (props) => {
  const { list, sortKey, onSort, isSortReverse, searchKey, onSave } = props;

  const SORTS = {
    NONE: (list) => list,
    TITLE: (list) => sortBy(list, "title"),
    AUTHOR: (list) => sortBy(list, "author"),
    COMMENTS: (list) => sortBy(list, "num_comments").reverse(),
    POINTS: (list) => sortBy(list, "points").reverse(),
  };

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

export default Table;
