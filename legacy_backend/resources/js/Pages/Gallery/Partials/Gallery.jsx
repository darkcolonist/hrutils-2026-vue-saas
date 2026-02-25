import Spinner from "@/Components/Spinner";
import { getDisplayName, getSearchKeyword } from "@/Pages/BackgroundCheck/Partials/Suggestions";
import { Box, CircularProgress, ClickAwayListener, Paper, Popper, Typography, useTheme } from "@mui/material";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MUILink from '@mui/material/Link';
import { Link, usePage } from '@inertiajs/react';
import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import Permission from "@/Components/Permission";

const ImageWithPopover = ({
  employee
  , imageLoaded
  , handleImageError
  , handleLoaded
}) => {
  const { env } = usePage().props;
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  return <React.Fragment>
    <img
      src={env.APP_DEBUG ? '/resources/img/sample.png' : employee.avatar }
      width="100%"
      height="100%"
      style={{
        display: imageLoaded ? null : "none",
        borderRadius: "3px",
        opacity: open ? null : (employee.status == "inactive" ? 0.2 : 0.8),
        border: open
          ? `2px solid ${theme.palette.primary.main}`
          : null
      }}
      alt={employee.company_email}
      onLoad={handleLoaded}
      onError={event => handleImageError(event, employee)}

      aria-owns={open ? 'mouse-over-popover' : undefined}
      aria-haspopup="true"
      onClick={handlePopoverOpen}
    />
    <Popper
      id="mouse-over-popover"
      open={open}
      anchorEl={anchorEl}
      onClose={handlePopoverClose}
    >
      <ClickAwayListener onClickAway={handlePopoverClose}>
        <Box
          sx={{
            py: .1,
            px: .5
          }}
          component={Paper}
          elevation={5}
        >
          <Typography textAlign="center">
            <Permission can='view background check'>
              <MUILink href={route('background.check', {
                keyword: getSearchKeyword(employee)
              })} component={Link}>
                <AdminPanelSettingsIcon />
              </MUILink>
            </Permission>
            {getDisplayName(employee)}
          </Typography>
          <Typography textAlign="center">{employee.job_title ?? "no title"}</Typography>
          <Typography textAlign="center">{employee.department ?? "no department"}</Typography>
        </Box>
      </ClickAwayListener>
    </Popper>
  </React.Fragment>
}

const GalleryItem = ({employee, sx, ...props}) => {
  const [imageLoaded,setimageLoaded] = React.useState(false);

  const handleLoaded = () => {
    setimageLoaded(true);
  }

  const handleImageError = (event, employee) => {
    event.target.onError = null;
    event.target.src = employee.avatar_personal;
  }

  return <Box
      {...{
        sx: {
          p: .5
          , m: .5
          , ...sx
          , display: 'flex'
          , alignItems: 'center'
          , justifyContent: 'center'
          , minWidth: sx.width
        }
      }}
      component={Paper}
      elevation={3}
    >
      <ImageWithPopover
        {...{
          employee,
          imageLoaded,
          handleImageError,
          handleLoaded
        }}
      />
      {!imageLoaded
        ? <Spinner
            style={{
              position: "absolute",
              opacity: .2
            }}
          />
        : null}
  </Box>
}

const Loader = () =>
  <Box
    {...{
      sx: {
        p: .5
        , m: .5
        , display: 'flex'
        , alignItems: 'center'
        , justifyContent: 'center'
      }
    }}
  ><CircularProgress /></Box>

const size = 128;
export default function Gallery(){
  // const [isLoading, setIsLoading] = React.useState(true);
  const [employees,setEmployees] = React.useState([]);
  const [page,setPage] = React.useState(1);
  const [hasMore,setHasMore] = React.useState(true);

  const loadMore = () => {
    axios.post(route('gallery.load', {
      page
    }))
    .then(response => {
      if(response === undefined) return;
      setHasMore(response.data.hasMore);
      setEmployees([...employees, ...response.data.list]);
      setPage(Number(response.data.page)+1);
    })
    // .finally(() => {
    //   setIsLoading(false);
    // })
    ;
  }

  React.useEffect(() => {
    loadMore();
  }, []);

  const employeesRender = employees.map((employee, i) =>
    <GalleryItem key={i} employee={employee}
      sx={{
        width: size
        , height: size
      }}
    />
  );

  return <InfiniteScroll
    dataLength={employees.length} //This is important field to render the next data
    next={loadMore}
    hasMore={hasMore}
    loader={<Loader />}
    endMessage={
      <Typography textAlign="center">end</Typography>
    }
    // below props only if you need pull down functionality
    // refreshFunction={this.refresh}
    // pullDownToRefresh
    // pullDownToRefreshThreshold={50}
    // pullDownToRefreshContent={
    //   <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
    // }
    // releaseToRefreshContent={
    //   <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
    // }
  >
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}
    >
      {employeesRender}
    </Box>
  </InfiniteScroll>
}