import React from 'react';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from '../components/column';
import wp2 from "../images/wp2.jfif"
import "../App.css"
import update from '../database/update';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { rdb } from '../firebase'
import { Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-height: 93vh;
  align-items: flex-start;
  min-width: 93vw;
`;

const ParentContainer = styled.div`
    width: 100%;
`;

class Zoom extends React.Component {
    state = null;

    other_state = {
        open: false,
    }

    onDragEnd = result => {

        this.setState({ disable: false })

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

        //removing from source column
        var did = source.droppableId
        var temp = this.state.columns[did].taskIds
        var index = temp.indexOf(draggableId)
        temp.splice(index, 1)
        rdb.ref().child("columns").child(source.droppableId).child("taskIds").set(temp)

        //adding to destination column
        var did1 = destination.droppableId
        var temp1 = this.state.columns[did1].taskIds
        temp1.push(draggableId)
        rdb.ref().child("columns").child(destination.droppableId).child("taskIds").set(temp1)

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
        /*const startTaskIds = Array.from(start.taskIds);
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
        this.setState(newState);*/
    };

    addColumn = () => {
        var newOrder = this.state.columnOrder
        newOrder.push("column-1" + this.state.columnOrder.length)
        rdb.ref().child('columnOrder').set(newOrder);

        rdb.ref().child('columns').child("column-1" + (this.state.columnOrder.length - 1)).set({
            id: "column-1" + (this.state.columnOrder.length - 1),
            title: "New Bucket",
            taskIds: [""]
        })
    }

    componentDidMount() {
        //update();
        rdb.ref().on('value', (snapshot) => {
            this.setState(snapshot.val())
        });
    }

    render() {
        if (this.state) {
            return (
                <div style={{minHeight:'100vh'}} >
                    <TransformWrapper
                        defaultScale={0.5}
                        defaultPositionX={200}
                        defaultPositionY={100}
                        disabled={this.state.disable}
                        doubleClick={{
                            disabled: true,
                        }}
                    >
                        {({ zoomIn, zoomOut, resetTransform, positionX, positionY, ...rest }) => (
                            <React.Fragment>
                                <div className="wp" style={{ backgroundImage: "url(" + wp2 + ")" }} >
                                    <div className="app-bar" >
                                        <div>
                                            Affinty Map
                                        </div>
                                        <div className="btn" >
                                            <Link to="/" >
                                                <div className="btns" >
                                                    Disable Zoom
                                                </div>
                                            </Link>
                                            <div className="btns" onClick={zoomIn} >
                                                Zoom In
                                            </div>
                                            <div className="btns" onClick={zoomOut} >
                                                Zoom Out
                                            </div>
                                        </div>
                                    </div>
                                    <TransformComponent>
                                        <ParentContainer>
                                            <DragDropContext onDragEnd={this.onDragEnd} onDragStart={() => { this.setState({ disable: true }) }} >

                                                <Container>
                                                    {this.state.columnOrder.map(columnId => {
                                                        const column = this.state.columns[columnId];
                                                        const tasks = column.taskIds.map(
                                                            taskId => this.state.tasks[taskId],
                                                        );

                                                        return <Column initialData={this.state} key={column.id} column={column} tasks={tasks} />;
                                                    })}
                                                    <div className="add-col" onClick={() => { this.addColumn() }} >
                                                        <img width="15px" src="https://img.icons8.com/material-outlined/24/000000/add.png" />
                                                        Add Column
                                                    </div>
                                                </Container>
                                            </DragDropContext>
                                        </ParentContainer>
                                    </TransformComponent>
                                </div>
                            </React.Fragment>
                        )}
                    </TransformWrapper>
                </div>
            );
        }
        else {
            return (<div>Loading</div>)
        }
    }
}

export default Zoom;
