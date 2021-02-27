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


function Dostavljalec() {
    const classes = useStyles();
    const [narocila, setNarocila] = useState([]);
    const [isNarocilaLoaded, setIsNarocilaLoaded] = useState(false);
    console.log(JSON.parse(localStorage.getItem('userInfo'))['_id'])
    useEffect(() => {
        const naloziNarocila = async () => {
            var q = endpoints.narocila + "/packages/by/"+JSON.parse(localStorage.getItem('userInfo'))['_id']
            console.log(q)
            fetch(endpoints.narocila + "/packages/by/"+JSON.parse(localStorage.getItem('userInfo'))['_id'], {
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
        <div>
            <Container>
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <br />
                        <Typography variant="h1" >
                            Moja naročila
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
                                        secondary={narocilo.status+" • "+new Date(narocilo.submitionDate).toUTCString().slice(0, -3)}
                                    />

                                    <ListItemText style={{textAlign: 'right'}}
                                        primary={(narocilo.status=="transit")
                                        ? ("Dostavi na: " + narocilo.submissionLocation.replace(/_/g, " ") + " skladišče št. " + (""+narocilo.deliveryNumber)[0]) 
                                        : "DOSTAVLJENO"}
                                    />
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