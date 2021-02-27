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
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [15, 0],
    popupAnchor: [0, 0]
});

L.Marker.prototype.options.icon = DefaultIcon;

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


function WarehouseMap() {
    const classes = useStyles();
    const [skladisca, setSkladisca] = useState([]);
    const [isSkladiscaLoaded, setIsSkladiscaLoaded] = useState(false);
    const position = [45.8098131,15.1614625]

    useEffect(() => {
        const naloziSkladisca = async () => {
            fetch(endpoints.skladisca + "/warehouses/all", {
                method: 'get'
            })
                .then(res => {
                    return res.json();
                })
                .then(response => {
                    console.log(response);
                    if (response !== null) {
                        setSkladisca(response);
                        setIsSkladiscaLoaded(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
        };
        naloziSkladisca();
    }, []);
    var loadingIndicator = (<div style={{ textAlign: 'center', marginTop: '100px' }}><CircularProgress /></div>);
    if (isSkladiscaLoaded) {
        loadingIndicator = ('');
    }

    return (
        <MapContainer center={position} zoom={15} scrollWheelZoom={true} style={{ fontFamily: "Roboto", height: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {skladisca.map((skladisce) =>
                <Marker position={skladisce.position}>
                    <Popup>
                        {skladisce.name} <br /> {skladisce.address}
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
export default WarehouseMap;