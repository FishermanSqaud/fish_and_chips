import React, { useState } from "react";
import Tooltip from '@material-ui/core/Tooltip'
import LocationsTable from './LocationsTable'
import { observer, inject } from "mobx-react";
import { makeStyles } from "@material-ui/styles";
import DetailDialog from './DetailDialog'
import DeleteDialog from './DeleteDialog'
import { IconButton, Card } from "@material-ui/core";
import LocationFilterView from './LocationFilterView'
import TextField from '@material-ui/core/TextField'
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import CreateDialog from "./CreateDialog";
import RefreshIcon from '@material-ui/icons/Refresh';
import CardContent from '@material-ui/core/CardContent';


const LocationsSection = inject("store")(
  observer((props) => {

    const classes = useStyles()
    const [showTableSearch, setShowTableSearch] = useState(false)

    const handleTableSearch = (e) => {
      props.store.set(
        "tableSearch",
        e.target.value
      )
    }

    const handleSearchCancel = () => {
      props.store.set(
        "tableSearch",
        ""
      )
      setShowTableSearch(false)
    }

    const handleSearchStart = () => {
      setShowTableSearch(true)
    }

    const handleOpenCreateDialog = () => {
      props.store.set(
        "isCreateDialogOpen",
        true
      )
    }

    const handleReloadLocations = async () => {
      try {

        await props.store.getAllLocationData()

      } catch (err) {
        props.store.set(
          "snackbarMsg",
          "불러오기 실패"
        )

        props.store.set(
          "snackbarErrorOpen",
          true
        )
      }
    }

    return (
      <div className={classes.sectionTabs}>
        <div className={classes.container}>
          <div className={classes.row}>

            {sections.map((eachSection, idx) => {
              return (
                <div
                  className={classes.col}
                  key={idx}>

                  <div className={classes.tableHeader}>
                    <div className={classes.category}>
                      {eachSection.title}
                    </div>

                    <Tooltip title="위치 데이터 생성">
                      <IconButton onClick={handleOpenCreateDialog}>
                        <AddLocationIcon></AddLocationIcon>
                      </IconButton>
                    </Tooltip>

                    <div className={classes.filters}>

                      {showTableSearch ?

                        <div style={{
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <IconButton onClick={handleSearchCancel}>
                            <CloseIcon></CloseIcon>
                          </IconButton>
                          <TextField
                            autoFocus
                            inputProps={{
                              style: {
                                padding: '11.5px 14px'
                              }
                            }}
                            id="outlined-search"
                            placeholder="메세지 검색"
                            type="search"
                            variant="outlined"
                            onChange={handleTableSearch} />
                        </div>

                        :

                        <IconButton onClick={handleSearchStart}>
                          <SearchIcon></SearchIcon>
                        </IconButton>
                      }

                      <LocationFilterView />

                      <Tooltip title="새로고침">
                        <IconButton onClick={handleReloadLocations}>
                          <RefreshIcon />
                        </IconButton>
                      </Tooltip>

                    </div>
                  </div>

                  <Card className={classes.card}>
                    <CardContent style={cardBodyStyle}>
                      <LocationsTable />
                    </CardContent>
                  </Card>
                </div>
              )
            })}

          </div>
        </div>

        <DeleteDialog></DeleteDialog>

        {props.store.isDetailDialogOpen &&
          <DetailDialog />
        }
        {props.store.isCreateDialogOpen &&
          <CreateDialog />}
      </div>
    );
  }))

export default LocationsSection;

const sections = [
  {
    title: "위치 데이터 목록",
  },
]

const cardBodyStyle = {
  minHeight: 500,
  padding: 17,
  paddingTop: 7
}

const useStyles = makeStyles((theme) => ({
  sectionTabs: {
    background: '#EEEEEE',
    padding: '70px 0',
    position: 'relative'
  },
  col : {
    flexBasis : 0,
    flexGrow : 1,
    // maxWidth : '100%',
    width : '100%',
    padding : '0 15%'
  },
  container: {
    // maxWidth: 720,
    width: '100%',
    paddingRight: 15,
    paddingLeft: 15,
    marginRight: 'auto',
    marginLeft: 'auto'
  },
  row : {
    display : 'flex',
    flexWrap : 'wrap',
    marginRight : -15,
    marginLeft : -15
  },
  regionBtnStyle: {
    fontSize: '1.1em',
    color: 'royalblue'
  },
  category: {
    display: 'flex',
    alignItems: 'baseline',
    fontWeight: 500,
    paddingLeft: 21,
    color: 'rgba(0, 0, 0, 0.64)',
    fontSize: '1.3em',
    lineHeight: '1.61em',
    minWidth: 141

  },
  tableHeader: {
    display: 'flex',
    marginBottom: 10,
    alignItems: 'center',
    paddingRight: 10
  },
  filters: {
    width: 'calc(100% - 145px)',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  tableSearch: {
    padding: '11.5px 14px'
  },
}))