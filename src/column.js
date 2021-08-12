import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';
import { rdb } from './firebase'

const Container = styled.div`
  margin: 8px;
  border-radius: 4px;
  width: 280px;
  background-color: #ebecf0;
  display: flex;
  flex-direction: column;
  box-shadow: 1px 1px 1px rbga(0,0,0,0.5);
`;
const Title = styled.div`
  padding: 8px;
  color: #59667f;
  font-weight: 700;
`;
const TaskList = styled.div`
  padding: 8px;
  flex-grow: 1;
  height: fit-content;
  background-color: #ebecf0;
`;

export default class Column extends React.Component {

  addItem = (id,taskIds) => {
    var i = parseInt(taskIds.length) + 1;
    taskIds.push("task-"+i);
    rdb.ref("/columns").child(id.toString()).child('taskIds').set(taskIds);

    rdb.ref("/tasks").child("task-"+taskIds.length).set({
      id: "task-"+taskIds.length,
      content: "New Task Created"
    });
  }

  render() {
    return (
      <Container>
        <Title>{this.props.column.title}</Title>
        <Droppable droppableId={this.props.column.id}>
          {provided => (
            <TaskList ref={provided.innerRef} {...provided.droppableProps}>
              {this.props.tasks.map((task, index) => {
                if (task) {
                  return (
                    <Task taskIds={this.props.column.taskIds} column_id={this.props.column.id} key={task.id} task={task} index={index} />
                  )
                }
              })}
              {provided.placeholder}
            </TaskList>
          )}
        </Droppable>
        <div className="add-item" onClick={() => { this.addItem(this.props.column.id, this.props.column.taskIds) }} >
          <img width="15px" src="https://img.icons8.com/material-outlined/24/000000/add.png" />
          Add Item
        </div>
      </Container>
    );
  }
}
