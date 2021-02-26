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
    ListItemText
} from "@material-ui/core";
import endpoints from '../../endpoints';

const useStyles = makeStyles(theme => ({
    container: {
        backgroundColor: 'white',
    }
}));


function Skladiscnik() {
    const classes = useStyles();
    const [narocila, setNarocila] = useState([]);
    const [isNarocilaLoaded, setIsNarocilaLoaded] = useState(false);
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
                    if(response !== null){
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

    return (
        <div>
            <Container>
                <h2>Odobritev naročil</h2>
                {narocila.map((narocilo) => 
                    <p>{narocilo._id}</p>
                )}
            </Container>
        </div>
    );
}
export default Skladiscnik;