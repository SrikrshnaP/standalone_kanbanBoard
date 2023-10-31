import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";

export default function KanbanBoard() {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [reviewed, setReviewed] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((json) => {
        setCompleted(json.filter((task) => task.completed));
        setReviewed(json.filter((task) => task.reviewed));
        setIncomplete(json.filter((task) => !task.completed));
      });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (source.droppableId == destination.droppableId) return;

    //REMOVE FROM SOURCE ARRAY
    if(source.droppableId == 4)  {
      setReviewed(removeItemById(draggableId, reviewed));
    } else if (source.droppableId == 2) {
      setCompleted(removeItemById(draggableId, completed));
    } else {
      setIncomplete(removeItemById(draggableId, incomplete));
    }

    // GET ITEM

    const task = findItemById(draggableId, [...incomplete, ...completed, ...reviewed]);

    //ADD ITEM
    if(destination.droppableId == 4)  {
      setReviewed([{ ...task, reviewed: !task.reviewed }, ...reviewed]);
    } else if (destination.droppableId == 2) {
      setCompleted([{ ...task, completed: !task.completed }, ...completed]);
    } else {
      setIncomplete([{ ...task, completed: !task.completed }, ...incomplete]);
    }
  };

  function findItemById(id, array) {
    return array.find((item) => item.id == id);
  }

  function removeItemById(id, array) {
    return array.filter((item) => item.id != id);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <h2 style={{ textAlign: "center" }}>KANBAN BOARD</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Column title={"TO DO"} tasks={incomplete} id={"1"} />
        <Column title={"DONE"} tasks={completed} id={"2"} />
        <Column title={"BACKLOG"} tasks={[]} id={"3"} />
        <Column title={"REVIEWED"} tasks={reviewed} id={"4"}/>
      </div>
    </DragDropContext>
  );
}
