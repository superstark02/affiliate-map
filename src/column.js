import React from 'react';
import styled from 'styled-components';
import { Droppable } from 'react-beautiful-dnd';
import Task from './task';
import { rdb } from './firebase'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

  state = {
    content: null,
    open: false,
    size: 0
  }

  addItem = (id, taskIds) => {
    var i = parseInt(taskIds.length) + 1;
    taskIds.push("task-1" + i);
    rdb.ref("/columns").child(id.toString()).child('taskIds').set(taskIds);

    rdb.ref("/tasks").child("task-1" + taskIds.length).set({
      id: "task-1" + taskIds.length,
      content: "New Task Created"
    });
  }

  onDelete = (id) => {
    var colOrder = this.props.initialData.columnOrder
    var index = colOrder.indexOf(id)
    colOrder.splice(index, 1);
    rdb.ref().child('columnOrder').set(colOrder);

    rdb.ref().child('columns').child(id).remove();
  }

  editItem = (id) => {
    this.setState({open:id})
  }

  editItemUtil = (id) => {
    rdb.ref("/columns").child(id).update({
      title: this.state.content
    }).then(res => {
      this.setState({ content: "" });
      this.setState({ open:false });
    });
  }

  componentDidUpdate(){
    
  }

  render() {
    return (
      <Container>
        <div style={{ display: "flex", justifyContent: "space-between" }} >
          <Title>{this.props.column.title}</Title>
          <div style={{ padding: "8px" }} >
            <img style={{ marginRight: "5px", cursor: "pointer" }} src="https://img.icons8.com/material-outlined/24/000000/pencil--v1.png" onClick={() => { this.editItem(this.props.column.id) }} width="15px" />
            <img style={{ cursor: "pointer" }} src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" onClick={() => { this.onDelete(this.props.column.id) }} width="15px" />
          </div>
        </div>
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

        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"I hope you like the platform"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Enter your bucket name: <input value={this.state.content} onChange={(e) => { this.setState({ content: e.target.value }) }} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { this.editItemUtil(this.state.open) }} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    );
  }
}
