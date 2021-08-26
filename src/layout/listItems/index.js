import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';

export const mainListItems = (
    <div>
        <ListItem button component="a" href="/dashboard">
            <ListItemIcon>
                <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
        </ListItem>
    </div>
);

export const secondaryListItems = (
    <div>
        <ListSubheader inset>Settings</ListSubheader>
        <ListItem button component="a" href="/settings/twitter">
            <ListItemIcon>
                <TwitterIcon />
            </ListItemIcon>
            <ListItemText primary="Twitter" />
        </ListItem>
        <ListItem button component="a" href="/settings/facebook">
            <ListItemIcon>
                <FacebookIcon />
            </ListItemIcon>
            <ListItemText primary="Facebook" />
        </ListItem>
    </div>
);