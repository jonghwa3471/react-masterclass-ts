import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import {
  boardModalState,
  boardOrderState,
  toDoState,
  TRELLO_TODO,
} from "./atoms";
import Board from "./components/Board";
import AddBoardButton from "./components/AddBoardButton";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import BoardModal from "./components/BoardModal";

library.add(fas, fab, far);

const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const boardOrder = useRecoilValue(boardOrderState);
  const [toDos, setToDos] = useRecoilState(toDoState);
  const modalState = useRecoilValue(boardModalState);
  const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        const dragEndResult = {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
        localStorage.setItem(TRELLO_TODO, JSON.stringify(dragEndResult));
        return dragEndResult;
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement.
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const taskObj = sourceBoard[source.index];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination.index, 0, taskObj);
        const dragEndResult = {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
        localStorage.setItem(TRELLO_TODO, JSON.stringify(dragEndResult));
        return dragEndResult;
      });
    }
  };
  return (
    <>
      <AddBoardButton />
      {modalState ? <BoardModal /> : null}
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <Boards>
            {boardOrder.map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </Wrapper>
      </DragDropContext>
    </>
  );
}

export default App;
