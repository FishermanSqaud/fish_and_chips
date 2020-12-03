import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { observer, inject } from "mobx-react";
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import FilterListIcon from '@material-ui/icons/FilterList';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import { IconButton, Tooltip, Table } from '@material-ui/core';

const LocationFilterView = inject("store")(
    observer((props) => {
        const [anchorEl, setAnchorEl] = React.useState(null);

        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
            setAnchorEl(null);
        };

        const handleSelectFilter = (filterType) => () => {
            props.store.set(
                "tableFilter",
                filterType
            )

            handleClose()
        }

        const showFilterIcon = (filterType) => {

            switch (filterType) {
                case props.store.FILTER_ALL:
                    return <FilterListIcon fontSize="small" />

                case props.store.FILTER_IMAGE:
                    return <ImageIcon fontSize="small" />

                case props.store.FILTER_TEXT:
                    return <TextFieldsIcon fontSize="small" />

                case props.store.FILTER_OBJECT:
                    return <BlurOnIcon fontSize="small" />
            }
        }

        const menus = [
            {
                type: props.store.FILTER_ALL,
                text: "전체 보기",
            },
            {
                type: props.store.FILTER_TEXT,
                text: "텍스트 데이터만 보기",
            },
            {
                type: props.store.FILTER_OBJECT,
                text: "3D 오브젝트만 보기",
            },
            {
                type: props.store.FILTER_IMAGE,
                text: "이미지 데이터만 보기",
            }
        ]

        return (
            <React.Fragment>

                <Tooltip title="데이터 필터 설정">
                    <IconButton
                        aria-controls="customized-menu"
                        aria-haspopup="true"
                        variant="contained"
                        onClick={handleClick}
                    >
                        {showFilterIcon(props.store.tableFilter)}
                    </IconButton>
                </Tooltip>

                <StyledMenu
                    id="customized-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>

                    {menus.map((menu, idx) => {
                        return (
                            <StyledMenuItem
                                key={idx}
                                onClick={
                                    handleSelectFilter(menu.type)
                                }>
                                <ListItemIcon style={{ minWidth: 40 }}>
                                    {showFilterIcon(menu.type)}
                                </ListItemIcon>
                                <ListItemText primary={menu.text} />
                            </StyledMenuItem>
                        )
                    })}

                </StyledMenu>

            </React.Fragment >
        );
    }))

export default LocationFilterView

const StyledMenu = withStyles({
    paper: {
        border: '1px solid #d3d4d5',
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
));

const StyledMenuItem = withStyles((theme) => ({
    root: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                color: theme.palette.common.white,
            },
        },
    },
}))(MenuItem);