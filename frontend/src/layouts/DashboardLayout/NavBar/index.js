import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
} from 'react-feather';
import NavItem from './NavItem';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import MapIcon from '@material-ui/icons/Map';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import auth from "../../../views/auth/auth";

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith'
};





const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  var items = [
    {
      href: '/app/dashboard',
      icon: BarChartIcon,
      title: 'Domov'
    },
    // {
    //   href: '/app/obvestila',
    //   icon: NotificationsIcon,
    //   title: 'Obvestila'
    // }
  ];
  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  if (auth.getUserInfo() !== null) {
    console.log(auth.getUserInfo().role);
    if (auth.getUserInfo().role == "admin") {
      items.push({
        href: '/app/dodajanje',
        icon: NotificationsIcon,
        title: 'Dodajanje'
      });
      items.push({
        href: '/app/pregled',
        icon: NotificationsIcon,
        title: 'Pregled'
      });
      items.push({
        href: '/app/odobritev',
        icon: ConfirmationNumberIcon,
        title: 'Odobritev naročil'
      });
      items.push({
        href: '/app/zemljevid',
        icon: MapIcon,
        title: 'Zemljevid'
      });
      items.push({
        href: '/app/adminTools',
        icon: SupervisorAccountIcon,
        title: 'Nadzor uporabnikov'
      });
    }
    else if (auth.getUserInfo().role == "skladiscnik") {
      items.push({
        href: '/app/odobritev',
        icon: ConfirmationNumberIcon,
        title: 'Odobritev naročil'
      });
      items.push({
        href: '/app/zemljevid',
        icon: MapIcon,
        title: 'Zemljevid'
      });
    }
    else{
      items.push({
        href: '/app/dodajanje',
        icon: NotificationsIcon,
        title: 'Dodajanje'
      });
    }
    items.push({
      href: '/odjava',
      icon: ExitToAppIcon,
      title: 'Odjava'
    });
  }
  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

export default NavBar;
