import React from "react";
import ReactDOM from "react-dom";
import rendered from "react-test-renderer";
import NewsList from "./components/News/NewsList";
import Statistics from "./components/Stats/Statistics";
import Search from './components/News/Search';
import Button from './components/News/Button';
import Table from './components/News/Table';

describe("Search", () => {
  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Search>Search</Search>, div);
  });

  test("snapshots", () => {
    const component = rendered.create(<Search>Search</Search>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Button", () => {
  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Button>More</Button>, div);
  });

  test("snapshots", () => {
    const component = rendered.create(<Button>More</Button>);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("Table", () => {
  const props = {
    list: [
      { title: "1", author: "1", num_comments: 1, points: 2, objectID: "y" },
      { title: "2", author: "2", num_comments: 1, points: 2, objectID: "z" },
    ],
    sortKey: "NONE",
  };

  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Table {...props} />, div);
  });

  test("snapshots", () => {
    const component = rendered.create(<Table {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe("NewsList", () => {
  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<NewsList />, div);
  });
});

it("api call returns a string", async () => {
  const getData = () => {
    return fetch(
      "https://hn.algolia.com/api/v1/search?query=&page=0&hitsPerPage=1"
    ).then((res) => res.json());
  };

  const expected = {
    hits: expect.arrayContaining([
      expect.objectContaining({
        created_at: expect.any(String),
        title: expect.any(String),
        url: expect.any(String),
        author: expect.any(String),
        points: expect.any(Number),
        num_comments: expect.any(Number),
        relevancy_score: expect.any(Number),
        _tags: expect.any(Array),
        objectID: expect.any(String),
        _highlightResult: expect.any(Object),
      }),
    ]),
    nbHits: expect.any(Number),
    page: expect.any(Number),
    nbPages: expect.any(Number),
    query: expect.any(String),
  };
  let actual = await getData();

  expect(actual.hits).toHaveLength(1);
  expect(actual).toMatchObject(expected);
});

describe("Statistics", () => {
  const props = {
    queries: [
      {
        creationDate: "2021-10-23T12:48:12.353Z",
        hits: 11413,
        id: 0,
        query: "fdfs",
      },
      {
        creationDate: "2021-10-22T12:48:12.353Z",
        hits: 11412,
        id: 1,
        query: "fdfs",
      },
      {
        creationDate: "2021-10-21T12:48:12.353Z",
        hits: 11411,
        id: 2,
        query: "fdfs",
      },
      {
        creationDate: "2021-09-20T12:48:12.353Z",
        hits: 11410,
        id: 3,
        query: "fdfs",
      },
    ],
    isVisible: true,
  };

  it("renders", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Statistics {...props} />, div);
  });

  test("snapshots", () => {
    const component = rendered.create(<Statistics {...props} />);
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
