import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import TwitterIcon from '@material-ui/icons/Twitter';
import FacebookIcon from '@material-ui/icons/Facebook';
import YoutubeIcon from '@material-ui/icons/YouTube';
import SettingsIcon from '@material-ui/icons/Settings';
import {useLocation} from 'react-router-dom'
import {matchPath} from "react-router";


const pageNames = {
    dashboard: "/dashboard",
    twitter: "/settings/twitter",
    facebook: "/settings/facebook",
    youtube: "/settings/youtube",
    mlConfiguration: "/settings/ml-configuration"
}

let isLocationPathMatch = (location) => (pageName) => {
    return !!matchPath(pageName, {
        path: `${location.pathname}`,
        exact: true,
        strict: true
    });
}

export const MainListItems = () => {

    let isMatch = isLocationPathMatch(useLocation());

    return (
        <div>
            <ListItem
                button
                component="a"
                href="/dashboard"
                selected={isMatch(pageNames.dashboard)}
            >
                <ListItemIcon>
                    <DashboardIcon/>
                </ListItemIcon>
                <ListItemText primary="Dashboard"/>
            </ListItem>
        </div>
    );
}



export const SecondaryListItems = () => {

    let isMatch = isLocationPathMatch(useLocation());

    return (
        <div>
            <ListSubheader inset>Settings</ListSubheader>
            <ListItem
                button
                component="a"
                href={pageNames.twitter}
                selected={isMatch(pageNames.twitter)}
            >
                <ListItemIcon>
                    <TwitterIcon/>
                </ListItemIcon>
                <ListItemText primary="Twitter"/>
            </ListItem>
            <ListItem
                button
                component="a"
                href={pageNames.facebook}
                selected={isMatch(pageNames.facebook)}
            >
                <ListItemIcon>
                    <FacebookIcon/>
                </ListItemIcon>
                <ListItemText primary="Facebook/Instagram"/>
            </ListItem>
            <ListItem
                button
                component="a"
                href={pageNames.youtube}
                selected={isMatch(pageNames.youtube)}
            >
                <ListItemIcon>
                    <YoutubeIcon/>
                </ListItemIcon>
                <ListItemText primary="Youtube"/>
            </ListItem>
            <ListItem
                button
                component="a"
                href={pageNames.mlConfiguration}
                selected={isMatch(pageNames.mlConfiguration)}
            >
                <ListItemIcon>
                    <SettingsIcon/>
                </ListItemIcon>
                <ListItemText primary="AI/ML"/>
            </ListItem>
        </div>
    );
}
