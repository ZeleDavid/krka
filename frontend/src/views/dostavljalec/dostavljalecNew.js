import React, { useEffect, useState } from "react";
import ScheduleSelector from 'react-schedule-selector'
import {
  Container,
  Grid,
  Typography,
  Button,
  CircularProgress,
  makeStyles,
  TextField,
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
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import endpoints from '../../endpoints';
import * as Yup from 'yup';
import { Formik } from 'formik';
import DeleteIcon from '@material-ui/icons/Delete';
import FolderIcon from '@material-ui/icons/Folder';
import ReceiptIcon from '@material-ui/icons/Receipt';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import auth from "../auth/auth";
import Swal from 'sweetalert2';
import Select from 'react-select'

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
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const navigate = useNavigate();
  const classes = useStyles();
  const [redirect, setRedirect] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [schedule, setSchedule] = useState([]);
  const onClick = () => {
    console.log("HELLO");
  }

  const handleSubmit = (event) => {
    var packageNum = event.packageNum;
    console.log(packageNum);
    var time = schedule[0];
    var timeFormated = time.getFullYear() + '-' + ('0'+(time.getMonth() + 1)).slice(-2) + '-' + ('0'+time.getDate()).slice(-2) + 'T' + ('0'+time.getHours()).slice(-2) + ':' + ('0'+time.getMinutes()).slice(-2) + ':' + ('0'+time.getSeconds()).slice(-2) + '.000Z'
    addNew(packageNum, timeFormated);
  }

  const addNew = async (packageNum, time) => {
    var packageItem = {
      status: "transit",
      submitionDate: time,
      deliveryNumber: parseInt(packageNum),
      sentBy: auth.getUserInfo()._id,
      submissionLocation: selectedOption,
    }

    fetch(endpoints.paketi, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(packageItem)
    })
      .then(res => {
        Swal.fire(
          'Potrjeno!',
          'Paket ' + packageNum + ' je bil uspešno dodan',
          'success'
        ).then(response => {
          setRedirect(true);
          setShowSuccess(true);
          navigate("/app/dashboard");
        })
        return res.json();
      })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
        setShowError(true);
      })

  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setShowError(true);
  };

  const selectedOptionClick = (e) => {
    console.log(e);
    setSelectedOption(e.value)
  }

  const calChange = (newSchedule) => {
    if (schedule.length === 0) {
      setSchedule(newSchedule.slice(0, 1));
    }
    else {
      if (newSchedule.length > 1) {
        setSchedule(newSchedule.slice(1, 2));
      }
    }
  }

  const getLocations = async (packageNumber) => {
    fetch(endpoints.skladisce + "check/" + packageNumber, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => {
      res.json().then((data) =>{
        if(data !=null){
          var opt = []
          var options2 = data['locations'];
          for(let i =0;i<options2.length;i++){
            let d = options2[i]
            opt.push({value:d, label:d.replace(/_/g, " ")})
          }
          setOptions(opt);
        }
        else{
          setOptions([])
        }
    })
  })
}


  return (
    <div>
      <Container>
        <Grid container>
          <Grid item xs={12} style={{ textAlign: "center" }}>
            <br />
            <Typography variant="h1" >
              Dodajanje naročil
                        </Typography>
          </Grid>
        </Grid>
        <Formik
          initialValues={{
            packageNum: ''
          }}
          validationSchema={
            Yup.object().shape({
              packageNum: Yup.string().required().matches(/^[0-9]+$/, "Zgolj števila so dovoljena").min(4, 'Število mora biti točno 4 mesta dolgo').max(4, 'Število mora biti točno 4 mesta dolgo')
            })
          }
          onSubmit={(values) => {
            handleSubmit(values);
            console.log(values);
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                error={Boolean(touched.packageNum && errors.packageNum)}
                fullWidth
                helperText={touched.packageNum && errors.packageNum}
                label="package Number"
                margin="normal"
                name="packageNum"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value.length == 4) {
                    getLocations(e.target.value);
                  }
                }}
                value={values.packageNum}
                variant="outlined"
              />
              <Select
              id="selection"
              name="submissionLocation"
              options={options}
              onChange={selectedOptionClick}
              />
              <ScheduleSelector
                selection={schedule}
                name="timePicker"
                numDays={7}
                minTime={7}
                maxTime={15}
                hourlyChunks={2}
                timeFormat={"HH:mm"}
                dateFormat={"DD MMM"}
                onChange={calChange}
              />
              <Box my={2}>
                <Button
                  color="primary"
                  disabled={isSubmitting}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                // disabled="true"
                >
                  Potrdi
                  </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Container>
    </div>
  )
}

/*function Dostavljalec() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [narocila, setNarocila] = useState([]);
    const [isNarocilaLoaded, setIsNarocilaLoaded] = useState(false);
    
    var state = { "schedule" : [] }
    
    var handleChange = newSchedule => {
        { state.schedule = newSchedule}
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
        <div>
            <Container>
                <Grid container>
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <br />
                        <Typography variant="h1" >
                            Dodajanje narocil
                        </Typography>
                    </Grid>
                </Grid>
                <Formik
            initialValues={{
              email: '',
              firstName: '',
              lastName: '',
              password: '',
              policy: false
            }}
            validationSchema={
              Yup.object().shape({
                packageNum: Yup.string().max(255).required('Package number is required'),
                lastName: Yup.string().max(255).required('Last name is required'),
              })
            }
            onSubmit={() => {
              navigate('/app/dashboard', { replace: true });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  error={Boolean(touched.packageNum && errors.packageNum)}
                  fullWidth
                  helperText={touched.packageNum && errors.packageNum}
                  label="package Number"
                  margin="normal"
                  name="firstName"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.packageNum}
                  variant="outlined"
                />
                <ScheduleSelector
        selection={this.state.schedule}
        numDays={5}
        minTime={7}
        maxTime={15}
        hourlyChunks={2}
        timeFormat={"HH:mm"}
        dateFormat={"DD MMM"}
        onChange={this.handleChange}
      />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Potrdi
                  </Button>
                </Box>
              </form>
            )}
          </Formik>
            </Container>
        </div>
    );
}*/
export default Dostavljalec;