import React from 'react';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { rdb } from '../firebase'

const Container = styled.div`
  border-radius: 2px;
  padding: 8px;
  margin-bottom: 8px;
  box-shadow: 1px 1px 1px rgba(0,0,0,0.5);
  background-color: white;
  display: flex;
  justify-content: space-between;
`;

export default class Task extends React.Component {

  state = {
    content: null,
    open: false
  }

  handleClose = () => {
    this.setState({ open: false })
  }

  delete_ = (id_, column_id) => {
    rdb.ref("/tasks").child(id_).remove();
    var temp = this.props.taskIds.indexOf(id_)
    this.props.taskIds.slice(1,temp);
    rdb.ref("/columns").child(column_id).child("taskIds").set(this.props.taskIds)
  }

  editItem = (id) => {
    this.setState({open:id})
  }

  editItemUtil = (id) => {
    rdb.ref("/tasks").child(id.toString()).set({
      id: id,
      content: this.state.content
    }).then(res => {
      this.setState({ content: "" });
      this.setState({ open:false });
    });
  }

  render() {
    return (
      <div>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"I hope you like the platform"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Enter your task: <input value={this.state.content} onChange={(e)=>{this.setState({content:e.target.value})}} />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>{this.editItemUtil(this.state.open)}} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Draggable draggableId={this.props.task.id} index={this.props.index}>
          {provided => (
            <Container
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div>
                {this.props.task.content}
              </div>
              <div>
                <img style={{ marginRight: "5px" }} src="https://img.icons8.com/material-outlined/24/000000/pencil--v1.png" onClick={() => { this.editItem(this.props.task.id) }} width="15px" />
                <img src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" onClick={() => { this.delete_(this.props.task.id, this.props.column_id) }} width="15px" />
              </div>
            </Container>
          )}
        </Draggable>
      </div>
    );
  }
}
