import React, { useEffect, useState } from "react";
import {
    Container,
    Grid,
    Typography,
    Button,
    CircularProgress,
    makeStyles,
    Divider,
    Box,
    IconButton,
    Hidden,
    Tooltip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Paper,
    ListItemAvatar
} from "@material-ui/core";
import endpoints from '../../endpoints';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import { date } from "yup";
import Swal from 'sweetalert2'

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: 'white',
    },
    potrdi: {
        "&:hover": {
            color: "red"
        }
    }
}));

let myId;
function Dostavljalec() {
    const izbrisiUporabnika = (uporabnik) => {
        Swal.fire(
            'Potrjeno!',
            'Uporabnik '+uporabnik.username+' je bilizbrisan',
            'success'
          )
    }

    const classes = useStyles();
    const [uporabniki, setUporabniki] = useState([]);
    const [isUporabnikiLoaded, setIsUporabnikiLoaded] = useState(false);
    myId = JSON.parse(localStorage.getItem('userInfo'))['_id']
    useEffect(() => {
        const naloziUporabnike = async () => {
            fetch(endpoints.uporabniki + "/users/all", {
                method: 'get'
            })
                .then(res => {
                    return res.json();
                })
                .then(response => {
                    console.log(response);
                    if (response !== null) {
                        setUporabniki(response);
                        setIsUporabnikiLoaded(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        };
        naloziUporabnike();
    }, []);
    var loadingIndicator = (<div style={{textAlign: 'center', marginTop: '100px'}}><CircularProgress /></div>);
    if(isUporabnikiLoaded){
        loadingIndicator = ('');
    }

    return (
        <div>
            <Container>
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <br />
                        <Typography variant="h1" >
                            Uporabniki
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {loadingIndicator}
                    <List>
                        {uporabniki.map((uporabnik) =>
                            <Paper>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ReceiptIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={uporabnik.role + " " + uporabnik.firstname + " " + uporabnik.lastname + (myId==uporabnik._id ? " (me)" : "")}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete">
                                            <CloseIcon className={classes.potrdi} onClick={() => izbrisiUporabnika(uporabnik)}/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Paper>
                        )}
                    </List>
                </Grid>
            </Container>
        </div>
    );
}
export default Dostavljalec;