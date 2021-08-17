import React from 'react';
import '@atlaskit/css-reset';
import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Column from '../components/column';
import wp2 from "../images/wp2.jfif"
import "../App.css"
import update from '../database/update';
import a from "../images/a.PNG"
import { rdb } from '../firebase'
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../components/loader';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 93vh;
`;

class Home extends React.Component {
    state = null;

    other_state = {
        open: false,
    }

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

    handleClose = () => {
        this.setState({ openInfo: false })
    }

    

    render() {
        if (this.state) {
            return (
                <div className="wp" style={{ backgroundImage: "url(" + wp2 + ")" }} >
                    <Dialog
                        open={this.state.openInfo}
                        onClose={this.handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{"Introduction"}</DialogTitle>
                        <DialogContent>
                            <p>
                                Hi there 👋, please read the following instructions:
                            </p>
                            <p>
                                <ul>
                                    <li>State is saved after refresh 🖖</li>
                                    <li>
                                        Find all the details here: <br></br>
                                        <ol>
                                            <li>Github</li>
                                            <li>Video</li>
                                            <li>Re-open this dialog box</li>
                                        </ol>
                                        <img src={a} width="300px" />
                                    </li>
                                </ul>
                            </p>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose} color="primary" autoFocus>
                                Ok
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <div className="app-bar" >
                        <div>
                            Affinty Map
                        </div>
                        <div className="btn" >
                            <Link to="/zoom" >
                                <div className="btns" >
                                    Pan And Zoom
                                </div>
                            </Link>
                            <a href="https://github.com/superstark02/affiliate-map" >
                                <div className="btns" >
                                    <img title="Go To Source Code" src="https://img.icons8.com/material-outlined/24/000000/github.png" width="15px" />
                                </div>
                            </a>
                            <a href="https://drive.google.com/file/d/1YFMy3DLDIFezlxw42Cqgj4A9AgCiiL1L/view?usp=sharing" >
                                <div className="btns" >
                                    <img title="Go To Video" src="https://img.icons8.com/material-outlined/24/000000/video.png" width="15px" />
                                </div>
                            </a>
                            <div className="btns" >
                                <img title="Open Info" onClick={() => { this.setState({ openInfo: true }) }} src="https://img.icons8.com/material-outlined/24/000000/info.png" width="15px" />
                            </div>
                        </div>
                    </div>
                    <DragDropContext onDragEnd={this.onDragEnd} >
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

                </div>
            );
        }
        else {
            return (<div><Loader/></div>)
        }
    }
}

export default Home;
