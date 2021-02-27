import React from 'react';
import {
  Container,
  Grid,
  makeStyles,
  Typography
} from '@material-ui/core';
import Page from 'src/components/Page';
import LatestProducts from '../LatestProducts';
import endpoints from '../../../../endpoints';
import auth from '../../../auth/auth';
class SkladiscnikDashboard extends React.Component {Page
  constructor(props) {
    super(props);
    this.state = {
      obvestila: [],
      isObvestilaLoaded: false,
    }
  }
  async componentDidMount() {
    fetch(endpoints.obvestila+"/listNotifications/"+auth.getUserInfo().id,
    {
      method: 'get',
      headers: {
        'Authorization': auth.getToken(),
      }
    })
    .then(res => res.json())
    .then((result) => {
      var obvestila = result;
      this.setState({
        isObvestilaLoaded: true,
        obvestila: obvestila
      });
    })
  }


  render() {
    var obvestila = [];
    
    return (
      <Page
        title="Dashboard"
        style={{paddingTop: "25px"}}
      >
        <Typography variant="h1" >
          Skladiscnik dashboard
        </Typography>
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >

            <Grid
              item
              lg={4}
              md={6}
              xl={3}
              xs={12}
            >
              <LatestProducts obvestila={obvestila}/>
            </Grid>
          </Grid>
        </Container>
      </Page>
    );
  }
}


export default SkladiscnikDashboard;
