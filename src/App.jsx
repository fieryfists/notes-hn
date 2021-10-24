import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import NotesList from "./components/Notes/NotesList";
import Statistics from "./components/Stats/Statistics";
import Header from "./components/Header";
import NewsList from "./components/News/NewsList";
import "./index.css";

const App = () => {
  const [notes, setNotes] = useState([
    {
      id: "N0eAPK-wpj_NGqVcRrQwB",
      title: "My first Note",
      searchKey: "",
      resultQuery: {
        created_at: "2018-03-14T03:50:30.000Z",
        title: "Stephen Hawking has died",
        url: "http://www.bbc.com/news/uk-43396008",
        author: "Cogito",
        points: 6015,
        story_text: null,
        comment_text: null,
        num_comments: 436,
        story_id: null,
        story_title: null,
        story_url: null,
        parent_id: null,
        created_at_i: 1520999430,
        relevancy_score: 8012,
        _tags: ["story", "author_Cogito", "story_16582136"],
        objectID: "16582136",
        _highlightResult: {
          title: {
            value: "Stephen Hawking has died",
            matchLevel: "none",
            matchedWords: [],
          },
          url: {
            value: "http://www.bbc.com/news/uk-43396008",
            matchLevel: "none",
            matchedWords: [],
          },
          author: { value: "Cogito", matchLevel: "none", matchedWords: [] },
        },
      },
      date: "2021-10-24T14:16:18.413Z",
    },
  ]);

  const [queries, setQueries] = useState([
    {
      creationDate: "2021-10-23T12:48:12.353Z",
      hits: 11413,
      id: nanoid(),
      query: "fdfs",
    },
    {
      creationDate: "2021-10-22T12:48:12.353Z",
      hits: 11412,
      id: nanoid(),
      query: "fdfs",
    },
    {
      creationDate: "2021-10-21T12:48:12.353Z",
      hits: 11411,
      id: nanoid(),
      query: "fdfs",
    },
    {
      creationDate: "2021-09-20T12:48:12.353Z",
      hits: 11410,
      id: nanoid(),
      query: "fdfs",
    },
  ]);

  const [searchText, setSearchText] = useState();

  const [saveMode, setSaveMode] = useState(false);
  const [statMode, setStatMode] = useState(false);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("SearchNotebook"));

    if (savedNotes) {
      setNotes(savedNotes);
    }

    const savedQueries = JSON.parse(localStorage.getItem("SearchQuery"));

    if (savedQueries) {
      setQueries(savedQueries);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("SearchNotebook", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem("SearchQuery", JSON.stringify(queries));
  }, [queries]);

  const addNote = ({ title, searchKey, resultQuery }) => {
    const savedNotes = JSON.parse(localStorage.getItem("SearchNotebook"));

    const date = new Date();
    const newNote = {
      id: nanoid(),
      title: title,
      searchKey: searchKey,
      resultQuery: resultQuery,
      date: date.toJSON(),
    };

    const newNotes = [...savedNotes, newNote];
    setNotes(newNotes);
  };

  const addQuery = (searchText, hits) => {
    const savedQueries = JSON.parse(localStorage.getItem("SearchQuery"));
    const date = new Date().toJSON();

    const existed = savedQueries.filter(
      (item) =>
        item.creationDate.slice(0, 10) === date.slice(0, 10) &&
        item.query === searchText
    );

    const updatedQueries = savedQueries.map((item) => {
      if (
        item.creationDate.slice(0, 10) === date.slice(0, 10) &&
        item.query === searchText
      ) {
        item.hits = Math.round((item.hits + hits) / 2);
      }

      return item;
    });

    const newQuery = {
      id: nanoid(),
      query: searchText,
      creationDate: date,
      hits: hits,
    };

    const newQueries =
      existed.length > 0 ? updatedQueries : [...savedQueries, newQuery];

    setQueries(newQueries);
  };

  const deleteNote = (id) => {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
  };

  return (
    <div className="container">
      <Header
        handleToggleSaveMode={setSaveMode}
        handleToggleStatMode={setStatMode}
        saveMode={saveMode}
        statMode={statMode}
      />

      {statMode ? (
        <Statistics isVisible={statMode} queries={queries} />
      ) : (
        <>
          <NotesList
            isVisible={saveMode}
            notes={notes}
            handleToggleSaveMode={setSaveMode}
            handleDeleteNote={deleteNote}
            forceSearch={setSearchText}
          />

          <NewsList
            isVisible={!saveMode}
            onSave={addNote}
            afterSearch={addQuery}
            defaultQuery={searchText}
          />
        </>
      )}
    </div>
  );
};

export default App;
