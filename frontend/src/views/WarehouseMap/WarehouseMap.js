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
    const [narocila, setNarocila] = useState([]);
    const [isNarocilaLoaded, setIsNarocilaLoaded] = useState(false);
    const position = [45.8098131, 15.1614625]

    const poglejSkladisce = (skladisce) => {
        var tekst = '<table class="table" style="width:100%">' +
            '<thead>' +
            '<tr>' +
            '<th scope="col"># dostave</th>' +
            '<th scope="col">Termin</th>' +
            '<th scope="col">Lokacija</th>' +
            '<th scope="col">Status</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        narocila.map((narocilo) => {
            var date= new Date(narocilo.submitionDate).toUTCString().slice(0, -3);
            if (skladisce.name == "Warehouse_1") {
                if (narocilo.deliveryNumber >= 1000 && narocilo.deliveryNumber < 2000) {
                    tekst += '<tr>' +
                        '<th scope="row">' + narocilo.deliveryNumber + '</th>' +
                        '<td>' + date + '</td>' +
                        '<td>' + narocilo.submissionLocation + '</td>' +
                        '<td>' + narocilo.status + '</td>' +
                        '</tr>';
                }
            }
            else if (skladisce.name == "Warehouse_2") {
                if (narocilo.deliveryNumber >= 2000 && narocilo.deliveryNumber < 3000) {
                    tekst += '<tr>' +
                        '<th scope="row">' + narocilo.deliveryNumber + '</th>' +
                        '<td>' + date + '</td>' +
                        '<td>' + narocilo.submissionLocation + '</td>' +
                        '<td>' + narocilo.status + '</td>' +
                        '</tr>';
                }
            }
            else if (skladisce.name == "Warehouse_3") {
                if (narocilo.deliveryNumber >= 3000 && narocilo.deliveryNumber < 4000) {
                    tekst += '<tr>' +
                        '<th scope="row">' + narocilo.deliveryNumber + '</th>' +
                        '<td>' + date + '</td>' +
                        '<td>' + narocilo.submissionLocation + '</td>' +
                        '<td>' + narocilo.status + '</td>' +
                        '</tr>';
                }
            }
        });
        // for(var narocilo in narocila){

        // }
        tekst += '</tbody>' +
            '</table>';

        Swal.fire({
            title: '<strong>Dostave v: ' + skladisce.name + '</strong>',
            icon: 'info',
            html: tekst,
            showCloseButton: false,
            showCancelButton: false,
            focusConfirm: true,
            width: '50%',
            confirmButtonText:
                'Nazaj na zemljevid'
        })
    }

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
        naloziSkladisca();
    }, []);
    var loadingIndicator = (<div style={{ textAlign: 'center', marginTop: '100px' }}><CircularProgress /></div>);
    if (isSkladiscaLoaded && isNarocilaLoaded) {
        loadingIndicator = ('');
    }

    return (
        <MapContainer center={position} zoom={15} scrollWheelZoom={true} style={{ height: "100%" }}>
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {skladisca.map((skladisce) =>
                <Marker position={skladisce.position}>
                    <Popup>
                        <b>Naziv: </b> {skladisce.name} <br /> <b>Naslov: </b> {skladisce.address} <br /><br /> <Button variant="contained" color="primary" onClick={() => poglejSkladisce(skladisce)}>Poglej dostave</Button>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
}
export default WarehouseMap;