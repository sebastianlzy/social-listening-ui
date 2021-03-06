import clsx from "clsx";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import AppBar from "@material-ui/core/AppBar";
import NotificationsIcon from "@material-ui/icons/Notifications";


import React from "react";


const AppBarComponent = ({classes, handleDrawerOpen, open}) => (
    <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
                <MenuIcon />
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                Social listening
            </Typography>
            {/*<IconButton color="inherit">*/}
            {/*    <Badge badgeContent={4} color="secondary">*/}
            {/*        <NotificationsIcon />*/}
            {/*    </Badge>*/}
            {/*</IconButton>*/}
        </Toolbar>
    </AppBar>
)

export default AppBarComponent