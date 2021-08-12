import React from 'react';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import initialData from './initial-data';
import Column from './column';
import wp1 from "./images/wp1.jpg"
import wp2 from "./images/wp2.jfif"
import "./App.css"
import update from './database/update';
import {rdb} from './firebase'

const Container = styled.div`
  display: flex;
`;

class App extends React.Component {
  state = null;

  onDragEnd = result => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    console.log(destination, source, draggableId);

    const start = this.state.columns[source.droppableId];
    const finish = this.state.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      const newState = {
        ...this.state,
        columns: {
          ...this.state.columns,
          [newColumn.id]: newColumn,
        },
      };

      this.setState(newState);
      return;
    }

    // Moving from one list to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...this.state,
      columns: {
        ...this.state.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    this.setState(newState);
  };

  componentDidMount(){
    //update();
    rdb.ref().on('value', (snapshot) => {
      console.log(snapshot.val())
      this.setState(snapshot.val())
    });
  }

  render() {
    if(this.state){
      return (
        <div className="wp" style={{ backgroundImage: "url(" + wp2 + ")" }} >
          <div className="app-bar" >
            <div>
              Affinty Map
            </div>
            <div className="btn" >
              Zoom In
            </div>
          </div>
          <DragDropContext onDragEnd={this.onDragEnd} >
            <Container>
              {this.state.columnOrder.map(columnId => {
                const column = this.state.columns[columnId];
                const tasks = column.taskIds.map(
                  taskId => this.state.tasks[taskId],
                );
  
                return <Column key={column.id} column={column} tasks={tasks} />;
              })}
              <div className="add-col" >
                <img width="15px" src="https://img.icons8.com/material-outlined/24/000000/add.png" />
                Add Column
              </div>
            </Container>
          </DragDropContext>
        </div>
      );
    }
    else{
      return(<div>Loading</div>)
    }
  }
}

export default App;
