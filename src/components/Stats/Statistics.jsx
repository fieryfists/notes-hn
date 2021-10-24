const Statistics = ({ queries, isVisible }) => {
  const getLastWeekHits = (query) => {
    const today = new Date().getTime();
    const startWeek = new Date(today - 7 * 24 * 60 * 60 * 1000);

    const rep = queries.filter(
      (item) =>
        Date.parse(item.creationDate) >= startWeek &&
        Date.parse(item.creationDate) <= today &&
        Date.parse(query.creationDate) >= startWeek &&
        Date.parse(query.creationDate) <= today &&
        item.query === query.query
    );

    const lastWeekHits = rep.reduce((sum, current, _, { length }) => {
      return sum + current.hits;
    }, 0);

    return Math.round(lastWeekHits / rep.length) || 0;
  };

  return (
    <div className={`table ${isVisible ? "visible" : "hidden"}`}>
      <div className="table-header">
        <span style={{ width: "50%" }}>SEARCH KEY</span>
        <span style={{ width: "15%" }}>CREATION DATE</span>
        <span style={{ width: "15%" }}>HITS/DAY</span>
        <span style={{ width: "20%" }}>HITS/LAST WEEK</span>
      </div>

      {queries.map((item) => (
        <div key={item.id} className="table-row">
          <span style={{ width: "50%" }}>
            <a href={item.url} className="subject">
              {item.query}
            </a>
          </span>
          <span style={{ width: "15%" }}>{item.creationDate.slice(0, 10)}</span>
          <span style={{ width: "15%" }}>{item.hits}</span>
          <span style={{ width: "20%" }}>{getLastWeekHits(item)}</span>
        </div>
      ))}
    </div>
  );
};

export default Statistics;
