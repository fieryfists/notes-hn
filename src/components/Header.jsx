import React from "react";

const Header = ({ handleToggleSaveMode, saveMode, handleToggleStatMode, statMode }) => {
  return (
    <div className="header">
      <h1>HN Search Notebook</h1>
      {(!statMode) && (
        <button
          onClick={() =>
            handleToggleSaveMode((previousSaveMode) => !previousSaveMode)
          }
        >
          {!saveMode ? (
            <i className="fa fa-database" aria-hidden="true">
              &nbsp;LIST
            </i>
          ) : (
            <i className="fa fa-database" aria-hidden="true">
              &nbsp;SEARCH
            </i>
          )}
        </button>
      )}
      <button
        onClick={() =>
          handleToggleStatMode((previousStatMode) => !previousStatMode)
        }
      >
        <i className="fa fa-database" aria-hidden="true">
          &nbsp;STATISTICS
        </i>
      </button>
    </div>
  );
};

export default Header;
