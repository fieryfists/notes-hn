import { MdDeleteForever } from "react-icons/md";

const NotesList = ({
  notes,
  isVisible,
  handleToggleSaveMode,
  handleDeleteNote,
  forceSearch,
}) => {
  return (
    <div className={`table ${isVisible ? "visible" : "hidden"}`}>
      <div className="table-header">
        <span style={{ width: "15%" }}>TITLE</span>
        <span style={{ width: "10%" }}>SEARCH KEY</span>
        <span style={{ width: "30%" }}>NEWS TITLE</span>
        <span style={{ width: "10%" }}>AUTHOR</span>
        <span style={{ width: "15%" }}>TAG LIST</span>
        <span style={{ width: "15%" }}>CREATION DATE</span>
        <span style={{ width: "5%" }}>DELETE</span>
      </div>

      {notes.map((item) => (
        <div key={item.id} className="table-row">
          <span style={{ width: "15%" }}>
            <span
              className="note-link"
              onClick={() => {
                handleToggleSaveMode((previousSaveMode) => !previousSaveMode);
                forceSearch(item.searchKey);
              }}
            >
              {item.title}
            </span>
          </span>
          <span style={{ width: "10%" }}>
            {item.searchKey === "" ? "All" : item.searchKey}
          </span>
          <span style={{ width: "30%" }}>
            <a href={item.resultQuery.url}>{item.resultQuery.title}</a>
          </span>
          <span style={{ width: "10%" }}>{item.resultQuery.author}</span>
          <span style={{ width: "15%" }}>
            {JSON.stringify(item.resultQuery._tags)}
          </span>
          <span style={{ width: "15%" }}>{item.date.slice(0, 10)}</span>
          <span style={{ width: "5%" }}>
            <MdDeleteForever
              onClick={() => handleDeleteNote(item.id)}
              className="delete-icon"
              size="1.3em"
            />
          </span>
        </div>
      ))}
    </div>
  );
};

export default NotesList;
