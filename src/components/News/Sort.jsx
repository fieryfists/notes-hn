import Button from "./Button";

const Sort = (props) => {
  const { sortKey, onSort, children, activeSortKey } = props;
  const sortClass = ["button-inline"];
  if (sortKey === activeSortKey) {
    sortClass.push("button-active");
  }
  return (
    <Button className={sortClass.join(" ")} onClick={() => onSort(sortKey)}>
      {children}
    </Button>
  );
};

export default Sort;
