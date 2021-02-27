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
    ListItemAvatar,
} from "@material-ui/core";
import endpoints from '../../endpoints';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Swal from 'sweetalert2'
import auth from "../auth/auth";

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: 'white',
    },
    potrdi: {
        "&:hover": {
            color: "green"
        }
    }
}));


function Skladiscnik() {
    const classes = useStyles();
    const [narocila, setNarocila] = useState([]);
    const [isNarocilaLoaded, setIsNarocilaLoaded] = useState(false);

    const potrdiNarocilo = (narocilo) => {
        confirm(narocilo._id);
    }

    const confirm = async (package_id) =>{
        console.log(endpoints.paketi+"confirmPackage/"+package_id+"/"+JSON.parse(localStorage.getItem('userInfo'))['_id'])
        fetch(endpoints.paketi+"confirmPackage/"+package_id+"/"+JSON.parse(localStorage.getItem('userInfo'))['_id'], {
            method: 'get'
        })
        .then(res =>{
            Swal.fire(
                'Potrjeno!',
                'Narocilo '+package_id+' je bilo potrjeno',
                'success'
              )
              return res.json();
            })
            .then(response => {
              console.log(response);
            })
            .catch(error => {
              console.log(error);
            })
        }

    useEffect(() => {
        const naloziNarocila = async () => {
            fetch(endpoints.narocila + "/packages/listPackages", {
                method: 'get'
            })
                .then(res => {
                    return res.json();
                })
                .then(response => {
                    console.log(response);
                    if (response !== null) {
                        setNarocila(response);
                        setIsNarocilaLoaded(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        };
        naloziNarocila();
    }, []);
    var loadingIndicator = (<div style={{textAlign: 'center', marginTop: '100px'}}><CircularProgress /></div>);
    if(isNarocilaLoaded){
        loadingIndicator = ('');
    }

    return (
        <div style={{fontFamily: "Roboto"}}>
            <Container>
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <br />
                        <Typography variant="h1" >
                            Odobritev naročil
                        </Typography>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    {loadingIndicator}
                    <List>
                        {narocila.map((narocilo) =>
                            <Paper>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <ReceiptIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={"Narocilo " + narocilo.deliveryNumber}
                                        secondary={narocilo.status+" • "+narocilo.submitionDate}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete">
                                            <CheckIcon className={classes.potrdi} onClick={() => potrdiNarocilo(narocilo)}/>
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
export default Skladiscnik;