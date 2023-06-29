import { useCallback, useMemo, useState } from "react";

const tiles = Array(99)
  .fill(0)
  .map((_e, i) => ({ id: i + 1 }));

const placeholder = { placeholder: true };

export default function App() {
  const [list, setList] = useState(tiles);
  const [draggingId, setDraggingId] = useState(null);
  const [hoveringIndex, setHoveringIndex] = useState(null);

  const handleDrag = useCallback(function handleDrag(item) {
    if (!item.id) return;
    setDraggingId(item.id);
  }, []);

  const handleDragOver = useCallback(
    function handleDragOver(hoveredItem) {
      const newHoveringIndex = list.findIndex(
        ({ id }) => id === hoveredItem.id
      );
      setHoveringIndex(
        newHoveringIndex === hoveringIndex
          ? newHoveringIndex + 1
          : newHoveringIndex
      );
    },
    [list, hoveringIndex]
  );

  const handleDrop = useCallback(
    function handleDrop() {
      setList((prev) => {
        const newList = [...prev];
        newList.splice(
          hoveringIndex,
          0,
          ...newList.splice(
            newList.findIndex(({ id }) => draggingId === id),
            1
          )
        );
        return newList;
      });
      setDraggingId(null);
      setHoveringIndex(null);
    },
    [draggingId, hoveringIndex]
  );

  const innerList = useMemo(
    () =>
      hoveringIndex
        ? [
            ...list.slice(0, hoveringIndex),
            placeholder,
            ...list.slice(hoveringIndex)
          ]
        : list,
    [hoveringIndex, list]
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          width: "500px"
        }}
        onDrag={handleDrag}
      >
        {innerList.map((item) =>
          item.placeholder ? (
            <Tile item={item} onDrop={() => handleDrop(item)} />
          ) : (
            <Tile
              item={item}
              onDragStart={() => handleDrag(item)}
              onDragOver={() => handleDragOver(item)}
            />
          )
        )}
      </div>
      <div>Currently dragging: {draggingId}</div>
    </>
  );
}

function Tile({ item, ...props }) {
  return (
    <div
      style={{
        width: "50px",
        height: "50px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid black",
        boxSizing: "border-box"
      }}
      draggable
      onDragOver={(e) => e.preventDefault()}
      {...props}
    >
      {item.id}
    </div>
  );
}
